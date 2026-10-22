# Microservice: Config Server (Spring Cloud Config)

## 1. Executive Summary & Purpose

The **Config Server** provides optional centralized external configuration management for microservices across development, testing, and production environments. Powered by **Spring Cloud Config Server**, it allows configuration properties to be version-controlled and updated without rebuilding or redeploying microservice binaries.

- **Logical Service Name**: `config-server`
- **Default Port**: `8080`
- **Health Probe**: `http://localhost:8080/actuator/health`
- **Database Schema**: None (File system or Git repository storage)

---

## 2. Service Boundaries & Responsibilities

- **Centralized Environment Profiles**: Serves environment-specific property files (`application-dev.properties`, `application-prod.properties`) to downstream services.
- **Dynamic Configuration Refresh**: Integrates with Spring Cloud Bus or actuator refresh endpoints to hot-reload properties.
- **Secret Encryption & Decryption**: Supports symmetric and asymmetric decryption of sensitive property values.

---

## 3. Technology Stack & Dependencies

- **Language**: Java 17
- **Framework**: Spring Boot 4.1.1
- **Cloud Orchestration**: Spring Cloud 2025.1.3 (`spring-cloud-config-server`)
- **Web Runtime**: Spring Boot Starter WebMVC
- **Operational Metrics**: Spring Boot Starter Actuator
- **Build Tool**: Apache Maven 3.9.16 via Maven Wrapper (`mvnw.cmd`)
- **Coverage & Static Analysis**: `jacoco-maven-plugin:0.8.12`, `sonar-maven-plugin:5.0.0.4389`

---

## 4. Bootstrap & Entry Point

### Entry Point: [`ConfigServerApplication.java`](file:///d:/aerobook/config-server/src/main/java/com/aerobook/configserver/ConfigServerApplication.java)
```java
package com.aerobook.configserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}
```
The `@EnableConfigServer` annotation activates the property resolution endpoints and configuration loaders.

---

## 5. Configuration & Environment Variables

### Configuration: [`application.properties`](file:///d:/aerobook/config-server/src/main/resources/application.properties)
```properties
spring.application.name=config-server
server.port=8080

# Profile storage location (native filesystem or git)
spring.profiles.active=native
spring.cloud.config.server.native.search-locations=classpath:/config

# Actuator monitoring
management.endpoints.web.exposure.include=health,info,env
```

| Property | Default | Purpose |
|---|---|---|
| `server.port` | `8080` | Port on which the config server listens |
| `spring.profiles.active` | `native` | Storage backend mode (native filesystem or git) |
| `management.endpoints.web.exposure.include` | `health,info,env` | Exposed actuator endpoints |

---

## 6. Endpoints & API Reference

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/{application}/{profile}` | Client Services | Fetches active properties for a specific service and environment profile |
| `GET` | `/{application}/{profile}/{label}` | Client Services | Fetches properties tied to a specific branch or version label |
| `GET` | `/{application}-{profile}.properties` | Client Services | Formatted Java properties output for legacy consumers |
| `GET` | `/{application}-{profile}.json` | Client Services | JSON formatted property representation |
| `GET` | `/actuator/health` | Public | Liveness probe indicating server status |

---

## 7. Testing & Build Instructions

### Running Tests & JaCoCo Coverage:
```powershell
cd d:\aerobook\config-server
.\mvnw.cmd test
```
- Test Suite: `ConfigServerApplicationTests`
- Output JaCoCo report: `target/site/jacoco/jacoco.xml`

### Starting the Service:
```powershell
.\mvnw.cmd spring-boot:run
```
Downstream microservices can import configurations via `spring.config.import=optional:configserver:http://localhost:8080`.

