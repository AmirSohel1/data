const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const pptxgen = require('pptxgenjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const SLIDES_DATA = [
  {
    slideNumber: 1,
    time: "00:00 – 00:45",
    title: "Introduction & Real-World Aviation Problem",
    category: "Part 1: Overview & Architecture",
    badge: "00:00 - 00:45 | Vision & Problem",
    screenAction: "Show AeroBook Landing Page (http://localhost:4200). Smoothly hover over the hero search bar, date pickers, and top navigation bar.",
    voiceover: `Hello everyone, and welcome. Today, I am excited to demonstrate AeroBook — an enterprise-grade, cloud-native airline flight reservation, passenger services, airport ground operations, and fleet management platform.

In commercial aviation, legacy monolithic booking engines struggle with single points of failure, slow holiday booking spikes, and fragmented airport operations. If an email notification service slows down or a reporting query runs, it should never prevent a passenger from booking a flight or boarding an aircraft.

AeroBook was engineered from the ground up to solve these mission-critical challenges using a distributed, event-driven microservices architecture that guarantees fault isolation, high availability, sub-millisecond perimeter security, and real-time operational consistency.`,
    bullets: [
      { heading: "Industry Challenge", text: "Legacy monoliths suffer from single-point-of-failure risks and fragile seasonal scaling." },
      { heading: "Fault Isolation Principle", text: "Failures in ancillary reporting or notifications never block core reservations or flight boarding." },
      { heading: "Enterprise Objectives", text: "High availability, sub-millisecond perimeter security, and zero-downtime flight operations." },
      { heading: "Platform Scope", text: "End-to-end coverage: Passenger booking, ground staff gate desk, and executive fleet control." }
    ],
    cards: [
      { title: "Legacy Monoliths", desc: "Tightly coupled DBs, cascading outages during traffic surges", color: "EF4444" },
      { title: "AeroBook Solution", desc: "11 isolated Spring Boot services, independent horizontal scale", color: "10B981" },
      { title: "Target SLA", desc: "99.99% uptime, <50ms core booking latency, zero overselling", color: "38BDF8" }
    ]
  },
  {
    slideNumber: 2,
    time: "00:45 – 01:45",
    title: "Distributed Architecture & 11 Microservices Suite",
    category: "Part 1: Overview & Architecture",
    badge: "00:45 - 01:45 | Microservices & DBs",
    screenAction: "Switch to Netflix Eureka Dashboard (http://localhost:8761). Highlight registered instances: CONFIG-SERVER, AUTH-SERVICE, API-GATEWAY, USER-SERVICE, PAYMENT-SERVICE, CHECK-IN-SERVICE, FLIGHT-SERVICE, BOOKING-SERVICE, FARE-SERVICE, NOTIFICATION-SERVICE.",
    voiceover: `Under the hood, AeroBook is powered by 11 backend Java Spring Boot microservices and an Angular 18 Single Page Application.

As you can see right here on our Eureka Service Discovery dashboard:
- At the perimeter, we have our Spring Cloud API Gateway running on Netty at port 8083, which acts as the single reverse proxy and security barrier for all incoming client traffic.
- We have centralized configuration management using Spring Cloud Config Server at port 8080.
- The business tier is decomposed into independent domain services: auth-service for cryptographic JWT security, user-service for traveler profiles, flight-service for flight schedules and fleet management, fare-service for tiered pricing and coupons, booking-service for reservations, payment-service for transactions, check-in-service for airport boarding passes, and notification-service for email delivery.
- Crucially, we enforce the Database-per-Service pattern. AeroBook runs 8 isolated MySQL database schemas, guaranteeing zero cross-database locking between business domains.`,
    bullets: [
      { heading: "Perimeter Ingress", text: "Spring Cloud Netty API Gateway (Port 8083) handles reverse proxying & CORS." },
      { heading: "Dynamic Discovery", text: "Netflix Eureka Registry (Port 8761) provides client-side load balancing via OpenFeign." },
      { heading: "Centralized Config", text: "Spring Cloud Config Server (Port 8080) delivers externalized environment properties." },
      { heading: "Database Isolation", text: "8 dedicated MySQL schemas (Database-per-Service) eliminate cross-domain table locks." }
    ],
    cards: [
      { title: "Gateway & Config", desc: "Ports 8083 & 8080: Netty non-blocking ingress & Git-backed config", color: "6366F1" },
      { title: "8 Business Domains", desc: "Auth, User, Flight, Fare, Booking, Payment, Check-In, Notification", color: "10B981" },
      { title: "8 MySQL Schemas", desc: "Strict schema boundaries with zero distributed 2PC locking", color: "F59E0B" }
    ]
  },
  {
    slideNumber: 3,
    time: "01:45 – 02:45",
    title: "Core Technical Innovations: Concurrency, AMQP & Security",
    category: "Part 1: Overview & Architecture",
    badge: "01:45 - 02:45 | Engineering Highlights",
    screenAction: "Show RabbitMQ Management Console (http://localhost:15672) showing queues (flight.seat.deduct, booking.notification) or display architectural innovation diagrams.",
    voiceover: `Building a distributed platform like AeroBook involves resolving real distributed systems challenges. Here are three key innovations we engineered into the platform:

1. High-Concurrency Seat Locking & Anti-Overselling: To prevent race conditions when multiple users book the last available seat simultaneously, our Flight Service implements pessimistic row-level locking using SELECT FOR UPDATE within an isolated transactional boundary. This completely eliminates seat overselling.
2. Hybrid Eventual Consistency with RabbitMQ: Instead of slow, fragile distributed two-phase commits, we leverage RabbitMQ AMQP messaging. When a payment succeeds, the booking service asynchronously publishes seat deduction and e-ticket generation events, keeping microservice response times under 50 milliseconds.
3. Perimeter Authentication with Zero Internal Overhead: The Netty API Gateway decrypts and verifies JWT tokens at the boundary, and mutates downstream request headers with trusted identity claims (X-User-Id and X-User-Role). Downstream microservices evaluate roles instantly without repeated asymmetric cryptographic decodes.`,
    bullets: [
      { heading: "Pessimistic Row Locking", text: "SELECT FOR UPDATE ensures atomic seat availability checks and zero overselling." },
      { heading: "Event-Driven Decoupling", text: "RabbitMQ AMQP message broker guarantees eventual consistency with sub-50ms latency." },
      { heading: "Zero-Overhead RBAC", text: "API Gateway mutates downstream headers (X-User-Id, X-User-Role) for instant auth." },
      { heading: "Idempotent Webhooks", text: "Cryptographic HMAC-SHA256 verification and ledger checks prevent duplicate payments." }
    ],
    cards: [
      { title: "Pessimistic Lock", desc: "SELECT FOR UPDATE prevents simultaneous double-booking of final seats", color: "EF4444" },
      { title: "RabbitMQ AMQP", desc: "flight.seat.deduct & booking.notification queues decouple operations", color: "F59E0B" },
      { title: "Gateway Header Mutation", desc: "X-User-Id & X-User-Role headers speed up internal microservice calls", color: "10B981" }
    ]
  },
  {
    slideNumber: 4,
    time: "02:45 – 03:30",
    title: "Multi-Persona Experience & Angular 18 Architecture",
    category: "Part 1: Overview & Architecture",
    badge: "02:45 - 03:30 | Personas & Quality",
    screenAction: "Return to Angular 18 Frontend (http://localhost:4200). Smoothly scroll through the responsive homepage UI showcasing Tailwind styling and Lucide icons.",
    voiceover: `AeroBook delivers a complete multi-persona experience tailored to three distinct roles:
- The Passenger: Real-time flight search, tiered cabin selection, dynamic coupon application, Razorpay payment processing, interactive seat selection, digital PDF e-tickets, and web check-in.
- The Airport Ground Staff: Dedicated airport operations desk for passenger manifests, PNR lookups, real-time boarding pass barcode scanning, flight dispatching, and incident logging.
- The Airline Administrator: Fleet aircraft inventory, route and flight schedule creation, fare matrix controls, and user directory management.

On the frontend, AeroBook is built with Angular 18, utilizing standalone signals, Tailwind CSS, and automated SonarQube static code quality validation with JaCoCo and LCOV coverage across the entire codebase.`,
    bullets: [
      { heading: "Passenger Persona (/customer)", text: "Flight discovery, dynamic coupon engine, seat map selection, and e-ticket downloads." },
      { heading: "Airport Staff Persona (/staff)", text: "Ground desk manifests, real-time boarding barcode scanner, and flight status dispatcher." },
      { heading: "Admin Persona (/admin)", text: "Commercial fleet registry, flight route scheduling, fare matrix, and credentials audit." },
      { heading: "Quality & Testing", text: "Angular 18 standalone signals, Tailwind CSS, and SonarQube static analysis pipeline." }
    ],
    cards: [
      { title: "Passenger Portal", desc: "Search, Seat Map, Razorpay, PDF E-Tickets, Web Check-In", color: "38BDF8" },
      { title: "Ground Staff Operations", desc: "Passenger Manifest, BCBP Barcode Scanner, Gate Dispatcher", color: "10B981" },
      { title: "Executive Admin", desc: "Aircraft Fleet, Route Pricing, Promo Campaigns, User Audit", color: "8B5CF6" }
    ]
  },
  {
    slideNumber: 5,
    time: "03:30 – 04:00",
    title: "Transition to Live Demo & Environment Topology",
    category: "Part 1: Overview & Architecture",
    badge: "03:30 - 04:00 | Live Setup & Credentials",
    screenAction: "Hover over the Login button on the top navigation bar. Prepare the credentials table on screen for a smooth live walkthrough transition.",
    voiceover: `Now that we have covered the business domain and the distributed architecture, let's jump straight into the live demonstration.

We will walk through the entire lifecycle: from a passenger booking a flight, applying a discount, and checking in, to ground staff boarding the passenger at the departure gate, and finally the administrative control center.

All services are fully active in our local cluster, communicating seamlessly through the Spring Cloud Gateway.`,
    bullets: [
      { heading: "Passenger Test Account", text: "priya@gmail.com / Passenger@123 (ROLE_USER -> Routes to /customer)" },
      { heading: "Ground Staff Test Account", text: "staff@aerobook.com / Staff@123 (ROLE_STAFF -> Routes to /staff)" },
      { heading: "System Admin Test Account", text: "admin@aerobook.com / Admin@123 (ROLE_ADMIN -> Routes to /admin)" },
      { heading: "Promotional Test Coupon", text: "WELCOME10 or AERO2026 (10% Dynamic Discount Calculation)" }
    ],
    cards: [
      { title: "Frontend Host", desc: "http://localhost:4200 (Angular 18 Standalone SPA)", color: "38BDF8" },
      { title: "API Gateway", desc: "http://localhost:8083 (Spring Cloud Netty Gateway)", color: "6366F1" },
      { title: "Eureka Registry", desc: "http://localhost:8761 (10 Active Registered Microservices)", color: "10B981" }
    ]
  },
  {
    slideNumber: 6,
    time: "04:00 – 05:30",
    title: "Live Step 1: Passenger Flight Search & Dynamic Fares",
    category: "Part 2: Live System Demonstration",
    badge: "04:00 - 05:30 | Search & Coupon Engine",
    screenAction: "1. Log in as priya@gmail.com / Passenger@123.\n2. Land on /customer dashboard.\n3. Search: DEL to BOM, tomorrow's date, Economy class.\n4. Show AB-101 and available seat count.\n5. Select flight, enter passenger details, apply coupon WELCOME10, and highlight live fare discount.",
    voiceover: `We begin by logging in as our passenger, Priya. Notice how the API Gateway instantly authenticates our JWT and routes us directly to our dedicated Customer Dashboard.

Let's search for a flight from Delhi to Mumbai. The frontend queries our API Gateway, which load-balances the request through Eureka to the Flight Service.

Here are our live scheduled flights. Notice the real-time available seat counter. Let's select flight AB-101.

On the booking configuration screen, our Fare Service dynamically calculates the base fare, Passenger Service Fee (PSF), User Development Fee (UDF), and GST taxes.

Let's enter our passenger details, and now let's apply our promo code: WELCOME10. Instantly, the Fare Service verifies the coupon validity, applies the discount, and recalculates our final payable total.`,
    bullets: [
      { heading: "JWT Authentication", text: "Auth Service issues 24-hr token; Gateway automatically routes role to /customer." },
      { heading: "Route Discovery", text: "Gateway queries Flight Service via Eureka load balancing for active scheduled routes." },
      { heading: "Dynamic Pricing", text: "Fare Service applies cabin multiplier and itemizes PSF, UDF, and GST taxes." },
      { heading: "Coupon Engine", text: "Validates code WELCOME10 against database quotas and applies instant discount." }
    ],
    cards: [
      { title: "Flight AB-101", desc: "DEL -> BOM | Non-Stop Boeing 737 | Live Seats: 142 Available", color: "38BDF8" },
      { title: "Fare Itemization", desc: "Base: ₹4,500 + PSF: ₹250 + GST: ₹225 = ₹4,975 Gross", color: "F59E0B" },
      { title: "Discount Applied", desc: "Coupon WELCOME10 (-10%): Net Payable = ₹4,477.50", color: "10B981" }
    ]
  },
  {
    slideNumber: 7,
    time: "05:30 – 06:45",
    title: "Live Step 2: Razorpay Payment & OpenPDF Ticket",
    category: "Part 2: Live System Demonstration",
    badge: "05:30 - 06:45 | Payment & E-Ticket",
    screenAction: "1. Click Proceed to Payment.\n2. Razorpay checkout modal opens.\n3. Complete mock payment simulation and click Pay Now.\n4. Show payment confirmation and 8-character PNR (ABK79421).\n5. Click View E-Ticket and show OpenPDF official ticket modal and PDF download.",
    voiceover: `Now let's proceed to payment. AeroBook integrates seamlessly with Razorpay.

When I click 'Pay', our backend payment service executes cryptographic HMAC-SHA256 signature verification to guarantee transaction authenticity and prevent tampering.

And just like that, the payment is confirmed! Behind the scenes, the Booking Service created a unique 8-character PNR, published an asynchronous event to RabbitMQ, and the Flight Service decremented the seat count in MySQL under row-level lock.

Simultaneously, the Notification Service dispatched an email confirmation with an attached PDF e-ticket. When I click 'View E-Ticket', we get this beautiful, print-ready document generated using OpenPDF, complete with the flight itinerary, fare breakdown, and official airline header.`,
    bullets: [
      { heading: "Razorpay Checkout", text: "Modal checkout with client-side integration and server-side order generation." },
      { heading: "HMAC Verification", text: "Payment Service cryptographically checks razorpay_signature before state commit." },
      { heading: "Asynchronous RabbitMQ", text: "AMQP message triggers atomic seat decrement in flight_db and email dispatch." },
      { heading: "OpenPDF E-Ticket", text: "High-fidelity dual-view ticket with 8-character PNR, tax details, and barcode." }
    ],
    cards: [
      { title: "HMAC-SHA256 Security", desc: "Server-side signature check prevents client payload manipulation", color: "10B981" },
      { title: "Unique PNR Generated", desc: "8-character alphanumeric record (e.g., ABK79421) committed to booking_db", color: "6366F1" },
      { title: "OpenPDF Generator", desc: "Instant vector PDF e-ticket and invoice ready for passenger download", color: "38BDF8" }
    ]
  },
  {
    slideNumber: 8,
    time: "06:45 – 07:45",
    title: "Live Step 3: Web Check-In & IATA Boarding Pass",
    category: "Part 2: Live System Demonstration",
    badge: "06:45 - 07:45 | Seat Map & Boarding Pass",
    screenAction: "1. Navigate to Web Check-In.\n2. Enter PNR ABK79421.\n3. Fuselage seat map renders dynamically.\n4. Select window seat 12A and click Confirm Check-In.\n5. Show digital Boarding Pass with IATA barcode (BP-X-YYZ), gate number, and seat 12A.\n6. Click Download Boarding Pass.",
    voiceover: `Now let's complete Web Check-In. Passengers can check in directly from their phone or browser. When I enter our PNR, AeroBook loads an interactive seat map representing the actual aircraft fuselage.

You can see occupied seats disabled in real time. Let's select seat 12A by the window.

When I click 'Confirm Check-In', our check-in-service locks in the seat assignment, updates our status from BOOKED to CHECKED_IN, and generates our digital IATA-compliant Boarding Pass.

Notice the generated high-resolution barcode, terminal gate, boarding group, and sequence number. The passenger is now 100% ready for travel.`,
    bullets: [
      { heading: "Interactive Fuselage Map", text: "Visual seating layout showing occupied (red) vs available (green/blue) seats." },
      { heading: "Atomic Seat Assignment", text: "Check-In Service validates seat availability and locks allocation to booking record." },
      { heading: "Lifecycle Transition", text: "Passenger booking status advances from BOOKED to CHECKED_IN." },
      { heading: "IATA Barcode Standard", text: "Generates authentic BCBP boarding pass with barcode string (BP-X-YYZ) & gate info." }
    ],
    cards: [
      { title: "Fuselage Seat Map", desc: "Dynamic SVG/CSS grid matching aircraft cabin configuration", color: "38BDF8" },
      { title: "Seat 12A Allocated", desc: "Window seat locked to PNR ABK79421 in checkin_db", color: "10B981" },
      { title: "IATA Boarding Pass", desc: "Includes Gate 4B, Boarding Group 2, and digital 2D barcode", color: "F59E0B" }
    ]
  },
  {
    slideNumber: 9,
    time: "07:45 – 08:45",
    title: "Live Step 4: Airport Ground Operations & Gate Scanner",
    category: "Part 2: Live System Demonstration",
    badge: "07:45 - 08:45 | Manifest & Gate Scan",
    screenAction: "1. Log out and log in as staff@aerobook.com / Staff@123.\n2. Land on Staff Dashboard (/staff).\n3. In Passenger Manifest, search for flight AB-101. Locate Priya's record with seat 12A.\n4. Click Simulate Gate Scan / Board Passenger. Show status updating to BOARDED.\n5. In Flight Status Dispatcher, update flight status from SCHEDULED to BOARDING.",
    voiceover: `Now let's switch personas to the airport terminal. I'll log in as airport ground staff using staff@aerobook.com.

Notice that our role-based security immediately recognizes ROLE_STAFF and directs us to the airport ground operations dashboard. Here, airport agents have real-time visibility across all flights, passenger manifests, and baggage counters.

Let's look up our flight AB-101. Here is our passenger, Priya, checked into seat 12A.

At the departure gate, the agent scans the boarding pass barcode. With one click, the check-in service validates the ticket and marks the passenger as BOARDED.

The staff member can also update the operational flight status — let's switch flight AB-101 from SCHEDULED to BOARDING. This status immediately propagates across the entire platform in real time.`,
    bullets: [
      { heading: "Airport Staff Portal", text: "Specialized dashboard at /staff secured by Spring Security RBAC (ROLE_STAFF)." },
      { heading: "Flight Manifest Oversight", text: "Ground agents view real-time boarding completion rates and checked baggage." },
      { heading: "Gate Boarding Scanner", text: "Validates boarding barcode and advances passenger status to BOARDED." },
      { heading: "Operational Dispatcher", text: "Broadcasts operational flight status (SCHEDULED -> BOARDING -> DEPARTED)." }
    ],
    cards: [
      { title: "Passenger Manifest", desc: "Full manifest visibility: Seat 12A, PNR ABK79421, Bag Tag #BG8841", color: "38BDF8" },
      { title: "Gate Scanner", desc: "Instant transition from CHECKED_IN to BOARDED upon barcode scan", color: "10B981" },
      { title: "Flight Dispatch", desc: "Operational status updated to BOARDING across all airport boards", color: "6366F1" }
    ]
  },
  {
    slideNumber: 10,
    time: "08:45 – 09:30",
    title: "Live Step 5: Airline Administration & Fleet Control",
    category: "Part 2: Live System Demonstration",
    badge: "08:45 - 09:30 | Fleet & Route Management",
    screenAction: "1. Log out and log in as admin@aerobook.com / Admin@123.\n2. Land on Admin Dashboard (/admin).\n3. Navigate through tabs: Fleet Management (Boeing 737, Airbus A320), Flight Schedules (view/create schedules), Coupons & Campaigns (WELCOME10), and User Management directory.",
    voiceover: `Finally, let's log in as the System Administrator using admin@aerobook.com.

The Admin Control Center gives airline executives full command over the enterprise:
- Under Fleet Management, admins configure commercial aircraft, cabin seating layouts, and operational aircraft statuses.
- Under Flight Schedules, routes, departure/arrival timestamps, aircraft assignments, and base fares can be scheduled dynamically.
- Under Coupons & Promotions, marketing campaigns and discount codes can be created with usage limits and expiry dates.
- And under User Management, administrators can audit credentials, verify accounts, and manage role permissions across the entire company.`,
    bullets: [
      { heading: "Fleet Inventory", text: "Manage commercial aircraft models (Boeing 737, Airbus A320, Boeing 787) & capacity." },
      { heading: "Route & Schedule Engine", text: "Create flights, link aircraft, define departure/arrival hubs, and set base fares." },
      { heading: "Campaign Management", text: "Configure promotional discount coupons, percentage caps, and usage quotas." },
      { heading: "Credential Directory", text: "Full enterprise user audit, account status verification, and RBAC role promotion." }
    ],
    cards: [
      { title: "Fleet Management", desc: "Aircraft registration, manufacturer fleet status, and cabin configurations", color: "8B5CF6" },
      { title: "Flight Scheduling", desc: "Route timing, origin/destination hubs, base fares, and aircraft linkage", color: "38BDF8" },
      { title: "Promo Campaigns", desc: "Coupon rules, usage quotas, discount caps, and campaign date windows", color: "10B981" }
    ]
  },
  {
    slideNumber: 11,
    time: "09:30 – 10:00",
    title: "Conclusion & Technical Wrap-Up",
    category: "Part 2: Live System Demonstration",
    badge: "09:30 - 10:00 | Architecture Summary",
    screenAction: "Switch back to the AeroBook Home Screen or show the Eureka Dashboard with all 10 healthy microservices active. Deliver confident, professional closing statement.",
    voiceover: `To summarize: AeroBook demonstrates how modern cloud-native architectures solve real-world aviation challenges:
- 11 decoupled Spring Boot microservices communicating via Netflix Eureka and Netty API Gateway.
- Event-driven eventual consistency powered by RabbitMQ.
- Zero overselling through row-level pessimistic locking.
- Enterprise security with JWT perimeter validation and BCrypt hashing.
- And a responsive, accessible Angular 18 frontend catering to Passengers, Staff, and Administrators alike.

Thank you very much for watching, and I am now open to any questions!`,
    bullets: [
      { heading: "Cloud-Native Microservices", text: "11 Java Spring Boot services communicating via Eureka and Netty API Gateway." },
      { heading: "Eventual Consistency", text: "RabbitMQ AMQP messaging guarantees resilient, decoupled async processing." },
      { heading: "Zero Overselling", text: "Pessimistic row locking ensures atomic seat inventory checks at scale." },
      { heading: "Unified Modern UI", text: "Angular 18 SPA delivers seamless workflows across Passenger, Staff, and Admin roles." }
    ],
    cards: [
      { title: "11 Microservices", desc: "100% decoupled Spring Boot backend with Eureka client-side load balancing", color: "10B981" },
      { title: "8 MySQL DBs", desc: "Zero database-level cross-coupling; strict domain boundaries", color: "38BDF8" },
      { title: "SonarQube Validated", desc: "Enterprise code quality with JaCoCo and LCOV coverage pipelines", color: "F59E0B" }
    ]
  }
];

// 1. Generate Native PowerPoint Presentation (.pptx)
async function generatePptx() {
  console.log('Generating PowerPoint presentation (.pptx)...');
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  // --- Title / Cover Slide ---
  const coverSlide = pptx.addSlide();
  coverSlide.background = { color: '070D1E' };

  coverSlide.addText('AeroBook Demonstration Video Presentation', {
    x: 0.8, y: 1.0, w: 11.7, h: 0.8,
    fontSize: 28, fontFace: 'Arial', color: 'FFFFFF', bold: true
  });

  coverSlide.addText('Synchronized 8–10 Minute Presentation Deck & Speaker Script', {
    x: 0.8, y: 1.8, w: 11.7, h: 0.5,
    fontSize: 16, fontFace: 'Arial', color: '38BDF8', bold: true
  });

  coverSlide.addText('Every slide is synchronized with on-screen visual actions and word-for-word voiceover script notes.', {
    x: 0.8, y: 2.3, w: 11.7, h: 0.4,
    fontSize: 12, fontFace: 'Arial', color: '94A3B8'
  });

  // 4 Meta Badges on Cover
  const metaCards = [
    { title: 'Target Video Duration', val: '8 – 10 Minutes', color: '38BDF8' },
    { title: 'Backend Microservices', val: '11 Spring Boot Services', color: '10B981' },
    { title: 'Frontend Technology', val: 'Angular 18 SPA', color: 'F59E0B' },
    { title: 'Database Isolation', val: '8 Isolated MySQL DBs', color: '8B5CF6' }
  ];

  metaCards.forEach((c, idx) => {
    const x = 0.8 + idx * 2.95;
    coverSlide.addShape(pptx.ShapeType.rect, {
      x, y: 3.2, w: 2.8, h: 1.6,
      fill: { color: '0F172A' },
      line: { color: c.color, width: 1.5 }
    });
    coverSlide.addText(c.title.toUpperCase(), {
      x: x + 0.15, y: 3.4, w: 2.5, h: 0.3,
      fontSize: 9, fontFace: 'Arial', color: c.color, bold: true
    });
    coverSlide.addText(c.val, {
      x: x + 0.15, y: 3.8, w: 2.5, h: 0.7,
      fontSize: 14, fontFace: 'Arial', color: 'FFFFFF', bold: true
    });
  });

  // Table of 3 Roles
  coverSlide.addText('DEMONSTRATION COVERAGE ACROSS ALL 3 PLATFORM ROLES:', {
    x: 0.8, y: 5.2, w: 11.7, h: 0.3,
    fontSize: 10, fontFace: 'Arial', color: '64748B', bold: true
  });

  const roles = [
    { name: '1. Passenger Persona', email: 'priya@gmail.com', flow: 'Search Flights -> Fare Itemization -> Razorpay Modal -> PDF Ticket -> Web Check-In' },
    { name: '2. Ground Staff Persona', email: 'staff@aerobook.com', flow: 'Passenger Manifest -> PNR Lookup -> Gate Barcode Scanner -> Flight Dispatcher' },
    { name: '3. Airline Administrator', email: 'admin@aerobook.com', flow: 'Aircraft Fleet -> Route Scheduler -> Promotional Coupons -> User RBAC Audit' }
  ];

  roles.forEach((r, idx) => {
    const y = 5.6 + idx * 0.52;
    coverSlide.addShape(pptx.ShapeType.rect, {
      x: 0.8, y, w: 11.7, h: 0.44,
      fill: { color: '1E293B' },
      line: { color: '334155', width: 1 }
    });
    coverSlide.addText(r.name, {
      x: 1.0, y: y + 0.05, w: 2.5, h: 0.35,
      fontSize: 10, fontFace: 'Arial', color: '38BDF8', bold: true
    });
    coverSlide.addText(r.email, {
      x: 3.6, y: y + 0.05, w: 2.2, h: 0.35,
      fontSize: 9, fontFace: 'Courier New', color: 'FDE68A'
    });
    coverSlide.addText(r.flow, {
      x: 5.9, y: y + 0.05, w: 6.4, h: 0.35,
      fontSize: 9, fontFace: 'Arial', color: 'E2E8F0'
    });
  });

  coverSlide.addNotes(`AeroBook Demonstration Video Master Presentation.
This presentation deck is synchronized slide-by-slide with your 8-to-10 minute demonstration video.
Each slide contains on-screen visual guidance and full word-for-word voiceover script notes in the speaker notes drawer.`);

  // --- Slides 1 to 11 ---
  for (const s of SLIDES_DATA) {
    const slide = pptx.addSlide();
    slide.background = { color: '070D1E' };

    // Slide Header Bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8, y: 0.4, w: 11.7, h: 0.9,
      fill: { color: '0F172A' },
      line: { color: '2563EB', width: 1.2 }
    });

    slide.addText(`SLIDE ${s.slideNumber} OF 11  |  ${s.time}`, {
      x: 1.0, y: 0.48, w: 6.0, h: 0.25,
      fontSize: 9, fontFace: 'Arial', color: '38BDF8', bold: true
    });

    slide.addText(s.title, {
      x: 1.0, y: 0.72, w: 9.0, h: 0.45,
      fontSize: 16, fontFace: 'Arial', color: 'FFFFFF', bold: true
    });

    slide.addText(s.category.toUpperCase(), {
      x: 9.5, y: 0.55, w: 2.8, h: 0.3,
      fontSize: 8, fontFace: 'Arial', color: '94A3B8', align: 'right', bold: true
    });

    // Left Column: Key Architectural & Technical Highlights (Width 7.2)
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8, y: 1.45, w: 7.2, h: 3.65,
      fill: { color: '0F172A' },
      line: { color: '334155', width: 1 }
    });

    slide.addText('KEY ARCHITECTURAL & TECHNICAL HIGHLIGHTS', {
      x: 1.0, y: 1.55, w: 6.8, h: 0.3,
      fontSize: 10, fontFace: 'Arial', color: 'F59E0B', bold: true
    });

    s.bullets.forEach((b, bIdx) => {
      const by = 1.95 + bIdx * 0.75;
      slide.addText(`•  ${b.heading}:`, {
        x: 1.0, y: by, w: 6.8, h: 0.25,
        fontSize: 10, fontFace: 'Arial', color: '38BDF8', bold: true
      });
      slide.addText(b.text, {
        x: 1.3, y: by + 0.25, w: 6.4, h: 0.45,
        fontSize: 9.5, fontFace: 'Arial', color: 'CBD5E1'
      });
    });

    // Right Column: 3 Metric/Component Cards (Width 4.3)
    s.cards.forEach((c, cIdx) => {
      const cy = 1.45 + cIdx * 1.25;
      slide.addShape(pptx.ShapeType.rect, {
        x: 8.2, y: cy, w: 4.3, h: 1.15,
        fill: { color: '1E293B' },
        line: { color: c.color, width: 1.5 }
      });
      slide.addText(c.title, {
        x: 8.4, y: cy + 0.12, w: 3.9, h: 0.3,
        fontSize: 11, fontFace: 'Arial', color: c.color, bold: true
      });
      slide.addText(c.desc, {
        x: 8.4, y: cy + 0.45, w: 3.9, h: 0.6,
        fontSize: 9, fontFace: 'Arial', color: 'E2E8F0'
      });
    });

    // Bottom Bar: On-Screen Live Action Cue Drawer
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8, y: 5.25, w: 11.7, h: 1.6,
      fill: { color: '172554' },
      line: { color: '3B82F6', width: 1.2 }
    });

    slide.addText('ON-SCREEN ACTION / LIVE DEMO CUE:', {
      x: 1.0, y: 5.35, w: 11.3, h: 0.25,
      fontSize: 9.5, fontFace: 'Arial', color: '60A5FA', bold: true
    });

    slide.addText(s.screenAction, {
      x: 1.0, y: 5.65, w: 11.3, h: 1.1,
      fontSize: 9.5, fontFace: 'Arial', color: 'EFF6FF'
    });

    // Embed Voiceover Notes in Speaker Notes
    slide.addNotes(`[SLIDE ${s.slideNumber} - TIMING: ${s.time}]
TITLE: ${s.title}

ON-SCREEN ACTION:
${s.screenAction}

============================================================
VOICEOVER SCRIPT (READ VERBATIM):
============================================================
${s.voiceover}`);
  }

  const pptxPath = path.join(DOCS_DIR, 'AeroBook_Demo_Video_Presentation.pptx');
  await pptx.writeFile({ fileName: pptxPath });
  console.log(`PowerPoint Presentation created: ${pptxPath}`);
}

// 2. Generate Master HTML Slide Deck for Presentation and PDF Export
function generateHtmlDeck() {
  console.log('Generating HTML Presentation Deck...');

  let slidesHtml = '';

  // Cover Slide HTML
  slidesHtml += `
  <section class="slide-page">
    <div class="slide-header-bar">
      <div class="brand-tag">AEROBOOK PRESENTATION DECK</div>
      <div class="slide-timing-badge">MASTER TITLE SLIDE</div>
    </div>
    <div class="cover-content">
      <div class="cover-badge">EXECUTIVE DEMONSTRATION SUITE</div>
      <h1 class="cover-title">AeroBook Demonstration Video Presentation</h1>
      <h2 class="cover-subtitle">Synchronized 8–10 Minute Slide Deck with Full Voiceover Script &amp; Visual Cues</h2>
      <p class="cover-desc">Designed for synchronized live project recording, academic evaluations, and architectural reviews.</p>
      
      <div class="cover-grid">
        <div class="cover-card">
          <div class="cover-card-label">TARGET VIDEO DURATION</div>
          <div class="cover-card-val" style="color: #38bdf8;">8 – 10 Minutes</div>
          <div class="cover-card-sub">0:00–4:00 Arch | 4:00–10:00 Live</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-label">BACKEND ARCHITECTURE</div>
          <div class="cover-card-val" style="color: #10b981;">11 Microservices</div>
          <div class="cover-card-sub">Spring Cloud &amp; Netflix Eureka</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-label">DATABASE ISOLATION</div>
          <div class="cover-card-val" style="color: #f59e0b;">8 MySQL DBs</div>
          <div class="cover-card-sub">Database-per-Service Pattern</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-label">FRONTEND PLATFORM</div>
          <div class="cover-card-val" style="color: #c084fc;">Angular 18 SPA</div>
          <div class="cover-card-sub">Signals &amp; Tailwind Styling</div>
        </div>
      </div>

      <div class="roles-strip">
        <div class="role-pill"><span class="role-tag">ROLE 1: PASSENGER</span> priya@gmail.com (Booking, Seat Map, Razorpay, PDF E-Ticket)</div>
        <div class="role-pill"><span class="role-tag">ROLE 2: STAFF</span> staff@aerobook.com (Ground Desk, BCBP Barcode Scanner, Gate Dispatch)</div>
        <div class="role-pill"><span class="role-tag">ROLE 3: ADMIN</span> admin@aerobook.com (Fleet Roster, Route Pricing, Promotional Campaigns)</div>
      </div>
    </div>
  </section>
  `;

  // 11 Content Slides HTML
  for (const s of SLIDES_DATA) {
    let bulletsHtml = s.bullets.map(b => `
      <div class="bullet-item">
        <div class="bullet-head">&#9656; ${b.heading}</div>
        <div class="bullet-body">${b.text}</div>
      </div>
    `).join('');

    let cardsHtml = s.cards.map(c => `
      <div class="metric-card" style="border-left: 4px solid #${c.color};">
        <div class="metric-title" style="color: #${c.color};">${c.title}</div>
        <div class="metric-desc">${c.desc}</div>
      </div>
    `).join('');

    slidesHtml += `
    <section class="slide-page">
      <div class="slide-header-bar">
        <div>
          <div class="slide-timing-badge">${s.badge}</div>
          <h2 class="slide-main-title">${s.title}</h2>
        </div>
        <div class="slide-category">${s.category.toUpperCase()}</div>
      </div>

      <div class="slide-body-grid">
        <div class="left-content-panel">
          <div class="panel-heading">&#128736; ARCHITECTURAL &amp; TECHNICAL HIGHLIGHTS</div>
          <div class="bullets-container">
            ${bulletsHtml}
          </div>
        </div>
        <div class="right-content-panel">
          <div class="panel-heading">&#9889; CORE RUNTIME DOMAINS</div>
          ${cardsHtml}
        </div>
      </div>

      <div class="bottom-action-bar">
        <div class="action-bar-label">&#128249; ON-SCREEN LIVE ACTION / VISUAL CUE:</div>
        <div class="action-bar-text">${s.screenAction.replace(/\n/g, ' &bull; ')}</div>
      </div>

      <div class="teleprompter-drawer">
        <div class="drawer-header">&#127908; SYNCHRONIZED SPOKEN VOICEOVER SCRIPT (READ ALOUD DURING THIS SLIDE):</div>
        <div class="drawer-body">${s.voiceover.replace(/\n\n/g, '<br><br>')}</div>
      </div>
    </section>
    `;
  }

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AeroBook - Synchronized 8-10 Min Presentation Deck</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');

    @page {
      size: 297mm 210mm landscape;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: #070d1e;
      color: #e2e8f0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .slide-page {
      width: 297mm;
      height: 210mm;
      page-break-after: always;
      padding: 10mm 14mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #070d1e;
      position: relative;
      overflow: hidden;
    }

    .slide-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      border: 1px solid #1e293b;
      border-left: 5px solid #2563eb;
      padding: 8px 16px;
      border-radius: 6px;
      margin-bottom: 8px;
    }

    .brand-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      font-weight: 700;
      color: #38bdf8;
      letter-spacing: 0.05em;
    }

    .slide-timing-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      font-weight: 700;
      background: #1e293b;
      color: #38bdf8;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #334155;
      display: inline-block;
      margin-bottom: 2px;
    }

    .slide-main-title {
      font-size: 13pt;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.01em;
    }

    .slide-category {
      font-size: 8pt;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.04em;
    }

    /* Body 2-Column Grid */
    .slide-body-grid {
      display: grid;
      grid-template-columns: 1.55fr 1fr;
      gap: 12px;
      margin-bottom: 8px;
    }

    .left-content-panel {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 6px;
      padding: 10px 14px;
    }

    .right-content-panel {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 6px;
      padding: 10px 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .panel-heading {
      font-size: 8pt;
      font-weight: 800;
      color: #f59e0b;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 4px;
    }

    .bullets-container {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .bullet-item {
      line-height: 1.3;
    }

    .bullet-head {
      font-size: 8.5pt;
      font-weight: 700;
      color: #38bdf8;
      margin-bottom: 1px;
    }

    .bullet-body {
      font-size: 8pt;
      color: #cbd5e1;
    }

    .metric-card {
      background: #1e293b;
      padding: 6px 10px;
      border-radius: 4px;
    }

    .metric-title {
      font-size: 8.5pt;
      font-weight: 700;
      margin-bottom: 2px;
    }

    .metric-desc {
      font-size: 7.5pt;
      color: #cbd5e1;
      line-height: 1.25;
    }

    /* Bottom Action Bar */
    .bottom-action-bar {
      background: #172554;
      border: 1px solid #1e40af;
      padding: 6px 12px;
      border-radius: 5px;
      margin-bottom: 8px;
    }

    .action-bar-label {
      font-size: 7.5pt;
      font-weight: 800;
      color: #93c5fd;
      letter-spacing: 0.04em;
      margin-bottom: 2px;
    }

    .action-bar-text {
      font-size: 8pt;
      color: #ffffff;
      line-height: 1.25;
    }

    /* Teleprompter Voiceover Drawer */
    .teleprompter-drawer {
      background: #022c22;
      border: 1px solid #065f46;
      border-left: 4px solid #10b981;
      padding: 8px 12px;
      border-radius: 5px;
    }

    .drawer-header {
      font-size: 7.5pt;
      font-weight: 800;
      color: #6ee7b7;
      letter-spacing: 0.04em;
      margin-bottom: 4px;
    }

    .drawer-body {
      font-size: 8pt;
      color: #d1fae5;
      line-height: 1.35;
      max-height: 48mm;
      overflow: hidden;
    }

    /* Cover Page Styles */
    .cover-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      padding: 10px 20px;
    }

    .cover-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9pt;
      font-weight: 700;
      background: #1e293b;
      color: #38bdf8;
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      border: 1px solid #334155;
      width: fit-content;
      margin-bottom: 12px;
    }

    .cover-title {
      font-size: 26pt;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }

    .cover-subtitle {
      font-size: 13pt;
      font-weight: 600;
      color: #38bdf8;
      margin-bottom: 10px;
    }

    .cover-desc {
      font-size: 10pt;
      color: #94a3b8;
      max-width: 800px;
      margin-bottom: 24px;
    }

    .cover-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 24px;
    }

    .cover-card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 6px;
      padding: 14px;
    }

    .cover-card-label {
      font-size: 7.5pt;
      font-weight: 800;
      color: #94a3b8;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }

    .cover-card-val {
      font-size: 15pt;
      font-weight: 800;
      margin-bottom: 4px;
    }

    .cover-card-sub {
      font-size: 8pt;
      color: #64748b;
    }

    .roles-strip {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .role-pill {
      background: #0f172a;
      border: 1px solid #1e293b;
      padding: 6px 14px;
      border-radius: 4px;
      font-size: 8.5pt;
      color: #cbd5e1;
    }

    .role-tag {
      color: #38bdf8;
      font-weight: 700;
      margin-right: 10px;
    }
  </style>
</head>
<body>
  ${slidesHtml}
</body>
</html>`;

  const htmlPath = path.join(DOCS_DIR, 'AeroBook_Demo_Video_Presentation.html');
  fs.writeFileSync(htmlPath, fullHtml, 'utf8');
  console.log(`HTML Presentation created: ${htmlPath}`);
  return htmlPath;
}

// 3. Render HTML to 16:9 Landscape Presentation PDF
function renderPdf(htmlPath) {
  console.log('Rendering 16:9 Presentation PDF via Chrome Headless...');
  const pdfPath = path.join(DOCS_DIR, 'AeroBook_Demo_Video_Presentation.pdf');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

  const cmd = `"${CHROME_PATH}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${fileUrl}"`;
  try {
    execSync(cmd, { stdio: 'inherit' });
    if (fs.existsSync(pdfPath)) {
      const stats = fs.statSync(pdfPath);
      console.log(`Presentation PDF created: ${pdfPath} (${(stats.size / 1024).toFixed(1)} KB)`);
    }
  } catch (err) {
    console.error('Error rendering PDF:', err.message);
  }
}

async function main() {
  console.log('================================================================');
  console.log('   Generating Synchronized 8-10 Min Slide Deck (PPTX & PDF)    ');
  console.log('================================================================');
  await generatePptx();
  const htmlPath = generateHtmlDeck();
  renderPdf(htmlPath);
  console.log('================================================================');
  console.log('   All Synchronized Presentation Assets Generated Successfully! ');
  console.log('================================================================');
}

main().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});

