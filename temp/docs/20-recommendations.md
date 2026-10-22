# Architecture Evolution & Engineering Recommendations

This document outlines prioritized, actionable engineering recommendations to advance the AeroBook microservices platform from a high-functioning development state to an enterprise-grade, high-availability production ecosystem.

---

## 1. High Priority (Near-Term Production Readiness)

### 1.1 Database Schema Migrations (Flyway / Liquibase)
- **Current State**: Microservices rely on Hibernate DDL auto-generation (`spring.jpa.hibernate.ddl-auto=update`).
- **Risk**: Automatic schema generation can cause accidental column mutations, cannot roll back failed schema alterations, and is unsafe for zero-downtime database upgrades.
- **Recommendation**: Integrate **Flyway** across all 8 persistent services. Set `spring.jpa.hibernate.ddl-auto=validate` and manage schema changes via versioned SQL scripts (`V1__initial_schema.sql`, `V2__add_index.sql`).

### 1.2 Circuit Breakers & Resilience4j
- **Current State**: OpenFeign clients (`FlightServiceClient`, `FareServiceClient`) invoke downstream HTTP services directly.
- **Risk**: Cascading service failure if a downstream microservice slows down or becomes unavailable during high load.
- **Recommendation**: Equip all OpenFeign client interfaces with **Resilience4j Circuit Breakers**, TimeLimiters, and fallbacks to gracefully handle downstream service timeouts and return cached flight schedules or friendly error states.

### 1.3 Distributed Caching with Redis
- **Current State**: Flight search queries (`GET /api/flights/search`) execute SQL table queries on `aerobook_flight_db` on every user keystroke and search submission.
- **Risk**: High database CPU utilization during flight search peak hours.
- **Recommendation**: Introduce a **Redis cache cluster** for flight route schedules, seat availability read models, and active coupon codes with a 60-second time-to-live (TTL), invalidated via AMQP events upon flight modification.

### 1.4 API Gateway Rate Limiting & Throttling
- **Current State**: Gateway routes requests without request rate limitations.
- **Risk**: Vulnerable to brute-force credential stuffing attacks on `/api/auth/login` and denial-of-service on search endpoints.
- **Recommendation**: Enable Spring Cloud Gateway's built-in **Redis RateLimiter** using the Token Bucket algorithm, enforcing limits such as 10 requests/sec for anonymous search and 5 requests/min for login attempts.

---

## 2. Medium Priority (Operational Maturity)

### 2.1 Distributed Tracing with OpenTelemetry & Tempo
- **Current State**: Request tracking relies on MDC log patterns and manual correlation ID parsing.
- **Recommendation**: Integrate **Micrometer Tracing** with OpenTelemetry exporters to stream distributed trace spans to Grafana Tempo or Jaeger, giving operations teams visual flame graphs of request latencies across all microservice hops.

### 2.2 Dead Letter Queues (DLQ) & Message Retry Policies
- **Current State**: Unhandled consumer exceptions in RabbitMQ queues could result in message requeuing loops or message drops.
- **Recommendation**: Configure a Dead Letter Exchange (`dlx.aerobook`) and Dead Letter Queues (`booking-created.dlq`) with exponential backoff retries (3 attempts) before routing unprocessable events to an alert queue.

### 2.3 Centralized Secret Management
- **Current State**: Configuration properties allow environment variable injection, but defaults exist in `application.properties`.
- **Recommendation**: Store production credentials, Razorpay secret keys, and JWT keys in **HashiCorp Vault** or AWS Secrets Manager, injected dynamically into container pods at runtime.

---

## 3. Long-Term Architectural Goals

### 3.1 CQRS (Command Query Responsibility Segregation)
- Separate the high-volume Flight Search read models from the transactional Flight Booking write engine, replicating read data to Elasticsearch or MongoDB for sub-millisecond faceted search.

### 3.2 WebSocket / Server-Sent Events (SSE) for Real-Time Flight Updates
- Replace polling on the passenger and staff dashboards with reactive Server-Sent Events from `notification-service`, instantly updating departure gate numbers and flight delays on passenger mobile screens.

