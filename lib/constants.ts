export const homepageFaqs = [
  {
    question: "What does Sparkline Labs do?",
    answer: `
    <p>Sparkline Labs is a Zimbabwe-based solutions engineering company. It is independent of similarly named businesses and brands such as Sparkline Labs AI, Sparkline Software Solutions, and other companies operating under the Sparkline name. When we refer to Sparkline Labs on this website, we mean the Zimbabwean company described here.</p>

    <p>Sparkline Labs designs and builds digital systems around how African businesses actually operate. We do not begin with a software category or a list of features. We begin by understanding the business problem, the existing workflow, the systems already in use, the customer's behaviour and the constraints that cannot simply be designed away.</p>

    <p>The resulting solution might be a new platform, an internal business application, an integration between existing tools, an automated workflow, or a modernisation of software that already exists. Our work therefore sits between business operations and software engineering rather than treating custom software development as the answer to every problem.</p>

    <p>Our <a href="/services">services</a> explain how we approach solution architecture, systems engineering, integration and automation, and technical modernisation. We also document the reasoning behind that approach in <a href="/blog/solutions-engineering/what-zimbabwean-businesses-need-from-software">What Does a Zimbabwean Business Actually Need From Software?</a>.</p>
  `,
  },
  {
    question: "Does Sparkline Labs provide AI solutions?",
    answer: `
      <p>Yes. We build and integrate AI where it can produce a useful business outcome, but we do not recommend AI simply because a business wants to “add AI”. We first look at the problem, the available data, the existing systems and the context the AI would need in order to produce reliable results.</p>

      <p>AI is a powerful force multiplier. The problem is that a multiplier amplifies what is already there. If a business has well-structured information, a clear workflow and the right systems, AI can make that operation significantly more capable. If the underlying data is incomplete, inconsistent or disconnected from the business process, AI can instead multiply uncertainty, generate plausible but incorrect answers and create a false impression that the technology itself does not work.</p>

      <p>That is why our approach is usually to establish the right <strong>data and system foundations before adding intelligence</strong>. Depending on the problem, that might mean building a structured application, connecting existing systems, improving the information captured by a workflow, and then introducing AI where it has enough context to be useful.</p>

      <p>Propertyzone is an example of this approach. AI capabilities can work against structured information about a property rather than trying to infer everything from a paragraph of free text. Our <a href="/blog/proptech-real-estate/zimbabwe-real-estate-ai-readiness-data-infrastructure">analysis of AI readiness in Zimbabwean real estate</a> explains why the data layer matters, while our <a href="/work/propertyzone">Propertyzone case study</a> shows how that principle is applied in a live system.</p>
    `,
  },
  {
    question:
      "Why does Sparkline Labs design software around Zimbabwean conditions?",
    answer: `
      <p>Software can be technically sound and still be a poor fit for the environment in which it is deployed. In Zimbabwe, that can mean assuming stable connectivity, forcing customers away from WhatsApp, overlooking local payment rails, relying on desktop-first workflows, or creating processes that require staff to perform work that the system was supposed to remove.</p>
      <p>We treat those conditions as design inputs. That means understanding where customers actually communicate, how money moves through the business, how employees work when systems are unavailable, and which transactions must continue when connectivity becomes unreliable.</p>
      <p>This is why our thinking goes beyond generic “software for Africa”. For example, our work on <a href="/blog/solutions-engineering/designing-software-for-zimbabwe-s-internet-connectivity-reality">designing software for Zimbabwe's internet connectivity reality</a> looks at how software behaves when mobile connectivity becomes unreliable, while <a href="/blog/solutions-engineering/why-zimbabwean-businesses-run-operations-through-whatsapp">our analysis of WhatsApp-driven operations</a> examines why replacing the customer's existing behaviour can be the wrong solution.</p>
    `,
  },
  {
    question:
      "Do we need to build new software, or can Sparkline Labs work with what we already have?",
    answer: `
      <p>Building something new is only one of the options we consider. A business may already have accounting software, a CRM, spreadsheets, WhatsApp, payment systems and other tools that each work reasonably well in isolation. The problem may be that they do not work together, that information is being moved between them manually, or that the underlying process was never designed properly in the first place.</p>
      <p>We therefore look at four possibilities: buy an existing product, build something custom, integrate the systems already in use, or change the process before introducing technology. The correct answer depends on the cost of the problem, the complexity of the workflow, the available data and what the business actually needs the system to accomplish.</p>
      <p>We explain that decision in detail in <a href="/blog/solutions-engineering/zimbabwe-technology-decision-framework-build-buy-integrate">Build or Buy? How Zimbabwean Businesses Should Decide Whether They Need Custom Software</a> and examine the risks of choosing software before understanding the problem in <a href="/blog/solutions-engineering/why-buying-software-before-understanding-the-problem-is-expensive">Why Buying Software Before Understanding the Problem Is Expensive</a>.</p>
    `,
  },
  {
    question: "What kinds of systems does Sparkline Labs build?",
    answer: `
      <p>We build systems where software needs to become part of how the business actually operates. That includes custom web platforms, internal tools, customer-facing applications, operational dashboards, SaaS products and systems that connect communication, data, payments and internal workflows.</p>
      <p>We are particularly interested in problems where information currently moves through people, spreadsheets, personal phones or disconnected applications. In those situations, the opportunity is often not simply to put an existing manual process on a screen, but to create a system that captures information at the right point, routes it to the right person and creates a useful operational record.</p>
      <p><a href="/work/propertyzone">Propertyzone</a> is a practical example. Sparkline Labs engineered the platform around structured property data, verified demand, lead routing, agency workflows and direct WhatsApp communication rather than simply creating another property listings website.</p>
    `,
  },
];

export const servicesFaqs = [
  {
    question: "How do I know which Sparkline Labs service my business needs?",
    answer: `
      <p>You do not need to know which service you need before speaking to us. The starting point is the business problem, not the name of the technology you think will solve it.</p>

      <p>If an existing process is being held together by spreadsheets, WhatsApp messages and manual work, we may recommend <a href="/services#integrations-automation">integration and automation</a>. If the business needs a system that existing software cannot provide, we may recommend a <a href="/services#systems-engineering">custom platform</a>. If you already have software that works but has become difficult to maintain or extend, <a href="/services#technical-modernisation">technical modernisation</a> may be more appropriate. And where the problem is still unclear, we start with <a href="/services#solution-architecture">solution architecture</a> to understand the workflow and determine what should actually be built.</p>

      <p>That is intentional. We would rather recommend the smallest intervention that solves the actual problem than start with a predetermined technology package.</p>
    `,
  },

  {
    question:
      "Can Sparkline Labs work with software and systems we already use?",
    answer: `
      <p>Yes. In many cases, the most useful system is not a replacement for everything the business already has, but a layer that makes those systems work together.</p>

      <p>Businesses often already have accounting software, CRMs, spreadsheets, websites, messaging channels and payment platforms. The problem is that information moves between them through people. Someone copies a lead from WhatsApp into a spreadsheet, sends payment details separately, updates another system manually and then relies on someone remembering the next step.</p>

      <p>We can connect systems such as WhatsApp, Paynow, EcoCash, Google Workspace, CRMs and spreadsheets so information can move through the workflow without unnecessary copy-and-paste. Where the existing system itself is the problem, we can also modernise or replace specific parts rather than forcing a full rebuild.</p>

      <p>Our experience with <a href="/work/propertyzone">Propertyzone</a> and the way we engineered it around WhatsApp, structured data and unreliable connectivity informs how we approach these integrations in real operating environments. You can also read <a href="/blog/solutions-engineering/designing-software-for-zimbabwe-s-internet-connectivity-reality">how connectivity influenced the architecture</a>.</p>
    `,
  },

  {
    question:
      "What happens if we know we have a problem but do not know what software to build?",
    answer: `
      <p>That is exactly where our technical strategy and solution architecture work is most useful. You do not need to arrive with a finished specification.</p>

      <p>We start by understanding what is happening operationally: who does the work, where information enters the business, which systems are involved, where manual steps occur, where customers drop out, and what currently prevents the business from achieving the desired outcome.</p>

      <p>We then determine whether the answer is to build, buy, integrate, automate, modernise or change the process before introducing technology. Where a build is appropriate, the discovery process results in a defined architecture, scope and implementation direction rather than a vague software-development proposal.</p>

      <p>This is why our approach is different from asking a developer to “build an app” from an initial idea. The first job is making sure the thing being built is actually the thing the business needs. We explore that distinction in <a href="/blog/software-industry/wordpress-era-ai-tools-zimbabwe-software-trust">The WordPress Era Never Ended. It Just Learned to Prompt.</a>.</p>
    `,
  },

  {
    question: "Does Sparkline Labs automate everything once a system is built?",
    answer: `
      <p>No. We deliberately use a manual-first approach where appropriate.</p>

      <p>Automation is valuable when a workflow is already understood and the repeated work can be reliably handled by a system. Automating an unclear or broken process simply makes the same problems happen faster and can make them harder to diagnose.</p>

      <p>That is why we often want the business to run the workflow manually first, with real users and real data, before deciding which parts should be automated. This gives us evidence about what actually happens rather than relying entirely on assumptions made during planning.</p>

      <p>The same principle applies to AI. We do not add AI because a feature sounds impressive. The system needs enough structured information and business context for the AI to produce useful results. Our <a href="/blog/proptech-real-estate/zimbabwe-real-estate-ai-readiness-data-infrastructure">AI-readiness work in Zimbabwean real estate</a> explains why data quality and structure matter before intelligent features are layered onto a system.</p>
    `,
  },

  {
    question:
      "Can you build systems that work under Zimbabwean connectivity and operating conditions?",
    answer: `
      <p>Yes. Local operating conditions are part of the engineering problem rather than an afterthought.</p>

      <p>A system designed on the assumption that every user has fast, continuous connectivity can become frustrating or unusable when mobile data is slow, a connection drops during an important action, or users move between reliable and unreliable network coverage. The same applies to systems that assume customers will abandon WhatsApp, businesses will operate entirely online, or every process can be automated immediately.</p>

      <p>Where the workflow requires it, we can design for conditions such as unreliable connectivity, mobile-first usage, WhatsApp-based communication and local payment infrastructure. Propertyzone, for example, was engineered to keep relevant information available during connectivity problems and synchronise when the connection returns.</p>

      <p>We document the engineering reasoning behind this in <a href="/blog/solutions-engineering/designing-software-for-zimbabwe-s-internet-connectivity-reality">Designing Software for Zimbabwe's Internet Connectivity Reality</a>.</p>
    `,
  },

  {
    question:
      "What happens after Sparkline Labs builds and launches the system?",
    answer: `
      <p>Launch is not treated as the end of the engineering process. The system has to work in the hands of the people who will actually operate it.</p>

      <p>Our approach is to move from discovery and a defined pilot into the main build, followed by handover and operation. We want the people responsible for the system to understand how it works, how the workflow should be operated, and what needs to happen when something falls outside the expected path.</p>

      <p>We also prefer systems that can be understood and maintained rather than products that become dependent on the original developer for every change. That is why architecture, maintainability and operational clarity matter from the beginning rather than being considered after launch.</p>

      <p>Our current delivery model is based on a paid discovery, a fixed-price pilot, a defined build and handover into operation. You can see how we apply that model in <a href="/work/propertyzone">the Propertyzone case study</a>.</p>
    `,
  },
];

export const solutionsEngineeringFaqs = [
  {
    question:
      "Why does Sparkline Labs start with the business problem instead of the software?",
    answer: `
      <p>A business usually sees the symptom before it sees the cause. Leads are being missed, so someone asks for a CRM. Reporting is slow, so someone asks for a dashboard. Staff keep entering the same information, so someone asks for automation. Those observations can all be correct while the proposed software is still the wrong intervention.</p>
      <p>We map what actually happens before deciding what should be built. That means looking at where the input comes from, who handles it first, what decisions happen along the way, what gets recorded, where information moves manually and where work disappears.</p>
      <p>Our article <a href="/blog/solutions-engineering/why-buying-software-before-understanding-the-problem-is-expensive">Why Buying Software Before Understanding the Problem Is Expensive</a> goes into the procurement problem in detail, while <a href="/blog/solutions-engineering/what-zimbabwean-businesses-need-from-software">What Does a Zimbabwean Business Actually Need From Software?</a> applies the same reasoning specifically to Zimbabwean operating conditions.</p>
    `,
  },
  {
    question: "What does solutions engineering mean in practice?",
    answer: `
      <p>Solutions engineering is the work of connecting an operational problem to a technical solution that can actually survive in production. It involves understanding the current process, identifying the real bottlenecks, deciding what should remain manual, determining what should be automated, designing the system around existing behaviour and then engineering the appropriate technology.</p>
      <p>That is why a solutions engineering engagement can produce very different outcomes. One business may need an internal tool. Another may need a WhatsApp integration. Another may need to modernise an existing codebase. Another may discover that changing the process is more valuable than introducing another application.</p>
      <p>Our <a href="/blog/solutions-engineering/what-zimbabwean-businesses-need-from-software">Zimbabwean software requirements article</a> and <a href="/blog/solutions-engineering/zimbabwe-technology-decision-framework-build-buy-integrate">technology decision framework</a> explain how we make those decisions.</p>
    `,
  },
  {
    question:
      "Why doesn't Sparkline Labs simply tell businesses to stop using WhatsApp?",
    answer: `
      <p>Because the existence of WhatsApp in the workflow is usually a consequence of the market, not the original technology strategy. Customers already use it, employees already understand it, and businesses have built working habits around it. Removing the channel can therefore solve an internal systems problem by creating a customer adoption problem.</p>
      <p>The better approach is often to keep WhatsApp as the communication layer while building the operational system underneath it. Messages can become structured enquiries, documents can be attached to business records, conversations can be routed across a team, and important actions can become part of a proper workflow rather than remaining trapped in someone's personal inbox.</p>
      <p>We explore that distinction in <a href="/blog/solutions-engineering/why-zimbabwean-businesses-run-operations-through-whatsapp">Why So Many Zimbabwean Businesses Still Run Critical Operations Through WhatsApp</a> and show a practical lead-capture example in <a href="/blog/seo-and-digital-strategy/whatsapp-lead-capture-crm-scoring-zimbabwe-propertyzone">Can WhatsApp Leads Be Captured and Scored Automatically in Zimbabwe?</a>.</p>
    `,
  },
];

export const softwareIndustryFaqs = [
  {
    question:
      "Does AI make custom software cheap enough that every business should build its own?",
    answer: `
      <p>AI has reduced the amount of human effort required for many coding tasks, but cheaper code does not automatically make a software project cheaper to operate or more likely to succeed. The difficult part of many business systems is not producing screens and functions. It is deciding what the system needs to do, structuring the data correctly, integrating it into an existing operation, handling failure cases and making sure people can actually use it.</p>
      <p>That distinction matters even more as it becomes easier to produce software that looks finished. A business can now have a working prototype very quickly without having solved the operational problem underneath it.</p>
      <p>We examine that shift in <a href="/blog/software-industry/will-ai-make-software-cheaper-zimbabwe">Will AI Make Software Cheaper in Zimbabwe? Why the Code Cost Was Never the Problem</a> and discuss why the industry needs to think beyond simply producing more software in <a href="/blog/software-industry/wordpress-era-ai-tools-zimbabwe-software-trust">The WordPress Era Never Ended. It Just Learned to Prompt.</a>.</p>
    `,
  },
  {
    question:
      "Why does Sparkline Labs advocate data discipline before adding AI to a business?",
    answer: `
      <p>Because an AI model can only be as useful as the context available to it. Connecting a language model to a business system does not automatically give that model an understanding of the business, its customers, its market or the real-world entities represented in its database.</p>

      <p>Consider a property platform. Asking AI to generate a property description from an unstructured paragraph gives it very little reliable context. It may not know the actual floor area, the property's infrastructure, the correct spelling or hierarchy of the suburb, nearby amenities, typical prices in that area, the property's tenure or zoning, or which features are actually present. The model may produce something that sounds convincing while quietly inventing details. That is an AI hallucination, but from the business's perspective it can simply look like “AI doesn't work for us”.</p>

      <p>Propertyzone was designed with this principle in mind. A property is represented through structured information that can give an AI system much richer context: property features, building characteristics, floor area, nearby amenities, suburb and city-level price information, property title structure, zoning, tenure and other attributes captured as data rather than buried inside free-form descriptions. That is what makes useful AI applications possible on top of the system. For example, AI-generated listing titles and descriptions can work from information the platform actually knows about the property rather than asking a model to guess what the property might contain.</p>

      <p>The same principle applies outside real estate. An AI system assisting a retailer needs meaningful product, customer and transaction context. An AI system helping a professional-services firm needs access to the right documents, clients, cases and workflows. An AI system supporting a sales operation needs reliable information about leads, interactions, products and outcomes.</p>

      <p>This is why we are deliberately cautious about premature AI integration. Adding AI to an application before the underlying information has been structured can create impressive demonstrations but unreliable production systems. The business then blames AI for a problem that actually exists in its data and architecture.</p>

      <p>We therefore treat <strong>data discipline as part of AI readiness</strong>. Before asking what AI can do, we ask whether the business has the information, structure, systems and context required for AI to do it reliably. Our article <a href="/blog/proptech-real-estate/zimbabwe-real-estate-ai-readiness-data-infrastructure">AI Readiness in Zimbabwe Real Estate: Why Your Listing Data Is Blocking Every Application That Matters</a> examines this problem in detail, while <a href="/blog/software-industry/wordpress-era-ai-tools-zimbabwe-software-trust">The WordPress Era Never Ended. It Just Learned to Prompt.</a> looks at the wider risk of adopting new technology before the underlying problem has been understood.</p>

      <p>We do not talk about AI less because we believe in it less. We talk about it differently because we believe it is a <strong>force multiplier</strong>. Across much of the current business environment, the force being multiplied is still fragmented data, manual processes and disconnected systems. Until those foundations improve, adding more AI can multiply the problem as easily as it multiplies the solution.</p>
    `,
  },
  {
    question:
      "What is the difference between AI-assisted software development and solutions engineering?",
    answer: `
      <p>AI-assisted development changes how code can be produced. Solutions engineering changes how the problem is approached. A capable AI coding tool can generate an application quickly, but it does not automatically know whether the application represents the real workflow, whether the required data exists, what happens when connectivity fails, or whether employees will adopt the resulting system.</p>
      <p>For businesses, that distinction becomes increasingly important as the cost of producing software falls. The scarce part is not necessarily code. It is the judgement required to understand the operation, design the right system and take responsibility for what happens after launch.</p>
      <p>Our <a href="/blog/software-industry/wordpress-era-ai-tools-zimbabwe-software-trust">WordPress and AI software analysis</a> looks at this shift from the perspective of Zimbabwe's software market.</p>
    `,
  },
];

export const seoDigitalStrategyFaqs = [
  {
    question:
      "Why does Sparkline Labs look beyond the website when working on SEO and digital strategy?",
    answer: `
      <p>A website is only one part of how a business is discovered, understood and chosen online. A business can have a fast, attractive website and still struggle to generate enquiries because its positioning is unclear, its content does not answer the questions customers are asking, its pages are difficult for search engines and AI systems to understand, or the journey from discovery to enquiry breaks down.</p>
      <p>That is why we look beyond the website itself. We consider the complete digital path: what people are searching for, how the business appears in search and AI-generated answers, what information customers encounter before reaching the website, how the website explains the offering, what happens when someone makes an enquiry, and how that enquiry is captured and followed up.</p>
      <p>For some businesses, the priority may be technical SEO. For others, it may be building a body of authoritative content around the problems they solve, clarifying their digital positioning, improving local discoverability, restructuring their information so it can be understood by search engines and AI assistants, or connecting incoming leads to the systems that handle them.</p>
      <p>Our approach is therefore closer to <strong>digital strategy</strong> than simply “building a website and doing SEO”. Our article <a href="/blog/seo-and-digital-strategy/built-not-found-zimbabwe-seo-ai-visibility">Built, But Not Found: Zimbabwe's SEO and AI Visibility Guide for 2026</a> explains why a technically good website can still remain invisible, while <a href="/blog/seo-and-digital-strategy/whatsapp-lead-capture-crm-scoring-zimbabwe-propertyzone">our work on WhatsApp lead capture</a> looks at what happens after digital visibility produces an actual enquiry.</p>
    `,
  },
  {
    question:
      "Why does Sparkline Labs talk about search visibility and AI visibility alongside software?",
    answer: `
      <p>A digital system does not create business value simply because it exists. Customers still need to find the business, understand what it offers and trust the information they encounter. That makes discoverability part of the wider system rather than something completely separate from engineering.</p>
      <p>This becomes more important as search increasingly produces answers rather than simply lists of links. Businesses need content, structured information, technical accessibility and credible evidence that search engines and AI systems can understand and use.</p>
      <p>Our <a href="/blog/seo-and-digital-strategy/built-not-found-zimbabwe-seo-ai-visibility">Built, But Not Found: Zimbabwe's SEO and AI Visibility Guide for 2026</a> examines the visibility side in depth, while our work on <a href="/blog/seo-and-digital-strategy/whatsapp-lead-capture-crm-scoring-zimbabwe-propertyzone">WhatsApp lead capture</a> shows how visibility ultimately connects to what happens after an enquiry arrives.</p>
    `,
  },
  {
    question: "What does digital strategy mean at Sparkline Labs?",
    answer: `
      <p>Digital strategy is the broader question of how technology, content, search, communication channels and business systems work together to produce an outcome. It is not simply a plan for what a company's website should look like.</p>
      <p>We look at the role each digital touchpoint plays in the business. Search may introduce someone to the company. An article may establish expertise and answer a difficult question. A website may explain the offering and establish trust. WhatsApp may become the preferred way for the customer to enquire. An internal system may then capture, qualify and route that enquiry. Analytics and operational data can show where the process is succeeding or failing.</p>
      <p>That means digital strategy can involve <strong>positioning, content architecture, SEO, AI visibility, websites, conversion paths, lead capture, integrations, automation and the systems behind customer interactions</strong>. The appropriate combination depends on the business and the problem rather than a predetermined list of digital services.</p>
      <p>This is particularly important in markets such as Zimbabwe, where customer behaviour does not always follow the assumptions built into conventional Western digital funnels. Our work on <a href="/blog/solutions-engineering/why-zimbabwean-businesses-run-operations-through-whatsapp">businesses operating through WhatsApp</a> and <a href="/blog/solutions-engineering/whatsapp-as-interface-software-as-system-zimbabwe">WhatsApp as the interface, software as the system</a> are examples of why the wider operating environment matters when designing a digital strategy.</p>
    `,
  },
];

export const proptechFaqs = [
  {
    question:
      "Why did Sparkline Labs build Propertyzone instead of starting with a generic property portal?",
    answer: `
      <p>Propertyzone was designed around problems that existing property-market workflows were not solving well: fragmented listing information, intent that was difficult to structure, enquiries that moved through personal WhatsApp inboxes, and agency workflows that depended heavily on manual coordination.</p>
      <p>That meant the product could not simply be a catalogue of properties. The system needed to connect structured listing data, buyer and renter intent, lead routing, agency workflows and the communication behaviour already used by the market.</p>
      <p>The resulting platform is documented in <a href="/work/propertyzone">the Propertyzone case study</a>, while <a href="/blog/proptech-real-estate/zimbabwe-real-estate-ai-readiness-data-infrastructure">our AI-readiness analysis of Zimbabwean real estate data</a> explains why structured market data matters beyond the listing experience itself.</p>
    `,
  },
  {
    question:
      "What did building Propertyzone teach Sparkline Labs about software for Zimbabwean businesses?",
    answer: `
      <p>It reinforced the idea that adoption is often determined by whether a system fits an existing operating environment. Propertyzone had to account for WhatsApp as a core communication behaviour, unreliable connectivity, mobile-first usage, structured property data and the way estate agents actually work rather than the way a conventional property portal assumes they work.</p>
      <p>That experience shaped the wider Sparkline Labs approach: understand the workflow, preserve useful behaviour, remove unnecessary manual work and engineer around the constraints that exist in production.</p>
      <p>We document those lessons in <a href="/blog/solutions-engineering/why-buying-software-before-understanding-the-problem-is-expensive">Why Buying Software Before Understanding the Problem Is Expensive</a> and <a href="/blog/solutions-engineering/why-zimbabwean-businesses-run-operations-through-whatsapp">Why So Many Zimbabwean Businesses Still Run Critical Operations Through WhatsApp</a>.</p>
    `,
  },
];
