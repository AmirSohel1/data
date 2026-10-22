# AeroBook Cloud Airline Platform

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-18.2-red.svg)](https://angular.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-AMQP-orange.svg)](https://www.rabbitmq.com/)
[![SonarQube](https://img.shields.io/badge/SonarQube-Quality%20Gate%20Passed-blue.svg)](http://localhost:9000)

**AeroBook** is an enterprise-grade commercial aviation booking, flight operations, and passenger management platform built with a modern microservices architecture on **Java 21**, **Spring Boot 3.3.4**, and **Angular 18**.

---

## Complete Project Documentation

Detailed, verified documentation is available in the [`docs/`](file:///d:/aerobook/docs/index.md) directory:

- 📖 **[Master Documentation Index](file:///d:/aerobook/docs/index.md)**
- 📕 **[Complete Project Documentation (Consolidated 75-Page PDF)](file:///d:/aerobook/docs/Complete_Project_Documentation.pdf)**
- 📽️ **[System & UML Diagrams Presentation Deck (PDF)](file:///d:/aerobook/docs/diagrams/AeroBook_Diagrams_Presentation.pdf)**
- 🏛️ **[System Architecture](file:///d:/aerobook/docs/03-system-architecture.md)**
- 🔌 **[Master API Reference (50+ Endpoints)](file:///d:/aerobook/docs/07-api-reference.md)**
- 🗄️ **[Database Design & ERDs (8 Schemas)](file:///d:/aerobook/docs/08-database-design.md)**
- 💻 **[Local Development & Startup Guide](file:///d:/aerobook/docs/12-local-development.md)**

---

## Service Architecture & Port Directory

| Service | Port | Database / Persistence | Core Responsibility |
|---|:---:|---|---|
| **[service-discovery](file:///d:/aerobook/docs/05-microservices/service-discovery.md)** | `8761` | In-Memory Registry | Netflix Eureka service discovery & cluster locator |
| **[config-server](file:///d:/aerobook/docs/05-microservices/config-server.md)** | `8080` | Native Profile | Centralized Spring Cloud Configuration |
| **[api-gateway](file:///d:/aerobook/docs/05-microservices/api-gateway.md)** | `8083` | Netty / Reactive | Ingress gateway, JWT verification, routing, CORS |
| **[auth-service](file:///d:/aerobook/docs/05-microservices/auth-service.md)** | `8082` | `aerobook_auth_db` | Authentication, credentials, JWT, OTP, RBAC |
| **[user-service](file:///d:/aerobook/docs/05-microservices/user-service.md)** | `8084` | `aerobook_user_db` | Passenger profiles and staff incident reports |
| **[flight-service](file:///d:/aerobook/docs/05-microservices/flight-service.md)** | `8087` | `aerobook_flight_db` | Flight schedules, aircraft fleet, seat availability |
| **[fare-service](file:///d:/aerobook/docs/05-microservices/fare-service.md)** | `8089` | `aerobook_fare_db` | Tiered cabin pricing, aviation GST, coupon engine |
| **[booking-service](file:///d:/aerobook/docs/05-microservices/booking-service.md)** | `8088` | `aerobook_booking_db` | Reservations, 6-char PNR generator, passenger roster |
| **[check-in-service](file:///d:/aerobook/docs/05-microservices/check-in-service.md)** | `8090` | `aerobook_checkin_db` | Passenger check-in, seat confirmation, boarding passes |
| **[notification-service](file:///d:/aerobook/docs/05-microservices/notification-service.md)** | `8091` | `aerobook_notification_db` | SMTP email alerts, OpenPDF e-tickets & boarding passes |
| **[payment-service](file:///d:/aerobook/docs/05-microservices/payment-service.md)** | `8092` | `aerobook_payment_db` | Razorpay checkout, HMAC-SHA256 verification, refunds |
| **[frontend](file:///d:/aerobook/docs/06-frontend.md)** | `4200` | Browser / Signals | Angular 18 Single Page App with `ab-*` UI library |

---

## Quick Start (Local Development)

### 1. Initialize Databases & Master Seed Data
```powershell
.\scripts\seed.ps1
```

### 2. Launch the Microservices Ecosystem
```powershell
# Start all microservices in order with background polling
.\scripts\run-services.ps1 -Frontend

# Or view each service in its own terminal window
.\scripts\run-services.ps1 -Window
```

### 3. Verify System Health
```powershell
.\scripts\smoke-check.ps1
```

Access the application in your browser at **`http://localhost:4200`**.

### Pre-Seeded Accounts
- **Admin**: `admin@aerobook.com` / `Admin@123`
- **Staff**: `staff@aerobook.com` / `Staff@123`
- **Passenger**: `priya@gmail.com` / `Passenger@123`