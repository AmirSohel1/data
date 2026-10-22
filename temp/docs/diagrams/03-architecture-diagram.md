# AeroBook Platform - System Architecture Diagram

## 1. Overview & Presentation Notes
The **System Architecture Diagram** illustrates the end-to-end, multi-tier enterprise microservices topology of the AeroBook platform. It illustrates how client requests traverse the edge security perimeter, resolve downstream microservices dynamically via Netflix Eureka, execute synchronous and asynchronous inter-service workflows, and persist state in isolated databases.

### Presentation Talking Points
- **Single Point of Ingress**: The Angular 18 Single Page Application interacts exclusively with the Spring Cloud API Gateway (Port 8083), decoupling client applications from internal microservice network topology.
- **Perimeter Security Model**: Cryptographic JWT validation occurs at the Gateway. Validated claims are propagated downstream as trusted HTTP headers (`X-User-Id`, `X-User-Role`), optimizing internal request performance.
- **Hybrid Communication Architecture**: Combines synchronous OpenFeign RPC for instant consistency with asynchronous RabbitMQ AMQP messaging for resilient, decoupled background workflows.
- **Database-Per-Service Autonomy**: 8 dedicated MySQL schemas prevent coupling and eliminate cross-domain database contention.

---

## 2. Complete System Architecture Diagram

```mermaid
flowchart TD
    %% CLIENT LAYER
    subgraph Client_Layer ["Client Presentation Tier (Port 4200)"]
        UI["Angular 18 Single Page Application<br/>(Standalone Components • Signals • ab-* UI Library)"]
        WebBrowser["Desktop & Mobile Browsers"]
        AirportKiosk["Airport Operations & Gate Scanners"]
        WebBrowser --> UI
        AirportKiosk --> UI
    end

    %% EDGE / GATEWAY LAYER
    subgraph Gateway_Layer ["Edge Security & API Gateway Tier (Port 8083)"]
        GW["Spring Cloud Gateway (Netty Reactive Engine)"]
        JWT_Filter["JWT Perimeter Authentication & Validation"]
        Header_Mutate["Downstream Header Mutation (X-User-Id, X-User-Role)"]
        CORS["CORS & Request Rate Limiting"]
        GW --> JWT_Filter --> Header_Mutate --> CORS
    end

    UI -->|"HTTPS / REST (JSON)"| GW

    %% DISCOVERY & CONFIG LAYER
    subgraph Infra_Layer ["Service Discovery & Centralized Configuration"]
        Eureka["Netflix Eureka Service Discovery<br/>(Port 8761 • Registry & Heartbeats)"]
        ConfigServer["Spring Cloud Config Server<br/>(Port 8080 • Native Profiles)"]
    end

    GW -.->|"Dynamic Route Lookup<br/>lb://SERVICE-NAME"| Eureka
    ConfigServer -.->|"Bootstraps Configuration"| GW

    %% BUSINESS SERVICES LAYER
    subgraph Microservices_Tier ["Business Microservices Tier (Java 21 • Spring Boot 3.3.4)"]
        AuthSvc["Auth Service<br/>(:8082 • JJWT, BCrypt)"]
        UserSvc["User Service<br/>(:8084 • Profiles & Incidents)"]
        FlightSvc["Flight Service<br/>(:8087 • Schedules & Fleet)"]
        FareSvc["Fare Service<br/>(:8089 • Tiered Pricing & Coupons)"]
        BookingSvc["Booking Service<br/>(:8088 • Reservations & PNR)"]
        CheckInSvc["Check-In Service<br/>(:8090 • Boarding Passes & Gate)"]
        NotifSvc["Notification Service<br/>(:8091 • OpenPDF & SMTP)"]
        PaymentSvc["Payment Service<br/>(:8092 • Razorpay Gateway)"]
    end

    %% GATEWAY DISPATCH
    CORS -->|"lb://AUTH-SERVICE"| AuthSvc
    CORS -->|"lb://USER-SERVICE"| UserSvc
    CORS -->|"lb://FLIGHT-SERVICE"| FlightSvc
    CORS -->|"lb://FARE-SERVICE"| FareSvc
    CORS -->|"lb://BOOKING-SERVICE"| BookingSvc
    CORS -->|"lb://CHECK-IN-SERVICE"| CheckInSvc
    CORS -->|"lb://NOTIFICATION-SERVICE"| NotifSvc
    CORS -->|"lb://PAYMENT-SERVICE"| PaymentSvc

    %% INTER-SERVICE COMMUNICATION
    BookingSvc -->|"OpenFeign: GET /api/flights/{id}"| FlightSvc
    BookingSvc -->|"OpenFeign: GET /api/fares/flight/{id}"| FareSvc
    FareSvc -->|"OpenFeign: GET /api/flights/{id}"| FlightSvc
    AuthSvc -->|"HTTP: POST /email/verify"| NotifSvc
    BookingSvc -->|"HTTP: POST /email/booking"| NotifSvc
    CheckInSvc -->|"HTTP: POST /email/checkin"| NotifSvc

    %% ASYNCHRONOUS EVENT BUS
    subgraph Event_Bus ["Asynchronous Event Broker (AMQP • Port 5672)"]
        RabbitMQ[("RabbitMQ Broker")]
        Q_Booking["Queue: booking-created<br/>(Durable AMQP)"]
        Q_Flight["Queue: flight.queue<br/>(Durable AMQP)"]
        RabbitMQ --- Q_Booking
        RabbitMQ --- Q_Flight
    end

    BookingSvc ==>|"Publishes: BookingCreatedEvent"| Q_Booking
    Q_Booking ==>|"Consumes: Decrement availableSeats"| FlightSvc
    FlightSvc ==>|"Publishes: FlightStatusUpdatedEvent"| Q_Flight

    %% PERSISTENCE TIER
    subgraph Persistence_Tier ["Relational Persistence Tier (MySQL 8.0 • Port 3306)"]
        DB_Auth[("aerobook_auth_db")]
        DB_User[("aerobook_user_db")]
        DB_Flight[("aerobook_flight_db")]
        DB_Fare[("aerobook_fare_db")]
        DB_Booking[("aerobook_booking_db")]
        DB_CheckIn[("aerobook_checkin_db")]
        DB_Notif[("aerobook_notification_db")]
        DB_Payment[("aerobook_payment_db")]
    end

    AuthSvc --> DB_Auth
    UserSvc --> DB_User
    FlightSvc --> DB_Flight
    FareSvc --> DB_Fare
    BookingSvc --> DB_Booking
    CheckInSvc --> DB_CheckIn
    NotifSvc --> DB_Notif
    PaymentSvc --> DB_Payment

    %% EXTERNAL SERVICES
    subgraph External_Services ["External Systems & Third-Party APIs"]
        RazorpayCloud["Razorpay Payment Gateway<br/>(HMAC-SHA256 Signature)"]
        SMTPServer["SMTP Mail Server<br/>(Gmail STARTTLS:587)"]
        SonarQubeServer["SonarQube Quality Server<br/>(Port 9000)"]
    end

    PaymentSvc <-->|"Orders & Verification"| RazorpayCloud
    NotifSvc -->|"Dispatch MIME Emails"| SMTPServer
```

---

## 3. Tiered Architectural Responsibilities

| Tier | Component | Technological Role |
|---|---|---|
| **Presentation** | Angular 18 SPA | Client user experience, Signals reactive state, atomic design token theming (`light`/`dark`) |
| **Edge Ingress** | Spring Cloud Gateway | Non-blocking reactive routing, Netty engine, JWT validation, header enrichment, CORS |
| **Discovery** | Netflix Eureka | Dynamic instance registration, client-side load balancing, automatic health heartbeat leasing |
| **Configuration** | Spring Cloud Config | Centralized configuration management with native profile resolution |
| **Core Business** | 8 Spring Boot Services | Domain business logic, transaction isolation, REST controllers, OpenFeign RPC clients |
| **Messaging** | RabbitMQ Broker | Asynchronous AMQP event decoupling, durable queues, fault-tolerant seat synchronization |
| **Persistence** | 8 MySQL Schemas | Isolated database-per-service relational persistence, transactional data integrity |
| **Third-Party** | Razorpay & Gmail | Payment processing, cryptographic signature validation, automated email notifications |

