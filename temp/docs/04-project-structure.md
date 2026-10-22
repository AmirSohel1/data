# 04. Repository & Project Structure

## 1. Monorepo Architecture Overview

AeroBook is organized as a structured multi-module monorepo containing 11 backend microservices, a standalone Angular frontend application, operational automation scripts, centralized database migration scripts, and continuous quality inspection pipelines.

```text
d:\aerobook/
├── .mvn/                                # Maven wrapper binary and properties
├── docs/                                # Complete comprehensive technical documentation
│   ├── 05-microservices/               # Dedicated deep-dive microservice specifications
│   └── Complete_Project_Documentation.pdf # Consolidated master PDF publication
├── scripts/                             # Orchestration, database seeds, and verification scripts
├── service-discovery/                   # Netflix Eureka Service Registry (Port 8761)
├── config-server/                       # Spring Cloud Config Server (Port 8080)
├── api-gateway/                         # Spring Cloud Gateway WebFlux Reverse Proxy (Port 8083)
├── auth-service/                        # Identity, JWT & Security Microservice (Port 8082)
├── user-service/                        # User Profiles & Incident Microservice (Port 8084)
├── flight-service/                      # Flight Catalog & Fleet Microservice (Port 8087)
├── fare-service/                        # Dynamic Fares & Coupons Microservice (Port 8089)
├── booking-service/                     # Reservations & PNR Microservice (Port 8088)
├── check-in-service/                    # Check-In & Boarding Pass Microservice (Port 8090)
├── notification-service/                # Alerts, SMTP & PDF Generator Microservice (Port 8091)
├── payment-service/                     # Razorpay Orders & Webhook Microservice (Port 8092)
├── frontend/                            # Angular 18 Single Page Application (Port 4200)
├── .env.example                         # Environment configuration template
├── .env.sonarqube.example               # SonarQube & PostgreSQL environment template
├── docker-compose.sonarqube.yml         # Containerized SonarQube & PostgreSQL stack
├── pom.xml                              # Root Maven aggregator POM for all 11 microservices
├── mvnw / mvnw.cmd                      # Cross-platform Maven wrapper executables
├── run-sonar-analysis.ps1 / .bat        # Master SonarQube code quality pipeline
└── start-all.bat / stop-all.bat         # 1-Click developer lifecycle scripts
```

---

## 2. Root Files & Operational Scripts

| File Name | Purpose & Function |
|---|---|
| [`pom.xml`](file:///d:/aerobook/pom.xml) | Root Maven aggregator orchestrating multi-module builds, tests, and static analysis across all 11 microservices |
| [`mvnw`](file:///d:/aerobook/mvnw) / [`mvnw.cmd`](file:///d:/aerobook/mvnw.cmd) | Maven 3.9.16 Wrapper enabling reproducible builds without requiring globally installed Maven |
| [`.env.example`](file:///d:/aerobook/.env.example) | Canonical environment variable reference detailing MySQL databases, JWT secret, Razorpay credentials, and service ports |
| [`docker-compose.sonarqube.yml`](file:///d:/aerobook/docker-compose.sonarqube.yml) | Production-ready Compose definition running SonarQube 10.5 Community + PostgreSQL 15 with persistent named volumes |
| [`run-sonar-analysis.ps1`](file:///d:/aerobook/run-sonar-analysis.ps1) | PowerShell orchestrator checking server availability, compiling, running tests, validating JaCoCo/LCOV, and triggering SonarQube |
| [`run-sonar-analysis.bat`](file:///d:/aerobook/run-sonar-analysis.bat) | Native Windows Command Prompt wrapper for `run-sonar-analysis.ps1` |
| [`start-all.bat`](file:///d:/aerobook/start-all.bat) / [`stop-all.bat`](file:///d:/aerobook/stop-all.bat) | Quick lifecycle batch triggers delegating to `scripts/run-services.ps1` |
| [`scripts/run-services.ps1`](file:///d:/aerobook/scripts/run-services.ps1) | Advanced service orchestrator implementing tiered startup ordering (Eureka first, then business services), health polling, and process management |
| [`scripts/seed.sql`](file:///d:/aerobook/scripts/seed.sql) | Master SQL migration script creating all 8 databases and populating 15-30 realistic aviation records per domain |

---

## 3. Backend Microservice Internal Architecture

Every Spring Boot microservice adheres to a clean, standardized layered architecture:

```text
<service-directory>/
├── pom.xml                              # Service-specific build manifest, plugins, dependencies
├── mvnw / mvnw.cmd                      # Embedded service-level Maven wrapper
├── src/
│   ├── main/
│   │   ├── java/com/aerobook/<service>/
│   │   │   ├── <Service>Application.java # Spring Boot entry point & bootstrap configuration
│   │   │   ├── client/                  # OpenFeign declarative REST client interfaces
│   │   │   ├── config/                  # Security, WebMvc, RabbitMQ, and CORS configuration classes
│   │   │   ├── controller/              # Spring MVC REST Controllers exposing HTTP endpoints
│   │   │   ├── dto/                     # Request payloads, response bodies, and error records
│   │   │   ├── entity/                  # JPA Entities mapped to MySQL database tables
│   │   │   ├── exception/               # Domain-specific exceptions and GlobalExceptionHandler
│   │   │   ├── messaging/               # RabbitMQ event producers and consumers
│   │   │   ├── repository/              # Spring Data JPA Repository interfaces
│   │   │   ├── service/                 # Core business logic interfaces
│   │   │   │   └── impl/                # Business service implementations
│   │   │   └── util/                    # Helper utilities, validators, and token parsers
│   │   └── resources/
│   │       ├── application.properties   # Microservice port, MySQL datasource, and Eureka settings
│   │       └── logback-spring.xml       # Structured logging layout and console patterns
│   └── test/
│       └── java/com/aerobook/<service>/ # Unit and integration test suites (JUnit 5 & Mockito)
└── target/
    ├── classes/                         # Compiled Java bytecode
    └── site/jacoco/jacoco.xml           # Automated JaCoCo XML code coverage report
```

### Key Service Package Directory Mappings:
- **`client/`**: Declarative `@FeignClient` interfaces specifying logical Eureka targets (`name = "FLIGHT-SERVICE"`).
- **`config/`**: Contains Spring configuration beans, security filters, and RabbitMQ queue/exchange bindings.
- **`controller/`**: Handles HTTP serialization, path routing, and parameter validation (`@Valid`).
- **`dto/`**: Strongly typed data transfer objects decoupling internal persistence models from API responses.
- **`entity/`**: Database records decorated with Jakarta Persistence annotations (`@Entity`, `@Table`, `@Id`).
- **`repository/`**: Inherits `JpaRepository<T, ID>` with custom query derivations and JPQL definitions.
- **`service/impl/`**: Pure business rules, validation constraints, and transactional boundaries (`@Transactional`).

---

## 4. Frontend Application Structure

The Angular frontend ([`frontend/`](file:///d:/aerobook/frontend)) utilizes Angular 18's Standalone Component architecture, eliminating legacy `NgModule` boilerplate and structuring code by functional concern:

```text
frontend/
├── angular.json                         # Angular CLI workspace build and test configurations
├── package.json                         # npm dependencies, scripts, and build tasks
├── tsconfig.json / tsconfig.app.json    # TypeScript compiler configuration
├── tsconfig.spec.json                   # TypeScript configuration for Jasmine unit tests
├── karma.conf.js                        # Karma test runner config with ChromeHeadlessCI & LCOV
├── sonar-project.properties             # SonarQube scanner properties for TypeScript analysis
├── public/                              # Static public web assets (favicons, manifest)
└── src/
    ├── index.html                       # HTML shell with zero-flash theme bootstrap script
    ├── main.ts                          # Angular platform bootstrap entry point
    ├── styles.css                       # Global Tailwind CSS and dual-theme CSS variable tokens
    └── app/
        ├── app.component.ts             # Root application shell rendering navbar & router outlet
        ├── app.routes.ts                # Client-side route declarations and guard attachments
        ├── app.config.ts                # Application providers (HttpClient, router, animations)
        ├── core/                        # Singleton core infrastructure (guards, interceptors, API)
        │   ├── api/                     # Strongly typed API client layer (16 domain clients)
        │   │   ├── api.service.ts       # Central HTTP client handling base URL & error mapping
        │   │   ├── auth.api.ts          # Login, register, refresh token, OTP endpoints
        │   │   ├── flights.api.ts       # Flight search, details, and status updates
        │   │   ├── bookings.api.ts      # Reservation creation, PNR search, cancel
        │   │   ├── payments.api.ts      # Razorpay order creation and verification
        │   │   └── ...                  # Check-in, notifications, fares, coupons, users APIs
        │   ├── guards/                  # Route guards (customerGuard, staffGuard, adminGuard)
        │   ├── interceptors/            # authInterceptor attaching Bearer token & correlation IDs
        │   ├── models/                  # TypeScript interface definitions (aerobook.models.ts)
        │   ├── services/                # State services (AuthService, ToastService, BookingService)
        │   └── theme/                   # ThemeService managing light/dark mode and localStorage
        ├── features/                    # Role-specific business views and dashboards
        │   ├── home/                    # Public landing page (home.component.ts)
        │   ├── customer/                # Passenger dashboard (customer-dashboard.component.ts)
        │   ├── staff/                   # Airport ground staff portal (staff-dashboard.component.ts)
        │   └── admin/                   # Airline admin control center (admin-dashboard.component.ts)
        └── shared/                      # Reusable visual components and design primitives
            ├── components/              # Complex shared widgets (navbar, login-modal, register-modal)
            └── ui/                      # Atomic design system components (ab-button, ab-card, etc.)
```

### Design System Primitives (`shared/ui/`):
- **`ab-button.component.ts`**: Standardized buttons with variant styles (primary, outline, ghost, danger).
- **`ab-card.component.ts`**: Glassmorphic panels with light/dark adaptive background and borders.
- **`ab-input.component.ts`**: Text, password, and number inputs with floating labels and error states.
- **`ab-modal.component.ts`**: Accessible dialog overlays with backdrop blur and escape key handling.
- **`ab-status-pill.component.ts`**: Colored status badges for flight and booking states.
- **`ab-ticket.component.ts`**: Specialized airline ticket presentation widget.

