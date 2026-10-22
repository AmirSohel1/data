const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const marked = require(path.join(__dirname, 'node_modules', 'marked'));

const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const OUTPUT_HTML = path.join(DOCS_DIR, 'complete_documentation.html');
const OUTPUT_PDF = path.join(DOCS_DIR, 'Complete_Project_Documentation.pdf');

// List of documentation files in logical order
const CHAPTERS = [
  { id: 'ch01', num: '1', title: 'Project Overview & Executive Summary', file: '01-project-overview.md' },
  { id: 'ch02', num: '2', title: 'Technology Stack & Version Matrix', file: '02-technology-stack.md' },
  { id: 'ch03', num: '3', title: 'System Architecture & Boundaries', file: '03-system-architecture.md' },
  { id: 'ch04', num: '4', title: 'Project Structure & Monorepo Anatomy', file: '04-project-structure.md' },
  { id: 'ch05-01', num: '5.1', title: 'Microservice: Service Discovery (Eureka)', file: '05-microservices/service-discovery.md' },
  { id: 'ch05-02', num: '5.2', title: 'Microservice: Config Server', file: '05-microservices/config-server.md' },
  { id: 'ch05-03', num: '5.3', title: 'Microservice: API Gateway', file: '05-microservices/api-gateway.md' },
  { id: 'ch05-04', num: '5.4', title: 'Microservice: Auth Service', file: '05-microservices/auth-service.md' },
  { id: 'ch05-05', num: '5.5', title: 'Microservice: User Service', file: '05-microservices/user-service.md' },
  { id: 'ch05-06', num: '5.6', title: 'Microservice: Flight Service', file: '05-microservices/flight-service.md' },
  { id: 'ch05-07', num: '5.7', title: 'Microservice: Fare Service', file: '05-microservices/fare-service.md' },
  { id: 'ch05-08', num: '5.8', title: 'Microservice: Booking Service', file: '05-microservices/booking-service.md' },
  { id: 'ch05-09', num: '5.9', title: 'Microservice: Check-In Service', file: '05-microservices/check-in-service.md' },
  { id: 'ch05-10', num: '5.10', title: 'Microservice: Notification Service', file: '05-microservices/notification-service.md' },
  { id: 'ch05-11', num: '5.11', title: 'Microservice: Payment Service', file: '05-microservices/payment-service.md' },
  { id: 'ch06', num: '6', title: 'Frontend Architecture (Angular 18)', file: '06-frontend.md' },
  { id: 'ch07', num: '7', title: 'Master REST API Reference Catalog', file: '07-api-reference.md' },
  { id: 'ch08', num: '8', title: 'Database Design & Relational Persistence', file: '08-database-design.md' },
  { id: 'ch09', num: '9', title: 'Inter-Service Communication (Feign & RabbitMQ)', file: '09-service-communication.md' },
  { id: 'ch10', num: '10', title: 'Platform Security, JWT & RBAC Matrix', file: '10-security.md' },
  { id: 'ch11', num: '11', title: 'Configuration Reference & Environment Catalog', file: '11-configuration.md' },
  { id: 'ch12', num: '12', title: 'Local Development & Startup Guide', file: '12-local-development.md' },
  { id: 'ch13', num: '13', title: 'Deployment & Containerization Architecture', file: '13-deployment.md' },
  { id: 'ch14', num: '14', title: 'Testing & Quality Assurance Architecture', file: '14-testing.md' },
  { id: 'ch15', num: '15', title: 'Observability, Monitoring & Logging', file: '15-observability.md' },
  { id: 'ch16', num: '16', title: 'Core Business Workflows & Sequence Flows', file: '16-business-workflows.md' },
  { id: 'ch17', num: '17', title: 'Operational Troubleshooting Runbook', file: '17-troubleshooting.md' },
  { id: 'ch18', num: '18', title: 'Domain & Technical Glossary', file: '18-glossary.md' },
  { id: 'ch19', num: '19', title: 'Architecture Decision Records (ADRs)', file: '19-architecture-decisions.md' },
  { id: 'ch20', num: '20', title: 'Architecture Evolution & Recommendations', file: '20-recommendations.md' },
  { id: 'ch21', num: '21', title: 'Definitive Platform Service Inventory', file: '21-service-inventory.md' },
  { id: 'ch22', num: '22', title: 'Documentation Coverage & Verification Audit', file: '22-documentation-coverage.md' }
];

console.log('Assembling documentation chapters...');

// Process markdown to HTML
let chaptersHtml = '';
let tocHtml = '<ul class="toc-list">';

CHAPTERS.forEach((ch, idx) => {
  const filePath = path.join(DOCS_DIR, ch.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace GitHub callouts
  content = content.replace(/> \[!NOTE\]\s*(.*)/g, '<div class="alert alert-note"><strong>NOTE:</strong> $1</div>');
  content = content.replace(/> \[!WARNING\]\s*(.*)/g, '<div class="alert alert-warning"><strong>WARNING:</strong> $1</div>');
  content = content.replace(/> \[!TIP\]\s*(.*)/g, '<div class="alert alert-tip"><strong>TIP:</strong> $1</div>');
  content = content.replace(/> \[!IMPORTANT\]\s*(.*)/g, '<div class="alert alert-important"><strong>IMPORTANT:</strong> $1</div>');

  // Convert markdown to HTML
  let html = marked.parse(content);

  // Convert ```mermaid code blocks into <pre class="mermaid">
  html = html.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g, (match, p1) => {
    // Unescape HTML entities in mermaid code
    const rawMermaid = p1
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    return `<div class="mermaid-container"><pre class="mermaid">\n${rawMermaid}\n</pre></div>`;
  });

  // Wrap in a chapter container with page-break
  chaptersHtml += `
    <section class="chapter" id="${ch.id}">
      <div class="chapter-badge">Chapter ${ch.num}</div>
      <div class="chapter-content">
        ${html}
      </div>
    </section>
  `;

  tocHtml += `
    <li class="toc-item">
      <span class="toc-num">${ch.num}</span>
      <a href="#${ch.id}" class="toc-link">${ch.title}</a>
      <span class="toc-dots"></span>
    </li>
  `;
});

tocHtml += '</ul>';

// Professional styling
const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>AeroBook Platform - Complete Technical Documentation</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

    @page {
      size: A4;
      margin: 20mm 16mm 22mm 16mm;
      @bottom-right {
        content: "Page " counter(page);
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: #64748b;
      }
      @bottom-left {
        content: "AeroBook Cloud Airline Platform - Architecture & Reference";
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: #94a3b8;
      }
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 9.5pt;
      line-height: 1.55;
      color: #1e293b;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }

    /* Cover Page */
    .cover-page {
      page-break-after: always;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 40mm 15mm 20mm 15mm;
      background: linear-gradient(135deg, #09132b 0%, #172554 45%, #1e3a8a 100%);
      color: #ffffff;
      border-radius: 4px;
    }

    .cover-brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .cover-logo-badge {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      font-weight: 800;
      color: #ffffff;
      box-shadow: 0 10px 25px rgba(29, 78, 216, 0.4);
    }

    .cover-brand-title {
      font-size: 28pt;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
      background: linear-gradient(to right, #ffffff, #93c5fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-main {
      margin-top: 40px;
    }

    .cover-subtitle {
      font-size: 15pt;
      font-weight: 400;
      color: #bfdbfe;
      margin-top: 12px;
      line-height: 1.4;
      max-width: 650px;
    }

    .cover-tagline {
      font-size: 10.5pt;
      color: #93c5fd;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .cover-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 30px;
    }

    .cover-pill {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 8.5pt;
      font-weight: 500;
      color: #e0f2fe;
    }

    .cover-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      font-size: 8.5pt;
      color: #94a3b8;
    }

    .cover-meta strong {
      color: #ffffff;
    }

    /* TOC Page */
    .toc-page {
      page-break-before: always;
      page-break-after: always;
      padding: 10mm 5mm;
    }

    .toc-header {
      font-size: 20pt;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 8px;
      margin-bottom: 24px;
    }

    .toc-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .toc-item {
      display: flex;
      align-items: baseline;
      padding: 6px 0;
      border-bottom: 1px dotted #e2e8f0;
      font-size: 9pt;
    }

    .toc-num {
      font-weight: 700;
      color: #2563eb;
      width: 45px;
      flex-shrink: 0;
    }

    .toc-link {
      color: #1e293b;
      text-decoration: none;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .toc-dots {
      flex-grow: 1;
      border-bottom: 1px dotted #cbd5e1;
      margin: 0 8px;
    }

    /* Chapter Containers */
    .chapter {
      page-break-before: always;
      margin-top: 15px;
    }

    .chapter-badge {
      display: inline-block;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      padding: 3px 10px;
      border-radius: 6px;
      margin-bottom: 8px;
    }

    /* Headings */
    h1 {
      font-size: 17pt;
      font-weight: 800;
      color: #0f172a;
      margin-top: 4px;
      margin-bottom: 14px;
      line-height: 1.25;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 6px;
    }

    h2 {
      font-size: 13pt;
      font-weight: 700;
      color: #1e3a8a;
      margin-top: 20px;
      margin-bottom: 10px;
      line-height: 1.3;
    }

    h3 {
      font-size: 10.5pt;
      font-weight: 600;
      color: #334155;
      margin-top: 14px;
      margin-bottom: 6px;
    }

    h4 {
      font-size: 9.5pt;
      font-weight: 600;
      color: #475569;
      margin-top: 10px;
      margin-bottom: 4px;
    }

    p {
      margin-top: 0;
      margin-bottom: 10px;
      color: #334155;
      text-align: justify;
    }

    /* Lists */
    ul, ol {
      margin-top: 0;
      margin-bottom: 10px;
      padding-left: 20px;
      color: #334155;
    }

    li {
      margin-bottom: 4px;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 16px 0;
      font-size: 8.5pt;
      page-break-inside: auto;
    }

    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }

    thead th {
      background-color: #0f172a;
      color: #ffffff;
      font-weight: 600;
      text-align: left;
      padding: 7px 10px;
      border: 1px solid #1e293b;
    }

    tbody td {
      padding: 6px 10px;
      border: 1px solid #e2e8f0;
      color: #334155;
      vertical-align: top;
    }

    tbody tr:nth-child(even) {
      background-color: #f8fafc;
    }

    /* Code & Syntax */
    pre {
      background-color: #0f172a;
      color: #f8fafc;
      padding: 10px 14px;
      border-radius: 6px;
      font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
      font-size: 8pt;
      line-height: 1.45;
      overflow-x: auto;
      margin: 10px 0 14px 0;
      page-break-inside: avoid;
      border: 1px solid #334155;
    }

    code {
      font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
      font-size: 8.5pt;
      background-color: #f1f5f9;
      color: #0f172a;
      padding: 2px 5px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    pre code {
      background-color: transparent;
      color: inherit;
      padding: 0;
      border: none;
      font-size: 8pt;
    }

    /* Mermaid Diagrams */
    .mermaid-container {
      margin: 16px 0;
      padding: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      text-align: center;
      page-break-inside: avoid;
    }

    .mermaid {
      font-family: 'Inter', sans-serif !important;
    }

    /* Alerts */
    .alert {
      padding: 9px 14px;
      border-radius: 6px;
      margin: 10px 0 14px 0;
      font-size: 8.5pt;
      line-height: 1.45;
      page-break-inside: avoid;
    }

    .alert-note {
      background-color: #eff6ff;
      border-left: 4px solid #2563eb;
      color: #1e40af;
    }

    .alert-warning {
      background-color: #fffbeb;
      border-left: 4px solid #d97706;
      color: #92400e;
    }

    .alert-tip {
      background-color: #ecfdf5;
      border-left: 4px solid #059669;
      color: #065f46;
    }

    .alert-important {
      background-color: #fef2f2;
      border-left: 4px solid #dc2626;
      color: #991b1b;
    }

    hr {
      border: 0;
      border-top: 1px solid #e2e8f0;
      margin: 18px 0;
    }
  </style>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover-page">
    <div class="cover-brand">
      <div class="cover-logo-badge">✈</div>
      <div>
        <div class="cover-tagline">Enterprise Platform Architecture</div>
        <h1 class="cover-brand-title">AeroBook</h1>
      </div>
    </div>

    <div class="cover-main">
      <div style="font-size: 24pt; font-weight: 800; line-height: 1.2;">
        Cloud Airline Reservation & Operations Ecosystem
      </div>
      <div class="cover-subtitle">
        Complete Technical Architecture, Microservices Directory, REST API Catalog, Relational Data Persistence, Security Specifications, and Operational Runbooks.
      </div>

      <div class="cover-pills">
        <span class="cover-pill">Java 21 LTS</span>
        <span class="cover-pill">Spring Boot 3.3.4</span>
        <span class="cover-pill">Angular 18.2</span>
        <span class="cover-pill">Spring Cloud Gateway</span>
        <span class="cover-pill">Netflix Eureka</span>
        <span class="cover-pill">MySQL 8.0</span>
        <span class="cover-pill">RabbitMQ AMQP</span>
        <span class="cover-pill">Razorpay Payment Gateway</span>
        <span class="cover-pill">SonarQube Governed</span>
      </div>
    </div>

    <div class="cover-footer">
      <div class="cover-meta">
        <div><strong>Author:</strong> AeroBook Platform Engineering & Architecture Team</div>
        <div><strong>Document Status:</strong> Production Verified | Version 1.0.0</div>
      </div>
      <div class="cover-meta" style="text-align: right;">
        <div><strong>Date:</strong> October 2026</div>
        <div><strong>Target Environment:</strong> Cloud Native / Microservices Monorepo</div>
      </div>
    </div>
  </div>

  <!-- Table of Contents Page -->
  <div class="toc-page">
    <div class="toc-header">Table of Contents</div>
    ${tocHtml}
  </div>

  <!-- Documentation Chapters -->
  ${chaptersHtml}

  <script>
    document.addEventListener("DOMContentLoaded", function() {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'neutral',
        flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
        securityLevel: 'loose'
      });
    });
  </script>
</body>
</html>
`;

console.log('Writing unified HTML document to ' + OUTPUT_HTML);
fs.writeFileSync(OUTPUT_HTML, htmlTemplate, 'utf8');

console.log('Converting HTML to PDF via Chrome Headless...');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const fileUrl = 'file:///' + OUTPUT_HTML.replace(/\\/g, '/');

const chromeCmd = `"${chromePath}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --virtual-time-budget=12000 --no-pdf-header-footer --print-to-pdf="${OUTPUT_PDF}" "${fileUrl}"`;

try {
  execSync(chromeCmd, { stdio: 'inherit', timeout: 90000 });
  console.log('PDF generated successfully!');

  if (fs.existsSync(OUTPUT_PDF)) {
    const stats = fs.statSync(OUTPUT_PDF);
    console.log(`Verified PDF File: ${OUTPUT_PDF} (${(stats.size / 1024).toFixed(1)} KB)`);
  }
} catch (err) {
  console.error('Error generating PDF with Chrome:', err.message);
  process.exit(1);
}

