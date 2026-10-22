# Operational Troubleshooting & Diagnostics Runbook

This guide details common operational failure modes encountered across the AeroBook microservices ecosystem, root cause analyses, and step-by-step remediation procedures.

---

## 1. Port Binding Conflicts & Stale Processes

### Symptom
A microservice fails during startup with `Web server failed to start. Port 808X was already in use.`

### Root Cause
A previously running instance or crashed JVM retained the TCP socket binding.

### Remediation
**Windows (PowerShell):**
```powershell
# Identify process ID holding the port (e.g. 8083)
Get-NetTCPConnection -LocalPort 8083 -ErrorAction SilentlyContinue | Select-Object OwningProcess

# Terminate the process
Stop-Process -Id <PID> -Force
```

**Linux / macOS:**
```bash
lsof -i :8083
kill -9 <PID>
```

---

## 2. Eureka Service Registration Latency & HTTP 503 Errors

### Symptom
Immediately after launching services, frontend requests through `http://localhost:8083/api/...` return `HTTP 503 Service Unavailable` or `Unable to find instance for <SERVICE-NAME>`.

### Root Cause
Netflix Eureka uses a 30-second heartbeat cycle. When a microservice boots up, it takes between 15 to 30 seconds for the Eureka server to register the lease, and another 15 to 30 seconds for the API Gateway's reactive discovery locator cache to synchronize.

### Remediation
1. Wait 30 seconds after launching all microservices.
2. Verify the service appears as `UP` in the Eureka Web Console at `http://localhost:8761`.
3. Check the Gateway health registry at `http://localhost:8083/api/gateway/services`.
4. Run the health probe:
   ```powershell
   .\scripts\smoke-check.ps1
   ```

---

## 3. Database Connectivity & Authentication Failures

### Symptom
Microservice logs display:
`java.sql.SQLNonTransientConnectionException: Could not create connection to database server` or `Access denied for user 'root'@'localhost'`.

### Root Cause
1. Local MySQL Server service is stopped.
2. The password in `application.properties` does not match your local MySQL root password.
3. The required database schema has not been initialized.

### Remediation
1. Check MySQL service status:
   ```powershell
   Get-Service -Name MySQL*
   Start-Service -Name MySQL80  # or your installed service name
   ```
2. Verify database schemas exist by re-running the seed script:
   ```powershell
   .\scripts\seed.ps1
   ```
3. Override credentials via environment variables without editing code:
   ```powershell
   $env:MYSQL_PASSWORD="YourActualPassword"
   ```

---

## 4. RabbitMQ Broker Connection Failures

### Symptom
`booking-service` or `flight-service` fails with:
`org.springframework.amqp.AmqpConnectException: java.net.ConnectException: Connection refused: no further information`.

### Root Cause
RabbitMQ server is not running or the AMQP default port `5672` is blocked.

### Remediation
1. Verify RabbitMQ Windows Service is running:
   ```powershell
   Get-Service -Name RabbitMQ
   Start-Service -Name RabbitMQ
   ```
2. Check RabbitMQ management console at `http://localhost:15672` (default credentials: `guest` / `guest`).

---

## 5. Frontend CORS Errors

### Symptom
Browser console logs `Access to fetch at 'http://localhost:808X/...' has been blocked by CORS policy`.

### Root Cause
The frontend attempted to connect directly to an individual microservice port (e.g. `8087` or `8088`) rather than routing through the centralized API Gateway on port `8083`.

### Remediation
1. Verify all API requests in the Angular client target `http://localhost:8083`.
2. Ensure the API Gateway `globalcors` configuration is loaded.

---

## 6. JWT Authentication & Token Expiration

### Symptom
Protected endpoints return `HTTP 401 Unauthorized` with message `JWT expired` or `SignatureException`.

### Root Cause
Access tokens expire after 24 hours. Alternatively, if `jwt.secret` differs between `auth-service` and `api-gateway`, signature verification fails.

### Remediation
1. Ensure `jwt.secret` matches in both `auth-service/src/main/resources/application.properties` and `api-gateway/src/main/resources/application.properties`.
2. Log out and log back in, or trigger the refresh token endpoint:
   ```http
   POST http://localhost:8083/api/auth/refresh-token
   Content-Type: application/json
   
   { "refreshToken": "..." }
   ```

---

## 7. Role Synchronization & Admin Dashboard Redirection

### Symptom
After logging in with an Admin account (`admin@aerobook.com`), the user is not automatically redirected to `/admin` or receives access denied.

### Root Cause
Role claims in the JWT token or database may contain `ROLE_ADMIN` while frontend guard checks expected `ADMIN` (or vice versa), or local storage was not cleared from a previous unprivileged session.

### Remediation
1. `AuthService` in the frontend normalizes roles by stripping the `ROLE_` prefix or checking both (`ROLE_ADMIN` and `ADMIN`).
2. Clear browser `localStorage` (`localStorage.clear()`) and re-login.
3. Verify that the database `aerobook_auth_db.credentials` table has `role = 'ROLE_ADMIN'`.

---

## 8. Razorpay Signature Verification Discrepancies

### Symptom
Payment verification returns `HTTP 400 Bad Request` with `Invalid Payment Signature`.

### Root Cause
The `razorpay.key.secret` configured in `payment-service` does not match the secret of the Razorpay Key ID used by the frontend checkout script.

### Remediation
1. Verify that `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `payment-service/src/main/resources/application.properties` belong to the same active Razorpay test account pair.

