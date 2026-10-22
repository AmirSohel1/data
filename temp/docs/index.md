# AeroBook Cloud Airline Platform - Documentation Index

Welcome to the comprehensive technical documentation for the **AeroBook Cloud Airline Platform**, an enterprise-grade commercial aviation booking, check-in, and operations ecosystem.

> [!NOTE]
> A consolidated, professionally formatted PDF edition of this entire documentation suite is available for download at:  
> **[`docs/Complete_Project_Documentation.pdf`](file:///d:/aerobook/docs/Complete_Project_Documentation.pdf)**  
> 
> For presentation deliveries, access the dedicated 16:9 widescreen presentation deck and individual visual diagrams:  
> **[📽️ Master Diagrams Presentation Deck (PDF)](file:///d:/aerobook/docs/diagrams/AeroBook_Diagrams_Presentation.pdf)** | **[🌐 Master Deck (HTML Slides)](file:///d:/aerobook/docs/diagrams/AeroBook_Diagrams_Presentation.html)**

---

## 🎨 System Diagrams & Presentation Deck (`docs/diagrams/`)

Complete architectural and UML diagram deliverables prepared for technical presentations:

| Diagram Type | Presentation PDF | Interactive Slide (HTML) | Markdown Source | Description |
|---|---|---|---|---|
| **Class Diagram** | [01-class-diagram.pdf](file:///d:/aerobook/docs/diagrams/01-class-diagram.pdf) | [HTML Slide](file:///d:/aerobook/docs/diagrams/01-class-diagram.html) | [01-class-diagram.md](file:///d:/aerobook/docs/diagrams/01-class-diagram.md) | Domain classes, entities, enums & associations across 11 services |
| **ER Diagram** | [02-er-diagram.pdf](file:///d:/aerobook/docs/diagrams/02-er-diagram.pdf) | [HTML Slide](file:///d:/aerobook/docs/diagrams/02-er-diagram.html) | [02-er-diagram.md](file:///d:/aerobook/docs/diagrams/02-er-diagram.md) | Relational schemas, PK/FK/UK constraints across 8 MySQL databases |
| **Architecture Diagram** | [03-architecture-diagram.pdf](file:///d:/aerobook/docs/diagrams/03-architecture-diagram.pdf) | [HTML Slide](file:///d:/aerobook/docs/diagrams/03-architecture-diagram.html) | [03-architecture-diagram.md](file:///d:/aerobook/docs/diagrams/03-architecture-diagram.md) | Multi-tier microservices topology, Netty Gateway, Eureka & AMQP |
| **Use-Case Diagram** | [04-use-case-diagram.pdf](file:///d:/aerobook/docs/diagrams/04-use-case-diagram.pdf) | [HTML Slide](file:///d:/aerobook/docs/diagrams/04-use-case-diagram.html) | [04-use-case-diagram.md](file:///d:/aerobook/docs/diagrams/04-use-case-diagram.md) | Passenger, Staff, and Admin RBAC use cases & external actors |
| **Activity Diagram** | [05-activity-diagram.pdf](file:///d:/aerobook/docs/diagrams/05-activity-diagram.pdf) | [HTML Slide](file:///d:/aerobook/docs/diagrams/05-activity-diagram.html) | [05-activity-diagram.md](file:///d:/aerobook/docs/diagrams/05-activity-diagram.md) | End-to-end flight booking, payment fork/join, check-in & gate scan |
| **Flow Diagram** | [06-flow-diagram.pdf](file:///d:/aerobook/docs/diagrams/06-flow-diagram.pdf) | [HTML Slide](file:///d:/aerobook/docs/diagrams/06-flow-diagram.html) | [06-flow-diagram.md](file:///d:/aerobook/docs/diagrams/06-flow-diagram.md) | Netty packet ingress, header mutation, OpenFeign RPC & AMQP queues |

---

## 1. System Overview & Foundation

- **[01. Project Overview](file:///d:/aerobook/docs/01-project-overview.md)**: Executive summary, problem domain, target user personas, core functional capabilities, and business scope.
- **[02. Technology Stack & Runtimes](file:///d:/aerobook/docs/02-technology-stack.md)**: Exhaustive version matrix covering Java 21, Spring Boot 3.3.4, Angular 18, MySQL 8, RabbitMQ, and testing tooling.
- **[03. System Architecture](file:///d:/aerobook/docs/03-system-architecture.md)**: Microservices topology, reactive routing, edge security, communication flows, and system boundaries.
- **[04. Project Repository Structure](file:///d:/aerobook/docs/04-project-structure.md)**: Monorepo layout, backend package anatomy, frontend standalone structure, and automation scripts.

---

## 2. Microservices Directory (`docs/05-microservices/`)

AeroBook consists of 11 independently deployable Java Spring Boot microservices:

1. **[Service Discovery (Eureka Server)](file:///d:/aerobook/docs/05-microservices/service-discovery.md)** - Port `8761`: Netflix Eureka registry and dynamic cluster locator.
2. **[Config Server](file:///d:/aerobook/docs/05-microservices/config-server.md)** - Port `8080`: Centralized configuration management with native profiles.
3. **[API Gateway](file:///d:/aerobook/docs/05-microservices/api-gateway.md)** - Port `8083`: Spring Cloud Gateway, WebFlux, Netty non-blocking ingress, and JWT perimeter verification.
4. **[Auth Service](file:///d:/aerobook/docs/05-microservices/auth-service.md)** - Port `8082`: User authentication, credential store, BCrypt hashing, JWT generation, refresh tokens, and OTP verifications (`aerobook_auth_db`).
5. **[User Service](file:///d:/aerobook/docs/05-microservices/user-service.md)** - Port `8084`: Passenger profiles, demographics, and airport staff incident tracking (`aerobook_user_db`).
6. **[Flight Service](file:///d:/aerobook/docs/05-microservices/flight-service.md)** - Port `8087`: Flight schedules, airline routes, aircraft fleet, seat capacity, and search engine (`aerobook_flight_db`).
7. **[Fare Service](file:///d:/aerobook/docs/05-microservices/fare-service.md)** - Port `8089`: Cabin pricing tiers (Economy, Business, First), GST tax rules, and promotional coupons (`aerobook_fare_db`).
8. **[Booking Service](file:///d:/aerobook/docs/05-microservices/booking-service.md)** - Port `8088`: Reservation orchestration, 6-character PNR generation, passenger manifests, and cancellations (`aerobook_booking_db`).
9. **[Check-In Service](file:///d:/aerobook/docs/05-microservices/check-in-service.md)** - Port `8090`: Passenger digital check-in, seat assignment, boarding pass generation, and gate scanner verification (`aerobook_checkin_db`).
10. **[Notification Service](file:///d:/aerobook/docs/05-microservices/notification-service.md)** - Port `8091`: SMTP email dispatch, OpenPDF dynamic e-ticket and boarding pass generation, and in-app alerts (`aerobook_notification_db`).
11. **[Payment Service](file:///d:/aerobook/docs/05-microservices/payment-service.md)** - Port `8092`: Razorpay order creation, HMAC-SHA256 signature verification, webhooks, and refunds (`aerobook_payment_db`).

---

## 3. Frontend Application

- **[06. Angular Frontend](file:///d:/aerobook/docs/06-frontend.md)**: Angular 18 Single Page Application, Standalone Components, Angular Signals, atomic `ab-*` UI library, and dual light/dark theming engine.

---

## 4. Cross-Cutting Technical Specifications

- **[07. Master API Reference](file:///d:/aerobook/docs/07-api-reference.md)**: Definitive catalog of all 50+ REST endpoints across all services and the API Gateway.
- **[08. Database Design & Persistence](file:///d:/aerobook/docs/08-database-design.md)**: Database-per-service pattern, complete Mermaid ERD, table DDLs, and master seed dataset.
- **[09. Inter-Service Communication](file:///d:/aerobook/docs/09-service-communication.md)**: Synchronous OpenFeign clients, dynamic Eureka resolution, and asynchronous RabbitMQ AMQP event messaging.
- **[10. Security & Authentication](file:///d:/aerobook/docs/10-security.md)**: Stateless JWT architecture, RBAC permissions matrix, BCrypt hashing, setup keys, and header mutation.
- **[11. Configuration & Environments](file:///d:/aerobook/docs/11-configuration.md)**: Environment variable reference catalog, profile hierarchy (`dev`, `docker`, `prod`), and configuration properties.

---

## 5. Operations, Deployment & Quality Assurance

- **[12. Local Development Guide](file:///d:/aerobook/docs/12-local-development.md)**: Step-by-step developer setup, PowerShell orchestration scripts, smoke test execution, and seeded test accounts.
- **[13. Deployment & Containerization](file:///d:/aerobook/docs/13-deployment.md)**: Multi-stage Docker packaging, Docker Compose topologies, Kubernetes production architecture, and graceful shutdown.
- **[14. Testing & Quality Assurance](file:///d:/aerobook/docs/14-testing.md)**: JUnit 5, Mockito, slice tests, Karma/Jasmine, JaCoCo coverage, and SonarQube quality gates.
- **[15. Observability & Logging](file:///d:/aerobook/docs/15-observability.md)**: Structured SLF4J/Logback logging, correlation IDs, Spring Boot Actuator probes, and Eureka telemetry.
- **[16. Core Business Workflows](file:///d:/aerobook/docs/16-business-workflows.md)**: 7 comprehensive sequence diagrams illustrating flight search, checkout, check-in, gate scan, and cancellation.
- **[17. Troubleshooting & Diagnostics Runbook](file:///d:/aerobook/docs/17-troubleshooting.md)**: Solutions for port conflicts, Eureka registration latency, CORS, JWT expiration, and database connectivity.
- **[18. Domain & Technical Glossary](file:///d:/aerobook/docs/18-glossary.md)**: Definitions for aviation concepts (PNR, IATA, boarding pass) and microservices architecture terms.
- **[19. Architecture Decision Records (ADRs)](file:///d:/aerobook/docs/19-architecture-decisions.md)**: Historical records for architectural decisions (ADRs 01 through 06).
- **[20. Architecture Recommendations](file:///d:/aerobook/docs/20-recommendations.md)**: Prioritized roadmap for enterprise scale (Flyway, Redis cache, Resilience4j, rate limiting).
- **[21. Service Inventory](file:///d:/aerobook/docs/21-service-inventory.md)**: Authoritative master service inventory table with ports, stacks, and health endpoints.
- **[22. Documentation Coverage Audit](file:///d:/aerobook/docs/22-documentation-coverage.md)**: Verification checklist and audit metrics.

