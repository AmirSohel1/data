# Configuration Reference & Environment Management

## 1. Centralized Configuration Architecture
AeroBook supports both **decentralized service profiles** and **centralized Spring Cloud Config Server** (`config-server:8080`).

Each microservice imports the centralized configuration optionally via:
```properties
spring.config.import=optional:configserver:http://localhost:8080
```
This ensures that services can run standalone with sensible local defaults or inherit centralized parameters across `dev`, `docker`, and `prod` deployment profiles.

---

## 2. Master Environment Variables Inventory

| Variable Name | Default / Example Value | Description | Services Consuming |
|---|---|---|---|
| `MYSQL_URL` | `jdbc:mysql://localhost:3306/<db_name>?createDatabaseIfNotExist=true` | JDBC connection string | All 8 persistent services |
| `MYSQL_USERNAME` | `root` | Database master user | All 8 persistent services |
| `MYSQL_PASSWORD` | `[SECURE_CREDENTIAL]` | Database user password | All 8 persistent services |
| `EUREKA_URL` | `http://localhost:8761/eureka/` | Eureka Service Registry endpoint | All 10 client services |
| `RABBITMQ_HOST` | `localhost` | AMQP Message Broker host | `booking-service`, `flight-service` |
| `RABBITMQ_PORT` | `5672` | AMQP Message Broker port | `booking-service`, `flight-service` |
| `RABBITMQ_USERNAME`| `guest` | RabbitMQ user account | `booking-service`, `flight-service` |
| `RABBITMQ_PASSWORD`| `[SECURE_CREDENTIAL]` | RabbitMQ user password | `booking-service`, `flight-service` |
| `JWT_SECRET` | `[MINIMUM_32_CHAR_SECRET_KEY]` | HMAC-SHA256 signing key | `api-gateway`, `auth-service`, `booking-service` |
| `JWT_EXPIRATION` | `3600000` (1 hour) | JWT Access Token TTL in milliseconds | `auth-service` |
| `JWT_REFRESH_EXPIRATION` | `604800000` (7 days) | Refresh Token TTL in milliseconds | `auth-service` |
| `ADMIN_REGISTRATION_KEY` | `[SECURE_ADMIN_KEY]` | Setup key required for admin signups | `auth-service` |
| `STAFF_REGISTRATION_KEY` | `[SECURE_STAFF_KEY]` | Setup key required for staff signups | `auth-service` |
| `RAZORPAY_KEY_ID` | `rzp_test_...` | Public client identifier for Razorpay | `payment-service`, `frontend` |
| `RAZORPAY_KEY_SECRET` | `[SECURE_KEY_SECRET]` | Private server secret for Razorpay | `payment-service` |
| `RAZORPAY_WEBHOOK_SECRET` | `[SECURE_WEBHOOK_SECRET]` | Secret for verifying Razorpay webhooks | `payment-service` |
| `SPRING_MAIL_HOST` | `smtp.gmail.com` | Outbound SMTP host | `notification-service` |
| `SPRING_MAIL_PORT` | `587` | SMTP TLS port | `notification-service` |
| `SPRING_MAIL_USERNAME` | `operations@aerobook.com` | SMTP authenticated account | `notification-service` |
| `SPRING_MAIL_PASSWORD` | `[SECURE_APP_PASSWORD]` | App-specific mail password | `notification-service` |
| `AEROBOOK_MAIL_ENABLED`| `true` | Toggle outbound mail dispatch | `notification-service` |

---

## 3. Configuration Profiles

### 3.1 Local Development Profile (`default`)
- Points to `localhost` databases, local Eureka (`8761`), and local RabbitMQ.
- DDL schema auto-generation: `spring.jpa.hibernate.ddl-auto=update`.
- SQL statement logging enabled in debug mode.

### 3.2 Docker Profile (`docker`)
- Activated via `-Dspring.profiles.active=docker` or `SPRING_PROFILES_ACTIVE=docker`.
- Targets Docker internal hostnames:
  - Database: `mysql:3306`
  - Eureka: `http://service-discovery:8761/eureka/`
  - RabbitMQ: `rabbitmq:5672`
  - Config Server: `http://config-server:8080`

### 3.3 Production Profile (`prod`)
- DDL auto-generation set to `validate` (schema mutations managed strictly via migration scripts).
- Sensitive environment variables supplied via container secrets or Kubernetes Secrets.
- Actuator endpoints restricted to internal cluster subnets.

