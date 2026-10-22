# AeroBook Platform - Class Diagram

## 1. Overview & Presentation Notes
The **Class Diagram** models the domain object structures, attributes, operational methods, and structural relationships across the AeroBook microservices ecosystem. It illustrates how business entities encapsulate data and behaviors across decoupled domain boundaries while maintaining semantic links (such as PNRs, booking IDs, and flight numbers).

### Presentation Talking Points
- **Domain-Driven Design (DDD)**: Each bounded context encapsulates its own entity models (e.g. `Flight`, `Fare`, `Booking`, `PaymentRecord`).
- **Data Integrity & Immutability**: Critical identifiers such as `pnr` (Passenger Name Record), `boardingPassNumber`, and `orderId` provide immutable audit keys.
- **Enumerations for Lifecycle Control**: State machines are governed strictly via typed enumerations (`FlightStatus`, `BookingStatus`, `PaymentStatus`, `IncidentStatus`).

---

## 2. Comprehensive Class Diagram

```mermaid
classDiagram
    direction TB

    %% AUTH DOMAIN
    class Credential {
        -Long credentialId
        -Long userId
        -String email
        -String password
        -Role role
        -LocalDateTime createdAt
        -LocalDateTime updatedAt
        +getCredentialId() Long
        +getEmail() String
        +getPassword() String
        +getRole() Role
    }

    class RefreshToken {
        -Long id
        -String token
        -LocalDateTime expiryDate
        -Credential credential
        +isExpired() boolean
    }

    class EmailVerification {
        -Long id
        -String email
        -String verificationCode
        -LocalDateTime expiresAt
        +isValid(String code) boolean
    }

    %% USER DOMAIN
    class UserEntity {
        -Long userId
        -String firstName
        -String lastName
        -String email
        -String phoneNumber
        -LocalDate dateOfBirth
        -String nationality
        -Role role
        -LocalDateTime createdAt
        +getFullName() String
        +getRole() Role
    }

    class IncidentReport {
        -Long id
        -Long userId
        -String userName
        -String userEmail
        -String reportedBy
        -String reason
        -IncidentSeverity severity
        -IncidentStatus status
        -String notes
        -LocalDateTime createdAt
        +updateStatus(IncidentStatus newStatus) void
    }

    %% FLIGHT DOMAIN
    class Aircraft {
        -Long id
        -String aircraftCode
        -String aircraftName
        -String manufacturer
        -Integer capacity
        -AircraftStatus status
        +isAvailable() boolean
    }

    class Flight {
        -Long id
        -String flightNumber
        -String airlineName
        -String source
        -String destination
        -LocalDateTime departureTime
        -LocalDateTime arrivalTime
        -Integer totalSeats
        -Integer availableSeats
        -BigDecimal baseFare
        -FlightStatus status
        -Aircraft aircraft
        +reserveSeats(int count) boolean
        +releaseSeats(int count) void
    }

    %% FARE DOMAIN
    class Fare {
        -Long id
        -Long flightId
        -BigDecimal economyFare
        -BigDecimal businessFare
        -BigDecimal firstClassFare
        -BigDecimal taxPercentage
        -BigDecimal discountPercentage
        -LocalDate effectiveDate
        -Boolean active
        +calculateTotal(CabinClass cabin) BigDecimal
    }

    class Coupon {
        -Long id
        -String code
        -String description
        -BigDecimal discountPercentage
        -BigDecimal maxDiscount
        -BigDecimal minFare
        -Integer usageLimit
        -Integer usageCount
        -LocalDate validFrom
        -LocalDate validUntil
        -String status
        +isValidForFare(BigDecimal fare) boolean
        +calculateDiscount(BigDecimal fare) BigDecimal
    }

    %% BOOKING DOMAIN
    class Booking {
        -Long bookingId
        -String pnr
        -Long userId
        -Long flightId
        -BigDecimal totalFare
        -BookingStatus status
        -LocalDateTime bookingDate
        -List~Passenger~ passengers
        +addPassenger(Passenger p) void
        +cancel() void
    }

    class Passenger {
        -Long passengerId
        -String firstName
        -String lastName
        -String gender
        -Integer age
        -String seatNumber
        -Booking booking
        +getSeatNumber() String
        +setSeatNumber(String seat) void
    }

    %% CHECK-IN DOMAIN
    class CheckIn {
        -Long id
        -Long bookingId
        -String passengerName
        -String seatNumber
        -String boardingPassNumber
        -String status
        -LocalDateTime checkedInAt
        +markBoarded() void
    }

    %% PAYMENT DOMAIN
    class PaymentRecord {
        -Long id
        -Long bookingId
        -String pnr
        -String orderId
        -String paymentId
        -Double amount
        -Long amountInPaise
        -String currency
        -PaymentStatus status
        -String signature
        -String refundId
        -Double refundAmount
        +isCaptured() boolean
        +processRefund(String refundId, Double amount) void
    }

    %% NOTIFICATION DOMAIN
    class Notification {
        -Long id
        -Long userId
        -String recipientEmail
        -String title
        -String message
        -NotificationType type
        -NotificationStatus status
        -String flightNumber
        -LocalDateTime createdAt
        -LocalDateTime readAt
        +markAsRead() void
    }

    %% ENUMS
    class Role {
        <<enumeration>>
        ROLE_USER
        ROLE_STAFF
        ROLE_ADMIN
    }

    class FlightStatus {
        <<enumeration>>
        SCHEDULED
        ON_TIME
        DELAYED
        BOARDING
        DEPARTED
        ARRIVED
        CANCELLED
    }

    class AircraftStatus {
        <<enumeration>>
        ACTIVE
        MAINTENANCE
        RETIRED
    }

    class BookingStatus {
        <<enumeration>>
        CONFIRMED
        CANCELLED
        PENDING
    }

    class PaymentStatus {
        <<enumeration>>
        CREATED
        AUTHORIZED
        CAPTURED
        REFUNDED
        FAILED
    }

    class IncidentSeverity {
        <<enumeration>>
        LOW
        MEDIUM
        HIGH
        CRITICAL
    }

    class IncidentStatus {
        <<enumeration>>
        OPEN
        INVESTIGATING
        RESOLVED
        CLOSED
    }

    class NotificationType {
        <<enumeration>>
        BOOKING_CONFIRMATION
        CHECK_IN_CONFIRMATION
        FLIGHT_UPDATE
        REFUND_CONFIRMATION
        EMAIL_VERIFICATION
        PASSWORD_RESET
        SYSTEM_BROADCAST
    }

    class NotificationStatus {
        <<enumeration>>
        PENDING
        SENT
        FAILED
        READ
    }

    %% RELATIONSHIPS
    Credential "1" *-- "0..*" RefreshToken : owns
    Credential --> Role
    UserEntity --> Role
    IncidentReport --> IncidentSeverity
    IncidentReport --> IncidentStatus
    Flight "1" o-- "1" Aircraft : operates
    Flight --> FlightStatus
    Aircraft --> AircraftStatus
    Booking "1" *-- "1..*" Passenger : includes
    Booking --> BookingStatus
    PaymentRecord --> PaymentStatus
    Notification --> NotificationType
    Notification --> NotificationStatus

    %% Cross-Domain Logical Associations
    UserEntity ..> Booking : books
    Booking ..> Flight : references
    Booking ..> Fare : priced by
    Booking ..> CheckIn : checked in via
    Booking ..> PaymentRecord : paid with
    Notification ..> UserEntity : notifies
```

---

## 3. Structural Summary & Domain Boundaries

| Service Domain | Primary Entities | Key Methods & Responsibilities |
|---|---|---|
| **Identity & Auth** | `Credential`, `RefreshToken`, `EmailVerification` | Secure authentication, BCrypt hashing, JWT issuance, token rotation |
| **User & Staff** | `UserEntity`, `IncidentReport` | Customer demographics, staff incident reporting and escalation |
| **Fleet & Flights** | `Flight`, `Aircraft` | Route scheduling, seat inventory allocation, status monitoring |
| **Fares & Pricing** | `Fare`, `Coupon` | Dynamic cabin tier pricing, tax calculation, coupon validation |
| **Reservations** | `Booking`, `Passenger` | PNR generation, passenger manifest management, cancellation |
| **Check-In & Gate** | `CheckIn` | Digital seat allocation, boarding pass issuance (`BP-*`), gate verification |
| **Payments** | `PaymentRecord` | Razorpay order creation, cryptographic HMAC verification, refunds |
| **Notifications** | `Notification` | Transactional email dispatch, vector PDF e-tickets/boarding passes |

