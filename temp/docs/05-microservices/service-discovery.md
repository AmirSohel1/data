# Microservice: Service Discovery (Eureka Server)

## 1. Executive Summary & Purpose

The **Service Discovery** microservice serves as the central registration directory and heart of the AeroBook distributed platform. Powered by **Netflix Eureka Server**, it dynamically registers, monitors, and tracks the health and network coordinates of all microservice instances across the ecosystem.

- **Logical Service Name**: `service-discovery`
- **Eureka Application ID**: `SERVICE-DISCOVERY`
- **Default Port**: `8761`
- **Dashboard URL**: `http://localhost:8761`
- **Database Schema**: None (In-memory replicated state)

---

## 2. Service Boundaries & Responsibilities

- **Central Registry**: Maintains an active registry of all running microservice instances, IPs, and ports.
- **Heartbeat & Liveness Monitoring**: Listens for periodic heartbeat renewal requests (default: every 30s) from client services; evicts expired instances.
- **Dynamic Routing Enablement**: Enables the API Gateway and OpenFeign clients to route requests using logical identifiers (`lb://AUTH-SERVICE`, `lb://FLIGHT-SERVICE`) rather than hardcoded IP addresses.
- **Self-Preservation Mode**: Prevents mass registry eviction during temporary network partitions.

---

## 3. Technology Stack & Dependencies

- **Language**: Java 17
- **Framework**: Spring Boot 4.1.1
- **Cloud Orchestration**: Spring Cloud 2025.1.3 (`spring-cloud-starter-netflix-eureka-server`)
- **Web Runtime**: Spring Boot Starter WebMVC with embedded Apache Tomcat
- **Operational Metrics**: Spring Boot Starter Actuator
- **Build Tool**: Apache Maven 3.9.16 via Maven Wrapper (`mvnw.cmd`)
- **Quality & Coverage**: `jacoco-maven-plugin:0.8.12`, `sonar-maven-plugin:5.0.0.4389`

---

## 4. Bootstrap & Entry Point

### Entry Point: [`ServiceDiscoveryApplication.java`](file:///d:/aerobook/service-discovery/src/main/java/com/aerobook/discovery/ServiceDiscoveryApplication.java)
```java
package com.aerobook.discovery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class ServiceDiscoveryApplication {
    public static void main(String[] args) {
        SpringApplication.run(ServiceDiscoveryApplication.class, args);
    }
}
```
The `@EnableEurekaServer` annotation initializes the Eureka controller, replication channels, and in-memory peer awareness registry.

---

## 5. Configuration & Environment Variables

### Configuration: [`application.properties`](file:///d:/aerobook/service-discovery/src/main/resources/application.properties)
```properties
spring.application.name=service-discovery
server.port=8761

# Standalone local deployment settings
eureka.instance.hostname=localhost
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
eureka.client.service-url.defaultZone=http://${eureka.instance.hostname}:${server.port}/eureka/

# Eviction and heartbeat timing
eureka.server.enable-self-preservation=false
eureka.server.eviction-interval-timer-in-ms=5000

# Actuator monitoring
management.endpoints.web.exposure.include=health,info
```

| Property | Default | Purpose |
|---|---|---|
| `server.port` | `8761` | Eureka HTTP listener port |
| `eureka.client.register-with-eureka` | `false` | Prevents the server from registering with itself |
| `eureka.client.fetch-registry` | `false` | Disables client registry caching for standalone server |
| `eureka.server.enable-self-preservation` | `false` | Allows immediate eviction during development restarts |

---

## 6. Endpoints & API Reference

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/` | Public | HTML Eureka Web Dashboard displaying active instances |
| `GET` | `/eureka/apps` | Internal | XML/JSON registry catalog of all registered applications |
| `GET` | `/eureka/apps/{appId}` | Internal | Specific microservice instance registry details |
| `POST` | `/eureka/apps/{appId}` | Internal | Client instance registration |
| `PUT` | `/eureka/apps/{appId}/{instanceId}` | Internal | Client 30-second heartbeat renewal |
| `DELETE` | `/eureka/apps/{appId}/{instanceId}` | Internal | Client graceful deregistration on shutdown |
| `GET` | `/actuator/health` | Public | Spring Boot Actuator liveness and health probe |

---

## 7. Testing & Build Instructions

### Running Tests & JaCoCo Coverage:
```powershell
cd d:\aerobook\service-discovery
.\mvnw.cmd test
```
- Tests run: `ServiceDiscoveryApplicationTests`
- Output JaCoCo report: `target/site/jacoco/jacoco.xml`

### Starting the Service:
```powershell
.\mvnw.cmd spring-boot:run
```
Upon startup, navigate to `http://localhost:8761` to view registered microservices.

