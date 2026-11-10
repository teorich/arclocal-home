/**
 * Editable content for the ArcLocal public home page.
 *
 * This object is both the default copy (what the page shows until someone
 * saves changes in the CMS) and the schema: `conform()` shapes every stored
 * value after it, so the page can never render malformed data.
 *
 * Presentation (icons, colours, links, section anchors) intentionally stays in
 * the component; only wording lives here.
 */
export const homeSeed = {
  seo: {
    title: "ArcLocal | Business SMS & Delivery Intelligence",
    description:
      "ArcLocal gives your team one place to reach customers, manage campaigns, track delivery and grow with confidence.",
    socialDescription:
      "Reach customers, manage campaigns and track delivery with ArcLocal's reliable bulk SMS platform.",
  },
  topbar: {
    left: "Business SMS, made simple",
    center: "Secure delivery intelligence",
    right: "Support for your messaging operations",
    signIn: "Sign in",
  },
  header: {
    tagline: "SMS THAT MOVES BUSINESS",
    login: "Log in",
    cta: "Request access",
  },
  hero: {
    badge: "Built for reliable business messaging",
    headlineStart: "Send messages that create",
    headlineAccent: "real results.",
    body: "ArcLocal gives your team one place to reach customers, manage campaigns, track delivery and grow with confidence—without operational complexity.",
    primaryCta: "Request ArcLocal access",
    secondaryCta: "Explore the platform",
    checks: ["Campaigns and alerts", "Delivery receipts"],
    visual: {
      campaignLabel: "ArcLocal campaign",
      campaignTitle: "Customer update",
      liveBadge: "Live delivery",
      reachLabel: "Campaign reach",
      reachValue: "12,480",
      reachPercent: 82,
      reachCaption: "delivered",
      receiptTitle: "Delivered to terminal",
      receiptText: "Real-time receipt updates keep your team informed.",
    },
  },
  benefits: [
    { title: "Fast delivery", text: "Launch campaigns in minutes" },
    { title: "Reliable & secure", text: "Hosted identity and audit trails" },
    { title: "Delivery visibility", text: "Receipts and status tracking" },
    { title: "Built for teams", text: "Roles, organizations and controls" },
  ],
  platform: {
    eyebrow: "One focused platform",
    title: "Everything your SMS operation needs.",
    body: "From the first audience upload to the final delivery receipt, ArcLocal keeps every message workflow clear, accountable and easy to manage.",
    cardLink: "Learn more",
    items: [
      { title: "Campaign studio", text: "Build, schedule and launch bulk SMS campaigns from one focused workspace." },
      { title: "Smart contacts", text: "Organize audiences, segments and consent records before every send." },
      { title: "Delivery intelligence", text: "Monitor accepted, delivered, pending and failed messages in real time." },
      { title: "Built to grow", text: "Scale your SMS operation without changing how your team works." },
    ],
  },
  how: {
    eyebrow: "How it works",
    title: "From audience to delivered message.",
    body: "A simple, traceable workflow for teams that need to communicate at volume without losing control.",
    cta: "Request access",
    steps: [
      { title: "Build your audience", text: "Import contacts, capture consent and create focused segments." },
      { title: "Create the message", text: "Write, personalize, schedule and approve your campaign." },
      { title: "Track every outcome", text: "Watch delivery status and receipts arrive in one workspace." },
    ],
  },
  why: {
    eyebrow: "Why ArcLocal",
    title: "The SMS workspace your team can trust.",
    body: "Every campaign, contact, consent record and delivery outcome stays clear and traceable, while ArcLocal handles the complexity behind the scenes.",
    chips: ["Secure workspaces", "Delivery receipts", "Team controls"],
    panel: {
      title: "Your messaging operation",
      subtitle: "Clear, secure and accountable",
      status: "Ready",
      stat1Label: "Audience consent",
      stat1Value: "Organized",
      stat2Label: "Delivery status",
      stat2Value: "Tracked",
    },
  },
  cta: {
    eyebrow: "Ready when you are",
    title: "Turn customer updates into dependable conversations.",
    body: "Create your secure account, request access and join the merchant workspaces approved for your role.",
    primary: "Request access",
    secondary: "Access your workspace",
  },
  footer: {
    about: "A dependable workspace for bulk SMS, delivery intelligence and business communication across Africa.",
    opsTitle: "Messaging operations",
    opsText: "ArcLocal keeps campaigns, audience consent and delivery intelligence together in one focused workspace.",
    copyright: "© 2026 ArcLocal. All rights reserved.",
    legal: "Privacy · Terms · Messaging consent",
  },
}

export type HomeContent = typeof homeSeed
