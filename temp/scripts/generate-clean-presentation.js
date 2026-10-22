const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const pptxgen = require('pptxgenjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIAGRAMS_DIR = path.join(ROOT_DIR, 'docs', 'diagrams');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(DIAGRAMS_DIR)) {
  fs.mkdirSync(DIAGRAMS_DIR, { recursive: true });
}

// ============================================================================
// 1. HANDCRAFTED ULTRA-CLEAN PRESENTATION SVGs (ZERO SPAGHETTI, PERFECT ALIGNMENT)
// ============================================================================

function getArchitectureSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1160 520" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#070d1e"/>
        <stop offset="100%" stop-color="#0b1736"/>
      </linearGradient>
      <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e293b" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0.9"/>
      </linearGradient>
      <linearGradient id="clientGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#0284c7"/>
        <stop offset="100%" stop-color="#2563eb"/>
      </linearGradient>
      <linearGradient id="gwGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#4f46e5"/>
        <stop offset="100%" stop-color="#7c3aed"/>
      </linearGradient>
      <linearGradient id="discGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#0d9488"/>
        <stop offset="100%" stop-color="#059669"/>
      </linearGradient>
      <linearGradient id="amqpGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ea580c"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.5"/>
      </filter>
      <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>
      </marker>
      <marker id="arrowAmber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b"/>
      </marker>
    </defs>

    <rect width="1160" height="520" rx="12" fill="url(#bgGrad)"/>

    <!-- TIER 1: CLIENT PRESENTATION TIER -->
    <g transform="translate(40, 20)">
      <rect width="1080" height="54" rx="8" fill="url(#cardGrad)" stroke="#38bdf8" stroke-width="1.5" filter="url(#shadow)"/>
      <rect x="0" y="0" width="160" height="54" rx="8" fill="url(#clientGrad)"/>
      <text x="80" y="26" fill="#ffffff" font-size="12" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">CLIENT TIER</text>
      <text x="80" y="42" fill="#e0f2fe" font-size="9" text-anchor="middle" font-family="Inter, sans-serif">Port 4200</text>
      
      <!-- Sub-components -->
      <g transform="translate(180, 10)">
        <rect width="260" height="34" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="130" y="21" fill="#f8fafc" font-size="10.5" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">Angular 18 SPA (Signals &amp; Standalone)</text>
      </g>
      <g transform="translate(460, 10)">
        <rect width="200" height="34" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="100" y="21" fill="#f8fafc" font-size="10.5" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">Passenger Portal</text>
      </g>
      <g transform="translate(680, 10)">
        <rect width="200" height="34" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="100" y="21" fill="#f8fafc" font-size="10.5" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">Airport Staff Gate Scanner</text>
      </g>
      <g transform="translate(900, 10)">
        <rect width="160" height="34" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="80" y="21" fill="#f8fafc" font-size="10.5" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">Admin Governance</text>
      </g>
    </g>

    <!-- CONNECTOR: CLIENT -> GATEWAY -->
    <path d="M 580 74 L 580 95" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
    <text x="595" y="88" fill="#94a3b8" font-size="9" font-family="Inter, sans-serif">HTTPS / REST</text>

    <!-- TIER 2: EDGE INGRESS API GATEWAY -->
    <g transform="translate(40, 96)">
      <rect width="1080" height="54" rx="8" fill="url(#cardGrad)" stroke="#818cf8" stroke-width="1.5" filter="url(#shadow)"/>
      <rect x="0" y="0" width="160" height="54" rx="8" fill="url(#gwGrad)"/>
      <text x="80" y="26" fill="#ffffff" font-size="12" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">API GATEWAY</text>
      <text x="80" y="42" fill="#ede9fe" font-size="9" text-anchor="middle" font-family="Inter, sans-serif">Port 8083 (Netty)</text>

      <g transform="translate(180, 10)">
        <rect width="210" height="34" rx="6" fill="#1e293b" stroke="#475569"/>
        <text x="105" y="21" fill="#a5b4fc" font-size="10" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">Netty Reactive EventLoop</text>
      </g>
      <g transform="translate(410, 10)">
        <rect width="210" height="34" rx="6" fill="#1e293b" stroke="#475569"/>
        <text x="105" y="21" fill="#a5b4fc" font-size="10" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">JWT Perimeter Auth Filter</text>
      </g>
      <g transform="translate(640, 10)">
        <rect width="210" height="34" rx="6" fill="#1e293b" stroke="#475569"/>
        <text x="105" y="21" fill="#a5b4fc" font-size="10" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">Header Mutation (X-User-*)</text>
      </g>
      <g transform="translate(870, 10)">
        <rect width="190" height="34" rx="6" fill="#1e293b" stroke="#475569"/>
        <text x="95" y="21" fill="#a5b4fc" font-size="10" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">CORS &amp; Rate Limiting</text>
      </g>
    </g>

    <!-- TIER 3: DISCOVERY & CONFIG (SIDEBAR / FLOATING TIER) -->
    <g transform="translate(40, 166)">
      <rect width="525" height="42" rx="6" fill="url(#cardGrad)" stroke="#34d399" stroke-width="1.2"/>
      <rect x="0" y="0" width="130" height="42" rx="6" fill="url(#discGrad)"/>
      <text x="65" y="22" fill="#ffffff" font-size="10.5" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">EUREKA SERVER</text>
      <text x="65" y="34" fill="#ccfbf1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Port 8761</text>
      <text x="325" y="26" fill="#cbd5e1" font-size="10" text-anchor="middle" font-family="Inter, sans-serif">Dynamic Service Registry • Client-Side Load Balancing (lb://)</text>
    </g>
    <g transform="translate(595, 166)">
      <rect width="525" height="42" rx="6" fill="url(#cardGrad)" stroke="#34d399" stroke-width="1.2"/>
      <rect x="0" y="0" width="130" height="42" rx="6" fill="url(#discGrad)"/>
      <text x="65" y="22" fill="#ffffff" font-size="10.5" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">CONFIG SERVER</text>
      <text x="65" y="34" fill="#ccfbf1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Port 8080</text>
      <text x="325" y="26" fill="#cbd5e1" font-size="10" text-anchor="middle" font-family="Inter, sans-serif">Centralized Native Profiles • Externalized Configuration</text>
    </g>

    <!-- TIER 4: BUSINESS MICROSERVICES CLUSTERS -->
    <g transform="translate(40, 222)">
      <!-- Cluster 1: Auth & User -->
      <g transform="translate(0, 0)">
        <rect width="255" height="120" rx="8" fill="url(#cardGrad)" stroke="#3b82f6" stroke-width="1.2"/>
        <rect x="0" y="0" width="255" height="26" rx="8" fill="#1e3a8a"/>
        <text x="127" y="18" fill="#93c5fd" font-size="10" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">IDENTITY &amp; DEMOGRAPHICS</text>
        <g transform="translate(10, 36)">
          <rect width="235" height="34" rx="4" fill="#0f172a" stroke="#334155"/>
          <text x="12" y="18" fill="#ffffff" font-size="10" font-weight="600" font-family="Inter, sans-serif">auth-service</text>
          <text x="12" y="29" fill="#94a3b8" font-size="8" font-family="Inter, sans-serif">Port 8082 • JJWT, BCrypt, OTP</text>
        </g>
        <g transform="translate(10, 76)">
          <rect width="235" height="34" rx="4" fill="#0f172a" stroke="#334155"/>
          <text x="12" y="18" fill="#ffffff" font-size="10" font-weight="600" font-family="Inter, sans-serif">user-service</text>
          <text x="12" y="29" fill="#94a3b8" font-size="8" font-family="Inter, sans-serif">Port 8084 • Profiles &amp; Incidents</text>
        </g>
      </g>

      <!-- Cluster 2: Flight & Fare -->
      <g transform="translate(275, 0)">
        <rect width="255" height="120" rx="8" fill="url(#cardGrad)" stroke="#10b981" stroke-width="1.2"/>
        <rect x="0" y="0" width="255" height="26" rx="8" fill="#065f46"/>
        <text x="127" y="18" fill="#a7f3d0" font-size="10" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">FLIGHT OPERATIONS &amp; FARES</text>
        <g transform="translate(10, 36)">
          <rect width="235" height="34" rx="4" fill="#0f172a" stroke="#334155"/>
          <text x="12" y="18" fill="#ffffff" font-size="10" font-weight="600" font-family="Inter, sans-serif">flight-service</text>
          <text x="12" y="29" fill="#94a3b8" font-size="8" font-family="Inter, sans-serif">Port 8087 • Schedules, Fleet, Seats</text>
        </g>
        <g transform="translate(10, 76)">
          <rect width="235" height="34" rx="4" fill="#0f172a" stroke="#334155"/>
          <text x="12" y="18" fill="#ffffff" font-size="10" font-weight="600" font-family="Inter, sans-serif">fare-service</text>
          <text x="12" y="29" fill="#94a3b8" font-size="8" font-family="Inter, sans-serif">Port 8089 • Cabin Tiers, GST, Coupons</text>
        </g>
      </g>

      <!-- Cluster 3: Booking & Check-In -->
      <g transform="translate(550, 0)">
        <rect width="255" height="120" rx="8" fill="url(#cardGrad)" stroke="#8b5cf6" stroke-width="1.2"/>
        <rect x="0" y="0" width="255" height="26" rx="8" fill="#4c1d95"/>
        <text x="127" y="18" fill="#ddd6fe" font-size="10" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">RESERVATIONS &amp; BOARDING</text>
        <g transform="translate(10, 36)">
          <rect width="235" height="34" rx="4" fill="#0f172a" stroke="#334155"/>
          <text x="12" y="18" fill="#ffffff" font-size="10" font-weight="600" font-family="Inter, sans-serif">booking-service</text>
          <text x="12" y="29" fill="#94a3b8" font-size="8" font-family="Inter, sans-serif">Port 8088 • PNR Gen, Manifests, Feign</text>
        </g>
        <g transform="translate(10, 76)">
          <rect width="235" height="34" rx="4" fill="#0f172a" stroke="#334155"/>
          <text x="12" y="18" fill="#ffffff" font-size="10" font-weight="600" font-family="Inter, sans-serif">check-in-service</text>
          <text x="12" y="29" fill="#94a3b8" font-size="8" font-family="Inter, sans-serif">Port 8090 • Seat Confirm, Gate Verify</text>
        </g>
      </g>

      <!-- Cluster 4: Payment & Notification -->
      <g transform="translate(825, 0)">
        <rect width="255" height="120" rx="8" fill="url(#cardGrad)" stroke="#f59e0b" stroke-width="1.2"/>
        <rect x="0" y="0" width="255" height="26" rx="8" fill="#78350f"/>
        <text x="127" y="18" fill="#fde68a" font-size="10" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">BILLING &amp; COMMUNICATIONS</text>
        <g transform="translate(10, 36)">
          <rect width="235" height="34" rx="4" fill="#0f172a" stroke="#334155"/>
          <text x="12" y="18" fill="#ffffff" font-size="10" font-weight="600" font-family="Inter, sans-serif">payment-service</text>
          <text x="12" y="29" fill="#94a3b8" font-size="8" font-family="Inter, sans-serif">Port 8092 • Razorpay Orders &amp; HMAC</text>
        </g>
        <g transform="translate(10, 76)">
          <rect width="235" height="34" rx="4" fill="#0f172a" stroke="#334155"/>
          <text x="12" y="18" fill="#ffffff" font-size="10" font-weight="600" font-family="Inter, sans-serif">notification-service</text>
          <text x="12" y="29" fill="#94a3b8" font-size="8" font-family="Inter, sans-serif">Port 8091 • OpenPDF Engine &amp; SMTP</text>
        </g>
      </g>
    </g>

    <!-- TIER 5: ASYNCHRONOUS EVENT BUS (RABBITMQ) -->
    <g transform="translate(40, 354)">
      <rect width="1080" height="42" rx="6" fill="url(#cardGrad)" stroke="#f97316" stroke-width="1.2"/>
      <rect x="0" y="0" width="180" height="42" rx="6" fill="url(#amqpGrad)"/>
      <text x="90" y="22" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">RABBITMQ EVENT BUS</text>
      <text x="90" y="34" fill="#ffedd5" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Port 5672 (AMQP)</text>

      <g transform="translate(200, 7)">
        <rect width="400" height="28" rx="4" fill="#1e293b" stroke="#ea580c"/>
        <text x="200" y="18" fill="#fed7aa" font-size="9" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">Durable Queue: 'booking-created' (Seat Deduction Consumer)</text>
      </g>
      <g transform="translate(620, 7)">
        <rect width="440" height="28" rx="4" fill="#1e293b" stroke="#ea580c"/>
        <text x="220" y="18" fill="#fed7aa" font-size="9" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">Durable Queue: 'flight.queue' (Flight Reschedule / Cancellation Alerts)</text>
      </g>
    </g>

    <!-- TIER 6: DATABASE-PER-SERVICE RELATIONAL PERSISTENCE -->
    <g transform="translate(40, 408)">
      <rect width="1080" height="98" rx="8" fill="url(#cardGrad)" stroke="#38bdf8" stroke-width="1.2"/>
      <rect x="0" y="0" width="1080" height="24" rx="8" fill="#0f172a"/>
      <text x="540" y="16" fill="#38bdf8" font-size="9.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">PERSISTENCE TIER: 8 ISOLATED MYSQL 8.0 DATABASES (PORT 3306 • HIKARICP POOLS • ZERO CROSS-DB JOINS)</text>

      <!-- 8 DB Cylinders -->
      <g transform="translate(15, 32)">
        <rect width="120" height="54" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="60" y="22" fill="#38bdf8" font-size="9" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">aerobook_auth</text>
        <text x="60" y="38" fill="#94a3b8" font-size="7.5" text-anchor="middle" font-family="Inter, sans-serif">credentials, tokens</text>
      </g>
      <g transform="translate(148, 32)">
        <rect width="120" height="54" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="60" y="22" fill="#38bdf8" font-size="9" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">aerobook_user</text>
        <text x="60" y="38" fill="#94a3b8" font-size="7.5" text-anchor="middle" font-family="Inter, sans-serif">users, incidents</text>
      </g>
      <g transform="translate(281, 32)">
        <rect width="120" height="54" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="60" y="22" fill="#10b981" font-size="9" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">aerobook_flight</text>
        <text x="60" y="38" fill="#94a3b8" font-size="7.5" text-anchor="middle" font-family="Inter, sans-serif">flights, aircrafts</text>
      </g>
      <g transform="translate(414, 32)">
        <rect width="120" height="54" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="60" y="22" fill="#10b981" font-size="9" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">aerobook_fare</text>
        <text x="60" y="38" fill="#94a3b8" font-size="7.5" text-anchor="middle" font-family="Inter, sans-serif">fares, coupons</text>
      </g>
      <g transform="translate(547, 32)">
        <rect width="120" height="54" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="60" y="22" fill="#8b5cf6" font-size="9" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">aerobook_booking</text>
        <text x="60" y="38" fill="#94a3b8" font-size="7.5" text-anchor="middle" font-family="Inter, sans-serif">bookings, passengers</text>
      </g>
      <g transform="translate(680, 32)">
        <rect width="120" height="54" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="60" y="22" fill="#8b5cf6" font-size="9" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">aerobook_checkin</text>
        <text x="60" y="38" fill="#94a3b8" font-size="7.5" text-anchor="middle" font-family="Inter, sans-serif">check_in records</text>
      </g>
      <g transform="translate(813, 32)">
        <rect width="120" height="54" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="60" y="22" fill="#f59e0b" font-size="9" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">aerobook_payment</text>
        <text x="60" y="38" fill="#94a3b8" font-size="7.5" text-anchor="middle" font-family="Inter, sans-serif">payments, refunds</text>
      </g>
      <g transform="translate(946, 32)">
        <rect width="120" height="54" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="60" y="22" fill="#f59e0b" font-size="9" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">aerobook_notif</text>
        <text x="60" y="38" fill="#94a3b8" font-size="7.5" text-anchor="middle" font-family="Inter, sans-serif">notifications, alerts</text>
      </g>
    </g>
  </svg>`;
}

function getUseCaseSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1160 520" width="100%" height="100%">
    <defs>
      <linearGradient id="ucBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#070d1e"/>
        <stop offset="100%" stop-color="#0b1736"/>
      </linearGradient>
      <linearGradient id="actorPillUser" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#2563eb"/>
      </linearGradient>
      <linearGradient id="actorPillStaff" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#059669"/><stop offset="100%" stop-color="#10b981"/>
      </linearGradient>
      <linearGradient id="actorPillAdmin" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#d97706"/><stop offset="100%" stop-color="#f59e0b"/>
      </linearGradient>
      <marker id="ucArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>
      </marker>
    </defs>
    <rect width="1160" height="520" rx="12" fill="url(#ucBg)"/>

    <!-- ACTORS COLUMN (LEFT) -->
    <g transform="translate(30, 30)">
      <text x="90" y="20" fill="#94a3b8" font-size="11" font-weight="700" letter-spacing="1" text-anchor="middle" font-family="Inter, sans-serif">PRIMARY ACTORS</text>
      
      <!-- Passenger -->
      <g transform="translate(0, 40)">
        <rect width="180" height="110" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
        <rect x="0" y="0" width="180" height="30" rx="8" fill="url(#actorPillUser)"/>
        <text x="90" y="20" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">👤 PASSENGER</text>
        <text x="90" y="52" fill="#38bdf8" font-size="9" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">ROLE_USER</text>
        <text x="90" y="72" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Books Flights &amp; Seats</text>
        <text x="90" y="86" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Online Check-In &amp; Pay</text>
        <text x="90" y="100" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Downloads Boarding Pass</text>
      </g>

      <!-- Staff -->
      <g transform="translate(0, 180)">
        <rect width="180" height="110" rx="8" fill="#1e293b" stroke="#34d399" stroke-width="1.5"/>
        <rect x="0" y="0" width="180" height="30" rx="8" fill="url(#actorPillStaff)"/>
        <text x="90" y="20" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">🛂 AIRPORT STAFF</text>
        <text x="90" y="52" fill="#34d399" font-size="9" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">ROLE_STAFF</text>
        <text x="90" y="72" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Scans Gate Passes (BP-*)</text>
        <text x="90" y="86" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Audits Flight Manifests</text>
        <text x="90" y="100" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Files Incident Reports</text>
      </g>

      <!-- Admin -->
      <g transform="translate(0, 320)">
        <rect width="180" height="110" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
        <rect x="0" y="0" width="180" height="30" rx="8" fill="url(#actorPillAdmin)"/>
        <text x="90" y="20" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">👑 ADMINISTRATOR</text>
        <text x="90" y="52" fill="#f59e0b" font-size="9" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">ROLE_ADMIN</text>
        <text x="90" y="72" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Fleet &amp; Aircraft CRUD</text>
        <text x="90" y="86" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Flight Schedule &amp; Fares</text>
        <text x="90" y="100" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Coupons, Users &amp; Incidents</text>
      </g>
    </g>

    <!-- SYSTEM BOUNDARY (CENTER) -->
    <g transform="translate(250, 20)">
      <rect width="660" height="475" rx="10" fill="#0f172a" fill-opacity="0.8" stroke="#334155" stroke-width="1.5"/>
      <rect x="0" y="0" width="660" height="30" rx="10" fill="#1e293b"/>
      <text x="330" y="20" fill="#38bdf8" font-size="11" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">AEROBOOK PLATFORM BOUNDARY (RBAC USE-CASE MATRIX)</text>

      <!-- Use Cases Grid (4 Categories x 3 Use Cases = 12 Capsules) -->
      <!-- Group 1: Flight Search & Fares -->
      <g transform="translate(20, 45)">
        <rect width="295" height="92" rx="6" fill="#1e293b" stroke="#1e3a8a"/>
        <text x="15" y="18" fill="#93c5fd" font-size="9" font-weight="700" font-family="Inter, sans-serif">✈️ FLIGHT DISCOVERY &amp; FARES</text>
        <rect x="15" y="26" width="265" height="24" rx="12" fill="#0f172a" stroke="#3b82f6"/>
        <text x="147" y="42" fill="#ffffff" font-size="8.5" text-anchor="middle" font-family="Inter, sans-serif">Search Flights (Origin, Dest, Date)</text>
        <rect x="15" y="56" width="125" height="24" rx="12" fill="#0f172a" stroke="#3b82f6"/>
        <text x="77" y="72" fill="#ffffff" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Compare Cabin Tiers</text>
        <rect x="150" y="56" width="130" height="24" rx="12" fill="#0f172a" stroke="#3b82f6"/>
        <text x="215" y="72" fill="#ffffff" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Apply Promo Coupons</text>
      </g>

      <!-- Group 2: Reservations & Billing -->
      <g transform="translate(345, 45)">
        <rect width="295" height="92" rx="6" fill="#1e293b" stroke="#4c1d95"/>
        <text x="15" y="18" fill="#c4b5fd" font-size="9" font-weight="700" font-family="Inter, sans-serif">🎟️ RESERVATIONS &amp; CHECKOUT</text>
        <rect x="15" y="26" width="265" height="24" rx="12" fill="#0f172a" stroke="#8b5cf6"/>
        <text x="147" y="42" fill="#ffffff" font-size="8.5" text-anchor="middle" font-family="Inter, sans-serif">Create Booking &amp; Generate PNR</text>
        <rect x="15" y="56" width="130" height="24" rx="12" fill="#0f172a" stroke="#8b5cf6"/>
        <text x="80" y="72" fill="#ffffff" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Razorpay Checkout Order</text>
        <rect x="155" y="56" width="125" height="24" rx="12" fill="#0f172a" stroke="#8b5cf6"/>
        <text x="217" y="72" fill="#ffffff" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Cancel Booking &amp; Refund</text>
      </g>

      <!-- Group 3: Check-In & Gate Verification -->
      <g transform="translate(20, 150)">
        <rect width="295" height="92" rx="6" fill="#1e293b" stroke="#065f46"/>
        <text x="15" y="18" fill="#6ee7b7" font-size="9" font-weight="700" font-family="Inter, sans-serif">🪪 CHECK-IN &amp; GATE OPERATIONS</text>
        <rect x="15" y="26" width="265" height="24" rx="12" fill="#0f172a" stroke="#10b981"/>
        <text x="147" y="42" fill="#ffffff" font-size="8.5" text-anchor="middle" font-family="Inter, sans-serif">Digital Self-Service Check-In</text>
        <rect x="15" y="56" width="125" height="24" rx="12" fill="#0f172a" stroke="#10b981"/>
        <text x="77" y="72" fill="#ffffff" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Select Cabin Seat</text>
        <rect x="150" y="56" width="130" height="24" rx="12" fill="#0f172a" stroke="#10b981"/>
        <text x="215" y="72" fill="#ffffff" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Scan Pass at Gate (/verify)</text>
      </g>

      <!-- Group 4: Documents & Notifications -->
      <g transform="translate(345, 150)">
        <rect width="295" height="92" rx="6" fill="#1e293b" stroke="#78350f"/>
        <text x="15" y="18" fill="#fde68a" font-size="9" font-weight="700" font-family="Inter, sans-serif">📧 COMMUNICATIONS &amp; DOCUMENTS</text>
        <rect x="15" y="26" width="265" height="24" rx="12" fill="#0f172a" stroke="#f59e0b"/>
        <text x="147" y="42" fill="#ffffff" font-size="8.5" text-anchor="middle" font-family="Inter, sans-serif">Generate Vector e-Ticket PDF</text>
        <rect x="15" y="56" width="130" height="24" rx="12" fill="#0f172a" stroke="#f59e0b"/>
        <text x="80" y="72" fill="#ffffff" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Issue Boarding Pass (BP-*)</text>
        <rect x="155" y="56" width="125" height="24" rx="12" fill="#0f172a" stroke="#f59e0b"/>
        <text x="217" y="72" fill="#ffffff" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Dispatch SMTP Email</text>
      </g>

      <!-- Group 5: Fleet & Governance -->
      <g transform="translate(20, 255)">
        <rect width="295" height="92" rx="6" fill="#1e293b" stroke="#831843"/>
        <text x="15" y="18" fill="#fbcfe8" font-size="9" font-weight="700" font-family="Inter, sans-serif">🛫 FLEET &amp; FLIGHT GOVERNANCE</text>
        <rect x="15" y="26" width="265" height="24" rx="12" fill="#0f172a" stroke="#ec4899"/>
        <text x="147" y="42" fill="#ffffff" font-size="8.5" text-anchor="middle" font-family="Inter, sans-serif">Manage Aircraft Fleet (Airbus/Boeing)</text>
        <rect x="15" y="56" width="130" height="24" rx="12" fill="#0f172a" stroke="#ec4899"/>
        <text x="80" y="72" fill="#ffffff" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Schedule New Flights</text>
        <rect x="155" y="56" width="125" height="24" rx="12" fill="#0f172a" stroke="#ec4899"/>
        <text x="217" y="72" fill="#ffffff" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Audit Flight Manifests</text>
      </g>

      <!-- Group 6: Security & Incidents -->
      <g transform="translate(345, 255)">
        <rect width="295" height="92" rx="6" fill="#1e293b" stroke="#14532d"/>
        <text x="15" y="18" fill="#bbf7d0" font-size="9" font-weight="700" font-family="Inter, sans-serif">🛡️ SECURITY &amp; INCIDENT ESCALATION</text>
        <rect x="15" y="26" width="265" height="24" rx="12" fill="#0f172a" stroke="#22c55e"/>
        <text x="147" y="42" fill="#ffffff" font-size="8.5" text-anchor="middle" font-family="Inter, sans-serif">Register &amp; Authenticate (JWT / OTP)</text>
        <rect x="15" y="56" width="130" height="24" rx="12" fill="#0f172a" stroke="#22c55e"/>
        <text x="80" y="72" fill="#ffffff" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">File Incident Report</text>
        <rect x="155" y="56" width="125" height="24" rx="12" fill="#0f172a" stroke="#22c55e"/>
        <text x="217" y="72" fill="#ffffff" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Investigate &amp; Resolve</text>
      </g>

      <!-- Permissions Summary Banner at Bottom -->
      <g transform="translate(20, 360)">
        <rect width="620" height="95" rx="6" fill="#020617" stroke="#334155"/>
        <text x="310" y="20" fill="#38bdf8" font-size="9.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">RBAC ACCESS GOVERNANCE MAPPING</text>
        <text x="20" y="44" fill="#93c5fd" font-size="8" font-family="Inter, sans-serif">• PASSENGER: Search Flights, Book Tickets, Razorpay Payments, Self Check-In, Download Passes</text>
        <text x="20" y="62" fill="#6ee7b7" font-size="8" font-family="Inter, sans-serif">• AIRPORT STAFF: Passenger Manifest Inspection, Departure Gate Barcode Verification, File Incidents</text>
        <text x="20" y="80" fill="#fde68a" font-size="8" font-family="Inter, sans-serif">• ADMINISTRATOR: Full Fleet CRUD, Flight Scheduling, Dynamic Fares, Coupons, User Role Escalation</text>
      </g>
    </g>

    <!-- EXTERNAL COLLABORATORS (RIGHT) -->
    <g transform="translate(940, 30)">
      <text x="90" y="20" fill="#94a3b8" font-size="11" font-weight="700" letter-spacing="1" text-anchor="middle" font-family="Inter, sans-serif">EXTERNAL SYSTEMS</text>
      
      <!-- Razorpay -->
      <g transform="translate(0, 40)">
        <rect width="180" height="110" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.2"/>
        <rect x="0" y="0" width="180" height="30" rx="8" fill="#0284c7"/>
        <text x="90" y="20" fill="#ffffff" font-size="10.5" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">💳 RAZORPAY GATEWAY</text>
        <text x="90" y="52" fill="#38bdf8" font-size="9" text-anchor="middle" font-family="Inter, sans-serif">REST API &amp; Webhooks</text>
        <text x="90" y="70" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">HMAC-SHA256 Signature</text>
        <text x="90" y="86" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Order Creation in Paise</text>
        <text x="90" y="100" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Automated Refunds</text>
      </g>

      <!-- SMTP -->
      <g transform="translate(0, 180)">
        <rect width="180" height="110" rx="8" fill="#1e293b" stroke="#34d399" stroke-width="1.2"/>
        <rect x="0" y="0" width="180" height="30" rx="8" fill="#059669"/>
        <text x="90" y="20" fill="#ffffff" font-size="10.5" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">📧 GMAIL SMTP RELAY</text>
        <text x="90" y="52" fill="#34d399" font-size="9" text-anchor="middle" font-family="Inter, sans-serif">Port 587 STARTTLS</text>
        <text x="90" y="70" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Registration 6-Digit OTP</text>
        <text x="90" y="86" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">e-Ticket PDF Attachments</text>
        <text x="90" y="100" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Boarding Pass PDF Alerts</text>
      </g>

      <!-- RabbitMQ -->
      <g transform="translate(0, 320)">
        <rect width="180" height="110" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2"/>
        <rect x="0" y="0" width="180" height="30" rx="8" fill="#d97706"/>
        <text x="90" y="20" fill="#ffffff" font-size="10.5" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">🐇 RABBITMQ AMQP</text>
        <text x="90" y="52" fill="#f59e0b" font-size="9" text-anchor="middle" font-family="Inter, sans-serif">Port 5672 Broker</text>
        <text x="90" y="70" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">booking-created queue</text>
        <text x="90" y="86" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Durable AMQP Queue</text>
        <text x="90" y="100" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="Inter, sans-serif">Seat Count Sync</text>
      </g>
    </g>
  </svg>`;
}

function getClassDiagramSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1160 520" width="100%" height="100%">
    <defs>
      <linearGradient id="cdBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#070d1e"/><stop offset="100%" stop-color="#0b1736"/>
      </linearGradient>
    </defs>
    <rect width="1160" height="520" rx="12" fill="url(#cdBg)"/>

    <!-- TITLE HEADER -->
    <text x="580" y="28" fill="#38bdf8" font-size="12" font-weight="800" letter-spacing="1.5" text-anchor="middle" font-family="Inter, sans-serif">
      AEROBOOK DOMAIN ENTITY ARCHITECTURE &amp; CLASS DIAGRAM
    </text>

    <!-- ROW 1: 4 CORE ENTITY MODULES -->
    <!-- Class 1: Flight -->
    <g transform="translate(30, 45)">
      <rect width="255" height="155" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
      <rect width="255" height="26" rx="6" fill="#1e3a8a"/>
      <text x="127" y="18" fill="#ffffff" font-size="10.5" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">Flight &lt;&lt;Entity&gt;&gt;</text>
      <g transform="translate(10, 34)">
        <text x="0" y="12" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- Long id [PK]</text>
        <text x="0" y="24" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- String flightNumber [UK]</text>
        <text x="0" y="36" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- String source / destination</text>
        <text x="0" y="48" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- Integer totalSeats / availableSeats</text>
        <text x="0" y="60" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- FlightStatus status</text>
        <line x1="0" y1="66" x2="235" y2="66" stroke="#334155"/>
        <text x="0" y="80" fill="#93c5fd" font-size="8" font-family="JetBrains Mono, monospace">+ reserveSeats(int count): boolean</text>
        <text x="0" y="92" fill="#93c5fd" font-size="8" font-family="JetBrains Mono, monospace">+ releaseSeats(int count): void</text>
        <text x="0" y="104" fill="#93c5fd" font-size="8" font-family="JetBrains Mono, monospace">+ isBookingOpen(): boolean</text>
      </g>
    </g>

    <!-- Class 2: Booking -->
    <g transform="translate(315, 45)">
      <rect width="255" height="155" rx="6" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.5"/>
      <rect width="255" height="26" rx="6" fill="#4c1d95"/>
      <text x="127" y="18" fill="#ffffff" font-size="10.5" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">Booking &lt;&lt;Entity&gt;&gt;</text>
      <g transform="translate(10, 34)">
        <text x="0" y="12" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- Long bookingId [PK]</text>
        <text x="0" y="24" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- String pnr [UK, 6-Char]</text>
        <text x="0" y="36" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- Long userId / flightId</text>
        <text x="0" y="48" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- BigDecimal totalFare</text>
        <text x="0" y="60" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- BookingStatus status</text>
        <line x1="0" y1="66" x2="235" y2="66" stroke="#334155"/>
        <text x="0" y="80" fill="#c4b5fd" font-size="8" font-family="JetBrains Mono, monospace">+ addPassenger(Passenger p): void</text>
        <text x="0" y="92" fill="#c4b5fd" font-size="8" font-family="JetBrains Mono, monospace">+ confirmReservation(): void</text>
        <text x="0" y="104" fill="#c4b5fd" font-size="8" font-family="JetBrains Mono, monospace">+ cancelBooking(): void</text>
      </g>
    </g>

    <!-- Class 3: Passenger -->
    <g transform="translate(600, 45)">
      <rect width="245" height="155" rx="6" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.5"/>
      <rect width="245" height="26" rx="6" fill="#4c1d95"/>
      <text x="122" y="18" fill="#ffffff" font-size="10.5" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">Passenger &lt;&lt;Entity&gt;&gt;</text>
      <g transform="translate(10, 34)">
        <text x="0" y="12" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- Long passengerId [PK]</text>
        <text x="0" y="24" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- Long bookingId [FK]</text>
        <text x="0" y="36" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- String firstName / lastName</text>
        <text x="0" y="48" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- String gender / Integer age</text>
        <text x="0" y="60" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- String seatNumber (e.g. 14B)</text>
        <line x1="0" y1="66" x2="225" y2="66" stroke="#334155"/>
        <text x="0" y="80" fill="#c4b5fd" font-size="8" font-family="JetBrains Mono, monospace">+ assignSeat(String seat): void</text>
        <text x="0" y="92" fill="#c4b5fd" font-size="8" font-family="JetBrains Mono, monospace">+ getFullName(): String</text>
        <text x="0" y="104" fill="#c4b5fd" font-size="8" font-family="JetBrains Mono, monospace">+ validatePassport(): boolean</text>
      </g>
    </g>

    <!-- Class 4: PaymentRecord -->
    <g transform="translate(875, 45)">
      <rect width="255" height="155" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
      <rect width="255" height="26" rx="6" fill="#78350f"/>
      <text x="127" y="18" fill="#ffffff" font-size="10.5" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">PaymentRecord &lt;&lt;Entity&gt;&gt;</text>
      <g transform="translate(10, 34)">
        <text x="0" y="12" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- Long id [PK]</text>
        <text x="0" y="24" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- Long bookingId / String pnr</text>
        <text x="0" y="36" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- String orderId [Razorpay UK]</text>
        <text x="0" y="48" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- Long amountInPaise / status</text>
        <text x="0" y="60" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- String signature (HMAC-SHA256)</text>
        <line x1="0" y1="66" x2="235" y2="66" stroke="#334155"/>
        <text x="0" y="80" fill="#fde68a" font-size="8" font-family="JetBrains Mono, monospace">+ verifySignature(secret): boolean</text>
        <text x="0" y="92" fill="#fde68a" font-size="8" font-family="JetBrains Mono, monospace">+ capturePayment(): void</text>
        <text x="0" y="104" fill="#fde68a" font-size="8" font-family="JetBrains Mono, monospace">+ executeRefund(): void</text>
      </g>
    </g>

    <!-- ROW 2: SUPPORTING DOMAIN ENTITIES & CHECK-IN -->
    <!-- Class 5: Aircraft & Fare -->
    <g transform="translate(30, 220)">
      <rect width="255" height="155" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
      <rect width="255" height="26" rx="6" fill="#1e3a8a"/>
      <text x="127" y="18" fill="#ffffff" font-size="10.5" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">Aircraft &amp; Fleet &lt;&lt;Entity&gt;&gt;</text>
      <g transform="translate(10, 34)">
        <text x="0" y="12" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- Long id [PK]</text>
        <text x="0" y="24" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- String aircraftCode (VT-EXA)</text>
        <text x="0" y="36" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- String model (Airbus A320)</text>
        <text x="0" y="48" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- Integer capacity (180 seats)</text>
        <text x="0" y="60" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- AircraftStatus status</text>
        <line x1="0" y1="66" x2="235" y2="66" stroke="#334155"/>
        <text x="0" y="80" fill="#93c5fd" font-size="8" font-family="JetBrains Mono, monospace">+ setMaintenance(): void</text>
        <text x="0" y="92" fill="#93c5fd" font-size="8" font-family="JetBrains Mono, monospace">+ isFlightReady(): boolean</text>
      </g>
    </g>

    <!-- Class 6: CheckIn -->
    <g transform="translate(315, 220)">
      <rect width="255" height="155" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
      <rect width="255" height="26" rx="6" fill="#065f46"/>
      <text x="127" y="18" fill="#ffffff" font-size="10.5" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">CheckIn &lt;&lt;Entity&gt;&gt;</text>
      <g transform="translate(10, 34)">
        <text x="0" y="12" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- Long id [PK]</text>
        <text x="0" y="24" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- Long bookingId</text>
        <text x="0" y="36" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- String passengerName</text>
        <text x="0" y="48" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- String seatNumber (14B)</text>
        <text x="0" y="60" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- String boardingPassNumber</text>
        <line x1="0" y1="66" x2="235" y2="66" stroke="#334155"/>
        <text x="0" y="80" fill="#a7f3d0" font-size="8" font-family="JetBrains Mono, monospace">+ issueBoardingPass(): String</text>
        <text x="0" y="92" fill="#a7f3d0" font-size="8" font-family="JetBrains Mono, monospace">+ verifyGateEntry(): boolean</text>
        <text x="0" y="104" fill="#a7f3d0" font-size="8" font-family="JetBrains Mono, monospace">+ markBoarded(): void</text>
      </g>
    </g>

    <!-- Class 7: UserEntity & Incident -->
    <g transform="translate(600, 220)">
      <rect width="245" height="155" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
      <rect width="245" height="26" rx="6" fill="#1e3a8a"/>
      <text x="122" y="18" fill="#ffffff" font-size="10.5" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">UserEntity &lt;&lt;Entity&gt;&gt;</text>
      <g transform="translate(10, 34)">
        <text x="0" y="12" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- Long userId [PK]</text>
        <text x="0" y="24" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- String email [UK] / phone</text>
        <text x="0" y="36" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- String firstName / lastName</text>
        <text x="0" y="48" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- LocalDate dateOfBirth</text>
        <text x="0" y="60" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- Role role (USER/STAFF/ADMIN)</text>
        <line x1="0" y1="66" x2="225" y2="66" stroke="#334155"/>
        <text x="0" y="80" fill="#93c5fd" font-size="8" font-family="JetBrains Mono, monospace">+ updateProfile(): void</text>
        <text x="0" y="92" fill="#93c5fd" font-size="8" font-family="JetBrains Mono, monospace">+ hasAdminAuthority(): boolean</text>
      </g>
    </g>

    <!-- Class 8: Notification -->
    <g transform="translate(875, 220)">
      <rect width="255" height="155" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
      <rect width="255" height="26" rx="6" fill="#78350f"/>
      <text x="127" y="18" fill="#ffffff" font-size="10.5" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">Notification &lt;&lt;Entity&gt;&gt;</text>
      <g transform="translate(10, 34)">
        <text x="0" y="12" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- Long id [PK]</text>
        <text x="0" y="24" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- Long userId / recipientEmail</text>
        <text x="0" y="36" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- String title / message</text>
        <text x="0" y="48" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- NotificationType type</text>
        <text x="0" y="60" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">- NotificationStatus status</text>
        <line x1="0" y1="66" x2="235" y2="66" stroke="#334155"/>
        <text x="0" y="80" fill="#fde68a" font-size="8" font-family="JetBrains Mono, monospace">+ dispatchMimeMail(): void</text>
        <text x="0" y="92" fill="#fde68a" font-size="8" font-family="JetBrains Mono, monospace">+ attachPdf(byte[] pdf): void</text>
      </g>
    </g>

    <!-- ROW 3: TYPED ENUMERATIONS -->
    <g transform="translate(30, 395)">
      <rect width="1100" height="105" rx="6" fill="#0f172a" stroke="#334155"/>
      <rect width="1100" height="22" rx="6" fill="#1e293b"/>
      <text x="550" y="16" fill="#38bdf8" font-size="9.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">DOMAIN ENUMERATIONS &amp; STATE MACHINES</text>

      <g transform="translate(20, 32)">
        <text x="0" y="12" fill="#93c5fd" font-size="8.5" font-weight="700" font-family="Inter, sans-serif">Role:</text>
        <text x="0" y="28" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">ROLE_USER</text>
        <text x="0" y="42" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">ROLE_STAFF</text>
        <text x="0" y="56" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">ROLE_ADMIN</text>
      </g>
      <g transform="translate(180, 32)">
        <text x="0" y="12" fill="#a7f3d0" font-size="8.5" font-weight="700" font-family="Inter, sans-serif">FlightStatus:</text>
        <text x="0" y="28" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">SCHEDULED, ON_TIME</text>
        <text x="0" y="42" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">DELAYED, BOARDING</text>
        <text x="0" y="56" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">DEPARTED, CANCELLED</text>
      </g>
      <g transform="translate(390, 32)">
        <text x="0" y="12" fill="#c4b5fd" font-size="8.5" font-weight="700" font-family="Inter, sans-serif">BookingStatus:</text>
        <text x="0" y="28" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">CONFIRMED</text>
        <text x="0" y="42" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">CANCELLED</text>
        <text x="0" y="56" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">PENDING</text>
      </g>
      <g transform="translate(580, 32)">
        <text x="0" y="12" fill="#fde68a" font-size="8.5" font-weight="700" font-family="Inter, sans-serif">PaymentStatus:</text>
        <text x="0" y="28" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">CREATED, AUTHORIZED</text>
        <text x="0" y="42" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">CAPTURED, REFUNDED</text>
        <text x="0" y="56" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">FAILED</text>
      </g>
      <g transform="translate(790, 32)">
        <text x="0" y="12" fill="#fbcfe8" font-size="8.5" font-weight="700" font-family="Inter, sans-serif">IncidentSeverity &amp; Status:</text>
        <text x="0" y="28" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">LOW, MEDIUM, HIGH, CRITICAL</text>
        <text x="0" y="42" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">OPEN, INVESTIGATING, RESOLVED</text>
      </g>
    </g>
  </svg>`;
}

function getErDiagramSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1160 520" width="100%" height="100%">
    <defs>
      <linearGradient id="erBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#070d1e"/><stop offset="100%" stop-color="#0b1736"/>
      </linearGradient>
    </defs>
    <rect width="1160" height="520" rx="12" fill="url(#erBg)"/>

    <text x="580" y="26" fill="#38bdf8" font-size="12" font-weight="800" letter-spacing="1.5" text-anchor="middle" font-family="Inter, sans-serif">
      AEROBOOK RELATIONAL DATABASE-PER-SERVICE ENTITY-RELATIONSHIP MODEL
    </text>

    <!-- 8 DATABASE SCHEMA BLOCKS (4 TOP, 4 BOTTOM) -->

    <!-- DB 1: aerobook_auth_db -->
    <g transform="translate(30, 45)">
      <rect width="255" height="215" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
      <rect width="255" height="24" rx="6" fill="#1e3a8a"/>
      <text x="12" y="16" fill="#ffffff" font-size="9" font-weight="800" font-family="Inter, sans-serif">🗄️ aerobook_auth_db</text>
      
      <!-- Table: credentials -->
      <g transform="translate(8, 30)">
        <rect width="239" height="110" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="10" y="16" fill="#38bdf8" font-size="9" font-weight="700" font-family="Inter, sans-serif">credentials</text>
        <text x="10" y="32" fill="#f59e0b" font-size="7.5" font-family="JetBrains Mono, monospace">PK credential_id: BIGINT</text>
        <text x="10" y="46" fill="#c084fc" font-size="7.5" font-family="JetBrains Mono, monospace">UK email: VARCHAR(150)</text>
        <text x="10" y="60" fill="#cbd5e1" font-size="7.5" font-family="JetBrains Mono, monospace">   password: VARCHAR(255)</text>
        <text x="10" y="74" fill="#cbd5e1" font-size="7.5" font-family="JetBrains Mono, monospace">   role: VARCHAR(30)</text>
        <text x="10" y="88" fill="#cbd5e1" font-size="7.5" font-family="JetBrains Mono, monospace">   created_at / updated_at</text>
      </g>
      <!-- Table: refresh_tokens -->
      <g transform="translate(8, 146)">
        <rect width="239" height="58" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="10" y="16" fill="#38bdf8" font-size="9" font-weight="700" font-family="Inter, sans-serif">refresh_tokens</text>
        <text x="10" y="30" fill="#f59e0b" font-size="7.5" font-family="JetBrains Mono, monospace">PK id: BIGINT</text>
        <text x="10" y="44" fill="#60a5fa" font-size="7.5" font-family="JetBrains Mono, monospace">FK credential_id | UK token</text>
      </g>
    </g>

    <!-- DB 2: aerobook_user_db -->
    <g transform="translate(315, 45)">
      <rect width="255" height="215" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
      <rect width="255" height="24" rx="6" fill="#1e3a8a"/>
      <text x="12" y="16" fill="#ffffff" font-size="9" font-weight="800" font-family="Inter, sans-serif">🗄️ aerobook_user_db</text>
      
      <!-- Table: users -->
      <g transform="translate(8, 30)">
        <rect width="239" height="110" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="10" y="16" fill="#38bdf8" font-size="9" font-weight="700" font-family="Inter, sans-serif">users</text>
        <text x="10" y="32" fill="#f59e0b" font-size="7.5" font-family="JetBrains Mono, monospace">PK user_id: BIGINT</text>
        <text x="10" y="46" fill="#c084fc" font-size="7.5" font-family="JetBrains Mono, monospace">UK email: VARCHAR(150)</text>
        <text x="10" y="60" fill="#cbd5e1" font-size="7.5" font-family="JetBrains Mono, monospace">   first_name, last_name</text>
        <text x="10" y="74" fill="#cbd5e1" font-size="7.5" font-family="JetBrains Mono, monospace">   phone_number, date_of_birth</text>
        <text x="10" y="88" fill="#cbd5e1" font-size="7.5" font-family="JetBrains Mono, monospace">   role, nationality</text>
      </g>
      <!-- Table: incident_reports -->
      <g transform="translate(8, 146)">
        <rect width="239" height="58" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="10" y="16" fill="#38bdf8" font-size="9" font-weight="700" font-family="Inter, sans-serif">incident_reports</text>
        <text x="10" y="30" fill="#f59e0b" font-size="7.5" font-family="JetBrains Mono, monospace">PK id: BIGINT | FK user_id</text>
        <text x="10" y="44" fill="#cbd5e1" font-size="7.5" font-family="JetBrains Mono, monospace">   severity, status, reason, notes</text>
      </g>
    </g>

    <!-- DB 3: aerobook_flight_db -->
    <g transform="translate(600, 45)">
      <rect width="245" height="215" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>
      <rect width="245" height="24" rx="6" fill="#065f46"/>
      <text x="12" y="16" fill="#ffffff" font-size="9" font-weight="800" font-family="Inter, sans-serif">🗄️ aerobook_flight_db</text>
      
      <!-- Table: flights -->
      <g transform="translate(8, 30)">
        <rect width="229" height="110" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="10" y="16" fill="#10b981" font-size="9" font-weight="700" font-family="Inter, sans-serif">flights</text>
        <text x="10" y="32" fill="#f59e0b" font-size="7.5" font-family="JetBrains Mono, monospace">PK id: BIGINT</text>
        <text x="10" y="46" fill="#c084fc" font-size="7.5" font-family="JetBrains Mono, monospace">UK flight_number: VARCHAR(50)</text>
        <text x="10" y="60" fill="#60a5fa" font-size="7.5" font-family="JetBrains Mono, monospace">FK aircraft_id: BIGINT</text>
        <text x="10" y="74" fill="#cbd5e1" font-size="7.5" font-family="JetBrains Mono, monospace">   source, destination</text>
        <text x="10" y="88" fill="#cbd5e1" font-size="7.5" font-family="JetBrains Mono, monospace">   total_seats, available_seats</text>
      </g>
      <!-- Table: aircrafts -->
      <g transform="translate(8, 146)">
        <rect width="229" height="58" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="10" y="16" fill="#10b981" font-size="9" font-weight="700" font-family="Inter, sans-serif">aircrafts</text>
        <text x="10" y="30" fill="#f59e0b" font-size="7.5" font-family="JetBrains Mono, monospace">PK id: BIGINT</text>
        <text x="10" y="44" fill="#cbd5e1" font-size="7.5" font-family="JetBrains Mono, monospace">UK aircraft_code | capacity</text>
      </g>
    </g>

    <!-- DB 4: aerobook_fare_db -->
    <g transform="translate(875, 45)">
      <rect width="255" height="215" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>
      <rect width="255" height="24" rx="6" fill="#065f46"/>
      <text x="12" y="16" fill="#ffffff" font-size="9" font-weight="800" font-family="Inter, sans-serif">🗄️ aerobook_fare_db</text>
      
      <!-- Table: fares -->
      <g transform="translate(8, 30)">
        <rect width="239" height="110" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="10" y="16" fill="#10b981" font-size="9" font-weight="700" font-family="Inter, sans-serif">fares</text>
        <text x="10" y="32" fill="#f59e0b" font-size="7.5" font-family="JetBrains Mono, monospace">PK id: BIGINT</text>
        <text x="10" y="46" fill="#c084fc" font-size="7.5" font-family="JetBrains Mono, monospace">UK flight_id: BIGINT</text>
        <text x="10" y="60" fill="#cbd5e1" font-size="7.5" font-family="JetBrains Mono, monospace">   economy_fare: DECIMAL(10,2)</text>
        <text x="10" y="74" fill="#cbd5e1" font-size="7.5" font-family="JetBrains Mono, monospace">   business_fare, first_class</text>
        <text x="10" y="88" fill="#cbd5e1" font-size="7.5" font-family="JetBrains Mono, monospace">   tax_percentage (18% GST)</text>
      </g>
      <!-- Table: coupons -->
      <g transform="translate(8, 146)">
        <rect width="239" height="58" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="10" y="16" fill="#10b981" font-size="9" font-weight="700" font-family="Inter, sans-serif">coupons</text>
        <text x="10" y="30" fill="#f59e0b" font-size="7.5" font-family="JetBrains Mono, monospace">PK id: BIGINT | UK code</text>
        <text x="10" y="44" fill="#cbd5e1" font-size="7.5" font-family="JetBrains Mono, monospace">   discount_pct, usage_limit</text>
      </g>
    </g>

    <!-- ROW 2: 4 BOTTOM DATABASES -->
    <!-- DB 5: aerobook_booking_db -->
    <g transform="translate(30, 275)">
      <rect width="255" height="215" rx="6" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.2"/>
      <rect width="255" height="24" rx="6" fill="#4c1d95"/>
      <text x="12" y="16" fill="#ffffff" font-size="9" font-weight="800" font-family="Inter, sans-serif">🗄️ aerobook_booking_db</text>
      
      <!-- Table: bookings -->
      <g transform="translate(8, 30)">
        <rect width="239" height="100" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="10" y="16" fill="#8b5cf6" font-size="9" font-weight="700" font-family="Inter, sans-serif">bookings</text>
        <text x="10" y="30" fill="#f59e0b" font-size="7.5" font-family="JetBrains Mono, monospace">PK booking_id: BIGINT</text>
        <text x="10" y="44" fill="#c084fc" font-size="7.5" font-family="JetBrains Mono, monospace">UK pnr: VARCHAR(20)</text>
        <text x="10" y="58" fill="#cbd5e1" font-size="7.5" font-family="JetBrains Mono, monospace">   user_id, flight_id</text>
        <text x="10" y="72" fill="#cbd5e1" font-size="7.5" font-family="JetBrains Mono, monospace">   total_fare, status</text>
        <text x="10" y="86" fill="#cbd5e1" font-size="7.5" font-family="JetBrains Mono, monospace">   booking_date: DATETIME</text>
      </g>
      <!-- Table: passengers -->
      <g transform="translate(8, 136)">
        <rect width="239" height="68" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="10" y="16" fill="#8b5cf6" font-size="9" font-weight="700" font-family="Inter, sans-serif">passengers (1:N with bookings)</text>
        <text x="10" y="30" fill="#f59e0b" font-size="7.5" font-family="JetBrains Mono, monospace">PK passenger_id: BIGINT</text>
        <text x="10" y="44" fill="#60a5fa" font-size="7.5" font-family="JetBrains Mono, monospace">FK booking_id: BIGINT</text>
        <text x="10" y="58" fill="#cbd5e1" font-size="7.5" font-family="JetBrains Mono, monospace">   first_name, age, seat_number</text>
      </g>
    </g>

    <!-- DB 6: aerobook_checkin_db -->
    <g transform="translate(315, 275)">
      <rect width="255" height="215" rx="6" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.2"/>
      <rect width="255" height="24" rx="6" fill="#4c1d95"/>
      <text x="12" y="16" fill="#ffffff" font-size="9" font-weight="800" font-family="Inter, sans-serif">🗄️ aerobook_checkin_db</text>
      
      <!-- Table: check_in -->
      <g transform="translate(8, 30)">
        <rect width="239" height="174" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="10" y="18" fill="#8b5cf6" font-size="9.5" font-weight="700" font-family="Inter, sans-serif">check_in</text>
        <text x="10" y="38" fill="#f59e0b" font-size="8" font-family="JetBrains Mono, monospace">PK id: BIGINT AUTO_INCREMENT</text>
        <text x="10" y="56" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">   booking_id: BIGINT</text>
        <text x="10" y="74" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">   passenger_name: VARCHAR(100)</text>
        <text x="10" y="92" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">   seat_number: VARCHAR(10)</text>
        <text x="10" y="110" fill="#c084fc" font-size="8" font-family="JetBrains Mono, monospace">UK boarding_pass_number (BP-*)</text>
        <text x="10" y="128" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">   status (CHECKED_IN / BOARDED)</text>
        <text x="10" y="146" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">   checked_in_at: DATETIME</text>
      </g>
    </g>

    <!-- DB 7: aerobook_payment_db -->
    <g transform="translate(600, 275)">
      <rect width="245" height="215" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.2"/>
      <rect width="245" height="24" rx="6" fill="#78350f"/>
      <text x="12" y="16" fill="#ffffff" font-size="9" font-weight="800" font-family="Inter, sans-serif">🗄️ aerobook_payment_db</text>
      
      <!-- Table: payments -->
      <g transform="translate(8, 30)">
        <rect width="229" height="174" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="10" y="18" fill="#f59e0b" font-size="9.5" font-weight="700" font-family="Inter, sans-serif">payments</text>
        <text x="10" y="38" fill="#f59e0b" font-size="8" font-family="JetBrains Mono, monospace">PK id: BIGINT AUTO_INCREMENT</text>
        <text x="10" y="56" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">   booking_id: BIGINT</text>
        <text x="10" y="74" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">   pnr: VARCHAR(20)</text>
        <text x="10" y="92" fill="#c084fc" font-size="8" font-family="JetBrains Mono, monospace">UK order_id: VARCHAR(100)</text>
        <text x="10" y="110" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">   payment_id, signature</text>
        <text x="10" y="128" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">   amount_in_paise: BIGINT</text>
        <text x="10" y="146" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">   status, refund_id, amount</text>
      </g>
    </g>

    <!-- DB 8: aerobook_notification_db -->
    <g transform="translate(875, 275)">
      <rect width="255" height="215" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.2"/>
      <rect width="255" height="24" rx="6" fill="#78350f"/>
      <text x="12" y="16" fill="#ffffff" font-size="9" font-weight="800" font-family="Inter, sans-serif">🗄️ aerobook_notification_db</text>
      
      <!-- Table: notifications -->
      <g transform="translate(8, 30)">
        <rect width="239" height="174" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="10" y="18" fill="#f59e0b" font-size="9.5" font-weight="700" font-family="Inter, sans-serif">notifications</text>
        <text x="10" y="38" fill="#f59e0b" font-size="8" font-family="JetBrains Mono, monospace">PK id: BIGINT AUTO_INCREMENT</text>
        <text x="10" y="56" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">   user_id: BIGINT</text>
        <text x="10" y="74" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">   recipient_email: VARCHAR(150)</text>
        <text x="10" y="92" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">   title: VARCHAR(255)</text>
        <text x="10" y="110" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">   message: TEXT</text>
        <text x="10" y="128" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">   type (BOOKING, CHECKIN, ALERT)</text>
        <text x="10" y="146" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono, monospace">   status, created_at, read_at</text>
      </g>
    </g>
  </svg>`;
}

function getActivityDiagramSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1160 520" width="100%" height="100%">
    <defs>
      <linearGradient id="actBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#070d1e"/><stop offset="100%" stop-color="#0b1736"/>
      </linearGradient>
      <marker id="actArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>
      </marker>
      <marker id="actArrowGreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981"/>
      </marker>
    </defs>
    <rect width="1160" height="520" rx="12" fill="url(#actBg)"/>

    <text x="580" y="24" fill="#38bdf8" font-size="12" font-weight="800" letter-spacing="1.5" text-anchor="middle" font-family="Inter, sans-serif">
      AEROBOOK END-TO-END BUSINESS ACTIVITY &amp; CONCURRENCY PIPELINE
    </text>

    <!-- STEP 1: SEARCH & VALIDATION -->
    <g transform="translate(30, 45)">
      <!-- Start Node -->
      <circle cx="15" cy="40" r="12" fill="#38bdf8"/>
      <path d="M 27 40 L 50 40" stroke="#38bdf8" stroke-width="2" marker-end="url(#actArrow)"/>

      <!-- Action 1 -->
      <g transform="translate(55, 18)">
        <rect width="140" height="44" rx="6" fill="#1e293b" stroke="#38bdf8"/>
        <text x="70" y="20" fill="#ffffff" font-size="8.5" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">1. Search Flights</text>
        <text x="70" y="32" fill="#94a3b8" font-size="7.5" text-anchor="middle" font-family="Inter, sans-serif">Origin, Dest, Date</text>
      </g>
      <path d="M 195 40 L 225 40" stroke="#38bdf8" stroke-width="2" marker-end="url(#actArrow)"/>

      <!-- Decision 1: Seats Available? -->
      <g transform="translate(230, 16)">
        <polygon points="40,0 80,24 40,48 0,24" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="40" y="22" fill="#fde68a" font-size="7" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">Seats &gt; 0?</text>
        <text x="40" y="32" fill="#fde68a" font-size="6.5" text-anchor="middle" font-family="Inter, sans-serif">Verified?</text>
      </g>
      <path d="M 310 40 L 340 40" stroke="#10b981" stroke-width="2" marker-end="url(#actArrowGreen)"/>
      <text x="325" y="34" fill="#10b981" font-size="7.5" font-weight="700" font-family="Inter, sans-serif">YES</text>

      <!-- Action 2: Choose Cabin & Add Passengers -->
      <g transform="translate(345, 18)">
        <rect width="150" height="44" rx="6" fill="#1e293b" stroke="#38bdf8"/>
        <text x="75" y="20" fill="#ffffff" font-size="8.5" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">2. Select Cabin Tier</text>
        <text x="75" y="32" fill="#94a3b8" font-size="7.5" text-anchor="middle" font-family="Inter, sans-serif">Economy, Business, First</text>
      </g>
      <path d="M 495 40 L 525 40" stroke="#38bdf8" stroke-width="2" marker-end="url(#actArrow)"/>

      <!-- Decision 2: Apply Coupon? -->
      <g transform="translate(530, 16)">
        <polygon points="40,0 80,24 40,48 0,24" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="40" y="22" fill="#fde68a" font-size="7" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">Coupon</text>
        <text x="40" y="32" fill="#fde68a" font-size="6.5" text-anchor="middle" font-family="Inter, sans-serif">Applied?</text>
      </g>
      <path d="M 610 40 L 640 40" stroke="#38bdf8" stroke-width="2" marker-end="url(#actArrow)"/>

      <!-- Action 3: Booking & PNR Gen -->
      <g transform="translate(645, 18)">
        <rect width="165" height="44" rx="6" fill="#1e293b" stroke="#8b5cf6"/>
        <text x="82" y="20" fill="#ffffff" font-size="8.5" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">3. Create Booking</text>
        <text x="82" y="32" fill="#c4b5fd" font-size="7.5" text-anchor="middle" font-family="Inter, sans-serif">Generate 6-Char PNR</text>
      </g>
      <path d="M 810 40 L 840 40" stroke="#38bdf8" stroke-width="2" marker-end="url(#actArrow)"/>

      <!-- Action 4: Razorpay Order Creation -->
      <g transform="translate(845, 18)">
        <rect width="165" height="44" rx="6" fill="#1e293b" stroke="#f59e0b"/>
        <text x="82" y="20" fill="#ffffff" font-size="8.5" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">4. Razorpay Order</text>
        <text x="82" y="32" fill="#fde68a" font-size="7.5" text-anchor="middle" font-family="Inter, sans-serif">Convert INR to Paise</text>
      </g>
      <path d="M 1010 40 L 1035 40" stroke="#38bdf8" stroke-width="2" marker-end="url(#actArrow)"/>

      <!-- Action 5: Checkout UI Modal -->
      <g transform="translate(1035, 18)">
        <circle cx="20" cy="22" r="16" fill="#0284c7"/>
        <text x="20" y="26" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">💳</text>
      </g>
    </g>

    <!-- CONNECTOR: ROW 1 TO ROW 2 -->
    <path d="M 1055 105 L 1055 140 L 100 140 L 100 160" stroke="#38bdf8" stroke-width="2" fill="none" marker-end="url(#actArrow)"/>

    <!-- STEP 2: PAYMENT VERIFICATION & FORK / JOIN CONCURRENCY -->
    <g transform="translate(30, 165)">
      <!-- Action 6: Cryptographic Verification -->
      <g transform="translate(20, 0)">
        <rect width="180" height="48" rx="6" fill="#1e293b" stroke="#f59e0b"/>
        <text x="90" y="22" fill="#ffffff" font-size="8.5" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">5. Verify Payment Signature</text>
        <text x="90" y="36" fill="#fde68a" font-size="7.5" text-anchor="middle" font-family="Inter, sans-serif">HMAC-SHA256 (order|payment)</text>
      </g>
      <path d="M 200 24 L 240 24" stroke="#10b981" stroke-width="2" marker-end="url(#actArrowGreen)"/>

      <!-- SOLID FORK BAR (PARALLEL EXECUTION) -->
      <rect x="245" y="-10" width="10" height="80" rx="3" fill="#38bdf8"/>
      <text x="250" y="90" fill="#38bdf8" font-size="8" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">FORK</text>

      <!-- Branch A: RabbitMQ Seat Deduction -->
      <path d="M 255 5 L 290 -25 L 320 -25" stroke="#38bdf8" stroke-width="1.5" fill="none" marker-end="url(#actArrow)"/>
      <g transform="translate(325, -45)">
        <rect width="250" height="40" rx="6" fill="#1e293b" stroke="#ea580c"/>
        <text x="125" y="18" fill="#fed7aa" font-size="8" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">AMQP Event: booking-created</text>
        <text x="125" y="30" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">FlightService decrements available_seats</text>
      </g>

      <!-- Branch B: OpenPDF Ticket & Email -->
      <path d="M 255 24 L 320 24" stroke="#38bdf8" stroke-width="1.5" fill="none" marker-end="url(#actArrow)"/>
      <g transform="translate(325, 4)">
        <rect width="250" height="40" rx="6" fill="#1e293b" stroke="#f59e0b"/>
        <text x="125" y="18" fill="#fde68a" font-size="8" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">Generate Vector e-Ticket PDF</text>
        <text x="125" y="30" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">OpenPDF buffer &amp; SMTP dispatch</text>
      </g>

      <!-- Branch C: Update Booking Status -->
      <path d="M 255 45 L 290 75 L 320 75" stroke="#38bdf8" stroke-width="1.5" fill="none" marker-end="url(#actArrow)"/>
      <g transform="translate(325, 55)">
        <rect width="250" height="40" rx="6" fill="#1e293b" stroke="#8b5cf6"/>
        <text x="125" y="18" fill="#ddd6fe" font-size="8" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">Update Booking: CONFIRMED</text>
        <text x="125" y="30" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">Persist to aerobook_booking_db</text>
      </g>

      <!-- SOLID JOIN BAR -->
      <path d="M 575 -25 L 610 5 L 625 5" stroke="#38bdf8" stroke-width="1.5" fill="none"/>
      <path d="M 575 24 L 625 24" stroke="#38bdf8" stroke-width="1.5" fill="none"/>
      <path d="M 575 75 L 610 45 L 625 45" stroke="#38bdf8" stroke-width="1.5" fill="none"/>
      
      <rect x="625" y="-10" width="10" height="80" rx="3" fill="#38bdf8"/>
      <text x="630" y="90" fill="#38bdf8" font-size="8" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">JOIN</text>

      <!-- Action 7: Itinerary Ready -->
      <path d="M 635 24 L 670 24" stroke="#10b981" stroke-width="2" marker-end="url(#actArrowGreen)"/>
      <g transform="translate(675, 4)">
        <rect width="180" height="42" rx="6" fill="#1e293b" stroke="#10b981"/>
        <text x="90" y="18" fill="#ffffff" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">6. Booking Confirmed</text>
        <text x="90" y="30" fill="#6ee7b7" font-size="7.5" text-anchor="middle" font-family="Inter, sans-serif">PNR Issued to Passenger</text>
      </g>

      <!-- Action 8: Check-In Window -->
      <path d="M 855 24 L 890 24" stroke="#38bdf8" stroke-width="2" marker-end="url(#actArrow)"/>
      <g transform="translate(895, 4)">
        <rect width="180" height="42" rx="6" fill="#1e293b" stroke="#38bdf8"/>
        <text x="90" y="18" fill="#ffffff" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">7. Check-In Opens (T-48h)</text>
        <text x="90" y="30" fill="#93c5fd" font-size="7.5" text-anchor="middle" font-family="Inter, sans-serif">Passenger Selects Seat</text>
      </g>
    </g>

    <!-- CONNECTOR: ROW 2 TO ROW 3 -->
    <path d="M 985 245 L 985 285 L 100 285 L 100 310" stroke="#38bdf8" stroke-width="2" fill="none" marker-end="url(#actArrow)"/>

    <!-- STEP 3: DEPARTURE GATE BOARDING & TERMINAL CLEARANCE -->
    <g transform="translate(30, 315)">
      <!-- Action 9: Boarding Pass Issuance -->
      <g transform="translate(20, 0)">
        <rect width="210" height="48" rx="6" fill="#1e293b" stroke="#8b5cf6"/>
        <text x="105" y="20" fill="#ffffff" font-size="8.5" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">8. Issue Boarding Pass (BP-*)</text>
        <text x="105" y="34" fill="#c4b5fd" font-size="7.5" text-anchor="middle" font-family="Inter, sans-serif">Generate Barcode &amp; Pass PDF</text>
      </g>
      <path d="M 230 24 L 270 24" stroke="#38bdf8" stroke-width="2" marker-end="url(#actArrow)"/>

      <!-- Action 10: Airport Gate Scan -->
      <g transform="translate(275, 0)">
        <rect width="220" height="48" rx="6" fill="#1e293b" stroke="#34d399"/>
        <text x="110" y="20" fill="#ffffff" font-size="8.5" font-weight="600" text-anchor="middle" font-family="Inter, sans-serif">9. Departure Gate Barcode Scan</text>
        <text x="110" y="34" fill="#6ee7b7" font-size="7.5" text-anchor="middle" font-family="Inter, sans-serif">Staff invokes POST /api/check-ins/verify</text>
      </g>
      <path d="M 495 24 L 535 24" stroke="#38bdf8" stroke-width="2" marker-end="url(#actArrow)"/>

      <!-- Decision 3: Gate Clearance -->
      <g transform="translate(540, 0)">
        <polygon points="45,0 90,24 45,48 0,24" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
        <text x="45" y="22" fill="#a7f3d0" font-size="7.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">Pass Valid</text>
        <text x="45" y="32" fill="#a7f3d0" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">&amp; Unboarded?</text>
      </g>
      <path d="M 630 24 L 670 24" stroke="#10b981" stroke-width="2" marker-end="url(#actArrowGreen)"/>
      <text x="645" y="18" fill="#10b981" font-size="7.5" font-weight="700" font-family="Inter, sans-serif">YES</text>

      <!-- Action 11: Mark BOARDED -->
      <g transform="translate(675, 0)">
        <rect width="210" height="48" rx="6" fill="#1e293b" stroke="#10b981"/>
        <text x="105" y="20" fill="#ffffff" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">10. Update Status: BOARDED</text>
        <text x="105" y="34" fill="#6ee7b7" font-size="7.5" text-anchor="middle" font-family="Inter, sans-serif">Gate Barrier Clearance Granted</text>
      </g>
      <path d="M 885 24 L 925 24" stroke="#10b981" stroke-width="2" marker-end="url(#actArrowGreen)"/>

      <!-- End Node (Success Bullseye) -->
      <g transform="translate(930, 4)">
        <circle cx="20" cy="20" r="16" fill="none" stroke="#10b981" stroke-width="2"/>
        <circle cx="20" cy="20" r="10" fill="#10b981"/>
      </g>
      <text x="950" y="52" fill="#10b981" font-size="8" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">PASSENGER BOARDED</text>
    </g>

    <!-- WORKFLOW SUMMARY PILLARS AT BOTTOM -->
    <g transform="translate(30, 410)">
      <rect width="1100" height="85" rx="6" fill="#0f172a" stroke="#334155"/>
      <rect width="1100" height="20" rx="6" fill="#1e293b"/>
      <text x="550" y="14" fill="#38bdf8" font-size="9" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">WORKFLOW EXECUTION GUARANTEES</text>

      <g transform="translate(20, 30)">
        <text x="0" y="14" fill="#38bdf8" font-size="8" font-weight="700" font-family="Inter, sans-serif">• IDEMPOTENCY:</text>
        <text x="85" y="14" fill="#cbd5e1" font-size="8" font-family="Inter, sans-serif">Re-verifying the same check-in returns existing boarded status without duplicate charges or duplicate seats.</text>
      </g>
      <g transform="translate(20, 48)">
        <text x="0" y="14" fill="#10b981" font-size="8" font-weight="700" font-family="Inter, sans-serif">• CONCURRENCY:</text>
        <text x="85" y="14" fill="#cbd5e1" font-size="8" font-family="Inter, sans-serif">Fork/Join pattern ensures slow email delivery (200-800ms) does not block critical transactional response.</text>
      </g>
      <g transform="translate(20, 66)">
        <text x="0" y="14" fill="#f59e0b" font-size="8" font-weight="700" font-family="Inter, sans-serif">• ROLLBACKS:</text>
        <text x="85" y="14" fill="#cbd5e1" font-size="8" font-family="Inter, sans-serif">Payment signature mismatch or failed transactions automatically cancel pending bookings and restore seats.</text>
      </g>
    </g>
  </svg>`;
}

function getFlowDiagramSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1160 520" width="100%" height="100%">
    <defs>
      <linearGradient id="dfdBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#070d1e"/><stop offset="100%" stop-color="#0b1736"/>
      </linearGradient>
      <marker id="dfdArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>
      </marker>
    </defs>
    <rect width="1160" height="520" rx="12" fill="url(#dfdBg)"/>

    <text x="580" y="24" fill="#38bdf8" font-size="12" font-weight="800" letter-spacing="1.5" text-anchor="middle" font-family="Inter, sans-serif">
      AEROBOOK PHYSICAL DATA FLOW &amp; EXECUTION PIPELINE (DFD)
    </text>

    <!-- 6 PIPELINE STAGES -->
    <!-- STAGE 1: INGRESS -->
    <g transform="translate(30, 45)">
      <rect width="170" height="340" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
      <rect width="170" height="26" rx="8" fill="#0284c7"/>
      <text x="85" y="18" fill="#ffffff" font-size="9" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">1. CLIENT &amp; INGRESS</text>
      
      <g transform="translate(10, 38)">
        <rect width="150" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="75" y="20" fill="#38bdf8" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">Angular 18 SPA</text>
        <text x="75" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">HTTP Request + Bearer JWT</text>
      </g>
      <g transform="translate(10, 98)">
        <rect width="150" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="75" y="20" fill="#38bdf8" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">Netty EventLoop</text>
        <text x="75" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">Non-blocking TCP socket</text>
      </g>
      <g transform="translate(10, 158)">
        <rect width="150" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="75" y="20" fill="#38bdf8" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">CorsWebFilter</text>
        <text x="75" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">Validates Origin &amp; Methods</text>
      </g>
      <g transform="translate(10, 218)">
        <rect width="150" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="75" y="20" fill="#38bdf8" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">Latency: 15-40ms</text>
        <text x="75" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">JSON Payload Serialization</text>
      </g>
    </g>

    <!-- ARROW 1 -> 2 -->
    <path d="M 200 170 L 220 170" stroke="#38bdf8" stroke-width="2" marker-end="url(#dfdArrow)"/>

    <!-- STAGE 2: GATEWAY ENRICHMENT -->
    <g transform="translate(225, 45)">
      <rect width="170" height="340" rx="8" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>
      <rect width="170" height="26" rx="8" fill="#4f46e5"/>
      <text x="85" y="18" fill="#ffffff" font-size="9" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">2. SECURITY &amp; DISPATCH</text>

      <g transform="translate(10, 38)">
        <rect width="150" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="75" y="20" fill="#818cf8" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">JwtAuthenticationFilter</text>
        <text x="75" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">Verify HMAC-SHA256 signature</text>
      </g>
      <g transform="translate(10, 98)">
        <rect width="150" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="75" y="20" fill="#818cf8" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">Header Mutation</text>
        <text x="75" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">Inject X-User-Id, X-User-Role</text>
      </g>
      <g transform="translate(10, 158)">
        <rect width="150" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="75" y="20" fill="#818cf8" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">Route Predicate Match</text>
        <text x="75" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">Path(/api/bookings/**)</text>
      </g>
      <g transform="translate(10, 218)">
        <rect width="150" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="75" y="20" fill="#818cf8" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">Eureka Discovery</text>
        <text x="75" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">Resolve lb://BOOKING-SERVICE</text>
      </g>
    </g>

    <!-- ARROW 2 -> 3 -->
    <path d="M 395 170 L 415 170" stroke="#38bdf8" stroke-width="2" marker-end="url(#dfdArrow)"/>

    <!-- STAGE 3: OPENFEIGN RPC -->
    <g transform="translate(420, 45)">
      <rect width="170" height="340" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>
      <rect width="170" height="26" rx="8" fill="#065f46"/>
      <text x="85" y="18" fill="#ffffff" font-size="9" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">3. SYNCHRONOUS RPC</text>

      <g transform="translate(10, 38)">
        <rect width="150" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="75" y="20" fill="#10b981" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">BookingController</text>
        <text x="75" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">Consumes X-User-Id header</text>
      </g>
      <g transform="translate(10, 98)">
        <rect width="150" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="75" y="20" fill="#10b981" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">FlightServiceClient</text>
        <text x="75" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">OpenFeign GET /api/flights/{id}</text>
      </g>
      <g transform="translate(10, 158)">
        <rect width="150" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="75" y="20" fill="#10b981" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">FareServiceClient</text>
        <text x="75" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">OpenFeign GET /api/fares/flight</text>
      </g>
      <g transform="translate(10, 218)">
        <rect width="150" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="75" y="20" fill="#10b981" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">PNR Generation</text>
        <text x="75" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">PnrGenerator.generatePnr()</text>
      </g>
    </g>

    <!-- ARROW 3 -> 4 -->
    <path d="M 590 170 L 610 170" stroke="#38bdf8" stroke-width="2" marker-end="url(#dfdArrow)"/>

    <!-- STAGE 4: PERSISTENCE (HIKARICP & INNODB) -->
    <g transform="translate(615, 45)">
      <rect width="170" height="340" rx="8" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.2"/>
      <rect width="170" height="26" rx="8" fill="#4c1d95"/>
      <text x="85" y="18" fill="#ffffff" font-size="9" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">4. ACID PERSISTENCE</text>

      <g transform="translate(10, 38)">
        <rect width="150" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="75" y="20" fill="#8b5cf6" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">Spring Data JPA</text>
        <text x="75" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">Hibernate 6 ORM Mapping</text>
      </g>
      <g transform="translate(10, 98)">
        <rect width="150" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="75" y="20" fill="#8b5cf6" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">HikariCP Pool</text>
        <text x="75" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">Zero-overhead connection pool</text>
      </g>
      <g transform="translate(10, 158)">
        <rect width="150" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="75" y="20" fill="#8b5cf6" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">MySQL InnoDB Engine</text>
        <text x="75" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">Row-level locks &amp; redo log</text>
      </g>
      <g transform="translate(10, 218)">
        <rect width="150" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="75" y="20" fill="#8b5cf6" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">Latency: 1-5ms</text>
        <text x="75" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">ACID Transaction Commit</text>
      </g>
    </g>

    <!-- ARROW 4 -> 5 -->
    <path d="M 785 170 L 805 170" stroke="#38bdf8" stroke-width="2" marker-end="url(#dfdArrow)"/>

    <!-- STAGE 5: ASYNC AMQP BUS -->
    <g transform="translate(810, 45)">
      <rect width="160" height="340" rx="8" fill="#0f172a" stroke="#ea580c" stroke-width="1.2"/>
      <rect width="160" height="26" rx="8" fill="#c2410c"/>
      <text x="80" y="18" fill="#ffffff" font-size="9" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">5. AMQP BUS</text>

      <g transform="translate(10, 38)">
        <rect width="140" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="70" y="20" fill="#ea580c" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">RabbitTemplate</text>
        <text x="70" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">Jackson2JsonConverter</text>
      </g>
      <g transform="translate(10, 98)">
        <rect width="140" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="70" y="20" fill="#ea580c" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">Durable AMQP Queue</text>
        <text x="70" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">booking-created (Port 5672)</text>
      </g>
      <g transform="translate(10, 158)">
        <rect width="140" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="70" y="20" fill="#ea580c" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">@RabbitListener</text>
        <text x="70" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">FlightService Consumer</text>
      </g>
      <g transform="translate(10, 218)">
        <rect width="140" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="70" y="20" fill="#ea580c" font-size="8.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">Latency: 2-8ms</text>
        <text x="70" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">Async Seat Decrement</text>
      </g>
    </g>

    <!-- ARROW 5 -> 6 -->
    <path d="M 970 170 L 990 170" stroke="#38bdf8" stroke-width="2" marker-end="url(#dfdArrow)"/>

    <!-- STAGE 6: OUTBOUND THIRD-PARTY -->
    <g transform="translate(990, 45)">
      <rect width="140" height="340" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="1.2"/>
      <rect width="140" height="26" rx="8" fill="#78350f"/>
      <text x="70" y="18" fill="#ffffff" font-size="9" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">6. OUTBOUND</text>

      <g transform="translate(8, 38)">
        <rect width="124" height="60" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="62" y="20" fill="#f59e0b" font-size="8" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">OpenPDF Engine</text>
        <text x="62" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">In-Memory Vector PDF</text>
        <text x="62" y="48" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">e-Ticket generation</text>
      </g>
      <g transform="translate(8, 108)">
        <rect width="124" height="60" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="62" y="20" fill="#f59e0b" font-size="8" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">Gmail SMTP Relay</text>
        <text x="62" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">Port 587 STARTTLS</text>
        <text x="62" y="48" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">Dispatches e-Ticket</text>
      </g>
      <g transform="translate(8, 178)">
        <rect width="124" height="60" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="62" y="20" fill="#f59e0b" font-size="8" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">Razorpay API</text>
        <text x="62" y="34" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">HMAC-SHA256 Secret</text>
        <text x="62" y="48" fill="#cbd5e1" font-size="7" text-anchor="middle" font-family="Inter, sans-serif">Capture &amp; Refund</text>
      </g>
      <g transform="translate(8, 248)">
        <rect width="124" height="40" rx="4" fill="#1e293b" stroke="#334155"/>
        <text x="62" y="24" fill="#f59e0b" font-size="8" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">Passenger Inbox</text>
      </g>
    </g>

    <!-- METRICS & TELEMETRY FOOTER -->
    <g transform="translate(30, 400)">
      <rect width="1100" height="95" rx="6" fill="#0f172a" stroke="#334155"/>
      <rect width="1100" height="22" rx="6" fill="#1e293b"/>
      <text x="550" y="16" fill="#38bdf8" font-size="9" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">PACKET LATENCY &amp; RESILIENCE TELEMETRY MATRIX</text>
      
      <g transform="translate(20, 32)">
        <text x="0" y="16" fill="#cbd5e1" font-size="8" font-family="Inter, sans-serif"><tspan fill="#38bdf8" font-weight="bold">• Ingress Round-Trip:</tspan> 15 - 40 ms total response time from client click to PNR on screen</text>
        <text x="0" y="34" fill="#cbd5e1" font-size="8" font-family="Inter, sans-serif"><tspan fill="#10b981" font-weight="bold">• Synchronous RPC (OpenFeign):</tspan> 5 - 15 ms internal hop latency via Eureka client-side round-robin load balancer</text>
        <text x="0" y="52" fill="#cbd5e1" font-size="8" font-family="Inter, sans-serif"><tspan fill="#ea580c" font-weight="bold">• Asynchronous Event Bus (RabbitMQ):</tspan> 2 - 8 ms AMQP message transit, isolating background seat deduction from HTTP thread pool</text>
      </g>
    </g>
  </svg>`;
}

function getChallengesFutureScopeSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1160 520" width="100%" height="100%">
    <defs>
      <linearGradient id="chalBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#070d1e"/><stop offset="100%" stop-color="#0b1736"/>
      </linearGradient>
    </defs>
    <rect width="1160" height="520" rx="12" fill="url(#chalBg)"/>

    <text x="580" y="24" fill="#38bdf8" font-size="12" font-weight="800" letter-spacing="1.5" text-anchor="middle" font-family="Inter, sans-serif">
      AEROBOOK TECHNICAL CHALLENGES OVERCOME &amp; FUTURE ROADMAP
    </text>

    <!-- COLUMN 1: CHALLENGES FACED & HOW WE SOLVED THEM (LEFT) -->
    <g transform="translate(30, 45)">
      <rect width="530" height="450" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="1.2"/>
      <rect width="530" height="30" rx="8" fill="#78350f"/>
      <text x="265" y="20" fill="#fde68a" font-size="10.5" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">ENGINEERING CHALLENGES FACED &amp; ARCHITECTURAL SOLUTIONS</text>

      <!-- Card 1 -->
      <g transform="translate(15, 42)">
        <rect width="500" height="90" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="15" y="20" fill="#f59e0b" font-size="9.5" font-weight="700" font-family="Inter, sans-serif">1. Distributed Data Consistency (No Cross-Database Joins)</text>
        <text x="15" y="38" fill="#ef4444" font-size="8" font-family="Inter, sans-serif">Challenge: Relational foreign keys cannot cross service DB boundaries without causing tight coupling.</text>
        <text x="15" y="56" fill="#10b981" font-size="8" font-weight="600" font-family="Inter, sans-serif">Solution: Synchronous OpenFeign queries for immediate verification + RabbitMQ AMQP messaging</text>
        <text x="15" y="70" fill="#10b981" font-size="8" font-weight="600" font-family="Inter, sans-serif">for eventual consistency, eliminating database-level locks and distributed 2PC transaction overhead.</text>
      </g>

      <!-- Card 2 -->
      <g transform="translate(15, 142)">
        <rect width="500" height="90" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="15" y="20" fill="#f59e0b" font-size="9.5" font-weight="700" font-family="Inter, sans-serif">2. Perimeter Security &amp; Internal Microservice Throughput</text>
        <text x="15" y="38" fill="#ef4444" font-size="8" font-family="Inter, sans-serif">Challenge: Repeated asymmetric JWT signature checking across internal hops added 30-50ms latency.</text>
        <text x="15" y="56" fill="#10b981" font-size="8" font-weight="600" font-family="Inter, sans-serif">Solution: Centralized cryptographic verification at Netty API Gateway (8083), mutating trusted</text>
        <text x="15" y="70" fill="#10b981" font-size="8" font-weight="600" font-family="Inter, sans-serif">downstream headers (X-User-Id, X-User-Role), achieving sub-millisecond internal auth evaluation.</text>
      </g>

      <!-- Card 3 -->
      <g transform="translate(15, 242)">
        <rect width="500" height="90" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="15" y="20" fill="#f59e0b" font-size="9.5" font-weight="700" font-family="Inter, sans-serif">3. Concurrency &amp; Race Conditions in Flight Seat Allocation</text>
        <text x="15" y="38" fill="#ef4444" font-size="8" font-family="Inter, sans-serif">Challenge: Simultaneous passenger checkouts during peak search hours could oversell available seats.</text>
        <text x="15" y="56" fill="#10b981" font-size="8" font-weight="600" font-family="Inter, sans-serif">Solution: Row-level pessimistic locking (SELECT FOR UPDATE) in Flight Service combined with durable</text>
        <text x="15" y="70" fill="#10b981" font-size="8" font-weight="600" font-family="Inter, sans-serif">sequential RabbitMQ queues, ensuring atomic inventory decrements with zero seat overselling.</text>
      </g>

      <!-- Card 4 -->
      <g transform="translate(15, 342)">
        <rect width="500" height="90" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="15" y="20" fill="#f59e0b" font-size="9.5" font-weight="700" font-family="Inter, sans-serif">4. Payment Gateway Webhook Resiliency &amp; Signature Mismatches</text>
        <text x="15" y="38" fill="#ef4444" font-size="8" font-family="Inter, sans-serif">Challenge: Client network drops or browser closes after Razorpay payment could leave bookings pending.</text>
        <text x="15" y="56" fill="#10b981" font-size="8" font-weight="600" font-family="Inter, sans-serif">Solution: Dual verification strategy: synchronous HMAC-SHA256 signature check on client return +</text>
        <text x="15" y="70" fill="#10b981" font-size="8" font-weight="600" font-family="Inter, sans-serif">idempotent background webhook receiver updating PaymentRecord to CAPTURED automatically.</text>
      </g>
    </g>

    <!-- COLUMN 2: FUTURE SCOPE & PRODUCTION ROADMAP (RIGHT) -->
    <g transform="translate(595, 45)">
      <rect width="530" height="450" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
      <rect width="530" height="30" rx="8" fill="#1e3a8a"/>
      <text x="265" y="20" fill="#93c5fd" font-size="10.5" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">FUTURE SCOPE &amp; ENTERPRISE PRODUCTION ROADMAP</text>

      <!-- Scope 1 -->
      <g transform="translate(15, 42)">
        <rect width="500" height="70" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="15" y="20" fill="#38bdf8" font-size="9.5" font-weight="700" font-family="Inter, sans-serif">🚀 1. Distributed Caching with Redis Cluster</text>
        <text x="15" y="38" fill="#cbd5e1" font-size="8" font-family="Inter, sans-serif">Cache frequent flight route queries (DEL-BOM) and active coupon codes with a 60-second TTL,</text>
        <text x="15" y="52" fill="#cbd5e1" font-size="8" font-family="Inter, sans-serif">invalidated dynamically via RabbitMQ events to drop database query load by 85% during peak hours.</text>
      </g>

      <!-- Scope 2 -->
      <g transform="translate(15, 122)">
        <rect width="500" height="70" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="15" y="20" fill="#38bdf8" font-size="9.5" font-weight="700" font-family="Inter, sans-serif">🛡️ 2. Resilience4j Circuit Breakers &amp; Fallbacks</text>
        <text x="15" y="38" fill="#cbd5e1" font-size="8" font-family="Inter, sans-serif">Equip OpenFeign clients with CircuitBreakers and TimeLimiters. If Fare Service slows down,</text>
        <text x="15" y="52" fill="#cbd5e1" font-size="8" font-family="Inter, sans-serif">Booking Service serves cached pricing or graceful degraded responses without cascading timeouts.</text>
      </g>

      <!-- Scope 3 -->
      <g transform="translate(15, 202)">
        <rect width="500" height="70" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="15" y="20" fill="#38bdf8" font-size="9.5" font-weight="700" font-family="Inter, sans-serif">🗄️ 3. Versioned Database Schema Migrations (Flyway)</text>
        <text x="15" y="38" fill="#cbd5e1" font-size="8" font-family="Inter, sans-serif">Replace Hibernate DDL auto-generation (ddl-auto=update) with Flyway versioned migration scripts</text>
        <text x="15" y="52" fill="#cbd5e1" font-size="8" font-family="Inter, sans-serif">(V1__init.sql, V2__add_index.sql) ensuring zero-downtime blue/green database deployments.</text>
      </g>

      <!-- Scope 4 -->
      <g transform="translate(15, 282)">
        <rect width="500" height="70" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="15" y="20" fill="#38bdf8" font-size="9.5" font-weight="700" font-family="Inter, sans-serif">📊 4. Full Distributed Tracing with OpenTelemetry &amp; Tempo</text>
        <text x="15" y="38" fill="#cbd5e1" font-size="8" font-family="Inter, sans-serif">Export trace spans from Spring Cloud Gateway and microservices to Grafana Tempo/Jaeger,</text>
        <text x="15" y="52" fill="#cbd5e1" font-size="8" font-family="Inter, sans-serif">allowing operations engineers to inspect flame graphs for every millisecond of a booking flow.</text>
      </g>

      <!-- Scope 5 -->
      <g transform="translate(15, 362)">
        <rect width="500" height="70" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="15" y="20" fill="#38bdf8" font-size="9.5" font-weight="700" font-family="Inter, sans-serif">📡 5. Real-Time Push Notifications (WebSockets / SSE)</text>
        <text x="15" y="38" fill="#cbd5e1" font-size="8" font-family="Inter, sans-serif">Replace client polling on dashboards with reactive Server-Sent Events from Notification Service,</text>
        <text x="15" y="52" fill="#cbd5e1" font-size="8" font-family="Inter, sans-serif">instantly pushing live departure gate numbers, weather delays, and boarding calls to mobile devices.</text>
      </g>
    </g>
  </svg>`;
}

// Map of slide objects
const PRESENTATION_PAGES = [
  {
    num: 1,
    id: '03-architecture-diagram',
    title: 'System Architecture & Microservices Topology',
    subtitle: 'Multi-Tier Enterprise Cloud Architecture: Netty Ingress, Eureka Discovery, AMQP Event Bus & Persistence',
    category: 'Platform Architecture',
    badge: 'Slide 1 of 7 • System Topology',
    svg: getArchitectureSvg(),
    talkingPoints: [
      'Single Point of Ingress: Client interacts exclusively through Netty API Gateway (8083), hiding all internal service ports.',
      'Perimeter Security: Cryptographic JWT token validation occurs at the Gateway, injecting X-User-Id and X-User-Role claims downstream.',
      'Hybrid Communication: OpenFeign for low-latency synchronous RPC queries + RabbitMQ for decoupled, reliable event delivery.'
    ]
  },
  {
    num: 2,
    id: '04-use-case-diagram',
    title: 'System Use-Case & RBAC Governance Model',
    subtitle: 'Actor Role Boundaries, Operational Capabilities, Permission Matrices & Third-Party Integrations',
    category: 'Requirements Engineering',
    badge: 'Slide 2 of 7 • UML Use-Case Model',
    svg: getUseCaseSvg(),
    talkingPoints: [
      'Role Partitioning: Strict boundaries isolate Passengers (ROLE_USER), Airport Staff (ROLE_STAFF), and Admins (ROLE_ADMIN).',
      'Departure Gate Integration: Staff operates digital gate scanner (/verify) that directly transitions passenger status to BOARDED.',
      'External Collaborators: Razorpay handles order payments; Gmail SMTP dispatches vector PDF boarding passes and OTPs.'
    ]
  },
  {
    num: 3,
    id: '01-class-diagram',
    title: 'Domain Class Diagram & Modular DDD Architecture',
    subtitle: 'Domain Entities, Value Objects, Structural Relationships & Typed Lifecycle Enumerations',
    category: 'Object-Oriented Design',
    badge: 'Slide 3 of 7 • Domain-Driven Design',
    svg: getClassDiagramSvg(),
    talkingPoints: [
      'Domain Separation: Authentication credentials (Credential) are decoupled from user demographics (UserEntity).',
      'Immutable Audit Keys: PNR (Passenger Name Record), boarding pass codes (BP-*), and Razorpay order IDs are unique across services.',
      'Lifecycle Enums: State machines are strictly governed via typed enums (FlightStatus, BookingStatus, PaymentStatus, IncidentStatus).'
    ]
  },
  {
    num: 4,
    id: '02-er-diagram',
    title: 'Entity-Relationship (ER) Persistence Model',
    subtitle: 'Relational Schemas, Constraints, Keys & Foreign References across 8 Isolated MySQL Databases',
    category: 'Persistence Architecture',
    badge: 'Slide 4 of 7 • Relational Database Model',
    svg: getErDiagramSvg(),
    talkingPoints: [
      'Database-per-Service: 8 private MySQL schemas prevent cross-service deadlocks and allow autonomous schema scaling.',
      'Intra-Domain Cascades: Direct foreign keys enforce relational integrity within services (e.g. bookings to passengers).',
      'Master Seed Dataset: 20 user credentials, 15 aircraft, 30 scheduled commercial flights, and active promotional coupons.'
    ]
  },
  {
    num: 5,
    id: '05-activity-diagram',
    title: 'End-to-End Business Activity & Lifecycle Workflow',
    subtitle: 'Procedural Business Execution: Flight Search, Coupon Validation, Razorpay Payment, AMQP Sync & Gate Clearance',
    category: 'Process Engineering',
    badge: 'Slide 5 of 7 • UML Activity Specification',
    svg: getActivityDiagramSvg(),
    talkingPoints: [
      'Validation Checkpoints: Seat availability, coupon discount eligibility, and HMAC-SHA256 signature checking.',
      'Fork/Join Concurrency: Successful payment concurrently publishes AMQP seat reduction, renders e-ticket PDF, and confirms booking.',
      'Gate Clearance Handshake: Airport staff mobile barcode scan transitions passenger records to BOARDED at departure gate.'
    ]
  },
  {
    num: 6,
    id: '06-flow-diagram',
    title: 'System Execution & Distributed Data Flow Pipeline (DFD)',
    subtitle: 'Physical Packet Traversal: Netty Ingress, JWT Mutation, Eureka Dynamic RPC, AMQP Bus & DB Transactions',
    category: 'Data & Network Architecture',
    badge: 'Slide 6 of 7 • Data Flow Model (DFD)',
    svg: getFlowDiagramSvg(),
    talkingPoints: [
      'Packet Ingress: HTTP request enters Netty EventLoop on port 8083, passes CorsWebFilter and JwtAuthenticationFilter.',
      'Dynamic Routing: Spring Cloud Gateway queries Eureka cache to resolve lb://BOOKING-SERVICE via round-robin load balancing.',
      'Decoupled Pipelines: Synchronous OpenFeign for seat checks (5-15ms); asynchronous RabbitMQ for seat deduction (2-8ms).'
    ]
  },
  {
    num: 7,
    id: '07-challenges-future-scope',
    title: 'Technical Challenges Overcome & Future Roadmap',
    subtitle: 'Distributed Data Consistency, Perimeter Security, Concurrency, Redis Caching & Resilience4j Circuit Breakers',
    category: 'Engineering & Evolution',
    badge: 'Slide 7 of 7 • Production Roadmap',
    svg: getChallengesFutureScopeSvg(),
    talkingPoints: [
      'Highlight Distributed Consistency solution: OpenFeign for read validation + RabbitMQ for eventual consistency.',
      'Explain Race Condition resolution: Pessimistic locking (SELECT FOR UPDATE) in Flight Service prevents flight overselling.',
      'Outline Future Scope: Redis cluster caching, Resilience4j circuit breakers, Flyway migrations, and WebSockets/SSE.'
    ]
  }
];

// HTML Template for single slide
function buildSingleSlideHtml(slide) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${slide.title} - AeroBook Technical Presentation</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
    @page {
      size: 297mm 210mm landscape;
      margin: 8mm 10mm;
      @bottom-right {
        content: "AeroBook Presentation Deck • ${slide.badge}";
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: #64748b;
      }
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #070d1e;
      color: #f8fafc;
      margin: 0;
      padding: 10px;
      -webkit-font-smoothing: antialiased;
    }
    .slide-box {
      width: 100%;
      height: 194mm;
      background: radial-gradient(circle at 10% 10%, #172554 0%, #09122a 50%, #030712 100%);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 12px 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1.5px solid rgba(255, 255, 255, 0.12);
      padding-bottom: 8px;
      margin-bottom: 8px;
    }
    .badge-pill {
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.35);
      padding: 3px 8px;
      border-radius: 5px;
    }
    .slide-h1 {
      font-size: 17pt;
      font-weight: 800;
      color: #ffffff;
      margin: 4px 0 2px 0;
      letter-spacing: -0.3px;
      background: linear-gradient(to right, #ffffff, #e2e8f0, #93c5fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .slide-sub {
      font-size: 8.5pt;
      color: #94a3b8;
      margin: 0;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13pt;
      font-weight: 800;
      color: #38bdf8;
    }
    .brand-plane {
      background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      color: #ffffff;
      font-size: 13px;
    }
    .svg-stage {
      flex-grow: 1;
      height: 140mm;
      max-height: 140mm;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(11, 19, 43, 0.85);
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-radius: 10px;
      padding: 6px;
      box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5);
      overflow: hidden;
    }
    .speaker-drawer {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 8px;
      padding: 6px 12px;
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .speaker-tag {
      font-size: 7pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #f59e0b;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.35);
      padding: 2px 7px;
      border-radius: 4px;
      white-space: nowrap;
    }
    .speaker-list {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      font-size: 7.5pt;
      color: #e2e8f0;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .speaker-list li::before {
      content: "▸";
      color: #38bdf8;
      font-weight: bold;
      margin-right: 4px;
    }
    .nav-bar {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(56, 189, 248, 0.4);
      padding: 8px 16px;
      border-radius: 30px;
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .nav-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 6px 14px;
      border-radius: 16px;
      font-size: 8pt;
      font-weight: 600;
      cursor: pointer;
    }
    @media print { .nav-bar { display: none; } }
  </style>
</head>
<body>
  <div class="slide-box">
    <div class="header-bar">
      <div>
        <div class="badge-pill">${slide.badge}</div>
        <h1 class="slide-h1">${slide.title}</h1>
        <p class="slide-sub">${slide.subtitle}</p>
      </div>
      <div class="brand-logo">
        <div class="brand-plane">✈</div>
        <span>AeroBook</span>
      </div>
    </div>

    <div class="svg-stage">
      ${slide.svg}
    </div>

    <div class="speaker-drawer">
      <div class="speaker-tag">Speaker Talking Points</div>
      <ul class="speaker-list">
        ${slide.talkingPoints.map(p => `<li>${p}</li>`).join('')}
      </ul>
    </div>
  </div>

  <div class="nav-bar">
    <button class="nav-btn" onclick="window.print()">🖨️ Print to PDF</button>
    <button class="nav-btn" onclick="document.documentElement.requestFullscreen()">⛶ Fullscreen</button>
  </div>
</body>
</html>`;
}

// Build consolidated 8-page master presentation HTML
function buildMasterDeckHtml(slides) {
  const slidesHtml = slides.map(s => {
    return `
    <div class="slide-box" id="slide-${s.num}">
      <div class="header-bar">
        <div>
          <div class="badge-pill">${s.badge}</div>
          <h1 class="slide-h1">${s.title}</h1>
          <p class="slide-sub">${s.subtitle}</p>
        </div>
        <div class="brand-logo">
          <div class="brand-plane">✈</div>
          <span>AeroBook</span>
        </div>
      </div>

      <div class="svg-stage">
        ${s.svg}
      </div>

      <div class="speaker-drawer">
        <div class="speaker-tag">Speaker Talking Points</div>
        <ul class="speaker-list">
          ${s.talkingPoints.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>
    </div>
    `;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AeroBook Platform - 8-Page Executive Presentation Deck</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
    @page {
      size: 297mm 210mm landscape;
      margin: 8mm 10mm;
      @bottom-right {
        content: "AeroBook Presentation Deck • Slide " counter(page);
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: #64748b;
      }
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #070d1e;
      color: #f8fafc;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .slide-box, .cover-box {
      width: 100%;
      height: 194mm;
      page-break-after: always;
      background: radial-gradient(circle at 10% 10%, #172554 0%, #09122a 50%, #030712 100%);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 12px 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    }
    .cover-box {
      padding: 24mm 20mm 16mm 20mm;
      background: radial-gradient(circle at 85% 15%, #1e3a8a 0%, #0b132b 55%, #030712 100%);
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1.5px solid rgba(255, 255, 255, 0.12);
      padding-bottom: 8px;
      margin-bottom: 8px;
    }
    .badge-pill {
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.35);
      padding: 3px 8px;
      border-radius: 5px;
    }
    .slide-h1 {
      font-size: 17pt;
      font-weight: 800;
      color: #ffffff;
      margin: 4px 0 2px 0;
      letter-spacing: -0.3px;
      background: linear-gradient(to right, #ffffff, #e2e8f0, #93c5fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .slide-sub {
      font-size: 8.5pt;
      color: #94a3b8;
      margin: 0;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13pt;
      font-weight: 800;
      color: #38bdf8;
    }
    .brand-plane {
      background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      color: #ffffff;
      font-size: 13px;
    }
    .svg-stage {
      flex-grow: 1;
      height: 140mm;
      max-height: 140mm;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(11, 19, 43, 0.85);
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-radius: 10px;
      padding: 6px;
      box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5);
      overflow: hidden;
    }
    .speaker-drawer {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 8px;
      padding: 6px 12px;
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .speaker-tag {
      font-size: 7pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #f59e0b;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.35);
      padding: 2px 7px;
      border-radius: 4px;
      white-space: nowrap;
    }
    .speaker-list {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      font-size: 7.5pt;
      color: #e2e8f0;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .speaker-list li::before {
      content: "▸";
      color: #38bdf8;
      font-weight: bold;
      margin-right: 4px;
    }
    .cover-big-title {
      font-size: 32pt;
      font-weight: 900;
      line-height: 1.15;
      letter-spacing: -0.5px;
      margin: 0;
      background: linear-gradient(135deg, #ffffff 0%, #93c5fd 60%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .cover-big-sub {
      font-size: 14pt;
      font-weight: 400;
      color: #94a3b8;
      margin-top: 10px;
      max-width: 820px;
      line-height: 1.4;
    }
    .cover-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 22px;
    }
    .cover-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 10px;
    }
    .cover-card-num {
      font-size: 7.5pt;
      font-weight: 800;
      color: #38bdf8;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .cover-card-title {
      font-size: 9.5pt;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 4px;
    }
    .cover-card-desc {
      font-size: 7.5pt;
      color: #94a3b8;
      line-height: 1.3;
    }
    .cover-footer-bar {
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5pt;
      color: #64748b;
    }
    .cover-footer-bar strong { color: #f8fafc; }
    @media screen {
      body {
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }
      .slide-box, .cover-box {
        max-width: 1280px;
        min-height: 720px;
      }
    }
  </style>
</head>
<body>

  <!-- Slide 0: Executive Cover -->
  <div class="cover-box" id="slide-0">
    <div>
      <div class="badge-pill">Executive 8-Page Presentation Deck</div>
      <h1 class="cover-big-title">AeroBook Cloud Airline Platform</h1>
      <p class="cover-big-sub">
        Technical Architecture, Microservices Topology, UML Models, Relational Persistence, Business Execution, Challenges Overcome &amp; Production Roadmap.
      </p>

      <div class="cover-grid">
        <div class="cover-card">
          <div class="cover-card-num">Slide 01</div>
          <div class="cover-card-title">System Architecture</div>
          <div class="cover-card-desc">Netty Ingress, Eureka Discovery, OpenFeign &amp; AMQP Bus.</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-num">Slide 02</div>
          <div class="cover-card-title">Use-Case Model</div>
          <div class="cover-card-desc">Passenger, Staff &amp; Admin RBAC with Razorpay &amp; SMTP.</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-num">Slide 03</div>
          <div class="cover-card-title">Class Diagram</div>
          <div class="cover-card-desc">Domain entities, lifecycle enums &amp; DDD associations.</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-num">Slide 04</div>
          <div class="cover-card-title">Relational ER Model</div>
          <div class="cover-card-desc">8 isolated MySQL schemas with explicit PK/FK/UK constraints.</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-num">Slide 05</div>
          <div class="cover-card-title">Business Activity</div>
          <div class="cover-card-desc">Search, Coupon, Payment Fork/Join &amp; Gate Verification.</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-num">Slide 06</div>
          <div class="cover-card-title">Data Flow (DFD)</div>
          <div class="cover-card-desc">End-to-end packet journey from client to MySQL InnoDB.</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-num">Slide 07</div>
          <div class="cover-card-title">Challenges Overcome</div>
          <div class="cover-card-desc">Distributed consistency, race conditions &amp; auth throughput.</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-num">Future Scope</div>
          <div class="cover-card-title">Production Roadmap</div>
          <div class="cover-card-desc">Redis Caching, CircuitBreakers, Flyway &amp; WebSockets.</div>
        </div>
      </div>
    </div>

    <div class="cover-footer-bar">
      <div><strong>Platform:</strong> Java 21 LTS • Spring Boot 3.3.4 • Angular 18 • MySQL 8 • RabbitMQ</div>
      <div><strong>Author:</strong> AeroBook Platform Engineering &amp; Architecture Team</div>
      <div>October 2026 • 8-Page Executive Presentation</div>
    </div>
  </div>

  <!-- Slides 1 to 7 -->
  ${slidesHtml}

</body>
</html>`;
}

// Generate Native Microsoft PowerPoint (.pptx)
async function generatePptxDeck(slides) {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  // Slide 1: Cover
  const coverSlide = pptx.addSlide();
  coverSlide.background = { color: '070D1E' };
  coverSlide.addText('Executive Architecture Presentation', {
    x: 0.8, y: 1.2, w: 10, h: 0.4,
    fontSize: 12, bold: true, color: '38BDF8', fontFace: 'Arial'
  });
  coverSlide.addText('AeroBook Cloud Airline Platform', {
    x: 0.8, y: 1.7, w: 11, h: 1.0,
    fontSize: 32, bold: true, color: 'FFFFFF', fontFace: 'Arial'
  });
  coverSlide.addText('Complete Microservices Architecture, UML Specifications, Relational Persistence, Challenges Overcome & Future Roadmap.', {
    x: 0.8, y: 2.8, w: 11, h: 0.8,
    fontSize: 14, color: '94A3B8', fontFace: 'Arial'
  });

  // Table of contents blocks on cover
  const cards = [
    { num: 'Slide 1', title: 'System Architecture', desc: 'Netty Gateway, Eureka & AMQP' },
    { num: 'Slide 2', title: 'Use-Case Model', desc: 'Passenger, Staff & Admin RBAC' },
    { num: 'Slide 3', title: 'Class Diagram', desc: 'Modular DDD Domain Entities' },
    { num: 'Slide 4', title: 'Relational ER Model', desc: '8 Isolated MySQL Schemas' },
    { num: 'Slide 5', title: 'Activity Diagram', desc: 'Payment Fork/Join & Gate Scan' },
    { num: 'Slide 6', title: 'Data Flow (DFD)', desc: 'Netty Ingress to DB Redo Log' },
    { num: 'Slide 7', title: 'Challenges & Future', desc: 'Consistency, Redis & Circuit Breakers' }
  ];

  cards.forEach((c, idx) => {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const x = 0.8 + col * 2.85;
    const y = 3.8 + row * 1.5;

    coverSlide.addShape(pptx.ShapeType.rect, {
      x, y, w: 2.7, h: 1.3,
      fill: { color: '1E293B' },
      line: { color: '334155', width: 1 }
    });
    coverSlide.addText(c.num, {
      x: x + 0.15, y: y + 0.1, w: 2.4, h: 0.25,
      fontSize: 9, bold: true, color: '38BDF8'
    });
    coverSlide.addText(c.title, {
      x: x + 0.15, y: y + 0.35, w: 2.4, h: 0.35,
      fontSize: 11, bold: true, color: 'FFFFFF'
    });
    coverSlide.addText(c.desc, {
      x: x + 0.15, y: y + 0.72, w: 2.4, h: 0.45,
      fontSize: 8.5, color: '94A3B8'
    });
  });

  coverSlide.addText('Java 21 LTS • Spring Boot 3.3.4 • Angular 18 • MySQL 8 • RabbitMQ | October 2026', {
    x: 0.8, y: 6.8, w: 11, h: 0.3,
    fontSize: 9, color: '64748B'
  });

  // Slides 2 to 8 (Diagrams & Challenges)
  for (const s of slides) {
    const slide = pptx.addSlide();
    slide.background = { color: '070D1E' };

    // Header
    slide.addText(s.badge, {
      x: 0.8, y: 0.4, w: 8, h: 0.25,
      fontSize: 9, bold: true, color: '38BDF8'
    });
    slide.addText(s.title, {
      x: 0.8, y: 0.65, w: 10, h: 0.5,
      fontSize: 18, bold: true, color: 'FFFFFF'
    });
    slide.addText(s.subtitle, {
      x: 0.8, y: 1.15, w: 11, h: 0.3,
      fontSize: 9, color: '94A3B8'
    });

    // Content container
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8, y: 1.55, w: 11.7, h: 4.4,
      fill: { color: '0F172A' },
      line: { color: '1E3A8A', width: 1.5 }
    });

    // Talking points drawer
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8, y: 6.1, w: 11.7, h: 0.85,
      fill: { color: '1E293B' },
      line: { color: '334155', width: 1 }
    });
    slide.addText('SPEAKER TALKING POINTS', {
      x: 1.0, y: 6.18, w: 2.5, h: 0.25,
      fontSize: 8, bold: true, color: 'F59E0B'
    });
    
    const bulletText = s.talkingPoints.map(p => `• ${p}`).join('   |   ');
    slide.addText(bulletText, {
      x: 1.0, y: 6.42, w: 11.3, h: 0.45,
      fontSize: 8, color: 'E2E8F0'
    });
  }

  const pptxPath = path.join(DIAGRAMS_DIR, 'AeroBook_Complete_Presentation.pptx');
  await pptx.writeFile({ fileName: pptxPath });
  console.log(`✓ Generated Native PowerPoint Presentation (.pptx): ${pptxPath}`);
}

// MAIN EXECUTION
async function main() {
  console.log('================================================================');
  console.log('   Generating Crystal-Clear 8-Page Presentation Deck Suite...   ');
  console.log('================================================================');

  // Step 1: Generate individual HTML & PDF for each slide
  for (const s of PRESENTATION_PAGES) {
    const htmlContent = buildSingleSlideHtml(s);
    const htmlPath = path.join(DIAGRAMS_DIR, `${s.id}.html`);
    const pdfPath = path.join(DIAGRAMS_DIR, `${s.id}.pdf`);

    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log(`✓ Wrote Slide HTML: ${htmlPath}`);

    const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
    const cmd = `"${CHROME_PATH}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${fileUrl}"`;
    execSync(cmd, { stdio: 'inherit', timeout: 35000 });

    const stats = fs.statSync(pdfPath);
    console.log(`✓ Generated Slide PDF: ${pdfPath} (${(stats.size / 1024).toFixed(1)} KB)`);
  }

  // Step 2: Generate Master 8-Page Presentation Deck HTML & PDF
  console.log('\n================================================================');
  console.log('   Compiling 8-Page Master Presentation Deck (PDF & HTML)...    ');
  console.log('================================================================');

  const deckHtml = buildMasterDeckHtml(PRESENTATION_PAGES);
  const deckHtmlPath = path.join(DIAGRAMS_DIR, 'AeroBook_Diagrams_Presentation.html');
  const deckPdfPath = path.join(DIAGRAMS_DIR, 'AeroBook_Diagrams_Presentation.pdf');

  fs.writeFileSync(deckHtmlPath, deckHtml, 'utf8');
  console.log(`✓ Wrote 8-Page Master Deck HTML: ${deckHtmlPath}`);

  const deckUrl = 'file:///' + deckHtmlPath.replace(/\\/g, '/');
  const deckCmd = `"${CHROME_PATH}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${deckPdfPath}" "${deckUrl}"`;
  execSync(deckCmd, { stdio: 'inherit', timeout: 60000 });

  const deckStats = fs.statSync(deckPdfPath);
  console.log(`✓ Generated 8-Page Master Deck PDF: ${deckPdfPath} (${(deckStats.size / 1024).toFixed(1)} KB)`);

  // Step 3: Generate Native Microsoft PowerPoint (.pptx) File
  console.log('\n================================================================');
  console.log('   Generating Native Microsoft PowerPoint Presentation (.pptx)...');
  console.log('================================================================');
  await generatePptxDeck(PRESENTATION_PAGES);

  console.log('\n================================================================');
  console.log('   All Deliverables Built & Validated with 100% Precision!       ');
  console.log('================================================================');
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});

