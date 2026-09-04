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
  {
    question:
      "Do you always charge for a discovery phase, and does every project take two weeks to scope?",
    answer: `
    <p>No. Not every Sparkline Labs project requires a paid two-week discovery phase.</p>

    <p>We use a deeper discovery process when the problem, workflow or proposed solution is genuinely uncertain. This is particularly useful for a unique proposition where the business is effectively asking us to work out what should exist before we can responsibly define what should be built. In those cases, discovery gives us time to understand the operation, map the workflow, identify technical risks, determine the appropriate architecture and establish a clear implementation path.</p>

    <p>Many projects are much more straightforward. If the problem is already well understood, the workflow is known, the solution has already been designed or prototyped, or we are extending an existing system with clearly defined requirements, there may be no reason to spend two weeks rediscovering something that is already known. In those cases, we can move directly into a pilot, implementation or other appropriate engagement.</p>

    <p>The same principle applies to pricing. We do not add a discovery fee simply because it is our standard process. The cost and structure of an engagement depend on the amount of uncertainty, the complexity of the problem and the work required before implementation can be properly defined.</p>

    <p>Our approach is therefore <strong>proportionate to the problem</strong>: understand what needs to be understood, prove what needs to be proven, and only spend time on discovery where it creates genuine value. This is consistent with our broader <a href="/services">solutions engineering approach</a>, where we determine whether a project needs architecture work, a pilot, integration, custom development or technical modernisation before deciding how the engagement should proceed.</p>
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
  {
    question:
      "Why doesn't Sparkline Labs have AI as a separate service category?",
    answer: `
      <p>Because AI is a capability that can sit inside a larger solution rather than a business problem in its own right.</p>

      <p>A company may need AI-assisted search, document extraction, recommendations, content generation, classification or customer interaction. But the AI component still depends on the surrounding workflow, data and system architecture.</p>

      <p>We therefore prefer to engineer the underlying system first and introduce AI where it provides a meaningful improvement. That might mean AI inside a custom platform, a business workflow, an integration or one of our own products.</p>

      <p>We talk about AI deliberately rather than constantly because we do not want to confuse the availability of a technology with the existence of a problem worth solving.</p>
    `,
  },
];

export const seoDigitalStrategyFaqs = [
  {
    question:
      "Does Sparkline Labs build websites and do SEO as separate services?",
    answer: `
      <p>They can be separate pieces of work, but we do not assume they should be treated as completely separate problems.</p>

      <p>A website may be responsible for explaining the business and converting a visitor. SEO may make that website discoverable. Content may answer the questions that create demand in the first place. AI visibility may determine whether the business is represented correctly in emerging answer-based search. WhatsApp or another channel may handle the actual enquiry, while a CRM or internal system manages what happens next.</p>

      <p>Looking at those pieces together can reveal problems that would remain invisible if the engagement stopped at “build a better website”. This is why our digital strategy work considers the entire customer journey rather than treating the website as the beginning and end of the digital operation.</p>
    `,
  },
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

export const productsFaqs = [
  {
    question: "What products has Sparkline Labs actually built?",
    answer: `
      <p>Sparkline Labs currently has products in production in the areas where we have identified a real operational problem worth solving. <a href="/products">Propertyzone</a> is our intent-first property platform for Zimbabwe, while its <strong>Agency CRM</strong> is a sales pipeline and deal-tracking system built directly into Propertyzone for verified real estate agencies.</p>

      <p>These are not demo applications created to showcase a technology stack. They are live systems that have to handle real users, real enquiries, real property data, real agency workflows and the operating conditions in which businesses actually work.</p>

      <p>We build our own products for the same reason we build systems for clients: to understand where technology genuinely improves an operation and where an apparently good software idea breaks down when it meets real users.</p>
    `,
  },
  {
    question:
      "Is Propertyzone a product of Sparkline Labs or a client project?",
    answer: `
      <p>Propertyzone is a Sparkline Labs product and is live in production. It was built around a specific problem in Zimbabwean real estate: large volumes of property enquiries were being generated, but the information, intent and follow-up required to turn those enquiries into useful opportunities were fragmented across listings, WhatsApp conversations and individual agents.</p>

      <p>The result is more than a property catalogue. Propertyzone combines structured property information, verified buyer and renter profiles, intent-tagged enquiries, lead management, agency workflows and direct WhatsApp communication.</p>

      <p>The engineering decisions behind the product are documented in the <a href="/work/propertyzone">Propertyzone case study</a>.</p>
    `,
  },
  {
    question: "Why does Sparkline Labs build its own products?",
    answer: `
      <p>Building our own products gives us something a conventional software vendor cannot get from a specification alone: direct experience with what happens after software goes live.</p>

      <p>We have to deal with adoption, incomplete data, changing requirements, customer behaviour, connectivity, operational workflows, support, performance and the difference between a feature that sounds useful and one that actually changes the business.</p>

      <p>That experience feeds back into the way we work with clients. Propertyzone, for example, forced us to deal with the relationship between structured data, WhatsApp, property search, lead qualification, agent workflows and unreliable connectivity as one system rather than as separate software features.</p>

      <p>That is a large part of why our work is based on <a href="/blog/solutions-engineering">solutions engineering</a> rather than simply implementing a technology specification.</p>
    `,
  },
  {
    question:
      "Can Sparkline Labs build a product from an idea that does not exist yet?",
    answer: `
      <p>Yes. We can work from a business problem, market opportunity or product idea rather than requiring a complete technical specification.</p>

      <p>Where the proposition is genuinely new or uncertain, we first need to understand the users, workflow, business model and technical risks before committing to a full build. That may involve a discovery phase and a focused pilot to prove the riskiest part of the concept.</p>

      <p>The goal is not to spend months producing a specification that has never encountered a real user. We prefer to identify the important assumptions early, test them and then build around what has actually been learned.</p>

      <p>That approach is explained further in our <a href="/services">services</a> and in <a href="/blog/solutions-engineering">our Solutions Engineering writing</a>.</p>
    `,
  },
  {
    question:
      "Can Sparkline Labs build a custom product for a business even if it already has existing software?",
    answer: `
      <p>Yes. A new product does not necessarily mean replacing every system the business already uses.</p>

      <p>Sometimes the right architecture is a new customer-facing platform connected to existing systems. In other cases, an internal product can sit alongside accounting, CRM, payment or communication systems and become the operational layer connecting them.</p>

      <p>We first determine which capabilities already work, which systems should remain authoritative, and where a new product would actually add value. Our approach may therefore result in a custom platform, an integration layer, an internal tool, or a combination of these rather than a complete replacement.</p>
    `,
  },
];

export const workFaqs = [
  {
    question: "What is Sparkline Labs trying to show through its case studies?",
    answer: `
      <p>Our case studies are intended to show more than the finished interface. They explain the business problem, the assumptions we challenged, the system we chose to build, the constraints we had to engineer around and what happened when the solution entered production.</p>

      <p>That distinction matters because a screenshot cannot tell you whether software changed the underlying workflow. A system can look polished while leaving the original business problem untouched.</p>

      <p>Our <a href="/work/propertyzone">Propertyzone case study</a>, for example, focuses on the distinction between an enquiry and a lead, the role of WhatsApp, structured property data, lead routing and unreliable connectivity because those were the actual engineering problems behind the product.</p>
    `,
  },
  {
    question:
      "Are the projects on the Work page client projects or products Sparkline Labs built itself?",
    answer: `
      <p>Both are possible. The Work page includes case studies from custom builds as well as products that Sparkline Labs has built and operates itself.</p>

      <p>Propertyzone is our clearest current example of the second category: it is a Sparkline Labs product that was built around a real market problem and taken into production.</p>

      <p>For client work, the same principle applies. We focus on what problem the system was designed to solve and why particular technical decisions were made, rather than presenting a generic list of technologies used.</p>
    `,
  },
  {
    question:
      "Why does the Propertyzone case study focus so much on the workflow instead of just the technology?",
    answer: `
      <p>Because the software was designed around a workflow problem rather than a technology problem.</p>

      <p>The property market already had websites, listings, agents and WhatsApp. The harder problem was what happened after someone enquired: whether that enquiry carried meaningful intent, who was responsible for it, whether it could be matched to other properties, whether the agent could respond quickly and what happened to the information afterwards.</p>

      <p>That is why the case study examines the system surrounding the interface. The <a href="/work/propertyzone">full Propertyzone case study</a> explains how structured data, intent, matching, WhatsApp and agent workflows became parts of the same system.</p>
    `,
  },
  {
    question:
      "Why does Sparkline Labs publish the problems and trade-offs behind its projects?",
    answer: `
      <p>Because the difficult part of engineering is rarely the existence of a feature. The difficult part is deciding what the feature should actually do, what assumptions it depends on and what happens when the real operating environment does not behave as expected.</p>

      <p>We therefore document decisions around workflow, data, connectivity, communication channels, adoption and technical risk. Those decisions are useful to potential clients because they show how we think before and during implementation.</p>

      <p>They also feed directly into the wider <a href="/blog/solutions-engineering">Solutions Engineering</a> body of work we publish from projects we have actually built.</p>
    `,
  },
];
export const propertyzoneCaseStudyFaqs = [
  {
    question: "What exactly did Sparkline Labs build for Propertyzone?",
    answer: `
      <p>Sparkline Labs built Propertyzone as an intent-first property platform combining structured property listings, verified buyer and renter profiles, lead capture, agency workflows, matching and direct WhatsApp-routed communication.</p>

      <p>The system was designed around the full journey rather than only the property-search screen. A property has structured attributes, a customer has an identifiable intent, an enquiry becomes part of a managed workflow, and agents can act on that information through the communication channel they already use.</p>

      <p>The platform is live in production. The <a href="/products">Products page</a> describes the current product capabilities, while this case study explains why the system was engineered in this way.</p>
    `,
  },
  {
    question:
      "Why does Propertyzone ask for more structured property information than a typical property advert?",
    answer: `
      <p>Because the information needs to remain useful after the property has been published.</p>

      <p>A normal listing can work with a price, location, bedroom count and a paragraph. A system that needs to match demand to inventory, support useful search, power neighbourhood information, qualify enquiries or provide context to AI applications needs much more of the property represented as structured data.</p>

      <p>Propertyzone therefore captures information about the property and its environment that would otherwise disappear into free text. This makes the data usable for matching, filtering, analysis and future intelligent applications instead of leaving everything inside a description written for humans alone.</p>

      <p>Our <a href="/blog/proptech-real-estate">PropTech & Real Estate</a> writing goes deeper into why structured property data is becoming infrastructure rather than just listing information.</p>
    `,
  },
  {
    question:
      "Why does Propertyzone use WhatsApp for agent communication instead of forcing agents into another messaging system?",
    answer: `
      <p>Because the agents and customers already use WhatsApp. Requiring them to change communication behaviour simply to use the software would introduce friction that the platform is supposed to remove.</p>

      <p>Propertyzone therefore uses WhatsApp as part of the delivery layer while the structured system underneath handles the information and workflow. An enquiry can carry the property reference, intent and qualification context into the agent's conversation instead of arriving as an unstructured message with no operational record.</p>

      <p>This is part of a wider Sparkline Labs principle: the system should adapt to the environment in which the business already operates where doing so produces a better outcome. We explore this in <a href="/blog/solutions-engineering/why-zimbabwean-businesses-run-operations-through-whatsapp">our writing on WhatsApp-driven business operations</a>.</p>
    `,
  },
  {
    question: "How does Propertyzone distinguish an enquiry from a real lead?",
    answer: `
      <p>Propertyzone treats the first interaction as the beginning of a process rather than assuming that every click is a qualified lead.</p>

      <p>An enquiry can represent different levels of intent. Someone asking whether a property is available is different from someone actively trying to buy, rent or invest, and someone who is not ready for one property may still be a useful prospect for another one later.</p>

      <p>The platform therefore captures intent and other relevant information so agencies can work from a more useful signal than a raw WhatsApp message. The objective is not to remove the agent's judgement. It is to give the agent more context before that judgement is required.</p>
    `,
  },
  {
    question:
      "Why is connectivity treated as part of Propertyzone's architecture?",
    answer: `
      <p>Because a property agent may need the system while moving between properties, meeting a client or working in an area where connectivity is unreliable. A workflow that assumes a perfect connection can therefore fail at exactly the moment it is needed.</p>

      <p>Propertyzone was engineered with those operating conditions in mind rather than treating poor connectivity as an unusual exception. Where appropriate, information can remain usable locally and the system can reconcile state when connectivity returns.</p>

      <p>This principle extends beyond Propertyzone. We consider mobile-first usage, network reliability and other environmental constraints during architecture instead of trying to solve them after the system has already been built.</p>
    `,
  },
  {
    question:
      "What makes Propertyzone different from simply building another property listings website?",
    answer: `
      <p>The difference is what the system is responsible for after the listing has been published.</p>

      <p>A conventional portal primarily helps a customer discover a property and contact an agent. Propertyzone is designed to connect inventory with intent, retain structured information about demand, route enquiries, support agency workflows and create opportunities for matching properties with known requirements.</p>

      <p>The goal is to move beyond an online catalogue towards a system that helps the property business manage what happens before and after the click.</p>

      <p>That is the reasoning behind the title of the case study: <strong>The Property Lead Was Already There. The Workflow Wasn't.</strong></p>
    `,
  },
];

export const blogFaqs = [
  {
    question:
      "Why does Sparkline Labs publish articles about business operations instead of only software development?",
    answer: `
      <p>Because the software problem usually starts before the software. A business may think it needs a CRM, automation, an AI feature or a new website when the underlying problem is actually a broken handoff, missing information, a disconnected workflow or a process that depends too heavily on one person.</p>

      <p>Our writing starts from those operational problems and examines where technology can actually improve them. That is why the blog covers WhatsApp, connectivity, software procurement, AI readiness, manual work, digital visibility and property technology alongside conventional engineering topics.</p>

      <p>The underlying principle is the same as our client work: understand the operation first, then determine what technology should do.</p>
    `,
  },
  {
    question: "Are the Sparkline Labs articles based on real projects?",
    answer: `
      <p>Much of the writing comes directly from problems encountered while building and operating systems such as <a href="/work/propertyzone">Propertyzone</a>, as well as from patterns we see across business technology in Zimbabwe.</p>

      <p>That is why many articles focus on specific operational questions rather than generic technology trends. For example, <a href="/blog/solutions-engineering/why-buying-software-before-understanding-the-problem-is-expensive">our analysis of software procurement</a> comes from the same solutions-engineering perspective used when deciding what should actually be built, while our writing on WhatsApp examines a communication channel that has become part of everyday business operations.</p>
    `,
  },
  {
    question: "Who is the Sparkline Labs blog written for?",
    answer: `
      <p>The blog is primarily written for business owners, operators, founders and technical decision-makers who need to make better technology decisions in Zimbabwe and across Africa.</p>

      <p>You do not need to be a software engineer to use it. Many articles start with a business problem and explain the technical implications afterwards: lost leads, manual work, disconnected systems, poor digital visibility, unreliable connectivity or software that no longer fits the business.</p>

      <p>The deeper purpose is to help businesses understand the decisions behind the technology rather than simply telling them which tool to buy.</p>
    `,
  },
  {
    question:
      "Why does Sparkline Labs focus so heavily on Zimbabwe when the technology it uses is global?",
    answer: `
      <p>Because software may be global while the environment in which it operates is not.</p>

      <p>Payment systems, customer communication habits, connectivity, mobile usage, business workflows, procurement behaviour and market structure all affect whether a technically sound system actually works for a Zimbabwean business.</p>

      <p>Our <a href="/blog/solutions-engineering">Solutions Engineering</a>, <a href="/blog/proptech-real-estate">PropTech & Real Estate</a>, <a href="/blog/seo-and-digital-strategy">SEO & Digital Strategy</a> and <a href="/blog/software-industry">Software Industry & AI</a> categories all explore different parts of that operating reality.</p>
    `,
  },
];
