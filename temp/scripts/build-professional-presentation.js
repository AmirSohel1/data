const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIAGRAMS_DIR = path.join(ROOT_DIR, 'docs', 'diagrams');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const SLIDE_DEFINITIONS = [
  {
    num: 1,
    id: '03-architecture-diagram',
    title: 'System Architecture & Microservices Topology',
    subtitle: 'Multi-Tier Enterprise Cloud Architecture: Edge Netty Ingress, Eureka Discovery, AMQP Event Bus & Persistence',
    category: 'Platform Architecture',
    badge: 'Core System Topology',
    mdFile: '03-architecture-diagram.md',
    componentCards: [
      {
        title: 'Ingress & Edge Security',
        desc: 'Spring Cloud Gateway (8083) running Netty WebFlux non-blocking engine. Enforces JWT cryptographic perimeter verification and mutates downstream headers with trusted X-User-Id and X-User-Role claims.'
      },
      {
        title: 'Discovery & Configuration',
        desc: 'Netflix Eureka (8761) provides dynamic cluster registration with client-side load balancing. Spring Cloud Config (8080) delivers centralized native configuration profiles.'
      },
      {
        title: 'Hybrid Inter-Service Mesh',
        desc: 'Synchronous OpenFeign RPC for latency-sensitive seat queries and pricing calculations. Asynchronous RabbitMQ AMQP queues (booking-created, flight.queue) for decoupled seat deduction.'
      },
      {
        title: 'Database-Per-Service Isolation',
        desc: '8 dedicated MySQL 8.0 databases hosting isolated domain schemas, preventing relational deadlocks and allowing independent database tuning and schema evolution.'
      }
    ],
    talkingPoints: [
      'Emphasize the Single Point of Ingress: The Angular 18 client talks exclusively to port 8083, hiding all internal ports.',
      'Explain zero-trust perimeter authentication: Gateway validates tokens once, saving CPU cycles across internal services.',
      'Highlight event-driven fault isolation: Even if downstream services pause, booking messages remain durable in RabbitMQ.'
    ]
  },
  {
    num: 2,
    id: '04-use-case-diagram',
    title: 'System Use-Case & RBAC Governance Model',
    subtitle: 'Actor Role Boundaries, Operational Workflows, Permission Matrices & Third-Party System Interactions',
    category: 'Requirements Engineering',
    badge: 'UML Use-Case Specification',
    mdFile: '04-use-case-diagram.md',
    componentCards: [
      {
        title: 'Passenger Persona (ROLE_USER)',
        desc: 'Search commercial flights by route/date, inspect cabin class pricing, validate discount coupons, book flights, add passenger rosters, pay via Razorpay, check in online, and download vector PDF boarding passes.'
      },
      {
        title: 'Airport Staff Persona (ROLE_STAFF)',
        desc: 'Access flight passenger manifest rosters, operate the departure gate barcode scanner (/api/check-ins/verify) to transition passengers to BOARDED status, and file passenger security incident reports.'
      },
      {
        title: 'Administrator Persona (ROLE_ADMIN)',
        desc: 'Full platform governance: aircraft fleet inventory management, flight route scheduling, cabin fare pricing rules, promotional coupon management, user role assignments, and incident ticket investigation.'
      },
      {
        title: 'External System Collaborators',
        desc: 'Razorpay Cloud Gateway for order creation and HMAC verification; Gmail SMTP relay server for OTP and ticket PDF email dispatch; RabbitMQ message broker for inventory synchronization.'
      }
    ],
    talkingPoints: [
      'Detail the 3 distinct human personas and how security roles strictly isolate administrative actions from passengers.',
      'Point out the departure gate boarding scanner workflow that connects physical airport gates to the digital backend.',
      'Demonstrate how automated external systems (Razorpay, SMTP) collaborate asynchronously without blocking user UI.'
    ]
  },
  {
    num: 3,
    id: '01-class-diagram',
    title: 'Domain Class Diagram & Object-Oriented Architecture',
    subtitle: 'Domain Entities, Value Objects, Structural Relationships & Lifecycle Enumerations Across 11 Services',
    category: 'Object-Oriented Design',
    badge: 'Domain-Driven Design (DDD)',
    mdFile: '01-class-diagram.md',
    componentCards: [
      {
        title: 'Identity & Access Domain',
        desc: 'Credential entity encapsulates hashed passwords (BCrypt $2a$10$) and role assignments; RefreshToken manages rotating session renewals; EmailVerification stores OTPs with expiration TTLs.'
      },
      {
        title: 'Commercial Flight & Fleet Domain',
        desc: 'Flight entity tracks commercial schedules, city pairs, and real-time available_seats; Aircraft entity maintains fleet models and total passenger seat capacity.'
      },
      {
        title: 'Reservations & Manifest Domain',
        desc: 'Booking entity owns unique 6-character PNR keys and total fares; Passenger entity records traveler legal names, gender, age, and assigned cabin seat numbers.'
      },
      {
        title: 'Payment & Check-In Entities',
        desc: 'PaymentRecord tracks Razorpay order IDs, signatures, amounts in paise, and refund IDs; CheckIn manages boarding pass codes (BP-*) and boarding status transitions.'
      }
    ],
    talkingPoints: [
      'Explain Domain-Driven Design (DDD): Business boundaries encapsulate state and logic, linked by logical business keys.',
      'Highlight state machine governance via typed enumerations: FlightStatus, BookingStatus, PaymentStatus, IncidentStatus.',
      'Demonstrate data normalization: Passenger rosters belong strictly to parent Bookings with cascading lifecycle management.'
    ]
  },
  {
    num: 4,
    id: '02-er-diagram',
    title: 'Entity-Relationship (ER) Relational Persistence Model',
    subtitle: 'Relational Schemas, Primary/Foreign/Unique Keys & Data Constraints Across 8 Isolated MySQL Databases',
    category: 'Persistence Architecture',
    badge: 'Relational Database Model',
    mdFile: '02-er-diagram.md',
    componentCards: [
      {
        title: 'Schema Isolation (Database-per-Service)',
        desc: 'Strict schema independence: aerobook_auth_db, aerobook_user_db, aerobook_flight_db, aerobook_fare_db, aerobook_booking_db, aerobook_checkin_db, aerobook_payment_db, aerobook_notification_db.'
      },
      {
        title: 'Relational Integrity & Key Constraints',
        desc: 'All tables use BIGINT auto-increment primary keys, unique constraints on business keys (pnr, flight_number, aircraft_code, order_id, email), and UTF-8 utf8mb4 encoding.'
      },
      {
        title: 'Intra-Domain Cascades',
        desc: 'Direct relational foreign keys enforce data integrity within services (e.g. bookings.booking_id -> passengers.booking_id; aircrafts.id -> flights.aircraft_id).'
      },
      {
        title: 'Logical Cross-Domain Linkages',
        desc: 'Inter-service references are maintained as logical foreign keys (flight_id, booking_id, user_id), preventing database-level locking across service boundaries.'
      }
    ],
    talkingPoints: [
      'Explain why enterprise microservices forbid cross-database joins: prevents cascading schema locks and outages.',
      'Highlight master seed dataset: 20 user credentials, 15 aircraft, 30 scheduled flights, and active promotional coupons.',
      'Demonstrate how PNRs and booking IDs bridge reservations, payments, boarding passes, and email notifications.'
    ]
  },
  {
    num: 5,
    id: '05-activity-diagram',
    title: 'End-to-End Business Activity & Lifecycle Workflow',
    subtitle: 'Procedural Business Execution: Flight Search, Coupon Validation, Razorpay Payment, AMQP Sync & Gate Clearance',
    category: 'Process Engineering',
    badge: 'UML Activity Specification',
    mdFile: '05-activity-diagram.md',
    componentCards: [
      {
        title: 'Decision Gates & Validation Checkpoints',
        desc: 'Automated verification pipeline: Flight seat availability check -> Coupon validity & minimum fare check -> Razorpay payment authorization -> Cryptographic HMAC signature check.'
      },
      {
        title: 'Parallel Fork/Join Concurrency',
        desc: 'Upon verified payment, the system forks into 3 parallel operations: (1) RabbitMQ event publishes to decrement seats, (2) OpenPDF generates vector e-ticket and dispatches email, (3) Booking updates to CONFIRMED.'
      },
      {
        title: 'Digital Self Check-In',
        desc: 'T-48h check-in window opens: Passenger inputs PNR and selects seat -> Check-In service validates reservation and issues boarding pass code (BP-<bookingId>-<seatNumber>) with downloadable PDF.'
      },
      {
        title: 'Airport Gate Scanner Verification',
        desc: 'Airport operations staff scans mobile or paper boarding pass barcode at departure gate: Service verifies validity, ensures unboarded status, and transitions record to BOARDED.'
      }
    ],
    talkingPoints: [
      'Walk through the happy path: Search -> Booking -> Payment -> Seat Sync -> Check-In -> Gate Boarding.',
      'Highlight parallel execution at the payment fork: Notice how non-critical notifications do not delay core transactions.',
      'Point out compensation and error recovery: Signature mismatch flags fraud; failed payment cancels pending reservation.'
    ]
  },
  {
    num: 6,
    id: '06-flow-diagram',
    title: 'System Execution & Distributed Data Flow Diagram (DFD)',
    subtitle: 'Physical Packet Traversal: Netty Ingress, JWT Mutation, Eureka Dynamic RPC, AMQP Bus & DB Transactions',
    category: 'Data & Network Architecture',
    badge: 'Data Flow Model (DFD)',
    mdFile: '06-flow-diagram.md',
    componentCards: [
      {
        title: 'Ingress & Reactive Filter Chain',
        desc: 'HTTP Request + Bearer JWT enters Netty EventLoop on port 8083 -> CorsWebFilter -> JwtAuthenticationFilter validates claims -> Mutates request with X-User-Id, X-User-Role, X-Correlation-Id headers.'
      },
      {
        title: 'Dynamic Service Route Resolution',
        desc: 'Spring Cloud Gateway queries Netflix Eureka registry cache to resolve lb://BOOKING-SERVICE to active healthy microservice IP:port coordinates using round-robin client-side load balancing.'
      },
      {
        title: 'Synchronous OpenFeign RPC Pipeline',
        desc: 'BookingController delegates to BookingServiceImpl -> Invokes FlightServiceClient and FareServiceClient declarative Feign interfaces over HTTP with Jackson JSON serialization.'
      },
      {
        title: 'Async Event Bus & Persistence Pipeline',
        desc: 'BookingCreatedEvent published via RabbitTemplate to durable AMQP queue booking-created -> FlightService listener decrements seats -> HikariCP connection pool executes ACID commits to MySQL InnoDB.'
      }
    ],
    talkingPoints: [
      'Trace a complete request packet from the browser keystroke down to the MySQL InnoDB redo log and back.',
      'Explain how correlation IDs (X-Correlation-Id) enable distributed tracing across multiple microservice hops.',
      'Show latency metrics from table: Ingress takes 5-15ms; internal DB operations take 1-5ms; email dispatch is asynchronous.'
    ]
  }
];

function extractMermaidCode(markdown) {
  const match = markdown.match(/```mermaid([\s\S]*?)```/);
  if (!match) return '';
  return match[1].trim();
}

// Renders Mermaid code to pure vector SVG via Headless Chrome
function renderMermaidToSvg(mermaidCode, theme = 'dark') {
  const runnerHtml = `<!DOCTYPE html><html><head><script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script></head><body><div id="output">PENDING</div><script>
window.onload = async function() {
  mermaid.initialize({
    startOnLoad: false,
    theme: '${theme}',
    themeVariables: {
      darkMode: true,
      background: 'transparent',
      primaryColor: '#1e3a8a',
      primaryTextColor: '#f8fafc',
      primaryBorderColor: '#3b82f6',
      lineColor: '#38bdf8',
      secondaryColor: '#0f172a',
      tertiaryColor: '#1e293b'
    },
    flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
    sequence: { useMaxWidth: true, showSequenceNumbers: true },
    securityLevel: 'loose'
  });
  const code = document.getElementById('code').textContent;
  try {
    const { svg } = await mermaid.render('mermaidSvg_' + Math.random().toString(36).substring(2, 9), code);
    document.getElementById('output').innerHTML = svg;
    document.body.setAttribute('data-status', 'SUCCESS');
  } catch(e) {
    document.getElementById('output').innerText = 'ERROR: ' + e.message;
    document.body.setAttribute('data-status', 'FAILED');
  }
};
</script><div id="code" style="display:none;">${mermaidCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div></body></html>`;

  const tmpPath = path.join(ROOT_DIR, 'scripts', `temp_runner_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.html`);
  fs.writeFileSync(tmpPath, runnerHtml, 'utf8');

  try {
    const fileUrl = 'file:///' + tmpPath.replace(/\\/g, '/');
    const out = execSync(`"${CHROME_PATH}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --virtual-time-budget=10000 --dump-dom "${fileUrl}"`, { encoding: 'utf8', timeout: 25000 });
    fs.unlinkSync(tmpPath);

    const statusMatch = out.match(/data-status="([^"]+)"/);
    if (!statusMatch || statusMatch[1] !== 'SUCCESS') {
      const errMatch = out.match(/<div id="output">ERROR: ([\s\S]*?)<\/div>/);
      throw new Error('Mermaid render failed: ' + (errMatch ? errMatch[1] : 'Unknown syntax error'));
    }

    const svgMatch = out.match(/<svg[\s\S]*?<\/svg>/);
    if (!svgMatch) throw new Error('No SVG generated in DOM');

    // Make SVG responsive
    let svg = svgMatch[0];
    svg = svg.replace(/width="[^"]+"/, 'width="100%"');
    svg = svg.replace(/style="[^"]*max-width:[^;"]*;?[^"]*"/, 'style="width: 100%; height: auto; max-height: 100%;"');
    return svg;
  } catch (err) {
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    throw err;
  }
}

// Presentation CSS Stylesheet (Widescreen 16:9 Landscape / A4 Landscape)
const presentationCss = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

  @page {
    size: 297mm 210mm landscape;
    margin: 8mm 10mm 8mm 10mm;
    @bottom-right {
      content: "AeroBook Architecture Deck • Slide " counter(page);
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
    text-rendering: optimizeLegibility;
  }

  /* SLIDE CONTAINER */
  .slide {
    width: 100%;
    min-height: 194mm;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 12px 16px;
    background: radial-gradient(circle at 10% 10%, #172554 0%, #09122a 50%, #030712 100%);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  }

  /* SLIDE HEADER */
  .slide-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1.5px solid rgba(255, 255, 255, 0.12);
    padding-bottom: 8px;
    margin-bottom: 10px;
  }

  .slide-title-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .slide-badges {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .badge-category {
    font-size: 7pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.15);
    border: 1px solid rgba(56, 189, 248, 0.35);
    padding: 3px 8px;
    border-radius: 5px;
  }

  .badge-slide {
    font-size: 7pt;
    font-weight: 700;
    color: #cbd5e1;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 3px 8px;
    border-radius: 5px;
  }

  .slide-title {
    font-size: 17pt;
    font-weight: 800;
    color: #ffffff;
    margin: 0;
    letter-spacing: -0.3px;
    background: linear-gradient(to right, #ffffff, #e2e8f0, #93c5fd);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .slide-subtitle {
    font-size: 8.5pt;
    color: #94a3b8;
    margin: 0;
    font-weight: 400;
    line-height: 1.3;
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

  /* DIAGRAM STAGE */
  .diagram-stage {
    flex-grow: 1;
    height: 108mm;
    max-height: 108mm;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(11, 19, 43, 0.85);
    border: 1px solid rgba(56, 189, 248, 0.2);
    border-radius: 10px;
    padding: 8px 12px;
    margin-bottom: 10px;
    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5);
    overflow: hidden;
  }

  .diagram-stage svg {
    width: 100% !important;
    height: 100% !important;
    max-height: 104mm !important;
    object-fit: contain;
  }

  /* BOTTOM CARDS GRID */
  .bottom-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .info-card {
    background: rgba(30, 41, 59, 0.55);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 8px;
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .info-card-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .card-bullet {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #38bdf8;
    flex-shrink: 0;
  }

  .info-card-title {
    font-size: 8pt;
    font-weight: 700;
    color: #e2e8f0;
    letter-spacing: 0.2px;
  }

  .info-card-body {
    font-size: 7.2pt;
    color: #94a3b8;
    line-height: 1.35;
    margin: 0;
  }

  /* TALKING POINTS DRAWER */
  .speaker-script {
    background: rgba(15, 23, 42, 0.85);
    border: 1px solid rgba(56, 189, 248, 0.3);
    border-radius: 8px;
    padding: 7px 12px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .speaker-badge {
    font-size: 7pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.35);
    padding: 2px 7px;
    border-radius: 4px;
    white-space: nowrap;
  }

  .speaker-points {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    font-size: 7.5pt;
    color: #e2e8f0;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .speaker-points li {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .speaker-points li::before {
    content: "▸";
    color: #38bdf8;
    font-weight: bold;
  }

  /* COVER SLIDE */
  .cover-slide {
    width: 100%;
    min-height: 194mm;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24mm 20mm 16mm 20mm;
    background: radial-gradient(circle at 85% 15%, #1e3a8a 0%, #0b132b 55%, #030712 100%);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .cover-header-badge {
    display: inline-block;
    font-size: 9pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.3);
    padding: 5px 14px;
    border-radius: 20px;
    margin-bottom: 14px;
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
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 22px;
  }

  .cover-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 12px;
  }

  .cover-card-num {
    font-size: 8pt;
    font-weight: 800;
    color: #38bdf8;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .cover-card-title {
    font-size: 10.5pt;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 4px;
  }

  .cover-card-desc {
    font-size: 7.8pt;
    color: #94a3b8;
    line-height: 1.35;
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

  .cover-footer-bar strong {
    color: #f8fafc;
  }

  /* INTERACTIVE NAVIGATION (On Screen View) */
  @media screen {
    body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      background-color: #030712;
    }
    .slide, .cover-slide {
      max-width: 1300px;
      min-height: 740px;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8);
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
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
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
    .nav-btn:hover {
      background: #1d4ed8;
    }
  }

  @media print {
    .nav-bar { display: none; }
  }
`;

function buildSlideHtml(def, svgContent, totalSlides = 6) {
  const cardsHtml = def.componentCards.map(c => `
    <div class="info-card">
      <div class="info-card-header">
        <div class="card-bullet"></div>
        <div class="info-card-title">${c.title}</div>
      </div>
      <p class="info-card-body">${c.desc}</p>
    </div>
  `).join('');

  const pointsHtml = def.talkingPoints.map(p => `<li>${p}</li>`).join('');

  return `
  <div class="slide" id="slide-${def.num}">
    <div class="slide-header">
      <div class="slide-title-block">
        <div class="slide-badges">
          <span class="badge-category">${def.category}</span>
          <span class="badge-slide">Slide ${def.num} of ${totalSlides} • ${def.badge}</span>
        </div>
        <h1 class="slide-title">${def.title}</h1>
        <p class="slide-subtitle">${def.subtitle}</p>
      </div>
      <div class="brand-logo">
        <div class="brand-plane">✈</div>
        <span>AeroBook</span>
      </div>
    </div>

    <div class="diagram-stage">
      ${svgContent}
    </div>

    <div class="bottom-grid">
      ${cardsHtml}
    </div>

    <div class="speaker-script">
      <div class="speaker-badge">Speaker Notes</div>
      <ul class="speaker-points">
        ${pointsHtml}
      </ul>
    </div>
  </div>
  `;
}

function buildSingleDiagramDocument(def, svgContent) {
  const slideHtml = buildSlideHtml(def, svgContent, 1);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${def.title} - AeroBook Technical Presentation</title>
  <style>
    ${presentationCss}
  </style>
</head>
<body>
  ${slideHtml}

  <div class="nav-bar">
    <button class="nav-btn" onclick="window.print()">🖨️ Print / Save PDF</button>
    <button class="nav-btn" onclick="document.documentElement.requestFullscreen()">⛶ Fullscreen (F11)</button>
  </div>
</body>
</html>`;
}

function buildMasterDeckDocument(renderedSlides) {
  const slidesContent = renderedSlides.map((item, idx) => buildSlideHtml(item.def, item.svg, renderedSlides.length)).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AeroBook Cloud Airline Platform - Complete Architectural Diagrams Deck</title>
  <style>
    ${presentationCss}
  </style>
</head>
<body>

  <!-- Slide 0: Executive Title Cover -->
  <div class="cover-slide" id="slide-0">
    <div>
      <div class="cover-header-badge">Executive Architecture Presentation Deck</div>
      <h1 class="cover-big-title">AeroBook Cloud Airline Platform</h1>
      <p class="cover-big-sub">
        Comprehensive Technical Presentation Deck: System Architecture, UML Domain Models, Relational ER Schemas, Business Workflows & Execution Pipelines.
      </p>

      <div class="cover-grid">
        <div class="cover-card">
          <div class="cover-card-num">Slide 01</div>
          <div class="cover-card-title">System Architecture</div>
          <div class="cover-card-desc">Multi-tier microservices topology, Spring Cloud Gateway Netty ingress, and Eureka discovery.</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-num">Slide 02</div>
          <div class="cover-card-title">Use-Case Model</div>
          <div class="cover-card-desc">Role-Based Access Control (Passenger, Staff, Admin) and third-party gateway integrations.</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-num">Slide 03</div>
          <div class="cover-card-title">Domain Class Model</div>
          <div class="cover-card-desc">Domain entities, lifecycle enumerations, value objects, and cross-boundary associations.</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-num">Slide 04</div>
          <div class="cover-card-title">Relational ER Model</div>
          <div class="cover-card-desc">Database-per-service pattern across 8 isolated MySQL schemas with explicit keys.</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-num">Slide 05</div>
          <div class="cover-card-title">Business Activity Model</div>
          <div class="cover-card-desc">Procedural booking flow, payment fork/join concurrency, and gate barcode scan.</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-num">Slide 06</div>
          <div class="cover-card-title">Data & Execution Flow</div>
          <div class="cover-card-desc">End-to-end packet journey from client ingress to OpenFeign RPC and RabbitMQ AMQP.</div>
        </div>
      </div>
    </div>

    <div class="cover-footer-bar">
      <div><strong>Platform:</strong> Java 21 LTS • Spring Boot 3.3.4 • Angular 18 • MySQL 8 • RabbitMQ</div>
      <div><strong>Prepared For:</strong> Architecture Review & Technical Presentation</div>
      <div>October 2026 • AeroBook Platform Engineering</div>
    </div>
  </div>

  <!-- Slides 1 to 6 -->
  ${slidesContent}

  <div class="nav-bar">
    <button class="nav-btn" onclick="window.print()">🖨️ Print / Save PDF</button>
    <button class="nav-btn" onclick="document.documentElement.requestFullscreen()">⛶ Fullscreen (F11)</button>
  </div>
</body>
</html>`;
}

// MAIN BUILD EXECUTION
console.log('================================================================');
console.log('   AeroBook Presentation Diagrams Suite - Production Builder    ');
console.log('================================================================');

const renderedSlides = [];

// Step 1: Pre-render all 6 diagrams to SVG
for (const def of SLIDE_DEFINITIONS) {
  const mdPath = path.join(DIAGRAMS_DIR, def.mdFile);
  console.log(`\n[${def.num}/6] Rendering ${def.id}...`);

  const mdContent = fs.readFileSync(mdPath, 'utf8');
  const mermaidCode = extractMermaidCode(mdContent);

  try {
    const svg = renderMermaidToSvg(mermaidCode, 'dark');
    console.log(`  ✓ Pre-rendered SVG successfully (${(svg.length / 1024).toFixed(1)} KB)`);
    renderedSlides.push({ def, svg });

    // Step 2: Write individual standalone HTML file with embedded vector SVG
    const htmlPath = path.join(DIAGRAMS_DIR, `${def.id}.html`);
    const singleHtml = buildSingleDiagramDocument(def, svg);
    fs.writeFileSync(htmlPath, singleHtml, 'utf8');
    console.log(`  ✓ Wrote standalone HTML: ${htmlPath}`);

    // Step 3: Print individual PDF via Chrome Headless
    const pdfPath = path.join(DIAGRAMS_DIR, `${def.id}.pdf`);
    const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
    const chromeCmd = `"${CHROME_PATH}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${fileUrl}"`;
    execSync(chromeCmd, { stdio: 'inherit', timeout: 45000 });

    const pdfStats = fs.statSync(pdfPath);
    console.log(`  ✓ Generated Vector PDF: ${pdfPath} (${(pdfStats.size / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`  ✗ Error rendering ${def.id}:`, err.message);
    process.exit(1);
  }
}

// Step 4: Build consolidated master presentation slide deck
console.log('\n================================================================');
console.log('   Building Consolidated Master Presentation Slide Deck...      ');
console.log('================================================================');

const deckHtmlPath = path.join(DIAGRAMS_DIR, 'AeroBook_Diagrams_Presentation.html');
const deckPdfPath = path.join(DIAGRAMS_DIR, 'AeroBook_Diagrams_Presentation.pdf');

const deckHtml = buildMasterDeckDocument(renderedSlides);
fs.writeFileSync(deckHtmlPath, deckHtml, 'utf8');
console.log(`✓ Wrote Master Deck HTML: ${deckHtmlPath}`);

const deckFileUrl = 'file:///' + deckHtmlPath.replace(/\\/g, '/');
const deckChromeCmd = `"${CHROME_PATH}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${deckPdfPath}" "${deckFileUrl}"`;
execSync(deckChromeCmd, { stdio: 'inherit', timeout: 90000 });

const masterStats = fs.statSync(deckPdfPath);
console.log(`✓ Generated Master Deck PDF: ${deckPdfPath} (${(masterStats.size / 1024).toFixed(1)} KB)`);

console.log('\n================================================================');
console.log('   All 6 Diagram Presentations & Master Deck Built Successfully! ');
console.log('================================================================');

