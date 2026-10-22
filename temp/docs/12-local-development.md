# Local Development & Quick Start Guide

## 1. System Prerequisites
Before running the AeroBook microservices ecosystem locally, ensure the following runtimes and tools are installed:

- **Java Development Kit (JDK)**: OpenJDK 21 LTS (`java -version`)
- **Build Tool**: Apache Maven 3.8+ (`mvn -version`) or Maven Wrapper (`./mvnw`)
- **Node.js & npm**: Node.js v18.19+ or v20/v22 LTS, npm 10+ (`node -v`, `npm -v`)
- **Angular CLI**: Angular CLI 18.x (`ng version`)
- **Database Engine**: MySQL Server 8.0+ running on port `3306`
- **Message Broker**: RabbitMQ Server running on port `5672` (Erlang OTP installed)
- **PowerShell / Bash**: PowerShell 5.1+ (Windows) or GNU Bash (Linux / macOS)

---

## 2. Step-by-Step Setup Sequence

### Step 1: Initialize Database Schemas and Seed Data
Execute the seed script to create all 8 microservice databases and populate them with initial mock aircraft, flight schedules, fares, and user credentials:

**On Windows (PowerShell):**
```powershell
.\scripts\seed.ps1
```

**On Linux / macOS (Bash):**
```bash
./scripts/seed.sh
```

**Manual MySQL Seed:**
```bash
mysql -u root -p < scripts/seed.sql
```

---

### Step 2: Build All Backend Microservices
Run the automated build orchestrator to compile and package all 11 Java services:

```powershell
.\scripts\build-all.ps1
```
Or manually run Maven in any service directory:
```bash
cd auth-service
mvn clean package -DskipTests
```

---

### Step 3: Install Frontend Dependencies
```bash
cd frontend
npm install
```

---

### Step 4: Launch the Microservices Ecosystem
AeroBook includes a smart orchestration script that handles phased startup sequencing (Eureka Server first, then Config Server, then downstream business microservices):

**Start all services in background:**
```powershell
.\scripts\run-services.ps1
```

**Start all services in visible individual terminal windows:**
```powershell
.\scripts\run-services.ps1 -Window
```

**Start all services including the Angular Frontend:**
```powershell
.\scripts\run-services.ps1 -Frontend
```

**Check running status of all services:**
```powershell
.\scripts\run-services.ps1 status
```

**Stop all running services:**
```powershell
.\scripts\run-services.ps1 stop
```

---

## 3. Verify Operational Health
Execute the platform smoke test to verify all service health probes directly and through the API Gateway:

```powershell
.\scripts\smoke-check.ps1
```

### Direct Service Ports & Dashboards

| Service / Dashboard | URL | Default Port |
|---|---|---|
| **Angular Frontend** | `http://localhost:4200` | 4200 |
| **API Gateway** | `http://localhost:8083` | 8083 |
| **Eureka Service Registry**| `http://localhost:8761` | 8761 |
| **Config Server** | `http://localhost:8080` | 8080 |
| **Auth Service** | `http://localhost:8082` | 8082 |
| **User Service** | `http://localhost:8084` | 8084 |
| **Flight Service** | `http://localhost:8087` | 8087 |
| **Booking Service** | `http://localhost:8088` | 8088 |
| **Fare Service** | `http://localhost:8089` | 8089 |
| **Check-In Service** | `http://localhost:8090` | 8090 |
| **Notification Service** | `http://localhost:8091` | 8091 |
| **Payment Service** | `http://localhost:8092` | 8092 |
| **RabbitMQ Management** | `http://localhost:15672` | 15672 |

---

## 4. Default Seeded User Credentials

| Persona | Email | Password | Access Level |
|---|---|---|---|
| **System Administrator** | `admin@aerobook.com` | `Admin@123` | Full access to Admin Dashboard (`/admin`) |
| **Airport Staff** | `staff@aerobook.com` | `Staff@123` | Staff Dashboard (`/staff`) & Gate Scanner |
| **Passenger 1** | `priya@gmail.com` | `Passenger@123` | Customer Dashboard (`/customer`), Bookings |
| **Passenger 2** | `asha.khan@example.com` | `Password123!` | Customer Dashboard (`/customer`) |
| **Passenger 3** | `sohel@aerobook.com` | `Admin@123` | Customer & Admin privileges |

