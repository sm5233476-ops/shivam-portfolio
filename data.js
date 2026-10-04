/* ==========================================================================
   DATA.JS - Single Source of Truth for Shivam Mishra Portfolio
   ========================================================================== */

/**
 * Core personal details and communication handles.
 * Reused dynamically across navbar, hero, quote builder, contact and footer.
 */
const CONTACT = {
  name: "Shivam Mishra",
  email: "8hivammishra8@gmail.com",
  whatsappDigits: "919899452192",
  displayPhone: "+91 9899452192",
  instagram: "shivam.0nyx",
  location: "India",
  replyTime: "within a few hours",
  availability: "Available for new projects",
  defaultWaMessage: "Hi Shivam, I saw your portfolio and would like to discuss a project for my business.",
  emailSubject: "Inquiry: Website / AI Assistant Project"
};

/**
 * Feature flag for live AI Assistant widget.
 * Set to true when widget snippet is active, false to hide prompt text.
 */
const ASSISTANT_ENABLED = false;

/**
 * Standard business terms - honest, clear, and transparent.
 */
const PAYMENT_TERMS = "50% upfront to reserve the development sprint, 50% upon final sign-off before deployment to your live domain.";
const REVISION_TERMS = "Two structured revision rounds during the interactive preview stage to ensure every detail aligns with your brand.";

/**
 * Concept builds for fictional businesses.
 * Honest showcase demonstrating industry-specific architecture and UI logic.
 */
const PROJECTS = [
  {
    id: "lumina-dental",
    industry: "Dental Healthcare",
    name: "Lumina Dental Studio",
    tagline: "Cosmetic dental clinic concept (Beverly Hills)",
    badge: "Concept project",
    problemSolution: "High-ticket dental patients need immediate treatment clarity and transparent financing before scheduling. Built with an interactive amortization calculator, smile transformation sliders, and a low-friction 3-step booking flow.",
    features: [
      "Financing Amortization Calculator",
      "3-Step Booking Flow",
      "Before & After Smile Slider",
      "Treatment FAQ Accordion"
    ],
    liveUrl: "https://lumina-dental-studio-iota.vercel.app/",
    laptopImg: "dental-laptop.jpg",
    laptopAlt: "Lumina Dental Studio desktop showcase with financing calculator and booking flow",
    phoneImg: "dental-phone.jpg",
    phoneAlt: "Lumina Dental Studio mobile view demonstrating clean mobile layout",
    video: ""
  },
  {
    id: "ironcrest-roofing",
    industry: "Home Services & Contracting",
    name: "Ironcrest Roofing & Restoration",
    tagline: "Commercial & residential roofing concept (Dallas)",
    badge: "Concept project",
    problemSolution: "Property owners facing severe storm damage need quick estimates without sales friction. Engineered with an instant square-footage replacement cost estimator, storm-readiness emergency sections, and a direct free inspection scheduler.",
    features: [
      "Instant Roof Estimate Calculator",
      "Free Inspection Booking Flow",
      "Storm-Damage Response Hub",
      "Project Transformation Sliders"
    ],
    liveUrl: "https://roofing-portfolio-two.vercel.app/",
    laptopImg: "roofing-laptop.jpg",
    laptopAlt: "Ironcrest Roofing desktop view showing storm restoration and instant estimate tool",
    phoneImg: "roofing-phone.jpg",
    phoneAlt: "Ironcrest Roofing mobile view showing one-tap inspection booking",
    video: ""
  },
  {
    id: "cinder-cedar",
    industry: "Specialty E-Commerce",
    name: "Cinder & Cedar Coffee Roasters",
    tagline: "Artisan specialty coffee roastery concept",
    badge: "Concept project",
    problemSolution: "Specialty buyers convert when origin notes and grind varieties are effortlessly clear. Developed with instant sensory filters, an interactive slide-out cart with dynamic free-shipping progress, and recurring coffee subscription options.",
    features: [
      "Tasting Notes & Origin Filters",
      "Slide-Out Cart with Free-Shipping Bar",
      "Demo Promo Code & Checkout Flow",
      "Recurring Coffee Subscriptions"
    ],
    liveUrl: "https://cinder-cedar-coffee-roasters.vercel.app/",
    laptopImg: "coffee-laptop.jpg",
    laptopAlt: "Cinder & Cedar desktop store showing specialty roast catalog and slide-out cart",
    phoneImg: "coffee-phone.jpg",
    phoneAlt: "Cinder & Cedar mobile layout showing quick add-to-cart experience",
    video: ""
  }
];

/**
 * Core Service Offerings
 */
const SERVICES = [
  {
    id: "service-websites",
    title: "High-Performance Service Websites",
    desc: "Bespoke, mobile-first websites engineered for local service businesses. Fast loading times, clean typography, and frictionless lead capture forms that turn local visitors into paying clients.",
    deliverables: [
      "Mobile-first responsive design",
      "Fast page loads (semantic HTML/CSS/JS)",
      "Interactive booking or quote flows",
      "Search-engine ready semantic structure"
    ]
  },
  {
    id: "ecommerce-stores",
    title: "Specialty E-Commerce Stores",
    desc: "Lightweight, conversion-focused online stores designed for independent brands. Smooth product catalogs, slide-out micro-carts, and straightforward checkout journeys without sluggish theme bloat.",
    deliverables: [
      "Fast product filtering & search",
      "Dynamic free-shipping progress bars",
      "Seamless mobile cart drawer",
      "Clean payment gateway integration"
    ]
  },
  {
    id: "ai-assistants",
    title: "24/7 Lead-Capture AI Chat Assistants",
    desc: "Custom-trained conversational chat widgets embedded right on your site. They answer customer questions instantly at 2 AM, qualify leads, and deliver contact details directly to your inbox or WhatsApp.",
    deliverables: [
      "Trained on your business FAQ and pricing",
      "Captures visitor name, phone, and inquiry",
      "Zero latency with natural voice styling",
      "Clean UI matching your brand aesthetic"
    ]
  }
];

/**
 * Instant Quote Builder Configuration (Single Source of Truth)
 * Values in USD integers.
 */
const PRICING = {
  projectTypes: [
    {
      id: "landing-page",
      label: "Landing Page",
      basePrice: 400,
      timeline: "3–5 days",
      desc: "Single focused page built for one service, product launch, or advertising campaign."
    },
    {
      id: "business-website",
      label: "Business Website (up to 5 pages)",
      basePrice: 900,
      timeline: "7–10 days",
      desc: "Complete multi-page presence: Home, About, Services, Case Studies/Gallery, Contact."
    },
    {
      id: "ecommerce-store",
      label: "E-Commerce Store",
      basePrice: 1500,
      timeline: "14–21 days",
      desc: "Custom storefront, catalog filtering, cart drawer, checkout setup, and product showcases."
    }
  ],
  extras: [
    {
      id: "extra-booking",
      label: "Booking System",
      price: 150,
      desc: "Multi-step interactive appointment scheduling flow connected to your calendar."
    },
    {
      id: "extra-calculator",
      label: "Calculator or Estimator",
      price: 150,
      desc: "Interactive pricing, financing amortization, or cost estimation tool for visitors."
    },
    {
      id: "extra-ai-assistant",
      label: "AI Chat Assistant",
      price: 150,
      desc: "Embedded 24/7 intelligent chat widget to answer customer questions and capture leads."
    }
  ],
  extraPagePrice: 80,
  maxExtraPages: 5,
  rangeMultiplier: 1.6,
  disclaimer: "Starting estimate only. Final price confirmed after a short discovery call. Timelines begin once copy and assets are ready."
};

/**
 * Structured 4-Step Working Process
 */
const PROCESS_STEPS = [
  {
    step: "01",
    title: "Short Call",
    desc: "A focused 20-minute discussion to understand your business, target audience, competitors, and the exact goals for your new website.",
    duration: "Day 1"
  },
  {
    step: "02",
    title: "Design Preview",
    desc: "A fully functional staging preview delivered early. You can tap through real screens on your phone before any final development starts.",
    duration: "Days 2–4"
  },
  {
    step: "03",
    title: "Build & Polish",
    desc: "Clean semantic HTML5, modern CSS, and subtle GSAP animations. Tested across Safari, Chrome, iOS, and Android for zero horizontal overflow.",
    duration: "Days 5–12"
  },
  {
    step: "04",
    title: "Launch & Support",
    desc: "Domain mapping, SSL verification, SEO meta tags, and 30 days of direct post-launch WhatsApp support to ensure everything runs smoothly.",
    duration: "Launch Day"
  }
];

/**
 * Honest Advantages
 */
const WHY_POINTS = [
  {
    title: "Clear WhatsApp updates",
    desc: "No long silences or ambiguous progress bars. You get regular, concise video walkthroughs and updates directly on WhatsApp."
  },
  {
    title: "A working preview early",
    desc: "You test a clickable, responsive staging URL early in the sprint, eliminating surprises and unnecessary back-and-forth revisions."
  },
  {
    title: "Mobile-first & genuinely fast",
    desc: "Handcrafted semantic code with zero heavy page-builder overhead. Pages load instantly even on patchy mobile connections."
  },
  {
    title: "Flexible time zone overlap",
    desc: "Working hours structured to provide consistent 4 to 6-hour daily communication overlap with US and UK business hours."
  }
];

/**
 * Core Technical Tools
 */
const TOOLS = [
  "HTML5 / Semantic CSS",
  "Modern JavaScript",
  "GSAP & ScrollTrigger",
  "Lenis Smooth Scroll",
  "Vercel Deployment",
  "GitHub Version Control",
  "AI-Assisted Development"
];

/**
 * Live Independent Products
 */
const PRODUCTS = [
  {
    id: "alwayson",
    name: "AlwaysOn Assistant",
    url: "https://alwayson-assistant.vercel.app",
    desc: "An embeddable AI chat widget that answers visitor questions and captures leads for local service businesses 24 hours a day.",
    badge: "Live Product"
  },
  {
    id: "reviewshield",
    name: "ReviewShield AI",
    url: "https://smartreviewshield.com",
    desc: "A tool that helps local businesses manage, monitor, and intelligently respond to their Google reviews.",
    badge: "Live Product"
  }
];

/**
 * FAQ Accordion Content (First item open by default)
 */
const FAQ = [
  {
    id: "faq-timeline",
    question: "How long does a website take to build?",
    answer: "A focused landing page typically takes 3 to 5 business days. A multi-page business website (up to 5 pages) takes 7 to 10 days, while custom e-commerce stores take 14 to 21 days. Timelines start once brand assets and written copy are ready."
  },
  {
    id: "faq-payment",
    question: "How does payment work?",
    answer: "Standard terms are 50% upfront to reserve the development sprint on my calendar, and 50% upon final sign-off before your site is deployed to your live domain. Invoicing is handled securely with clear receipts."
  },
  {
    id: "faq-ownership",
    question: "Who owns the domain, hosting, and code?",
    answer: "You own 100% of everything from day one. I set up hosting directly on your own free or low-cost Vercel/Netlify account and map your domain. If we ever part ways, you retain full ownership and clean, standard code with no proprietary lock-in."
  },
  {
    id: "faq-requirements",
    question: "What do you need from me before we start?",
    answer: "High-resolution logos, brand colors, any existing photos of your work, and your core service descriptions. If you don't have finished copy yet, I provide structured content worksheets to help you put it together quickly."
  },
  {
    id: "faq-revisions",
    question: "How many revisions are included?",
    answer: "Every project includes two structured rounds of revisions during the interactive preview milestone. Because you get to test a functional staging URL early, feedback is specific and changes happen quickly."
  },
  {
    id: "faq-existing-assistant",
    question: "Can you add an AI assistant to my existing site?",
    answer: "Yes. The AI chat assistant is built as a lightweight, embeddable script. It can be added to WordPress, Squarespace, Webflow, Shopify, or plain HTML websites within one business day."
  }
];

/**
 * Hero Crossfade Slides (Screenshots from local root files)
 */
const HERO_CROSSFADE = [
  {
    laptopImg: "dental-laptop.jpg",
    laptopAlt: "Lumina Dental Studio on laptop frame",
    phoneImg: "dental-phone.jpg",
    phoneAlt: "Lumina Dental Studio on phone frame",
    name: "Lumina Dental Studio"
  },
  {
    laptopImg: "roofing-laptop.jpg",
    laptopAlt: "Ironcrest Roofing & Restoration on laptop frame",
    phoneImg: "roofing-phone.jpg",
    phoneAlt: "Ironcrest Roofing on phone frame",
    name: "Ironcrest Roofing & Restoration"
  },
  {
    laptopImg: "coffee-laptop.jpg",
    laptopAlt: "Cinder & Cedar Coffee Roasters on laptop frame",
    phoneImg: "coffee-phone.jpg",
    phoneAlt: "Cinder & Cedar on phone frame",
    name: "Cinder & Cedar Coffee Roasters"
  }
];
