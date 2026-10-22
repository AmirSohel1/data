# Master API Reference Catalog

This document provides the definitive, unified REST API reference for the entire AeroBook microservices ecosystem. All requests originate through the **Spring Cloud API Gateway** (`http://localhost:8083`), which routes them dynamically to downstream services.

---

## 1. Global Gateway Overview Endpoints (`api-gateway`)

| Method | Public Gateway Path | Downstream Route | Access | Description |
|---|---|---|---|---|
| `GET` | `/api/gateway/health` | Local Gateway | Public | Gateway operational status & uptime |
| `GET` | `/api/gateway/services` | Local Gateway | Public | Discovered microservices registry map |
| `GET` | `/api/gateway/admin/summary` | Local Gateway | Public | Platform-wide operational stats |
| `GET` | `/api/gateway/endpoints` | Local Gateway | Public | Catalog of all route endpoints |
| `GET` | `/api/gateway/rbac-matrix` | Local Gateway | Public | Platform RBAC permissions matrix |
| `GET` | `/api/gateway/presentation-demo`| Local Gateway | Public | Demo telemetry for investor / tech walkthroughs |

---

## 2. Authentication & Credential Endpoints (`auth-service`)

Downstream Service Port: `8082` | Target Route: `lb://AUTH-SERVICE`

| Method | Endpoint Path | Payload / Query | Response Code | Description | Access |
|---|---|---|---|---|---|
| `GET` | `/api/auth/health` | _None_ | 200 OK | Auth service health status | Public |
| `POST` | `/api/auth/send-verification-code` | `{ email }` | 200 OK | Dispatch 6-digit OTP code to email | Public |
| `POST` | `/api/auth/verify-code` | `{ email, code }` | 200 OK | Validate registration OTP code | Public |
| `POST` | `/api/auth/forgot-password` | `{ email }` | 200 OK | Dispatch password recovery code | Public |
| `POST` | `/api/auth/reset-password` | `{ email, code, newPassword }` | 200 OK | Reset account password | Public |
| `POST` | `/api/auth/register` | `{ email, password, firstName, lastName, ... }` | 201 Created | Passenger registration | Public |
| `POST` | `/api/auth/register-admin` | `{ email, password, firstName, lastName, setupKey }` | 201 Created | Admin registration (Setup key required) | Restricted |
| `POST` | `/api/auth/register-staff` | `{ email, password, firstName, lastName, setupKey }` | 201 Created | Staff registration (Setup key required) | Restricted |
| `POST` | `/api/auth/login` | `{ email, password }` | 200 OK | Authenticate and obtain JWT token | Public |
| `POST` | `/api/auth/refresh-token` | `{ refreshToken }` | 200 OK | Exchange refresh token for fresh JWT | Authenticated |
| `GET` | `/api/auth/credentials` | _None_ | 200 OK | List all credentials (passwords excluded) | Admin |
| `PUT` | `/api/auth/credentials/{userId}/role` | `{ role }` | 200 OK | Update user role assignment | Admin |

---

## 3. User & Staff Incident Endpoints (`user-service`)

Downstream Service Port: `8084` | Target Route: `lb://USER-SERVICE`

| Method | Endpoint Path | Payload / Query | Response Code | Description | Access |
|---|---|---|---|---|---|
| `GET` | `/api/v1/users/health` | _None_ | 200 OK | User service health status | Public |
| `POST` | `/api/v1/users` | `UserRequest` | 201 Created | Create user profile record | Internal / Auth |
| `GET` | `/api/v1/users` | _None_ | 200 OK | Retrieve all user profiles | Admin / Staff |
| `GET` | `/api/v1/users/{id}` | Path: `id` | 200 OK | Get user profile by ID | Authenticated |
| `GET` | `/api/v1/users/email/{email}` | Path: `email` | 200 OK | Get user profile by email | Authenticated |
| `PUT` | `/api/v1/users/{id}` | `UserRequest` | 200 OK | Update user profile | Owner / Admin |
| `DELETE`| `/api/v1/users/{id}` | Path: `id` | 204 No Content | Delete user account | Admin |
| `GET` | `/api/v1/users/incidents` | _None_ | 200 OK | List all passenger incident reports | Admin / Staff |
| `GET` | `/api/v1/users/incidents/{id}` | Path: `id` | 200 OK | Get single incident ticket | Admin / Staff |
| `POST` | `/api/v1/users/incidents` | `IncidentReportRequest` | 201 Created | File operational passenger incident | Staff / Admin |
| `PUT` | `/api/v1/users/incidents/{id}/status` | Query: `status` | 200 OK | Update incident workflow state | Staff / Admin |
| `DELETE`| `/api/v1/users/incidents/{id}` | Path: `id` | 204 No Content | Delete incident report | Admin |
| `GET` | `/api/v1/users/incidents/count/open` | _None_ | 200 OK | Count unresolved incidents | Staff / Admin |

---

## 4. Flights & Fleet Endpoints (`flight-service`)

Downstream Service Port: `8087` | Target Route: `lb://FLIGHT-SERVICE`

| Method | Endpoint Path | Payload / Query | Response Code | Description | Access |
|---|---|---|---|---|---|
| `GET` | `/api/flights/health` | _None_ | 200 OK | Flight service health status | Public |
| `GET` | `/api/flights/search` | `source`, `destination`, `date` | 200 OK | Search flights by origin/dest/date | Public |
| `GET` | `/api/flights` | _None_ | 200 OK | List all scheduled flights | Public |
| `GET` | `/api/flights/{id}` | Path: `id` | 200 OK | Get flight details & seat availability | Public |
| `POST` | `/api/admin/flights` | `CreateFlightRequest` | 201 Created | Schedule a new flight | Admin |
| `PUT` | `/api/admin/flights/{id}` | `UpdateFlightRequest` | 200 OK | Modify flight schedule/status | Admin |
| `DELETE`| `/api/admin/flights/{id}` | Path: `id` | 204 No Content | Cancel / delete scheduled flight | Admin |
| `GET` | `/api/admin/flights` | _None_ | 200 OK | Administrative flight roster | Admin / Staff |
| `POST` | `/api/admin/aircrafts` | `CreateAircraftRequest` | 201 Created | Add new aircraft to fleet | Admin |
| `GET` | `/api/admin/aircrafts` | _None_ | 200 OK | List all fleet aircraft | Admin / Staff |
| `GET` | `/api/admin/aircrafts/{id}`| Path: `id` | 200 OK | Get single aircraft specs | Admin / Staff |
| `DELETE`| `/api/admin/aircrafts/{id}`| Path: `id` | 204 No Content | Decommission aircraft | Admin |

---

## 5. Pricing & Coupon Endpoints (`fare-service`)

Downstream Service Port: `8089` | Target Route: `lb://FARE-SERVICE`

| Method | Endpoint Path | Payload / Query | Response Code | Description | Access |
|---|---|---|---|---|---|
| `GET` | `/api/fares/health` | _None_ | 200 OK | Fare service health status | Public |
| `POST` | `/api/fares` | `FareRequest` | 201 Created | Define cabin fares for a flight | Admin |
| `GET` | `/api/fares/{id}` | Path: `id` | 200 OK | Get fare record by ID | Public |
| `GET` | `/api/fares/flight/{flightId}` | Path: `flightId` | 200 OK | Get cabin pricing for flight | Public |
| `GET` | `/api/fares` | _None_ | 200 OK | List all flight fare rules | Public / Admin |
| `PUT` | `/api/fares/{id}` | `FareRequest` | 200 OK | Update pricing tiers & tax | Admin |
| `DELETE`| `/api/fares/{id}` | Path: `id` | 204 No Content | Delete fare record | Admin |
| `GET` | `/api/fares/coupons` | _None_ | 200 OK | List all promotional coupons | Public / Admin |
| `GET` | `/api/fares/coupons/{id}` | Path: `id` | 200 OK | Get coupon terms by ID | Public / Admin |
| `POST` | `/api/fares/coupons` | `CouponRequest` | 201 Created | Create new promo coupon | Admin |
| `PUT` | `/api/fares/coupons/{id}` | `CouponRequest` | 200 OK | Update coupon parameters | Admin |
| `PUT` | `/api/fares/coupons/{id}/toggle` | Path: `id` | 200 OK | Toggle coupon ACTIVE/INACTIVE | Admin |
| `DELETE`| `/api/fares/coupons/{id}` | Path: `id` | 204 No Content | Delete coupon code | Admin |
| `POST` | `/api/fares/coupons/validate` | `CouponValidateRequest` | 200 OK | Validate coupon eligibility | Authenticated |

---

## 6. Bookings & Passenger Endpoints (`booking-service`)

Downstream Service Port: `8088` | Target Route: `lb://BOOKING-SERVICE`

| Method | Endpoint Path | Payload / Query | Response Code | Description | Access |
|---|---|---|---|---|---|
| `GET` | `/api/bookings/health` | _None_ | 200 OK | Booking service health status | Public |
| `POST` | `/api/bookings` | `BookingRequest` | 201 Created | Create booking & assign PNR | Authenticated |
| `GET` | `/api/bookings` | _None_ | 200 OK | List all platform bookings | Admin / Staff |
| `GET` | `/api/bookings/{bookingId}` | Path: `bookingId` | 200 OK | Get booking details by ID | Owner / Admin / Staff |
| `GET` | `/api/bookings/pnr/{pnr}` | Path: `pnr` | 200 OK | Lookup booking by 6-char PNR | Authenticated / Staff |
| `GET` | `/api/bookings/user/{userId}`| Path: `userId` | 200 OK | List bookings placed by user | Owner / Admin |
| `GET` | `/api/bookings/flight/{flightId}` | Path: `flightId` | 200 OK | List bookings on a flight | Admin / Staff |
| `DELETE`| `/api/bookings/{bookingId}`| Path: `bookingId` | 204 No Content | Cancel flight reservation | Owner / Admin |

---

## 7. Check-In & Boarding Gate Endpoints (`check-in-service`)

Downstream Service Port: `8090` | Target Route: `lb://CHECK-IN-SERVICE`

| Method | Endpoint Path | Payload / Query | Response Code | Description | Access |
|---|---|---|---|---|---|
| `GET` | `/api/check-ins/health` | _None_ | 200 OK | Check-in service health probe | Public |
| `POST` | `/api/check-ins` | `CheckInRequest` | 200 OK | Check in & issue boarding pass | Authenticated |
| `GET` | `/api/check-ins/booking/{bookingId}` | Path: `bookingId` | 200 OK | Get check-in by booking ID | Authenticated |
| `GET` | `/api/check-ins/{id}` | Path: `id` | 200 OK | Get check-in by record ID | Authenticated |
| `GET` | `/api/check-ins` | Header: `X-User-Role` | 200 OK | Manifest audit list | Admin / Staff |
| `POST` | `/api/check-ins/verify` | Param: `boardingPassNumber` | 200 OK | Airport gate boarding verification | Staff / Admin |

---

## 8. Notifications & PDF Endpoints (`notification-service`)

Downstream Service Port: `8091` | Target Route: `lb://NOTIFICATION-SERVICE`

| Method | Endpoint Path | Payload / Query | Response Code | Description | Access |
|---|---|---|---|---|---|
| `GET` | `/api/notifications/health` | _None_ | 200 OK | Notification service health probe | Public |
| `POST` | `/api/notifications/send` | `NotificationRequest` | 201 Created | Dispatch in-app alert | Internal |
| `POST` | `/api/notifications/email/booking` | `BookingNotificationRequest` | 200 OK | Send booking confirmation email + PDF | Internal |
| `POST` | `/api/notifications/email/checkin` | `CheckInNotificationRequest` | 200 OK | Send check-in email + boarding pass | Internal |
| `POST` | `/api/notifications/email/flight-alert` | `FlightAlertNotificationRequest` | 200 OK | Dispatch flight delay/gate alert | Internal |
| `POST` | `/api/notifications/email/refund` | `RefundNotificationRequest` | 200 OK | Send refund confirmation email | Internal |
| `POST` | `/api/notifications/email/verify` | `EmailVerificationRequest` | 200 OK | Send registration OTP code | Internal |
| `POST` | `/api/notifications/email/reset-password` | `EmailVerificationRequest` | 200 OK | Send password reset code | Internal |
| `POST` | `/api/notifications/broadcast` | `BroadcastRequest` | 200 OK | Global notification broadcast | Admin |
| `GET` | `/api/notifications/user/{userId}` | Path: `userId` | 200 OK | In-app notification inbox | Authenticated |
| `PUT` | `/api/notifications/{id}/read` | Path: `id` | 200 OK | Mark notification as read | Authenticated |
| `PUT` | `/api/notifications/user/{userId}/read-all` | Path: `userId` | 200 OK | Mark all notifications read | Authenticated |
| `GET` | `/api/notifications/unread-count/{userId}` | Path: `userId` | 200 OK | Unread notification count badge | Authenticated |
| `GET` | `/api/notifications` | _None_ | 200 OK | List all notifications | Admin |
| `GET` | `/api/notifications/pdf/ticket` | Query parameters | 200 OK | Download e-ticket PDF | Authenticated |
| `GET` | `/api/notifications/pdf/boarding-pass` | Query parameters | 200 OK | Download boarding pass PDF | Authenticated |

---

## 9. Payments & Refunds Endpoints (`payment-service`)

Downstream Service Port: `8092` | Target Route: `lb://PAYMENT-SERVICE`

| Method | Endpoint Path | Payload / Query | Response Code | Description | Access |
|---|---|---|---|---|---|
| `GET` | `/api/payments/health` | _None_ | 200 OK | Payment service health probe | Public |
| `POST` | `/api/payments/orders` | `PaymentOrderRequest` | 201 Created | Create Razorpay order | Authenticated |
| `POST` | `/api/payments/verify` | `PaymentVerifyRequest` | 200 OK | Verify signature & capture payment | Authenticated |
| `POST` | `/api/payments/webhook` | Webhook body | 200 OK | Asynchronous Razorpay webhook | Gateway |
| `POST` | `/api/payments/{id}/refund` | `PaymentRefundRequest` | 200 OK | Initiate Razorpay refund | Staff / Admin |
| `GET` | `/api/payments` | _None_ | 200 OK | List all transaction records | Admin / Staff |
| `GET` | `/api/payments/{id}` | Path: `id` | 200 OK | Get payment record by ID | Authenticated |
| `GET` | `/api/payments/booking/{bookingId}` | Path: `bookingId` | 200 OK | Get payment for booking | Authenticated |

