import type { RichTextValue } from "@/components/portable-text";

export type LegalSubsection = {
  title: string;
  paragraphs: string[];
  list?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
  callout?: string;
};

export type LegalSection = {
  id: string;
  sectionNumber?: string;
  title: string;
  icon?: string;
  summary?: string;
  subsections?: LegalSubsection[];
  content?: RichTextValue; // Portable Text if loaded from Sanity
};

export type LegalPageData = {
  _id?: string;
  title: string;
  slug: { current: string };
  h1: string;
  version?: string;
  lastUpdated: string;
  effectiveDate?: string;
  preambleHeading?: string;
  preamble: string;
  sections: LegalSection[];
  seo?: {
    title?: string;
    description?: string;

    ogImage?: string;
  };
};

// ---------------------------------------------------------------------------
// Fallback Privacy Policy Data
// Governed by the Cyber Security and Data Protection Act [Chapter 12:07]
// ---------------------------------------------------------------------------

export const FALLBACK_PRIVACY_POLICY: LegalPageData = {
  title: "Privacy Policy",
  slug: { current: "privacy-policy" },
  h1: "Data Governance and Statutory Privacy Policy",
  version: "V 1.2",
  lastUpdated: "May 12, 2026",
  effectiveDate: "January 1, 2026",
  preambleHeading: "Statutory Preamble and Data Stewardship Mandate",
  preamble:
    "Sparkline Labs (Private) Limited (\"Sparkline Labs\", \"the Company\", \"we\", \"us\") operates as a premier solutions engineering and software development studio headquartered in Harare, Zimbabwe. This protocol defines the mandatory statutory mechanics for the aggregation, processing, encryption, and protection of personal and enterprise data across all our software products, client portals, APIs, and digital infrastructure.\n\nOur data governance framework is engineered strictly in compliance with the Cyber Security and Data Protection Act [Chapter 12:07] of Zimbabwe, international standards for information security, and applicable regional privacy statutes. By accessing our services, websites, or software platforms, you provide informed consent to these statutory data processing standards. If you do not agree with these provisions, you must immediately terminate your interaction with our infrastructure.\n\nWe enforce strict technical and organizational safeguards under Chapter 12:07, including role-based access control (RBAC), end-to-end cryptographic transport protocols (TLS 1.3), and continuous automated vulnerability audits to safeguard enterprise and personal records.",
  sections: [

    {
      id: "scope-of-data-collection",
      sectionNumber: "1.0",
      title: "Scope of Personal and Enterprise Data Aggregation",
      icon: "database",
      summary:
        "Detailed classification of identification, technical, telemetry, and transactional data aggregated across our software ecosystem.",
      subsections: [
        {
          title: "1.1 Client & Authorized Representative Credentials",
          paragraphs: [
            "To establish contractual relationships, provision software access, and facilitate secure technical onboarding, Sparkline Labs collects direct identification credentials from clients, enterprise partners, and authorized users.",
            "Collected data includes full legal names, business corporate registration numbers, national identity or passport numbers for authorized signatories, verified business email addresses, primary telephone numbers, physical enterprise addresses, and cryptographically hashed authentication credentials.",
          ],
        },
        {
          title: "1.2 Enterprise Technical & System Metadata",
          paragraphs: [
            "During the design, deployment, and operational maintenance of custom software platforms, integrations, and internal dashboards, we process operational metadata necessary for system execution.",
            "This metadata includes API endpoint configurations, webhook receiver logs, database connection parameters (stored in encrypted key-vault environments), integration credentials (such as WhatsApp Business API tokens and EcoCash / Paynow merchant keys), and transactional record structures required for workflow automation.",
          ],
        },
        {
          title: "1.3 Automated Technical Intelligence & Diagnostics",
          paragraphs: [
            "Our infrastructure automatically captures telemetry and runtime intelligence when users interact with our web applications, SaaS tools, and APIs.",
            "Logged parameters include originating Internet Protocol (IP) addresses, cryptographic session tokens, browser runtime engines, operating system architectures, device telemetry, request latency metrics, HTTP headers, and error stack traces. This data is leveraged strictly for cybersecurity defense, DDoS mitigation, and performance tuning across variable Southern African internet backbones.",
          ],
        },
        {
          title: "1.4 Communications & Support Audit Trails",
          paragraphs: [
            "We archive electronic communications transmitted through our support desks, project management portals, email gateways, and verified WhatsApp business lines.",
            "These records constitute an immutable technical and contractual audit trail used to verify project change requests, milestone sign-offs, dispute resolution proceedings, and statutory compliance audits.",
          ],
        },
      ],
    },
    {
      id: "lawful-basis-and-utilization",
      sectionNumber: "2.0",
      title: "Lawful Basis and Technical Utilization",
      icon: "file-text",
      summary:
        "The statutory bases under Chapter 12:07 authorizing our processing activities and operational objectives.",
      subsections: [
        {
          title: "2.1 Execution of Contractual & Technical Commitments",
          paragraphs: [
            "The primary lawful basis for processing personal and corporate data is the performance of technical contracts and statements of work (SOW) executed between Sparkline Labs and our clients.",
            "Data is utilized to architect bespoke software systems, deploy cloud and on-premises infrastructure, configure transactional automations, test database schemas, and deliver continuous maintenance.",
          ],
        },
        {
          title: "2.2 Infrastructure Optimization & Performance Intelligence",
          paragraphs: [
            "Aggregated and anonymized runtime analytics are processed to detect memory leaks, identify slow SQL queries, optimize edge caching rules, and enhance application responsiveness.",
            "We perform continuous telemetry monitoring to guarantee high system availability and resilience against localized infrastructure variances, such as power grid fluctuations and telecommunications downtime in Zimbabwe.",
          ],
        },
        {
          title: "2.3 Operational Communications & Incident Alerts",
          paragraphs: [
            "We utilize verified contact credentials to transmit high-priority operational notifications, including scheduled maintenance windows, API deprecation warnings, critical security patches, and deployment completion reports.",
            "Transactional billing statements, milestone completion invoices, and statutory tax certificates are similarly transmitted through authenticated electronic channels.",
          ],
        },
        {
          title: "2.4 Statutory Compliance & Security Enforcement",
          paragraphs: [
            "Data is processed and retained where mandated by Zimbabwean law, including anti-money laundering (AML) protocols, taxation audits administered by the Zimbabwe Revenue Authority (ZIMRA), and lawful directives issued by statutory cyber authorities.",
          ],
          callout:
            "Sparkline Labs never sells, monetizes, or rents personal identifying data or proprietary client source materials to third-party brokers or external commercial entities under any circumstances.",
        },
      ],
    },
    {
      id: "proprietary-covenants-and-rights",
      sectionNumber: "3.0",
      title: "Proprietary Covenants and Statutory Rights",
      icon: "scale",
      summary:
        "Unambiguous affirmation of client data ownership and statutory rights under the Cyber Security and Data Protection Act.",
      subsections: [
        {
          title: "3.1 Client Enterprise Data Sovereignty",
          paragraphs: [
            "Sparkline Labs unequivocally recognizes that our clients retain exclusive, unconditional ownership of all proprietary data, business logic, customer databases, and intellectual assets uploaded to or processed through systems we engineer.",
            "Our status in relation to client enterprise records is strictly that of a Data Processor / Technical Intermediary operating under documented contractual instructions.",
          ],
        },
        {
          title: "3.2 Limited Technical Processing License",
          paragraphs: [
            "To perform software development, deployment, and cloud maintenance, you grant Sparkline Labs a non-exclusive, revocable, royalty-free operating license to:",
            "• Host, process, and synchronize data within designated staging and production cloud clusters.",
            "• Perform automated database backups, data sanitization for staging environments, and database migrations.",
            "• Execute automated testing suites, continuous integration / continuous deployment (CI/CD) pipelines, and code compilation routines.",
          ],
        },
        {
          title: "3.3 Enforceable Statutory Rights under Zimbabwean Law",
          paragraphs: [
            "Under the Cyber Security and Data Protection Act [Chapter 12:07], every data subject possesses statutory rights enforceable against our Harare offices:",
          ],
          list: [
            "Right of Access: You are entitled to demand a comprehensive digital extract of all personal data held within our active production and staging environments.",
            "Right of Rectification: You may mandate the immediate correction of inaccurate, outdated, or incomplete personal or corporate records.",
            "Right of Erasure ('Right to be Forgotten'): You may demand the permanent scrubbing of your data, subject to statutory retention exceptions under ZIMRA and AML regulations.",
            "Right to Object: You may formally object to processing activities conducted under legitimate interest grounds, including non-essential telemetry analytics.",
            "Right to Data Portability: You may request that your structured enterprise data be exported in an open, industry-standard machine-readable format (e.g. JSON, CSV).",
          ],
        },
      ],
    },
    {
      id: "infrastructure-security-standards",
      sectionNumber: "4.0",
      title: "Infrastructure Security & Cryptographic Standards",
      icon: "lock",
      summary:
        "High-grade encryption protocols, perimeter defenses, and statutory breach response mechanics.",
      subsections: [
        {
          title: "4.1 Cryptographic Controls in Transit and at Rest",
          paragraphs: [
            "All data transmitted across public internet networks to or from Sparkline Labs endpoints is secured using Transport Layer Security (TLS 1.3) protocols with strict forward secrecy and HSTS enforcement.",
            "Data at rest—including database volumes, cold storage backups, API token vaults, and private encryption keys—is safeguarded using Advanced Encryption Standard (AES) with 256-bit keys. Sensitive authentication credentials and master secrets are segregated in dedicated hardware security modules (HSMs) or zero-trust cloud secret vaults.",
          ],
        },
        {
          title: "4.2 Logical Access Governance & Zero Trust Architecture",
          paragraphs: [
            "Internal access to production servers, databases, and continuous deployment pipelines is strictly governed by the Principle of Least Privilege (PoLP) and Role-Based Access Control (RBAC).",
            "Technical personnel must authenticate using hardware-backed Multi-Factor Authentication (MFA) and access infrastructure exclusively via encrypted VPN bastions with comprehensive session audit logging.",
          ],
        },
        {
          title: "4.3 72-Hour Statutory Breach Notification Protocol",
          paragraphs: [
            "In strict compliance with Chapter 12:07 of Zimbabwean law, Sparkline Labs maintains an active, documented Computer Security Incident Response Plan (CSIRP).",
            "In the event of a verified unauthorized breach, infiltration, or data compromise involving personal records, Sparkline Labs will formally notify affected data subjects and the relevant statutory regulatory authorities within 72 hours of verification.",
          ],
        },
      ],
    },
    {
      id: "subprocessors-and-cross-border-transfers",
      sectionNumber: "5.0",
      title: "Third-Party Subprocessors & Cross-Border Data Flows",
      icon: "share-2",
      summary:
        "Infrastructure partners, FinTech integrations, and statutory conditions for transnational data transmission.",
      subsections: [
        {
          title: "5.1 Qualified Technical Subprocessors",
          paragraphs: [
            "To maintain high-availability systems, low-latency CDN edge routing, and resilient storage, Sparkline Labs contracts with audited international and regional infrastructure providers:",
          ],
          table: {
            headers: ["Partner / Provider", "Functional Scope", "Jurisdiction & Compliance"],
            rows: [
              [
                "Cloud Compute & Database Hosts",
                "Dedicated server instances, managed PostgreSQL clusters, distributed Redis caches",
                "ISO 27001 / SOC 2 Type II Certified Facilities",
              ],
              [
                "Sanity.io Content Infrastructure",
                "Structured CMS data storage, image transformations, legal content distribution",
                "EU-US DPF / GDPR & Chapter 12:07 Compliant",
              ],
              [
                "Edge Network & CDN Gateways",
                "DDoS protection, static asset acceleration, edge TLS termination",
                "Global Anycast Edge Network",
              ],
              [
                "FinTech & Mobile Money Rails",
                "EcoCash, InnBucks, Paynow, Zimswitch payment validation and API callbacks",
                "RBZ-Monitored Payment Providers (Zimbabwe)",
              ],
              [
                "WhatsApp Cloud API / Meta",
                "Automated customer lead routing, transactional webhook notifications",
                "Enterprise SLA & End-to-End Cryptography",
              ],
            ],
          },
        },
        {
          title: "5.2 Cross-Border Data Transfer Protections",
          paragraphs: [
            "Where data is transferred outside the borders of Zimbabwe for cloud compute or redundant geographical disaster recovery, Sparkline Labs ensures that the destination territory maintains data protection standards equal to or exceeding Chapter 12:07.",
            "All cross-border transfers are executed pursuant to Standard Contractual Clauses (SCCs) guaranteeing enforceable data subject rights and robust judicial remedies.",
          ],
        },
        {
          title: "5.3 Compelled Regulatory & Law Enforcement Disclosures",
          paragraphs: [
            "We disclose client or personal data to government authorities, statutory bodies, or law enforcement strictly when compelled by a valid subpoena, court order, or written directive issued by a court of competent jurisdiction in Zimbabwe.",
            "We review each legal request critically to ensure that statutory thresholds have been satisfied prior to disclosing any information.",
          ],
        },
      ],
    },
    {
      id: "data-retention-and-deletion",
      sectionNumber: "6.0",
      title: "Data Retention Schedules and Deletion Protocols",
      icon: "database",
      summary:
        "Statutory timelines for record keeping and secure cryptographic sanitization upon project completion.",
      subsections: [
        {
          title: "6.1 Statutory Retention Framework",
          paragraphs: [
            "Sparkline Labs does not retain data longer than is technically necessary for service fulfillment or required by Zimbabwean statutory law:",
          ],
          table: {
            headers: ["Data Category", "Statutory Retention Period", "Governing Mandate"],
            rows: [
              [
                "Client Account Records & Contracts",
                "Active Contract Duration + 5 Years",
                "Statutory Commercial Prescription Act",
              ],
              [
                "Invoicing, VAT & Tax Records",
                "10 Years from Transaction Date",
                "Zimbabwe Revenue Authority (ZIMRA) Mandate",
              ],
              [
                "Project Repositories & Backups",
                "Contract Duration + 90 Days post-termination",
                "Client Transition & Decommissioning Policy",
              ],
              [
                "Technical Diagnostics & Server Logs",
                "12 Months from Logging Date",
                "Cybersecurity Incident Audit Standard",
              ],
              [
                "Support & Ticketing Audit Trails",
                "3 Years from Ticket Resolution",
                "Contractual Dispute & SLA Verification",
              ],
            ],
          },
        },
        {
          title: "6.2 Decommissioning & Cryptographic Sanitization",
          paragraphs: [
            "Upon formal project offboarding or account deletion requests, public access endpoints are disabled within 24 hours.",
            "Associated database tables and project staging volumes are cryptographically overwritten using DoD 5220.22-M sanitization standards or permanent cryptographic key destruction within 30 business days, ensuring no recoverable data fragments remain on physical media.",
          ],
        },
      ],
    },
    {
      id: "technical-tracking-and-cookies",
      sectionNumber: "7.0",
      title: "Technical Tracking, Cookies & Behavioral Telemetry",
      icon: "code",
      summary:
        "Transparent categorization of first-party and third-party tracking identifiers.",
      subsections: [
        {
          title: "7.1 Functional Hierarchy of Tracking Identifiers",
          paragraphs: [
            "Sparkline Labs utilizes HTTP cookies and local storage tokens strictly to maintain essential operational integrity:",
            "• Strictly Necessary Infrastructure Cookies: Essential for session authentication, CSRF cross-site request forgery defense, and load balancer affinity. These cannot be disabled.",
            "• Performance & Diagnostic Telemetry: First-party analytics scripts utilized to measure page load speeds, resource rendering times, and navigation drop-offs. No personally identifiable tracking profiles are constructed.",
          ],
        },
        {
          title: "7.2 User Telemetry Calibration",
          paragraphs: [
            "Users may configure their browser environments to reject or delete tracking cookies at any time. Disabling strictly necessary cookies may impair portal functionality or prevent authenticated logins.",
          ],
        },
      ],
    },
    {
      id: "enterprise-confidentiality",
      sectionNumber: "8.0",
      title: "Enterprise Data Confidentiality & Vulnerability Disclosure",
      icon: "shield",
      summary:
        "Non-disclosure obligations regarding client proprietary logic and coordinated vulnerability guidelines.",
      subsections: [
        {
          title: "8.1 Professional Secrecy",
          paragraphs: [
            "All software architecture diagrams, proprietary database schemas, source code files, and trade secrets disclosed to Sparkline Labs during client engagements are treated as strictly confidential.",
            "All engineering staff are bound by perpetual non-disclosure agreements enforceable in the High Court of Zimbabwe.",
          ],
        },
        {
          title: "8.2 Responsible Security Disclosure",
          paragraphs: [
            "Sparkline Labs actively encourages security researchers to report potential vulnerabilities in our public systems. Reports should be transmitted to security@sparklinelabs.co.zw with encrypted proof-of-concept details. We adhere to responsible disclosure principles and provide coordinated remediation timelines.",
          ],
        },
      ],
    },
    {
      id: "governance-and-dpo-contacts",
      sectionNumber: "9.0",
      title: "Regulatory Oversight and Data Protection Officer Contacts",
      icon: "user-check",
      summary:
        "Official channels for statutory requests, data subject access demands, and regulatory inquiries.",
      subsections: [
        {
          title: "9.1 Data Protection Officer (DPO)",
          paragraphs: [
            "Sparkline Labs has designated an internal Data Protection Officer responsible for monitoring adherence to the Cyber Security and Data Protection Act [Chapter 12:07].",
            "For all formal inquiries, statutory access requests, rectification demands, or complaints, contact our legal bureau:",
            "• Legal Entity: Sparkline Labs (Private) Limited",
            "• Physical Address: Harare, Zimbabwe",
            "• Legal & Privacy Bureau: privacy@sparklinelabs.co.zw",
            "• Corporate Telephone / WhatsApp: +263 71 463 8508",
          ],
        },
        {
          title: "9.2 Protocol Amendments and Periodic Review",
          paragraphs: [
            "We reserve the right to revise this Data Governance and Statutory Privacy Policy periodically to reflect technological shifts, statutory regulatory updates, or changes in corporate structure. Material updates will be highlighted via our portal and timestamped with a new revision date.",
          ],
        },
      ],
    },
  ],
  seo: {
    title: "Statutory Data Governance & Privacy Policy",
    description:
      "Official data privacy and cybersecurity protocol of Sparkline Labs (Pvt) Ltd under the Cyber Security and Data Protection Act [Chapter 12:07] of Zimbabwe. Learn how we safeguard client and system data.",
  },

};

// ---------------------------------------------------------------------------
// Fallback Terms of Service Data
// Governed by the Laws of Zimbabwe & Arbitration Act [Chapter 7:15]
// ---------------------------------------------------------------------------

export const FALLBACK_TERMS_OF_SERVICE: LegalPageData = {
  title: "Terms of Service",
  slug: { current: "terms-of-service" },
  h1: "Statutory Terms of Service and Operating Mandate",
  version: "V 1.3",
  lastUpdated: "March 1, 2026",
  effectiveDate: "March 1, 2026",
  preambleHeading: "Mandatory Legal Acknowledgment and Operating Mandate",
  preamble:
    "These Terms of Service (\"Terms\", \"Agreement\") constitute a legally binding corporate contract between you or the entity you represent (\"Client\", \"User\") and Sparkline Labs (Private) Limited (\"Sparkline Labs\", \"the Company\", \"we\", \"us\"), governing your access to and utilization of our software development services, custom technical platforms, solution architecture, APIs, and digital infrastructure.\n\nBy engaging our services, commissioning a technical Statement of Work (SOW), accessing our platforms, or utilizing any software engineered by Sparkline Labs, you represent that you possess the requisite legal capacity and authority to enter into this Agreement. If you do not accept these terms and conditions unconditionally, you are prohibited from utilizing our platforms, software, or technical services.\n\nThis Agreement enforces strict limitations on technical liability, establishes mutual non-disclosure covenants, mandates binding arbitration under the Arbitration Act [Chapter 7:15] in Harare, Zimbabwe for all disputes, and defines intellectual property boundaries.",
  sections: [

    {
      id: "statutory-definitions",
      sectionNumber: "1.0",
      title: "Statutory & Operational Definitions",
      icon: "book-open",
      summary:
        "Binding legal and operational definitions governing the interpretation of this Agreement.",
      subsections: [
        {
          title: "1.1 Defined Terms",
          paragraphs: [
            "The following terms shall bear the ascribed meanings throughout this Agreement:",
          ],
          list: [
            "\"Company\" means Sparkline Labs (Private) Limited, a registered company incorporated in the Republic of Zimbabwe.",
            "\"Client\" means the individual, commercial business, or enterprise contracting with Sparkline Labs for technical services or platform access.",
            "\"Services\" means custom software engineering, solution architecture, API development, integration engineering, technical modernization, and cloud infrastructure consulting.",
            "\"Deliverables\" means the discrete software components, source code, data schemas, API specifications, and architectural documentation created for Client pursuant to a Statement of Work.",
            "\"Statement of Work (SOW)\" means a written schedule, formal quote, or technical specification signed or electronically approved by both parties detailing project milestones and commercial fees.",
            "\"Confidential Information\" means all non-public technical, financial, commercial, and operational information disclosed by one party to the other.",
            "\"Platform\" means any digital application, software portal, web service, or API infrastructure hosted or managed by Sparkline Labs (including Propertyzone).",
            "\"Third-Party Dependencies\" means external APIs, cloud compute infrastructure, telecommunication networks, and third-party software libraries not authored by the Company.",
          ],
        },
      ],
    },
    {
      id: "eligibility-and-corporate-authority",
      sectionNumber: "2.0",
      title: "Eligibility, Authority & Account Governance",
      icon: "user-check",
      summary:
        "Contractual capacity, authorized corporate representation, and credential security standards.",
      subsections: [
        {
          title: "2.1 Contractual Capacity under Zimbabwean Law",
          paragraphs: [
            "Access to and engagement with Sparkline Labs is strictly restricted to legal entities and individuals who possess full legal capacity to enter into binding contracts under the laws of Zimbabwe. Individuals executing agreements on behalf of a corporation warrant that they are duly authorized officers.",
          ],
        },
        {
          title: "2.2 Account Security & Mutual Vigilance",
          paragraphs: [
            "Where software platforms or staging dashboards require authentication credentials, Client is solely responsible for preserving the confidentiality of administrative passwords, API keys, and deployment tokens.",
            "Every administrative action executed using Client credentials—including database operations, user provisioning, and service configuration changes—shall be deemed legally authorized by the Client. Prompt notification must be given to security@sparklinelabs.co.zw upon any suspected credential compromise.",
          ],
        },
      ],
    },
    {
      id: "scope-of-engineering-services",
      sectionNumber: "3.0",
      title: "Scope of Engineering Services & Operational Limits",
      icon: "code",
      summary:
        "Core technical capabilities, service level targets, and Southern African infrastructure realities.",
      subsections: [
        {
          title: "3.1 Solutions Engineering Core Disciplines",
          paragraphs: [
            "Sparkline Labs provides specialized engineering services across four principal disciplines:",
            "• Solution Architecture: High-level technical planning, workflow mapping, system boundary definitions, database design, and feasibility studies.",
            "• Systems Engineering: Bespoke software engineering, full-stack web applications, portals, internal dashboards, and enterprise SaaS platforms.",
            "• Integration & Automation: Connecting disparate operational systems via APIs (including WhatsApp Business API, CRM gateways, payment processors, and ERPs).",
            "• Technical Modernization: Codebase refactoring, performance optimization, architectural decoupling, and legacy migration.",
          ],
        },
        {
          title: "3.2 Availability Targets & Local Infrastructure Realities",
          paragraphs: [
            "For managed platforms and hosted client solutions, Sparkline Labs targets a 99.5% operational uptime window for production environments, excluding scheduled maintenance windows announced with at least 48 hours notice.",
            "Client acknowledges the unique operating environment in Southern Africa, including regional power grid disruptions (load shedding), localized ISP fiber severances, and cross-border latency variations. Sparkline Labs implements multi-region cloud redundancy where commercially contracted, but disclaims liability for interruptions arising from sovereign telecommunications grid failures.",
          ],
        },
      ],
    },
    {
      id: "client-obligations-and-acceptable-use",
      sectionNumber: "4.0",
      title: "Client Obligations & Acceptable Use Mandate",
      icon: "shield",
      summary:
        "Timely delivery of specifications, review cycles, and strict prohibitions against malicious behavior.",
      subsections: [
        {
          title: "4.1 Collaborative Prerequisites",
          paragraphs: [
            "Successful software delivery requires active Client participation. Client covenants to provide timely access to necessary technical specifications, third-party API credentials, domain DNS controls, brand assets, and subject matter experts.",
            "Milestone review cycles must be completed within seven (7) business days of milestone submission. Failure to provide written rejection or feedback within this window constitutes deemed acceptance of the milestone deliverables.",
          ],
        },
        {
          title: "4.2 Prohibited Technical Conduct",
          paragraphs: [
            "Users and Clients are strictly prohibited from engaging in the following actions across our infrastructure:",
          ],
          list: [
            "Unauthorized Penetration Testing: Executing denial-of-service (DDoS) simulations, brute-force attacks, or vulnerability scans against production servers without prior written authorization.",
            "Malicious Infiltration: Introducing viruses, trojans, worms, logic bombs, or destructive code into our software repositories or client staging clusters.",
            "Automated Scraping: Harvesting proprietary data, price intelligence, or source code through automated web scraping, bots, or crawler scripts.",
            "Reverse Engineering: Decompiling, disassembling, or reverse-engineering proprietary frameworks, algorithms, or utility tools authored by Sparkline Labs.",
            "Illegal Deployment: Utilizing engineered platforms for fraudulent financial schemes, unauthorized forex trading, or activities violating the laws of Zimbabwe.",
          ],
        },
      ],
    },
    {
      id: "intellectual-property-allocation",
      sectionNumber: "5.0",
      title: "Intellectual Property Allocation & Deliverables Licensing",
      icon: "lock",
      summary:
        "Clear demarcation between Client bespoke deliverables and Sparkline Labs core architectural assets.",
      subsections: [
        {
          title: "5.1 Client Proprietary Materials",
          paragraphs: [
            "Client retains all pre-existing intellectual property rights in all data, customer databases, trademarks, proprietary algorithms, and brand collateral provided to Sparkline Labs.",
          ],
        },
        {
          title: "5.2 Sparkline Labs Pre-Existing IP & Frameworks",
          paragraphs: [
            "Sparkline Labs retains full and exclusive ownership of all pre-existing software libraries, architectural frameworks, reusable UI design tokens, database ORM patterns, scaffolding tools, and foundational engineering utilities developed prior to or independently of the engagement (\"Company Pre-Existing IP\").",
            "To the extent Company Pre-Existing IP is incorporated into client deliverables, Sparkline Labs grants Client a perpetual, worldwide, non-exclusive, royalty-free license to utilize such components as an integral part of the delivered software.",
          ],
        },
        {
          title: "5.3 Assignment of Bespoke Deliverables",
          paragraphs: [
            "Upon full and final settlement of all invoiced fees associated with an executed Statement of Work, Sparkline Labs assigns to Client all right, title, and interest in the bespoke custom source code and unique graphical assets created specifically for Client.",
          ],
          callout:
            "Source code transfer, production database handovers, and repository ownership transfers shall not occur until all outstanding commercial invoices have been settled in full.",
        },
      ],
    },
    {
      id: "commercial-terms-and-settlement",
      sectionNumber: "6.0",
      title: "Commercial Terms, Settlement Modalities & Taxation",
      icon: "dollar-sign",
      summary:
        "Milestone invoicing, supported payment rails in Zimbabwe, statutory tax compliance, and late settlement.",
      subsections: [
        {
          title: "6.1 Milestone Billing & Scope Revisions",
          paragraphs: [
            "Engineering engagements are executed pursuant to milestone schedules defined in the Statement of Work. Typical schedules require an initial mobilization commitment (e.g. 40%), milestone progression payments, and a final sign-off balance.",
            "Any requested alterations to project requirements, new feature additions, or third-party integration changes exceeding the agreed SOW will be documented in a formal Change Request and billed at our prevailing technical hourly rates.",
          ],
        },
        {
          title: "6.2 Supported Settlement Channels",
          paragraphs: [
            "Invoices are denominated in United States Dollars (USD) or equivalent local statutory currencies per prevailing legal regulations. We accept payment through authenticated commercial channels:",
            "• Direct Bank Wire / RTGS / Nostro FCA transfers to our registered corporate accounts.",
            "• Mobile Money: EcoCash and InnBucks (at verified settlement exchange rates where permissible).",
            "• Digital Cards & International Wire Transfer (for diaspora and international enterprise clients).",
          ],
        },
        {
          title: "6.3 Statutory Taxation & ZIMRA Compliance",
          paragraphs: [
            "All commercial fees are subject to applicable Value Added Tax (VAT) and statutory fiscal levies in accordance with the regulations of the Zimbabwe Revenue Authority (ZIMRA). Sparkline Labs will provide valid Fiscal Tax Invoices detailing VAT amounts collected.",
          ],
        },
        {
          title: "6.4 Late Settlement & Service Suspension",
          paragraphs: [
            "Invoices not settled within fourteen (14) calendar days of issuance shall accrue interest at the rate of 2% per month or the maximum rate permitted by Zimbabwean law. In the event of default exceeding thirty (30) days, Sparkline Labs reserves the right to suspend active development, revoke staging server access, and halt deployment pipelines.",
          ],
        },
      ],
    },
    {
      id: "confidentiality-and-non-disclosure",
      sectionNumber: "7.0",
      title: "Confidentiality & Mutual Non-Disclosure Covenants",
      icon: "file-text",
      summary:
        "Perpetual protection of sensitive business logic, technical secrets, and strategic information.",
      subsections: [
        {
          title: "7.1 Scope of Confidentiality",
          paragraphs: [
            "Each party covenants that it shall hold in strict confidence all technical architectures, proprietary algorithms, financial models, customer lists, and strategic business plans disclosed by the other party.",
            "Confidential Information shall be disclosed only to employees, contractors, and legal advisors who have an imperative need-to-know and are bound by confidentiality obligations no less restrictive than those contained herein.",
          ],
        },
        {
          title: "7.2 Exclusions & Compelled Judicial Disclosures",
          paragraphs: [
            "Confidentiality obligations shall not apply to information that is publicly known through no breach, was already in the receiving party's possession prior to disclosure, or is independently developed without reference to the disclosing party's materials.",
            "Disclosures mandated by a valid order of a court of competent jurisdiction in Zimbabwe are permitted, provided prompt notice is given to the disclosing party.",
          ],
        },
      ],
    },
    {
      id: "warranties-and-technical-disclaimers",
      sectionNumber: "8.0",
      title: "Strategic Warranties & Technical Disclaimers",
      icon: "alert-triangle",
      summary:
        "Limitation of warranties, 'As-Is' technical status, and downstream third-party dependencies.",
      subsections: [
        {
          title: "8.1 Workmanship Warranty",
          paragraphs: [
            "Sparkline Labs warrants that all software engineering services shall be executed in a professional, workmanlike manner conforming to prevailing modern industry standards. For custom deliverables, we provide a thirty (30) day post-launch bug remediation warranty covering reproducible defects that deviate materially from the agreed SOW specifications.",
          ],
        },
        {
          title: "8.2 General Technical Disclaimer",
          paragraphs: [
            "Except as expressly set forth herein, all services, software platforms, codebases, and APIs are provided strictly on an \"AS IS\" and \"AS AVAILABLE\" basis without warranties of any kind, whether express, implied, statutory, or otherwise.",
            "Sparkline Labs expressly disclaims all implied warranties of merchantability, fitness for a particular commercial purpose, non-infringement, and uninterrupted error-free operation.",
          ],
        },
        {
          title: "8.3 Third-Party API & Telecommunications Reliance",
          paragraphs: [
            "Modern software frequently relies upon external third-party systems, including Meta (WhatsApp Business Cloud API), payment gateway networks (Paynow, EcoCash), cloud infrastructure hosts, and telecom operators.",
            "Sparkline Labs exercises no control over third-party API rate limits, pricing revisions, policy modifications, network outages, or deprecation notices. We disclaim all liability for operational disruptions arising from upstream third-party platform failures.",
          ],
        },
      ],
    },
    {
      id: "limitations-of-liability",
      sectionNumber: "9.0",
      title: "Strategic Limitations of Liability & Liquidated Damages",
      icon: "scale",
      summary:
        "Clear financial liability caps and comprehensive exclusion of consequential and punitive damages.",
      subsections: [
        {
          title: "9.1 Exclusion of Indirect & Consequential Losses",
          paragraphs: [
            "To the maximum extent permitted by applicable Zimbabwean law, under no circumstances shall Sparkline Labs, its directors, engineers, or affiliates be liable to Client or any third party for any indirect, incidental, consequential, special, punitive, or exemplary damages.",
            "This exclusion includes, without limitation, lost corporate profits, lost revenue, business interruption, loss of enterprise data, reputational damage, or the cost of procuring substitute software services, regardless of the theory of liability.",
          ],
        },
        {
          title: "9.2 Aggregate Liability Ceiling",
          paragraphs: [
            "In all circumstances, the total aggregate liability of Sparkline Labs arising out of or related to this Agreement, whether in contract, delict (including negligence), or otherwise, shall be strictly capped at the total amount actually paid by Client to Sparkline Labs under the specific Statement of Work giving rise to the claim during the three (3) months preceding the event.",
          ],
        },
      ],
    },
    {
      id: "indemnification-protocols",
      sectionNumber: "10.0",
      title: "Mutual Indemnification Obligations",
      icon: "shield",
      summary:
        "Defending and holding harmless against third-party claims, copyright infringement, and illegal use.",
      subsections: [
        {
          title: "10.1 Client Indemnification",
          paragraphs: [
            "Client agrees to defend, indemnify, and hold harmless Sparkline Labs, its officers, and contractors against any third-party claims, damages, liabilities, or legal costs arising out of: (1) Client's breach of this Agreement, (2) Any materials, specs, or intellectual property provided by Client that infringe third-party rights, or (3) Unlawful commercial operation of the engineered platform.",
          ],
        },
        {
          title: "10.2 Company IP Indemnification",
          paragraphs: [
            "Sparkline Labs agrees to defend Client against claims alleging that original custom software authored directly by the Company infringes a registered copyright in Zimbabwe, provided Client gives immediate written notice and full authority to direct the defense.",
          ],
        },
      ],
    },
    {
      id: "termination-and-offboarding",
      sectionNumber: "11.0",
      title: "Term, Suspension & Termination Protocols",
      icon: "file-text",
      summary:
        "Contract termination mechanics, convenience clauses, and transition assistance.",
      subsections: [
        {
          title: "11.1 Termination for Cause",
          paragraphs: [
            "Either party may terminate an active engagement immediately upon written notice if the other party commits a material breach of this Agreement that remains uncured after fourteen (14) calendar days of formal notification, or if a party enters liquidation, insolvency, or bankruptcy proceedings.",
          ],
        },
        {
          title: "11.2 Termination for Convenience",
          paragraphs: [
            "Client may terminate an ongoing development project for convenience upon thirty (30) days written notice. In such event, Client shall pay Sparkline Labs for all engineering hours incurred, milestones achieved, and non-cancelable third-party commitments up to the effective termination date.",
          ],
        },
        {
          title: "11.3 Offboarding & Data Handover",
          paragraphs: [
            "Upon termination and full financial settlement, Sparkline Labs will provide standard code repository exports and exportable database dumps to facilitate transition to Client's designated internal team or alternative technical partner.",
          ],
        },
      ],
    },
    {
      id: "dispute-resolution-and-arbitration",
      sectionNumber: "12.0",
      title: "Dispute Resolution, Binding Arbitration & Governing Law",
      icon: "scale",
      summary:
        "Mandatory good-faith consultation, binding arbitration under Chapter 7:15, and jurisdiction in Harare.",
      subsections: [
        {
          title: "12.1 Amicable Consultation",
          paragraphs: [
            "In the event of any controversy, dispute, or claim arising out of or relating to this Agreement, the parties shall first endeavor in good faith to resolve the matter through direct consultation between senior executive representatives within twenty-one (21) days.",
          ],
        },
        {
          title: "12.2 Mandatory Binding Arbitration under Chapter 7:15",
          paragraphs: [
            "If the dispute is not settled through amicable consultation, it shall be referred to and finally resolved by binding arbitration under the rules of the Arbitration Act [Chapter 7:15] of Zimbabwe.",
            "• Seat of Arbitration: Harare, Zimbabwe.",
            "• Arbitrator: A single arbitrator mutually appointed by the parties, or failing agreement within fourteen days, appointed by the Commercial Arbitration Centre in Harare.",
            "• Language of Arbitration: English.",
            "• Binding Award: The arbitrator's award shall be final, binding, and enforceable in any court of competent jurisdiction.",
          ],
        },
        {
          title: "12.3 Governing Law & Judicial Jurisdiction",
          paragraphs: [
            "This Agreement, its interpretation, and any non-contractual obligations arising out of it shall be governed exclusively by the laws of the Republic of Zimbabwe. Subject to the arbitration mandate, the High Court of Zimbabwe in Harare shall possess exclusive jurisdiction.",
          ],
        },
      ],
    },
    {
      id: "general-provisions",
      sectionNumber: "13.0",
      title: "General Legal Provisions",
      icon: "globe",
      summary:
        "Force Majeure, severability, complete integration, and formal notice addresses.",
      subsections: [
        {
          title: "13.1 Force Majeure",
          paragraphs: [
            "Neither party shall be held liable for failure or delay in performing contractual obligations if caused by events beyond reasonable control, including acts of God, widespread power grid collapse, subsea cable severances, war, labor disputes, pandemic lockdowns, or sovereign regulatory freezes.",
          ],
        },
        {
          title: "13.2 Severability & Entire Agreement",
          paragraphs: [
            "If any provision of this Agreement is held to be invalid or unenforceable by an arbitrator or court of competent jurisdiction, the remaining provisions shall continue in full force and effect.",
            "These Terms, together with executed Statements of Work, constitute the entire agreement between the parties, superseding all prior oral or written negotiations.",
          ],
        },
        {
          title: "13.3 Official Corporate Legal Notice",
          paragraphs: [
            "All legal notices required under this Agreement shall be served in writing to:",
            "• Entity: Sparkline Labs (Private) Limited",
            "• Legal Bureau: legal@sparklinelabs.co.zw",
            "• Corporate Headquarters: Harare, Zimbabwe",
          ],
        },
      ],
    },
  ],
  seo: {
    title: "Statutory Terms of Service & Operating Mandate",
    description:
      "Statutory terms of service, technical SLA conditions, IP allocation, and operational mandate of Sparkline Labs (Pvt) Ltd. Governed by the laws of Zimbabwe and Arbitration Act [Chapter 7:15].",
  },
};

