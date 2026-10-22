# AeroBook: Complete 8–10 Minute Project Demonstration Video Script
**Format**: Dual-Track (Visual Screen Actions + Word-for-Word English Voiceover Narration)  
**Target Duration**: 8 to 10 Minutes  
**Structure**:
- **Part 1 (0:00 – 4:00)**: Project Overview, Architecture, Key Features & Engineering Highlights
- **Part 2 (4:00 – 10:00)**: Live End-to-End System Walkthrough (Passenger, Staff, Admin & Infrastructure)

---

## Pre-Recording Setup Checklist (Prepare Before Recording)

| # | Item | Preparation Action / URL |
|---|---|---|
| 1 | **Browser Window 1 (Main App)** | `http://localhost:4200` (Angular Frontend landing page) |
| 2 | **Browser Tab 2 (Service Discovery)** | `http://localhost:8761` (Netflix Eureka Dashboard showing all 10 registered microservices) |
| 3 | **Browser Tab 3 (RabbitMQ Console)** | `http://localhost:15672` (RabbitMQ Management - Queues & Exchanges) |
| 4 | **Test Account 1 (Passenger)** | `priya@gmail.com` / `Passenger@123` |
| 5 | **Test Account 2 (Staff)** | `staff@aerobook.com` / `Staff@123` |
| 6 | **Test Account 3 (Admin)** | `admin@aerobook.com` / `Admin@123` |
| 7 | **Coupon Code for Demo** | `WELCOME10` or `AERO2026` |
| 8 | **Screen Resolution** | 1920x1080 (1080p), 100% or 110% browser zoom for crisp presentation |

---

# PART 1: PROJECT OVERVIEW & ARCHITECTURE (0:00 – 4:00)

---

### [00:00 – 00:45] Introduction & High-Level Problem Statement

**[VISUAL / ON-SCREEN ACTION]**:
- Show the **AeroBook Landing Page** (`http://localhost:4200`) with its modern dark/aviation theme, smooth hero banner, and flight search widget.
- Hover smoothly over the flight search inputs and navigation bar.

**[SPOKEN SCRIPT / VOICEOVER]**:
> "Hello everyone, and welcome. Today, I am excited to demonstrate **AeroBook** — an enterprise-grade, cloud-native airline reservation, passenger services, airport ground operations, and fleet management platform.
>
> In the commercial aviation industry, legacy monolithic booking engines struggle with single points of failure, slow holiday booking spikes, and fragmented airport operations. If a notification service fails or a reporting query runs slow, it should never block a passenger from booking a seat or boarding an aircraft.
>
> AeroBook was engineered from the ground up to solve these mission-critical challenges using a distributed, event-driven microservices architecture that guarantees fault isolation, high availability, sub-millisecond perimeter security, and real-time operational consistency."

---

### [00:45 – 01:45] Distributed Architecture & Microservices Suite

**[VISUAL / ON-SCREEN ACTION]**:
- Switch tab to the **Netflix Eureka Dashboard** (`http://localhost:8761`).
- Highlight the **Instances Currently Registered with Eureka** section showing:
  - `CONFIG-SERVER` (Port 8080)
  - `AUTH-SERVICE` (Port 8082)
  - `API-GATEWAY` (Port 8083)
  - `USER-SERVICE` (Port 8084)
  - `PAYMENT-SERVICE` (Port 8085)
  - `CHECK-IN-SERVICE` (Port 8086)
  - `FLIGHT-SERVICE` (Port 8087)
  - `BOOKING-SERVICE` (Port 8088)
  - `FARE-SERVICE` (Port 8089)
  - `NOTIFICATION-SERVICE` (Port 8090)

**[SPOKEN SCRIPT / VOICEOVER]**:
> "Under the hood, AeroBook is powered by **11 backend Java Spring Boot microservices** and an **Angular 18 Single Page Application**.
>
> As you can see right here on our Eureka Service Discovery dashboard:
> - At the perimeter, we have our **Spring Cloud API Gateway** running on Netty at port 8083, which acts as the single reverse proxy for all client traffic.
> - We have centralized configuration management using **Spring Cloud Config Server**.
> - The business layer is split into specialized domain services: `auth-service` for cryptographic JWT security, `user-service` for traveler profiles, `flight-service` for schedules and fleet management, `fare-service` for tiered pricing and coupons, `booking-service` for reservations, `payment-service` for transactions, `check-in-service` for airport boarding passes, and `notification-service` for email and alerts.
> - Crucially, we enforce the **Database-per-Service pattern**. AeroBook uses **8 isolated MySQL database schemas**, ensuring zero direct database coupling between domains."

---

### [01:45 – 02:45] Key Engineering Innovations & Solutions

**[VISUAL / ON-SCREEN ACTION]**:
- Show a brief architectural diagram or switch to the **RabbitMQ Management Dashboard** (`http://localhost:15672`), showing the queues (`flight.seat.deduct`, `booking.notification`, `audit.events`).

**[SPOKEN SCRIPT / VOICEOVER]**:
> "Building a distributed platform like AeroBook involves complex distributed systems challenges. Here are three key innovations we engineered into the platform:
>
> 1. **High-Concurrency Seat Locking & Anti-Overselling**: To prevent race conditions when hundreds of users attempt to book the last seat simultaneously, our Flight Service utilizes **pessimistic row-level locking** using `SELECT FOR UPDATE` within atomic transaction boundaries. This completely prevents seat overselling.
> 2. **Hybrid Eventual Consistency with RabbitMQ**: Instead of slow, fragile distributed two-phase commits, we use **RabbitMQ AMQP messaging**. When a payment succeeds, the booking service asynchronously publishes seat deduction and e-ticket generation events, keeping microservice response times under 50 milliseconds.
> 3. **Perimeter Authentication with Zero Internal Overhead**: The Netty API Gateway decrypts and validates JWT tokens at the boundary, and mutates downstream request headers with trusted identity claims (`X-User-Id` and `X-User-Role`). Downstream microservices evaluate roles instantly without repeating cryptographic token decodes."

---

### [02:45 – 03:30] End-to-End Persona Model & Tech Stack

**[VISUAL / ON-SCREEN ACTION]**:
- Switch back to the **Angular Frontend** (`http://localhost:4200`).
- Scroll past the features section, showing the modern UI with Tailwind CSS and Lucide icons.

**[SPOKEN SCRIPT / VOICEOVER]**:
> "AeroBook delivers a complete multi-persona experience tailored to three distinct roles:
> - **The Passenger**: Real-time flight search, tiered cabin selection, dynamic coupon application, Razorpay payment processing, interactive seat selection, digital PDF e-tickets, and web check-in.
> - **The Airport Ground Staff**: Dedicated airport desk for passenger manifest management, PNR lookups, real-time boarding pass barcode scanning, flight dispatching, and incident logging.
> - **The Airline Administrator**: Fleet aircraft inventory, route and flight schedule creation, fare matrix controls, and user directory management.
>
> On the frontend, AeroBook is built with **Angular 18**, utilizing standalone signals, Tailwind CSS, and automated SonarQube static code quality validation with JaCoCo and LCOV coverage across the entire codebase."

---

### [03:30 – 04:00] Transition to Live Demonstration

**[VISUAL / ON-SCREEN ACTION]**:
- Hover over the **Login** button in the top navigation bar.

**[SPOKEN SCRIPT / VOICEOVER]**:
> "Now that we have covered the business domain and the distributed architecture, let's jump straight into the **live demonstration**.
>
> We will walk through the entire lifecycle: from a passenger booking a flight, applying a discount, and checking in, to ground staff boarding the passenger at the departure gate, and finally the administrative control center."

---

# PART 2: LIVE END-TO-END DEMO (4:00 – 10:00)

---

### [04:00 – 05:30] Step 1: Flight Search, Dynamic Fare & Passenger Booking

**[VISUAL / ON-SCREEN ACTION]**:
1. Click **Login** and log in with the passenger account:
   - Email: `priya@gmail.com`
   - Password: `Passenger@123`
2. Automatically redirected to the **Customer Dashboard** (`/customer`).
3. Click on **Book Flight** or use the flight search bar:
   - Origin: Select **DEL (Delhi)**
   - Destination: Select **BOM (Mumbai)**
   - Departure Date: Select tomorrow's date
   - Class: **Economy**
4. Click **Search Flights**.
5. When flight results appear, point out the flight number (e.g., `AB-101`), departure/arrival times, and the live remaining seats counter.
6. Click **Select Flight**.
7. Enter passenger details (Name, Age, Gender).
8. In the **Promotional Coupon** box, type `WELCOME10` or `AERO2026` and click **Apply**.
   - Show the live discount deduction in the fare summary card (Base Fare + Taxes - Coupon Discount = Total Amount).

**[SPOKEN SCRIPT / VOICEOVER]**:
> "We begin by logging in as our passenger, Priya. Notice how the API Gateway instantly authenticates our JWT and routes us directly to our dedicated Customer Dashboard.
>
> Let's search for a flight from Delhi to Mumbai. The frontend queries our API Gateway, which load-balances the request through Eureka to the Flight Service.
>
> Here are our live scheduled flights. Notice the real-time available seat counter. Let's select flight `AB-101`.
>
> On the booking configuration screen, our Fare Service dynamically calculates the base fare, Passenger Service Fee (PSF), User Development Fee (UDF), and GST taxes.
>
> Let's enter our passenger details, and now let's apply our promo code: `WELCOME10`. Instantly, the Fare Service verifies the coupon validity, applies the discount, and recalculates our final payable total."

---

### [05:30 – 06:45] Step 2: Razorpay Payment, E-Ticket Generation & Asynchronous Event Processing

**[VISUAL / ON-SCREEN ACTION]**:
1. Click **Proceed to Payment**.
2. The **Razorpay Checkout Modal** pops up.
3. Complete the mock payment (or select Net Banking/Card test simulation) and click **Pay Now**.
4. Show the payment verification spinner and instantaneous redirect to the **Booking Confirmation Screen**.
5. Highlight the newly generated **8-character PNR** (e.g., `ABK79421`).
6. Click **View E-Ticket**.
   - Display the high-fidelity dual-view e-ticket modal.
   - Click **Download PDF** to show the OpenPDF-generated official flight ticket with flight details, tax breakdown, and passenger information.

**[SPOKEN SCRIPT / VOICEOVER]**:
> "Now let's proceed to payment. AeroBook integrates seamlessly with Razorpay.
>
> When I click 'Pay', our backend payment service executes cryptographic HMAC-SHA256 signature verification to guarantee transaction authenticity and prevent tampering.
>
> And just like that, the payment is confirmed! 
>
> Behind the scenes, the Booking Service created a unique 8-character PNR, published an asynchronous event to RabbitMQ, and the Flight Service decremented the seat count in MySQL under row-level lock.
>
> Simultaneously, the Notification Service dispatched an email confirmation with an attached PDF e-ticket.
>
> When I click 'View E-Ticket', we get this beautiful, print-ready document generated using OpenPDF, complete with the flight itinerary, fare breakdown, and official airline header."

---

### [06:45 – 07:45] Step 3: Web Check-In, Interactive Fuselage Seat Map & Boarding Pass

**[VISUAL / ON-SCREEN ACTION]**:
1. Navigate to **Web Check-In** from the top menu or dashboard button.
2. Enter the PNR or select the newly booked flight.
3. The **Interactive Cabin Fuselage Seat Map** loads:
   - Point out occupied seats (red/gray) vs. available seats (green/blue).
   - Click on an available window seat (e.g., `12A` or `14F`).
4. Click **Confirm Seat & Check-In**.
5. The digital **Boarding Pass** generates on screen:
   - Highlight the authentic IATA-style Bar Coded Boarding Pass format (`BP-X-YYZ`).
   - Highlight the Gate number, Boarding Group, and Seat Assignment.
   - Click **Download Boarding Pass**.

**[SPOKEN SCRIPT / VOICEOVER]**:
> "Now let's complete Web Check-In. 
>
> Passengers can check in directly from their phone or browser. When I enter our PNR, AeroBook loads an interactive seat map representing the actual aircraft fuselage.
>
> You can see occupied seats disabled in real time. Let's select seat `12A` by the window. 
>
> When I click 'Confirm Check-In', our `check-in-service` locks in the seat assignment, updates our status from `BOOKED` to `CHECKED_IN`, and generates our digital IATA-compliant Boarding Pass.
>
> Notice the generated high-resolution barcode, terminal gate, boarding group, and sequence number. The passenger is now 100% ready for travel."

---

### [07:45 – 08:45] Step 4: Airport Ground Operations (Staff Portal & Gate Scanner)

**[VISUAL / ON-SCREEN ACTION]**:
1. Log out from the passenger account.
2. Log in with the Staff account:
   - Email: `staff@aerobook.com`
   - Password: `Staff@123`
3. The system automatically redirects to the **Staff Dashboard** (`/staff`).
4. Show the **Airport Operations Center**:
   - Active Flight Manifests
   - Gate Status Dispatcher
5. In the **Passenger Manifest Search**, enter the passenger PNR or search for flight `AB-101`.
   - Point out Priya's record showing status `CHECKED_IN`, Seat `12A`.
6. Click **Simulate Gate Scan / Board Passenger**.
   - Show status updating instantly from `CHECKED_IN` to `BOARDED` with a green status pill.
7. Click on **Flight Status Dispatcher**:
   - Change flight status from `SCHEDULED` to `BOARDING`.

**[SPOKEN SCRIPT / VOICEOVER]**:
> "Now let's switch personas to the airport terminal. I'll log in as airport ground staff using `staff@aerobook.com`.
>
> Notice that our role-based security immediately recognizes `ROLE_STAFF` and directs us to the airport ground operations dashboard.
>
> Here, airport agents have real-time visibility across all flights, passenger manifests, and baggage counters.
>
> Let's look up our flight `AB-101`. Here is our passenger, Priya, checked into seat `12A`. 
>
> At the departure gate, the agent scans the boarding pass barcode. With one click, the check-in service validates the ticket and marks the passenger as `BOARDED`.
>
> The staff member can also update the operational flight status — let's switch flight `AB-101` from `SCHEDULED` to `BOARDING`. This status immediately propagates across the entire platform in real time."

---

### [08:45 – 09:30] Step 5: Airline Administration & Fleet Control

**[VISUAL / ON-SCREEN ACTION]**:
1. Log out and log in with the Administrator account:
   - Email: `admin@aerobook.com`
   - Password: `Admin@123`
2. Redirected to the **Admin Dashboard** (`/admin`).
3. Quickly navigate through:
   - **Fleet Management**: Show aircraft roster (Boeing 737, Airbus A320, Boeing 787 Dreamliner).
   - **Flight Schedules**: Show schedule creation modal (Origin, Destination, Times, Base Fare).
   - **Coupons & Campaigns**: Show active coupons (`WELCOME10`, `AERO2026`) and creation modal.
   - **User Management**: Show the credentials audit directory.

**[SPOKEN SCRIPT / VOICEOVER]**:
> "Finally, let's log in as the System Administrator using `admin@aerobook.com`.
>
> The Admin Control Center gives airline executives full command over the enterprise:
> - Under **Fleet Management**, admins configure commercial aircraft, cabin seating layouts, and operational aircraft statuses.
> - Under **Flight Schedules**, routes, departure/arrival timestamps, aircraft assignments, and base fares can be scheduled dynamically.
> - Under **Coupons & Promotions**, marketing campaigns and discount codes can be created with usage limits and expiry dates.
> - And under **User Management**, administrators can audit credentials, verify accounts, and manage role permissions across the entire company."

---

### [09:30 – 10:00] Conclusion & Technical Wrap-Up

**[VISUAL / ON-SCREEN ACTION]**:
- Switch back to the **AeroBook Home Screen** or show the terminal / Eureka dashboard with all healthy services.
- Move cursor smoothly and smile/conclude.

**[SPOKEN SCRIPT / VOICEOVER]**:
> "To summarize: AeroBook demonstrates how modern cloud-native architectures solve real-world aviation challenges:
> - **11 decoupled Spring Boot microservices** communicating via Netflix Eureka and Netty API Gateway.
> - **Event-driven eventual consistency** powered by RabbitMQ.
> - **Zero overselling** through row-level pessimistic locking.
> - **Enterprise security** with JWT perimeter validation and BCrypt hashing.
> - And a responsive, accessible **Angular 18 frontend** catering to Passengers, Staff, and Administrators alike.
>
> Thank you very much for watching, and I am now open to any questions!"

---

## Quick Reference Summary for Recording

| Time | Segment | Role / Screen | Key Focus |
|---|---|---|---|
| **0:00 – 0:45** | Project Intro | Landing Page | Business Problem & Vision |
| **0:45 – 01:45** | Architecture | Eureka Dashboard | 11 Microservices & 8 DBs |
| **01:45 – 02:45** | Innovations | RabbitMQ / Diagrams | Concurrency, AMQP, Netty Gateway |
| **02:45 – 03:30** | Personas | Angular UI | 3 Roles: Passenger, Staff, Admin |
| **03:30 – 04:00** | Demo Transition | Login Screen | Transition to live test |
| **04:00 – 05:30** | Passenger Booking | `priya@gmail.com` | Search, Dynamic Fare, Coupon |
| **05:30 – 06:45** | Payment & Ticket | Razorpay Modal | HMAC verification, PNR, PDF Ticket |
| **06:45 – 07:45** | Web Check-In | Seat Map | Fuselage Map, Seat 12A, Boarding Pass |
| **07:45 – 08:45** | Ground Operations | `staff@aerobook.com` | Manifest lookup, Boarding scan, Status |
| **08:45 – 09:30** | Admin Center | `admin@aerobook.com` | Fleet roster, Flight scheduling, Coupons |
| **09:30 – 10:00** | Conclusion | Overview Screen | Summary & wrap-up |

