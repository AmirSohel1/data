const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const marked = require(path.join(__dirname, 'node_modules', 'marked'));

const ROOT_DIR = path.resolve(__dirname, '..');
const DIAGRAMS_DIR = path.join(ROOT_DIR, 'docs', 'diagrams');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const DIAGRAM_CONFIGS = [
  {
    id: '01-class-diagram',
    title: 'Domain Class Diagram',
    subtitle: 'Microservices Domain Entities, Value Objects, Associations & Typed Enums',
    category: 'Object-Oriented Design',
    badge: 'UML Class Model',
    slideNum: 'Slide 1 of 6',
    mdFile: '01-class-diagram.md',
    highlights: [
      'Encapsulates 11 service domains (Auth, User, Flight, Fare, Booking, Check-In, Payment, Notification)',
      'Strict DDD entity modeling with immutable identifiers (PNRs, Boarding Pass Codes, Order IDs)',
      'Typed lifecycle enums for state machines: FlightStatus, BookingStatus, PaymentStatus, IncidentStatus'
    ]
  },
  {
    id: '02-er-diagram',
    title: 'Entity-Relationship (ER) Diagram',
    subtitle: 'Relational Schemas, Constraints, Keys & Foreign References across 8 MySQL Databases',
    category: 'Persistence Architecture',
    badge: 'Relational Data Model',
    slideNum: 'Slide 2 of 6',
    mdFile: '02-er-diagram.md',
    highlights: [
      'Strict Database-per-Service architectural pattern across 8 isolated MySQL schemas',
      'Cascading relational integrity within domains (e.g., bookings to passengers)',
      'Logical cross-domain foreign references maintaining eventual consistency without DB deadlocks'
    ]
  },
  {
    id: '03-architecture-diagram',
    title: 'System Architecture Diagram',
    subtitle: 'Enterprise Multi-Tier Microservices Topology, Edge Gateway, AMQP & Persistence',
    category: 'Platform Architecture',
    badge: 'System Topology',
    slideNum: 'Slide 3 of 6',
    mdFile: '03-architecture-diagram.md',
    highlights: [
      'Single Point of Ingress: Spring Cloud Gateway (8083) with Netty reactive non-blocking engine',
      'Edge Security: Cryptographic JWT verification and downstream header mutation (X-User-Id, X-User-Role)',
      'Hybrid Communication: Synchronous OpenFeign RPC + Asynchronous RabbitMQ AMQP event messaging'
    ]
  },
  {
    id: '04-use-case-diagram',
    title: 'System Use-Case Diagram',
    subtitle: 'Actor Roles, Functional Boundaries, RBAC Enforcement & External Integrations',
    category: 'Functional Requirements',
    badge: 'UML Use-Case Model',
    slideNum: 'Slide 4 of 6',
    mdFile: '04-use-case-diagram.md',
    highlights: [
      'Clear Persona Partitioning: Passengers (ROLE_USER), Airport Staff (ROLE_STAFF), and Admins (ROLE_ADMIN)',
      'Full Aviation Lifecycle: Flight search, coupon validation, booking, checkout, check-in, and boarding',
      'External Collaborators: Razorpay payment gateway authorization, Gmail SMTP, and RabbitMQ event sync'
    ]
  },
  {
    id: '05-activity-diagram',
    title: 'Business Activity Diagram',
    subtitle: 'End-to-End Workflow Execution, Decision Gates, Concurrency & Rollbacks',
    category: 'Process Modeling',
    badge: 'UML Activity Model',
    slideNum: 'Slide 5 of 6',
    mdFile: '05-activity-diagram.md',
    highlights: [
      'Comprehensive validation checkpoints: Seat availability, promo coupon rules, HMAC signature matching',
      'Fork/Join Concurrency: Parallel seat reduction via RabbitMQ, e-ticket PDF generation, and email dispatch',
      'Departure Gate Verification: Airport staff mobile barcode scan transitioning passengers to BOARDED'
    ]
  },
  {
    id: '06-flow-diagram',
    title: 'System Execution & Data Flow Diagram',
    subtitle: 'Request Ingress Pipeline, OpenFeign RPC, AMQP Message Queues & DB Transactions',
    category: 'Data & Pipeline Flow',
    badge: 'Data Flow Model (DFD)',
    slideNum: 'Slide 6 of 6',
    mdFile: '06-flow-diagram.md',
    highlights: [
      'Traceable packet journey: Netty EventLoop -> Gateway Filters -> Eureka Lookup -> Dispatch',
      'Decoupled async pipelines: RabbitMQ AMQP messaging for eventual consistency and background jobs',
      'ACID relational commits via HikariCP connection pooling and MySQL InnoDB engine'
    ]
  }
];

function extractMermaidCode(markdown) {
  const match = markdown.match(/```mermaid([\s\S]*?)```/);
  if (!match) return '';
  return match[1].trim();
}

// Common CSS for presentation slides
const presentationCss = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

  @page {
    size: 297mm 210mm landscape;
    margin: 8mm 12mm 10mm 12mm;
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
    background-color: #0b132b;
    color: #f8fafc;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  .slide {
    width: 100%;
    min-height: 190mm;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 14px;
    background: radial-gradient(circle at 15% 15%, #172554 0%, #0b132b 55%, #050b1a 100%);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .slide-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1.5px solid rgba(255, 255, 255, 0.12);
    padding-bottom: 10px;
    margin-bottom: 12px;
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
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.3);
    padding: 3px 8px;
    border-radius: 6px;
  }

  .badge-slide {
    font-size: 7.5pt;
    font-weight: 700;
    color: #94a3b8;
    background: rgba(255, 255, 255, 0.08);
    padding: 3px 8px;
    border-radius: 6px;
  }

  .slide-title {
    font-size: 19pt;
    font-weight: 800;
    color: #ffffff;
    margin: 0;
    letter-spacing: -0.3px;
    background: linear-gradient(to right, #ffffff, #cbd5e1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .slide-subtitle {
    font-size: 9.5pt;
    color: #94a3b8;
    margin: 0;
    font-weight: 400;
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
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    color: #ffffff;
    font-size: 14px;
  }

  /* DIAGRAM CONTAINER */
  .diagram-wrapper {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(15, 23, 42, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 12px;
    margin-bottom: 12px;
    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
    overflow: hidden;
  }

  .mermaid {
    width: 100%;
    max-height: 125mm;
    display: flex;
    justify-content: center;
  }

  .mermaid svg {
    max-width: 100% !important;
    max-height: 125mm !important;
    height: auto !important;
  }

  /* SLIDE FOOTER / TALKING POINTS */
  .slide-footer-notes {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    background: rgba(30, 41, 59, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 10px 14px;
  }

  .note-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 8pt;
    line-height: 1.4;
    color: #cbd5e1;
  }

  .note-bullet {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #38bdf8;
    margin-top: 5px;
    flex-shrink: 0;
  }

  /* COVER SLIDE */
  .cover-slide {
    width: 100%;
    min-height: 190mm;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 30mm 20mm 20mm 20mm;
    background: radial-gradient(circle at 80% 20%, #1e3a8a 0%, #0b132b 60%, #030712 100%);
    border-radius: 12px;
  }

  .cover-header-badge {
    display: inline-block;
    font-size: 10pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.3);
    padding: 6px 14px;
    border-radius: 20px;
    margin-bottom: 20px;
  }

  .cover-big-title {
    font-size: 34pt;
    font-weight: 900;
    line-height: 1.15;
    letter-spacing: -0.5px;
    margin: 0;
    background: linear-gradient(135deg, #ffffff 0%, #93c5fd 60%, #38bdf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .cover-big-sub {
    font-size: 16pt;
    font-weight: 400;
    color: #94a3b8;
    margin-top: 14px;
    max-width: 800px;
    line-height: 1.4;
  }

  .cover-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 30px;
  }

  .cover-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 14px;
  }

  .cover-card-title {
    font-size: 11pt;
    font-weight: 700;
    color: #38bdf8;
    margin-bottom: 6px;
  }

  .cover-card-desc {
    font-size: 8.5pt;
    color: #94a3b8;
    line-height: 1.4;
  }

  .cover-footer-bar {
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    padding-top: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9pt;
    color: #64748b;
  }
`;

function buildSingleDiagramHtml(config, mermaidCode) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${config.title} - AeroBook Platform Presentation</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    ${presentationCss}
  </style>
</head>
<body>
  <div class="slide">
    <div class="slide-header">
      <div class="slide-title-block">
        <div class="slide-badges">
          <span class="badge-category">${config.category}</span>
          <span class="badge-slide">${config.badge}</span>
        </div>
        <h1 class="slide-title">${config.title}</h1>
        <p class="slide-subtitle">${config.subtitle}</p>
      </div>
      <div class="brand-logo">
        <div class="brand-plane">✈</div>
        <span>AeroBook</span>
      </div>
    </div>

    <div class="diagram-wrapper">
      <div class="mermaid">
${mermaidCode}
      </div>
    </div>

    <div class="slide-footer-notes">
      ${config.highlights.map(h => `
        <div class="note-item">
          <div class="note-bullet"></div>
          <div>${h}</div>
        </div>
      `).join('')}
    </div>
  </div>

  <script>
    document.addEventListener("DOMContentLoaded", function() {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'dark',
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
    });
  </script>
</body>
</html>`;
}

function buildDeckHtml(configs) {
  const slidesHtml = configs.map(config => {
    const mdPath = path.join(DIAGRAMS_DIR, config.mdFile);
    const md = fs.readFileSync(mdPath, 'utf8');
    const mermaidCode = extractMermaidCode(md);

    return `
    <div class="slide">
      <div class="slide-header">
        <div class="slide-title-block">
          <div class="slide-badges">
            <span class="badge-category">${config.category}</span>
            <span class="badge-slide">${config.slideNum} • ${config.badge}</span>
          </div>
          <h1 class="slide-title">${config.title}</h1>
          <p class="slide-subtitle">${config.subtitle}</p>
        </div>
        <div class="brand-logo">
          <div class="brand-plane">✈</div>
          <span>AeroBook</span>
        </div>
      </div>

      <div class="diagram-wrapper">
        <div class="mermaid">
${mermaidCode}
        </div>
      </div>

      <div class="slide-footer-notes">
        ${config.highlights.map(h => `
          <div class="note-item">
            <div class="note-bullet"></div>
            <div>${h}</div>
          </div>
        `).join('')}
      </div>
    </div>
    `;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>AeroBook Platform - Architectural & UML Diagrams Presentation Deck</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    ${presentationCss}
  </style>
</head>
<body>

  <!-- Cover Slide -->
  <div class="cover-slide">
    <div>
      <div class="cover-header-badge">Executive Architecture Presentation Deck</div>
      <h1 class="cover-big-title">AeroBook Cloud Airline Platform</h1>
      <p class="cover-big-sub">
        Comprehensive Technical Presentation Deck: System Architecture, UML Domain Models, Relational ER Diagrams, Business Workflows & Execution Pipelines.
      </p>

      <div class="cover-grid">
        <div class="cover-card">
          <div class="cover-card-title">1. System Architecture</div>
          <div class="cover-card-desc">Multi-tier microservices topology, Spring Cloud Gateway Netty ingress, and Eureka discovery.</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-title">2. Use-Case Model</div>
          <div class="cover-card-desc">Role-Based Access Control (Passenger, Staff, Admin) and third-party gateway integrations.</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-title">3. Domain Class Model</div>
          <div class="cover-card-desc">Domain entities, lifecycle enumerations, value objects, and cross-boundary associations.</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-title">4. Relational ER Model</div>
          <div class="cover-card-desc">Database-per-service pattern across 8 isolated MySQL schemas with explicit keys.</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-title">5. Business Activity Model</div>
          <div class="cover-card-desc">Procedural booking flow, payment fork/join concurrency, and gate barcode scan.</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-title">6. Data & Execution Flow</div>
          <div class="cover-card-desc">End-to-end packet journey from client ingress to OpenFeign RPC and RabbitMQ AMQP.</div>
        </div>
      </div>
    </div>

    <div class="cover-footer-bar">
      <div><strong>Platform:</strong> Java 21 LTS • Spring Boot 3.3.4 • Angular 18 • MySQL 8 • RabbitMQ</div>
      <div><strong>Prepared For:</strong> Technical Presentation & Architecture Review</div>
      <div>October 2026</div>
    </div>
  </div>

  <!-- Diagram Slides -->
  ${slidesHtml}

  <script>
    document.addEventListener("DOMContentLoaded", function() {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'dark',
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
    });
  </script>
</body>
</html>`;
}

// 1. Generate Individual Diagram HTML & PDF files
console.log('Generating individual diagram presentations...');

DIAGRAM_CONFIGS.forEach(config => {
  const mdPath = path.join(DIAGRAMS_DIR, config.mdFile);
  const mdContent = fs.readFileSync(mdPath, 'utf8');
  const mermaidCode = extractMermaidCode(mdContent);

  const htmlContent = buildSingleDiagramHtml(config, mermaidCode);
  const htmlPath = path.join(DIAGRAMS_DIR, `${config.id}.html`);
  const pdfPath = path.join(DIAGRAMS_DIR, `${config.id}.pdf`);

  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log(`Wrote HTML: ${htmlPath}`);

  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  const chromeCmd = `"${CHROME_PATH}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --virtual-time-budget=10000 --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${fileUrl}"`;

  try {
    execSync(chromeCmd, { stdio: 'inherit', timeout: 60000 });
    const stats = fs.statSync(pdfPath);
    console.log(`Generated PDF: ${pdfPath} (${(stats.size / 1024).toFixed(1)} KB)`);
  } catch (e) {
    console.error(`Failed to generate PDF for ${config.id}:`, e.message);
  }
});

// 2. Generate Consolidated Presentation Deck HTML & PDF
console.log('\nGenerating consolidated presentation deck...');
const deckHtml = buildDeckHtml(DIAGRAM_CONFIGS);
const deckHtmlPath = path.join(DIAGRAMS_DIR, 'AeroBook_Diagrams_Presentation.html');
const deckPdfPath = path.join(DIAGRAMS_DIR, 'AeroBook_Diagrams_Presentation.pdf');

fs.writeFileSync(deckHtmlPath, deckHtml, 'utf8');
console.log(`Wrote Master Deck HTML: ${deckHtmlPath}`);

const deckUrl = 'file:///' + deckHtmlPath.replace(/\\/g, '/');
const deckChromeCmd = `"${CHROME_PATH}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --virtual-time-budget=15000 --no-pdf-header-footer --print-to-pdf="${deckPdfPath}" "${deckUrl}"`;

try {
  execSync(deckChromeCmd, { stdio: 'inherit', timeout: 90000 });
  const deckStats = fs.statSync(deckPdfPath);
  console.log(`Generated Master Deck PDF: ${deckPdfPath} (${(deckStats.size / 1024).toFixed(1)} KB)`);
} catch (e) {
  console.error('Failed to generate Master Deck PDF:', e.message);
}

console.log('\nAll diagram presentations generated successfully!');

