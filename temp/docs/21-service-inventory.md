# Definitive Platform Service Inventory

This document provides the authoritative inventory of all microservices, frontend applications, and supporting platform components comprising the AeroBook ecosystem.

---

## 1. Master Service Inventory Table

| Service Name | Directory Path | Port | Technology Stack | Database / Storage | Key Responsibilities | Primary Dependencies | Health Endpoint |
|---|---|:---:|---|---|---|---|---|
| **Service Discovery** | `/service-discovery` | 8761 | Java 21, Spring Boot 3.3.4, Netflix Eureka Server | In-Memory Registry | Dynamic microservice registry, instance heartbeats, and cluster topology | Standalone | `/actuator/health` |
| **Config Server** | `/config-server` | 8080 | Java 21, Spring Boot 3.3.4, Spring Cloud Config | File / Git Native Profile | Centralized external configuration repository | Standalone | `/actuator/health` |
| **API Gateway** | `/api-gateway` | 8083 | Java 21, Spring Cloud Gateway, WebFlux, Netty | Reactive Non-Blocking | Single entry ingress, routing, JWT perimeter security, header mutation, CORS | Eureka:8761 | `/api/gateway/health` |
| **Auth Service** | `/auth-service` | 8082 | Java 21, Spring Boot 3.3.4, Spring Security, JJWT | MySQL: `aerobook_auth_db` | User authentication, credential store, BCrypt hashing, JWT generation, refresh tokens, OTP | Eureka:8761, MySQL:3306, Notification:8091 | `/api/auth/health` |
| **User Service** | `/user-service` | 8084 | Java 21, Spring Boot 3.3.4, Spring Data JPA | MySQL: `aerobook_user_db` | Customer profiles, demographic records, airport staff incident reporting | Eureka:8761, MySQL:3306 | `/api/v1/users/health` |
| **Flight Service** | `/flight-service` | 8087 | Java 21, Spring Boot 3.3.4, RabbitMQ AMQP | MySQL: `aerobook_flight_db` | Commercial flight schedules, aircraft fleet, seat inventory, search engine | Eureka:8761, MySQL:3306, RabbitMQ:5672 | `/api/flights/health` |
| **Fare Service** | `/fare-service` | 8089 | Java 21, Spring Boot 3.3.4, OpenFeign | MySQL: `aerobook_fare_db` | Tiered cabin pricing (Economy, Business, First), GST tax rules, promo coupon validation | Eureka:8761, MySQL:3306, Flight:8087 | `/api/fares/health` |
| **Booking Service** | `/booking-service` | 8088 | Java 21, Spring Boot 3.3.4, OpenFeign, RabbitMQ | MySQL: `aerobook_booking_db` | Flight reservation orchestration, PNR generation, passenger manifest, cancellations | Eureka:8761, MySQL:3306, Flight:8087, Fare:8089, RabbitMQ:5672 | `/api/bookings/health` |
| **Check-In Service** | `/check-in-service` | 8090 | Java 21, Spring Boot 3.3.4, Spring Data JPA | MySQL: `aerobook_checkin_db` | Passenger check-in, seat confirmation, boarding pass generation, departure gate scanner | Eureka:8761, MySQL:3306, Notification:8091 | `/api/check-ins/health` |
| **Notification Service** | `/notification-service` | 8091 | Java 21, Spring Boot 3.3.4, OpenPDF, JavaMail | MySQL: `aerobook_notification_db` | Transactional email dispatch, vector PDF e-tickets/boarding passes, in-app notification inbox | Eureka:8761, MySQL:3306, SMTP Host:587 | `/api/notifications/health` |
| **Payment Service** | `/payment-service` | 8092 | Java 21, Spring Boot 3.3.4, Razorpay Java SDK | MySQL: `aerobook_payment_db` | Razorpay checkout orders, HMAC-SHA256 signature verification, webhooks, refunds | Eureka:8761, MySQL:3306, Razorpay Cloud API | `/api/payments/health` |
| **Angular Frontend** | `/frontend` | 4200 | Angular 18.2, TypeScript 5.5, Signals, Standalone | Browser LocalStorage / In-Memory Signals | User interface for passengers, airport staff, and platform administrators | API Gateway:8083 | N/A (`/`) |

---

## 2. Infrastructure & Supporting Components

| Component | Default Port | Technology | Purpose |
|---|:---:|---|---|
| **MySQL Server** | 3306 | MySQL Community 8.0+ | Relational data persistence hosting 8 isolated microservice schemas |
| **RabbitMQ Broker** | 5672 | RabbitMQ 3.12+ (Erlang OTP) | Asynchronous message broker for decoupled event-driven workflows |
| **RabbitMQ Admin UI** | 15672 | Web Management Plugin | AMQP broker monitoring, queue inspection, and message statistics |
| **SonarQube Server** | 9000 | SonarQube 10.5 Community (Docker) | Automated static code analysis, test coverage, and quality gate governance |

