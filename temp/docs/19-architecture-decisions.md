# Architecture Decision Records (ADR)

This document captures the key architectural decisions, rationale, trade-offs, and alternatives considered during the design and evolution of the AeroBook platform.

---

## ADR 01: Microservices Architecture over Monolithic Architecture

- **Status**: Accepted
- **Context**: An airline booking and operations platform encompasses multiple distinct business boundaries with divergent scaling, security, and operational requirements (e.g., high-volume read-heavy flight searches vs. high-concurrency transactional booking reservations and low-latency gate boarding verifications).
- **Decision**: Decompose the application into 11 independently deployable microservices organized around domain boundaries: Service Discovery, Config Server, API Gateway, Auth, User, Flight, Fare, Booking, Check-In, Notification, and Payment.
- **Consequences**:
  - *Positive*: Independent scaling, domain isolation, localized failure domains, autonomous service deployments.
  - *Trade-offs*: Increased operational complexity, distributed transactions requiring eventual consistency, inter-service network latency.

---

## ADR 02: Database-per-Service Pattern over Shared Database Schema

- **Status**: Accepted
- **Context**: In monolithic enterprise databases, multiple subsystems execute cross-table joins, tightly coupling database schemas and preventing individual teams or services from modifying data models without risk of system-wide breakage.
- **Decision**: Mandate strict Database-per-Service isolation across 8 private MySQL schemas (`aerobook_auth_db`, `aerobook_user_db`, `aerobook_flight_db`, `aerobook_fare_db`, `aerobook_booking_db`, `aerobook_checkin_db`, `aerobook_notification_db`, `aerobook_payment_db`). Microservices are prohibited from querying external databases directly.
- **Consequences**:
  - *Positive*: Complete schema autonomy, independent database performance tuning, zero cross-domain table locking.
  - *Trade-offs*: Elimination of relational foreign key constraints across services; cross-service queries must be orchestrated via APIs or messaging.

---

## ADR 03: Reactive Non-Blocking API Gateway (Netty & Spring Cloud Gateway)

- **Status**: Accepted
- **Context**: The API Gateway serves as the single perimeter ingress for all platform traffic. A thread-per-request blocking gateway model (e.g., Spring MVC / Zuul 1) can suffer thread pool exhaustion under heavy concurrent request spikes.
- **Decision**: Adopt Spring Cloud Gateway built on Spring WebFlux, Project Reactor, and Netty.
- **Consequences**:
  - *Positive*: Asynchronous non-blocking I/O capable of handling tens of thousands of concurrent client connections with minimal memory and CPU overhead.
  - *Trade-offs*: Reactive programming paradigms require careful filter chain structuring and non-blocking filter implementations.

---

## ADR 04: Hybrid Synchronous (OpenFeign) & Asynchronous (RabbitMQ) Messaging

- **Status**: Accepted
- **Context**: Certain business actions require immediate consistent answers (e.g., Booking Service must verify flight existence and seat counts before accepting payment), while other operations can be processed asynchronously without blocking the user (e.g., flight seat count deduction, e-ticket PDF generation, email dispatch).
- **Decision**: Use Spring Cloud OpenFeign with Eureka client-side load balancing for synchronous query-response flows, and RabbitMQ with durable AMQP queues for asynchronous state propagation and background notifications.
- **Consequences**:
  - *Positive*: Optimal user response times, fault isolation (booking succeeds even if notifications are delayed), guaranteed message delivery via durable queues.
  - *Trade-offs*: Requires maintaining both an HTTP service discovery mesh and an AMQP broker cluster.

---

## ADR 05: Perimeter JWT Authentication & Downstream Header Mutation

- **Status**: Accepted
- **Context**: Re-evaluating cryptographic JWT signatures and hitting database caches on every internal microservice hop introduces significant CPU overhead and latency.
- **Decision**: Centralize JWT signature verification and role parsing exclusively at the API Gateway. The Gateway extracts claims and injects trusted HTTP headers (`X-User-Id`, `X-User-Role`, `X-User-Email`) into downstream requests.
- **Consequences**:
  - *Positive*: High internal throughput, downstream services remain lightweight and decoupled from token parsing logic.
  - *Trade-offs*: Internal service ports must be secured from direct external ingress via network firewalls or container virtual networks.

---

## ADR 06: Angular 18 Standalone Components & Signals over NgModules

- **Status**: Accepted
- **Context**: Traditional Angular applications suffer from NgModule boilerplate, verbose RxJS boilerplate for simple reactive state, and performance overhead from Zone.js dirty checking.
- **Decision**: Build the frontend Single Page Application using Angular 18 with 100% Standalone Components and native Angular Signals (`signal()`, `computed()`) for component state management.
- **Consequences**:
  - *Positive*: Tree-shakable bundle sizes, clear component dependency graphs, instantaneous fine-grained DOM updates without zone-wide re-renders.
  - *Trade-offs*: Developers must adhere strictly to Signal-based data patterns rather than legacy two-way bindings.

