# LaunchPad Digital — Website Build Prompting Guide

> **LaunchPad Digital** — A full-service digital agency helping small businesses in Finland grow online.
>
> This document contains comprehensive AI prompts to build the agency website from scratch. Services span marketing, web development, videography, AI automation, branding, and more.

---

## Brand Overview

| Element | Value |
|---|---|
| **Name** | LaunchPad Digital |
| **Tagline** | *Helping Finnish businesses grow digital* |
| **Domain** | launchpaddigital.fi |
| **Logo Mark** | LP↗ (monogram with upward arrow) |
| **Legal Name** | LaunchPad Digital Oy |
| **Social Handle** | @launchpaddigital |
| **Email** | hello@launchpaddigital.fi |
| **Location** | Tampere, Finland |

### Core Services

1. **Web Development** — Custom websites, landing pages, e-commerce
2. **Video & Content Production** — Reels, brand videos, product shoots
3. **Digital Marketing** — Social media, SEO, paid ads, email campaigns
4. **AI & Automation** — Chatbots, workflow automation, AI-powered tools
5. **Branding & Design** — Logo, visual identity, brand strategy
6. **Consulting** — Digital strategy, tech stack advisory

### Target Audience

- Small businesses in Finland (1–50 employees)
- Startups and solopreneurs
- Local shops, restaurants, service providers going online
- Companies looking to automate and scale

---

## Table of Contents

1. [Phase 1: Project Setup](#phase-1-project-setup)
2. [Phase 2: Homepage & Hero](#phase-2-homepage--hero)
3. [Phase 3: Services Pages](#phase-3-services-pages)
4. [Phase 4: Portfolio & Case Studies](#phase-4-portfolio--case-studies)
5. [Phase 5: About & Contact](#phase-5-about--contact)
6. [Phase 6: Animations & Polish](#phase-6-animations--polish)
7. [Phase 7: SEO & Deployment](#phase-7-seo--deployment)
8. [Optional Extras](#optional-extras)
9. [Tips for Best Results](#tips-for-best-results)

---

## Phase 1: Project Setup

### Prompt 1 — Scaffold the Project

```
Create a digital agency website for "LaunchPad Digital" with the following structure:

- index.html (homepage)
- services.html (all services overview)
- portfolio.html (case studies & portfolio)
- about.html (about the agency)
- contact.html (contact & booking page)
- css/styles.css (main stylesheet)
- js/app.js (main JavaScript)

Brand: LaunchPad Digital — "Helping Finnish businesses grow digital"
Location: Tampere, Finland

Tech stack:
- Pure HTML5, CSS3, JavaScript (no frameworks)
- Google Fonts: "Inter" for body, "Space Grotesk" for headings
- Font Awesome 6 via CDN for icons

Design direction:
- Modern, clean, professional, trustworthy
- Color palette:
  - Primary dark: #0f172a (navy/slate)
  - White: #ffffff
  - Accent: #3b82f6 (electric blue)
  - Secondary accent: #06b6d4 (cyan)
  - Success green: #22c55e (for CTAs)
- Generous whitespace, bold typography
- Mobile-first responsive design
- Gradient accents (blue → cyan) for hero and buttons

Set up the base HTML boilerplate for all pages with:
- Shared <head> with meta tags, fonts, favicon placeholder
- Navigation bar (LP↗ logo left, links right, "Get Started" CTA button, hamburger on mobile)
- Footer with: service links, social links (LinkedIn, Instagram, YouTube), newsletter signup, contact info, copyright
- CSS variables for all colors, fonts, spacing, border-radius
- CSS reset and base typography
```

### Prompt 2 — Navigation & Footer

```
Build the navigation and footer components for LaunchPad Digital:

Navigation:
- Fixed/sticky navbar, white/transparent on top, solid white with shadow on scroll
- Logo: "LaunchPad" in Space Grotesk bold + "Digital" in lighter weight, blue accent on the ↗ arrow
- Links: Home, Services, Portfolio, About, Contact
- "Get Started" CTA button (blue gradient, stands out)
- Active page indicator (underline or color change)
- Mobile: hamburger icon → slide-in menu from right with overlay
- Smooth transitions for all state changes

Footer (4-column layout on desktop, stacked on mobile):
- Column 1: Logo + brief company description + social icons (LinkedIn, Instagram, YouTube)
- Column 2: Services links (Web Dev, Video, Marketing, AI, Branding)
- Column 3: Company links (About, Portfolio, Blog, Careers, Contact)
- Column 4: Newsletter signup (email input + subscribe button)
- Bottom bar: © LaunchPad Digital Oy [year] | Privacy Policy | Terms
- "Back to top" arrow button

Add the scroll-based navbar background change in app.js.
```

---

## Phase 2: Homepage & Hero

### Prompt 3 — Hero Section

```
Create a bold hero section for the LaunchPad Digital homepage:

- Full-viewport height (100vh) or near-full (90vh)
- Background: gradient mesh or abstract geometric pattern (blue → cyan → dark)
  - OR: split layout — text on left, illustration/graphic on right
- Content (left-aligned or centered):
  - Eyebrow text: "Digital Agency in Finland"
  - Main heading (clamp 2.5rem–5rem): "We Help Small Businesses Grow Digital"
  - Subheading: "Web development, marketing, video production, and AI automation — all under one roof."
  - Two CTA buttons:
    - Primary: "Get a Free Consultation" (blue gradient, bold)
    - Secondary: "View Our Work →" (outline style)
  - Trust badges below CTAs: "Trusted by 20+ Finnish businesses" + small client logos row
- Subtle scroll-down indicator at bottom (animated chevron)
- On mobile: stacked layout, smaller text, full-width buttons
```

### Prompt 4 — Services Overview Section

```
Below the hero, add a "What We Do" services section on the homepage:

- Section title: "What We Do" with subtitle "Everything your business needs to thrive online"
- Grid of 6 service cards (3 columns desktop, 2 tablet, 1 mobile):
  1. Web Development — icon: code brackets — "Custom websites, e-commerce, and web apps"
  2. Video & Content — icon: video camera — "Brand videos, reels, product photography"
  3. Digital Marketing — icon: chart/megaphone — "SEO, social media, paid ads, email"
  4. AI & Automation — icon: robot/cpu — "Chatbots, workflow automation, AI tools"
  5. Branding & Design — icon: palette — "Logo, visual identity, brand guidelines"
  6. Consulting — icon: lightbulb — "Digital strategy and tech advisory"
- Each card: icon (in blue circle), title, 1-line description, "Learn more →" link
- Cards have white background, subtle shadow, hover lift + blue top border effect
- Lazy loading on any images
```

### Prompt 5 — Why Choose Us & Stats

```
Add two more sections to the homepage:

1. "Why LaunchPad?" section:
   - 2-column layout: text left, image/graphic right
   - 3-4 bullet points with icons:
     - "Local Expertise" — We understand the Finnish market
     - "All-in-One" — No need to juggle multiple agencies
     - "Modern Tech" — AI-powered solutions, not outdated methods
     - "Results-Driven" — We measure everything, you see the ROI
   - CTA button: "Book a Call"

2. Stats/numbers bar (full-width, blue gradient background):
   - 4 stats in a row: "20+ Clients" | "50+ Projects" | "3+ Years" | "100% Finnish"
   - Numbers animated count-up when scrolled into view
   - White text on blue gradient
   - On mobile: 2x2 grid
```

---

## Phase 3: Services Pages

### Prompt 6 — Services Overview Page

```
Build the services page (services.html) for LaunchPad Digital:

- Page hero: "Our Services" heading + subtitle "Full-stack digital solutions for Finnish businesses"
- 6 detailed service sections (alternating layout: text-left/image-right, then flip):

1. Web Development
   - Icon + heading + 2 paragraphs
   - What's included: Custom websites, E-commerce (Shopify/WooCommerce), Landing pages, Web apps, Maintenance & hosting
   - Tech badges: React, Next.js, WordPress, Shopify

2. Video & Content Production
   - Brand videos, social media reels, product photography, drone footage
   - Process: concept → shoot → edit → deliver
   - Equipment badges: 4K, Drone, Studio

3. Digital Marketing
   - SEO, Google Ads, Meta Ads, Social media management, Email campaigns, Analytics
   - "We handle everything from strategy to execution"

4. AI & Automation
   - Custom chatbots, workflow automation, AI-powered customer service
   - CRM automation, email sequences, data analysis
   - "Save 10+ hours per week with smart automation"

5. Branding & Design
   - Logo design, brand guidelines, visual identity, business cards, social templates
   - "From startup branding to complete rebrands"

6. Consulting & Strategy
   - Digital audits, tech stack advisory, growth strategy, competitor analysis
   - "1-hour free consultation for new clients"

- Each section has a "Get a Quote →" CTA button
- Bottom CTA: "Not sure what you need? Let's talk." → links to contact
```

### Prompt 7 — Pricing / Packages Section

```
Add a pricing section to the services page (or as a separate section):

- Section title: "Simple, Transparent Pricing"
- 3 pricing tiers in cards:

1. Starter (for solopreneurs):
   - Landing page or 1-page website
   - Basic SEO setup
   - Social media templates (5)
   - Price: "From €999"
   - CTA: "Get Started"

2. Growth (most popular — highlighted):
   - Full website (up to 5 pages)
   - Brand video (30-60 sec)
   - Social media setup + 1 month management
   - Basic AI chatbot
   - Price: "From €2,999"
   - CTA: "Get Started"
   - "Most Popular" badge

3. Scale (for established businesses):
   - E-commerce / web app
   - Full video production package
   - 3-month marketing campaign
   - Custom AI automation
   - Brand identity package
   - Price: "Custom"
   - CTA: "Book a Call"

- Note below: "All prices exclude VAT (ALV). Custom packages available."
- Cards: white bg, shadow, hover lift, blue accent on popular tier
- On mobile: stack vertically, popular tier first
```

---

## Phase 4: Portfolio & Case Studies

### Prompt 8 — Portfolio Page

```
Build the portfolio page (portfolio.html) for LaunchPad Digital:

- Page hero: "Our Work" heading + subtitle "Real results for real businesses"
- Filter bar:
  - Category buttons: All, Web, Video, Marketing, AI, Branding
  - Active filter highlighted in blue
  - Smooth filter animation
- Portfolio grid (3 columns desktop, 2 tablet, 1 mobile):
  - Each project card:
    - Thumbnail image (16:9 or 4:3)
    - Project title
    - Client name
    - Service tags (e.g., "Web + Marketing")
    - Hover: overlay with "View Case Study →"
  - Use 6-9 placeholder projects with sample data:
    - "Helsinki Café" — Web + Branding
    - "Nordic Fitness" — Video + Marketing
    - "TampereShop" — E-commerce + AI Chatbot
    - "Sauna & Co" — Brand Video + Social
    - "GreenTech Finland" — Web App + Automation
    - "Local Bakery" — Branding + Marketing
- Lazy loading on all images
- "Have a project in mind?" CTA at bottom
```

### Prompt 9 — Case Study Template

```
Create a case study detail template/section (can be modal or expandable):

- When clicking a portfolio item, show detailed case study:
  - Hero banner with project image
  - Project overview:
    - Client name & industry
    - Services provided (tags)
    - Timeline (e.g., "4 weeks")
    - Key result (e.g., "+150% website traffic")
  - The Challenge: what problem the client had
  - Our Solution: what LaunchPad Digital did
  - Results: metrics with big numbers (traffic increase, revenue, engagement)
  - Client testimonial quote
  - Before/after screenshots (if applicable)
  - "Start Your Project →" CTA button
- Use placeholder content for 2-3 detailed case studies
- Clean editorial layout, lots of whitespace
```

---

## Phase 5: About & Contact

### Prompt 10 — About Page

```
Build the about page (about.html) for LaunchPad Digital:

Layout:
- Hero: "About LaunchPad Digital" + subtitle "Your digital growth partner in Finland"

Content sections:

1. Our Story:
   - 2-column: text left, team photo right
   - 2-3 paragraphs about founding story, mission, values
   - "Founded in Tampere, we help small Finnish businesses compete in the digital world"
   - Emphasis on being local, approachable, results-driven

2. Our Values (3-4 cards in a row):
   - Transparency — "No hidden fees, clear communication"
   - Quality — "We don't cut corners"
   - Partnership — "Your success is our success"
   - Innovation — "Always exploring better tools and methods"

3. The Team:
   - Grid of team members (2-4 people)
   - Each: photo (circle), name, role, 1-line bio, LinkedIn link
   - Placeholder team members:
     - Founder / Full-Stack Developer
     - Creative Director / Videographer
     - Marketing Specialist
     - AI & Automation Lead

4. Tools & Technologies we use:
   - Logo grid: React, Next.js, Shopify, WordPress, Python, Adobe Suite,
     Meta Ads, Google Ads, ChatGPT API, Make/Zapier, Figma
   - Simple grid with tool logos/icons

5. "Ready to grow?" CTA section at bottom

Style: clean, professional, trustworthy feel
```

### Prompt 11 — Contact Page

```
Build the contact page (contact.html) for LaunchPad Digital:

- Page hero: "Let's Build Something Great" + subtitle "Get your free consultation"
- Split layout: info on left, form on right (stacked on mobile)

Left side — Contact Info:
- "Get in Touch" heading
- Short paragraph: "Whether you need a website, a brand video, or a full digital strategy — we'd love to hear about your project."
- Contact details:
  - Email: hello@launchpaddigital.fi (with mailto link)
  - Phone (with tel link)
  - Location: Tampere, Finland (with small map embed or static map image)
  - Social links: LinkedIn, Instagram, YouTube
- Business hours: "Mon–Fri, 9:00–17:00 EET"
- Response time: "We typically respond within 24 hours"

Right side — Contact Form:
- Fields:
  - Name (required)
  - Email (required)
  - Company name
  - Service interested in (dropdown: Web Development, Video Production, Marketing, AI & Automation, Branding, Full Package, Other)
  - Budget range (dropdown: Under €1k, €1k–3k, €3k–5k, €5k–10k, €10k+, Not sure)
  - Project description (textarea)
- Blue gradient submit button: "Send Message"
- Form validation (required fields, email format)
- On submit: use Formspree or Netlify Forms endpoint
- Success message: "Thanks! We'll get back to you within 24 hours."

Style: clean, professional, matching site aesthetic
```

---

## Phase 6: Animations & Polish

### Prompt 12 — Scroll Animations

```
Add scroll-triggered animations throughout the site:

Using Intersection Observer API (no libraries):

1. Fade-in-up: text blocks and headings fade in and slide up when scrolled into view
2. Fade-in: images fade in smoothly
3. Stagger effect: grid items animate in one by one with slight delays
4. Hero parallax: background image moves at different scroll speed
5. Stats counter: numbers count up from 0 when the stats section enters viewport

Implementation:
- Add a .reveal class to elements that should animate
- CSS: .reveal starts with opacity: 0, transform: translateY(30px)
- CSS: .reveal.active transitions to opacity: 1, transform: translateY(0)
- JS: IntersectionObserver watches .reveal elements, adds .active when visible
- Add data-delay="100", data-delay="200" etc. for stagger effect
- Respect prefers-reduced-motion media query (disable animations if set)
```

### Prompt 13 — Loading & Transitions

```
Add page polish and micro-interactions:

1. Page loading screen:
   - Simple centered logo/name that fades out after page load
   - CSS animation only (no heavy JS)
   - 1-2 second display, then slides up to reveal content

2. Smooth page transitions (optional, CSS-based):
   - Content fades in when page loads
   - Optional: use View Transitions API if supported

3. Custom cursor (desktop only):
   - Subtle custom cursor: small dot + larger circle follower
   - Cursor changes on hoverable elements (grows/changes color)
   - Disable on touch devices

4. Image loading:
   - Blurred placeholder that sharpens when image loads
   - Or: simple skeleton pulse animation before images load
   - Progressive enhancement approach

5. Smooth scroll for all anchor links
```

---

## Phase 7: SEO & Deployment

### Prompt 14 — SEO & Meta Tags

```
Add comprehensive SEO and meta tags to all pages:

1. Each page should have:
   - Unique <title> tag (e.g., "Services | LaunchPad Digital — Digital Agency Finland")
   - Meta description (unique per page, 150-160 chars)
   - Canonical URL tag
   - Open Graph tags: og:title, og:description, og:image, og:url, og:type
   - Twitter Card tags: twitter:card (summary_large_image), twitter:title, twitter:description, twitter:image
   - Structured data (JSON-LD) for:
     - Organization schema (LaunchPad Digital)
     - LocalBusiness schema (Tampere, Finland)
     - Service schema on services page
     - BreadcrumbList on all inner pages

2. Technical SEO:
   - Create a sitemap.xml with all pages
   - Create robots.txt allowing all crawlers
   - Add alt text to ALL images
   - Ensure all headings follow proper hierarchy (h1 → h2 → h3)
   - Add aria-labels to interactive elements

3. Performance:
   - Add rel="preload" for hero images
   - Add rel="preconnect" for Google Fonts
   - Ensure all images use loading="lazy" (except hero)
```

### Prompt 15 — Performance & Accessibility

```
Optimize the site for performance and accessibility:

Performance:
- Minify CSS (or provide a build step)
- Defer non-critical JavaScript
- Use srcset and sizes on images for responsive loading
- Add width and height attributes to images (prevent layout shift)
- Optimize font loading with font-display: swap
- Preload critical assets (hero image, primary font)

Accessibility (WCAG 2.1 AA):
- All interactive elements are keyboard accessible
- Focus styles visible on all focusable elements (blue outline)
- Skip to main content link (hidden until focused)
- ARIA labels on: hamburger menu, modal close buttons, form elements
- Alt text on all images (descriptive, not just filenames)
- Color contrast ratio meets 4.5:1 minimum
- Lightbox and modals trap focus when open
- Screen reader announcements for dynamic content changes
- prefers-reduced-motion support for all animations
- Proper landmark roles (<nav>, <main>, <footer>)
```

### Prompt 16 — GitHub Pages Deployment

```
Prepare the site for GitHub Pages deployment:

1. Create/update the favicon:
   - SVG favicon with LP↗ monogram or rocket icon
   - Blue on white, matching the site theme

2. Verify all paths are relative (no absolute paths)

3. Add a 404.html page:
   - Styled consistently with the site
   - "Houston, we have a problem" or "This page hasn't launched yet" message
   - Link back to homepage
   - Search bar or popular links

4. Create a README.md:
   - Project name: LaunchPad Digital
   - Description and mission
   - Screenshot/preview
   - Tech stack used
   - How to run locally
   - Live site link: launchpaddigital.fi

5. Final checklist:
   - All placeholder images noted (need to be replaced with real project images)
   - All placeholder text reviewed and finalized
   - External links open in new tab (target="_blank" rel="noopener")
   - Forms have proper action URLs (Formspree/Netlify)
   - Console is clean (no errors)
   - Google Analytics / Plausible Analytics snippet added
```

---

## Optional Extras

### Prompt 17 — Testimonials Section

```
Add a testimonials section to the homepage (after services, before CTA):

- Section title: "What Our Clients Say"
- Horizontal slider/carousel:
  - Each slide:
    - Quote text (1-3 sentences)
    - Client name, company name, role
    - Star rating (5 stars)
    - Small client photo or company logo
  - Large quote marks as decorative element (blue, low opacity)
  - Auto-advance every 5 seconds
  - Navigation dots at bottom
  - Pause auto-advance on hover
  - Swipe support on mobile
- 4-5 placeholder testimonials from Finnish business owners:
  - Café owner: "LaunchPad built our website and we saw 3x more online orders"
  - Gym owner: "Their video content doubled our Instagram following"
  - E-commerce startup: "The AI chatbot handles 60% of customer questions automatically"
  - Restaurant: "Professional, fast, and they actually understand small business needs"
- Clean design, white/light background
- Build with vanilla JS (no library)
```

### Prompt 18 — Blog / Resources Page

```
Add a blog or resources section:

- New page: blog.html (or resources.html)
- Page hero: "Resources" + "Tips & insights to grow your business online"
- Blog post grid (2 columns desktop, 1 mobile):
  - Each card: thumbnail, category tag, title, excerpt (2 lines), read time, date
  - Hover: subtle lift effect
- 4-6 placeholder posts:
  - "5 Reasons Every Finnish Business Needs a Website in 2026"
  - "How AI Chatbots Can Save Your Business 10 Hours a Week"
  - "SEO Basics: Getting Found on Google in Finland"
  - "Why Video Content is King for Small Businesses"
  - "The True Cost of Not Having a Digital Presence"
  - "How to Choose the Right Digital Agency"
- Category filter: All, Web, Marketing, AI, Video, Business
- Newsletter signup CTA at bottom: "Get tips delivered to your inbox"
- Individual blog post template page (clean reading layout)
```

### Prompt 19 — FAQ Section

```
Add an FAQ section (on services page or as standalone):

- Section title: "Frequently Asked Questions"
- Accordion-style expandable questions:
  1. "How much does a website cost?" → pricing overview
  2. "How long does a project take?" → typical timelines
  3. "Do you work with businesses outside Tampere?" → yes, all of Finland + remote
  4. "What if I already have a website?" → redesign/improvement services
  5. "Do you offer ongoing support?" → maintenance packages
  6. "Can you help with just one service?" → yes, à la carte available
  7. "What makes you different from other agencies?" → local, all-in-one, AI-powered
  8. "Do I need to provide content?" → we can create it for you
- Clean accordion with smooth expand/collapse animation
- Blue accent on active/open question
- Plus/minus or chevron icon
- Built with vanilla JS
```

### Prompt 20 — Social Proof & Trust Elements

```
Add trust-building elements across the site:

1. Client logo bar (homepage, below hero or above footer):
   - "Trusted by businesses across Finland"
   - Horizontal row of 6-8 client logos (grayscale, color on hover)
   - Auto-scrolling marquee on mobile
   - Use placeholder logos

2. Results banner (homepage):
   - "Real Results" section with 3 mini case studies:
   - Each: metric (+150% traffic), client type, service used
   - Blue gradient background

3. Google Reviews widget:
   - "4.9 ★ on Google" badge in footer or contact page
   - Link to Google Business profile

4. "As seen in" row (optional):
   - Local press/media logos if applicable
   - YLE, Aamulehti, etc. placeholders
```

---

## Tips for Best Results

### General Tips

1. **One prompt at a time**: Feed these prompts sequentially. Wait for each to be implemented before moving on.
2. **Iterate**: After each prompt, review the result and ask for adjustments before moving to the next phase.
3. **Be specific about images**: Replace placeholder paths with your actual image filenames as you go.
4. **Test responsively**: After each section, ask the agent to verify mobile responsiveness.
5. **Customize text**: Replace all placeholder text with your actual copy before deployment.

### Design Customization

If you want a different aesthetic, modify Prompt 1's design direction. Some alternatives:

- **Dark & premium**: Background #0a0a0f, white text, gold accent #c9a96e
- **Startup-fresh**: White bg, bright gradients (purple→pink), playful rounded elements
- **Corporate & trustworthy**: Navy #1e3a5f, white, subtle gold #b8860b, serif headings
- **Nordic minimal**: Off-white #fafaf8, charcoal text, forest green accent #2d5016

### Folder Structure Reference

```
launchpad-digital/
├── index.html
├── services.html
├── portfolio.html
├── about.html
├── contact.html
├── blog.html
├── 404.html
├── sitemap.xml
├── robots.txt
├── README.md
├── favicon.svg
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── images/
    ├── hero-bg.jpg (or gradient, no image needed)
    ├── team/
    │   ├── founder.jpg
    │   ├── creative-director.jpg
    │   └── ...
    ├── portfolio/
    │   ├── project-01.jpg
    │   ├── project-02.jpg
    │   └── ...
    ├── clients/
    │   ├── logo-01.svg
    │   └── ...
    ├── services/
    │   ├── web-dev.jpg
    │   ├── video.jpg
    │   └── ...
    └── blog/
        ├── post-01.jpg
        └── ...
```

### Quick Reference — Brand Assets

| Asset | Value |
|---|---|
| Primary color | #3b82f6 (electric blue) |
| Secondary color | #06b6d4 (cyan) |
| Dark background | #0f172a (navy/slate) |
| Heading font | Space Grotesk |
| Body font | Inter |
| Logo | LaunchPad Digital (LP↗ mark) |
| Favicon | LP↗ monogram, blue on white |
| Domain | launchpaddigital.fi |
| Tagline | Helping Finnish businesses grow digital |

---

*Created: March 2026*
*For: LaunchPad Digital — Full-Service Digital Agency Website Build*
