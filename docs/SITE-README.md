# Hello Fahid — Portfolio Site

Personal portfolio for **Fahid A. Khan**, Software Engineer at Treon (Tampere, Finland).  
Live at: **https://fahid-khan.github.io**

---

## Tech Stack

| Layer | Details |
|-------|---------|
| Hosting | GitHub Pages (static, no build step) |
| HTML | Vanilla — 7 pages + 6 blog posts |
| CSS | Single stylesheet `css/styles.css` (~2 000 lines) |
| JS | `js/app.js` — navbar, sidebar, scroll fade-ins, back-to-top |
| Fonts | Inter (body), JetBrains Mono (code/mono) via Google Fonts |
| Icons | Font Awesome 5.12.1 (local copy in `fontawesome-free-5.12.1-web/`) |

No frameworks, no bundler, no build step. Push to `main` and GitHub Pages deploys.

---

## File Map

```
index.html          Home — hero, stats, services preview, timeline, tech stack, testimonials, CTA
about.html          About — intro, specializations, education, certs, volunteering, hobbies
projects.html       Services — detailed offerings, case studies, process steps, CTA
blog.html           Blog listing — cards linking to 6 posts
contact.html        Contact — email/LinkedIn/GitHub cards, location, Formspree form
resume.html         Printable resume — summary, experience, education, certs, skills
404.html            Custom error page

blog/
  mqtt-grafana.html
  jenkins-iot-pipeline.html
  terraform-azure.html
  docker-compose-fastapi.html
  ansible-server-automation.html
  robot-framework-python-libraries.html

css/styles.css      All styles (dark theme, CSS variables, responsive, animations)
js/app.js           All JS (navbar scroll, sidebar toggle, fade-in observer, back-to-top)

images/             Site images (hero photo, about, project thumbnails, logos)
videos/             (empty — reserved)
docs/               Documentation and planning files
```

---

## Design System

### Colour Palette (CSS variables in `:root`)

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg-primary` | `#0a0a0f` | Page background |
| `--bg-secondary` | `#111118` | Alternate section background |
| `--bg-card` | `#16161f` | Card backgrounds |
| `--bg-card-hover` | `#1c1c28` | Card hover state |
| `--accent-1` | `#0ea5e9` | Primary accent (sky blue) |
| `--accent-2` | `#06b6d4` | Secondary accent (cyan) |
| `--accent-3` | `#38bdf8` | Tertiary accent (light sky) |
| `--text-primary` | `#f0f4f8` | Headings, main text |
| `--text-secondary` | `#94a3b8` | Body paragraphs |
| `--text-muted` | `#64748b` | Dates, labels, subtle text |

### Typography

- **Primary:** Inter (weights 300–800)
- **Monospace:** JetBrains Mono (weights 400–500)
- Base size: 1rem, line-height: 1.7

### Spacing & Radius

- Section padding: `6rem 0`
- Card radius: `--radius-lg` (1rem)
- Button radius: `--radius` (0.75rem)
- Max width: 1200px

### Animations (defined as `@keyframes`)

| Name | Effect | Used on |
|------|--------|---------|
| `wiggle` | Playful icon shake | Service/cert/contact card icons on hover |
| `float` | Gentle vertical drift | Hero gradient orbs |
| `pulse-glow` | Pulsing box-shadow | Timeline number circles |
| `blink` | Cursor blink | Hero greeting `_` cursor |
| `shimmer` | Flowing gradient | `.gradient-text` (name in hero) |
| `pop-in` | Bouncy scale entrance | Back-to-top button |
| `fade-in` | Opacity + slide up | Sections on scroll (via IntersectionObserver) |

### Easing

- `--transition`: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` — smooth default
- `--bounce`: `cubic-bezier(0.34, 1.56, 0.64, 1)` — playful overshoot for hover states

---

## What's Been Done

### Cleanup
- Removed all unnecessary HTML comments (73), CSS block comments (29), and JS comments (7) across all files
- Cleaned up resulting empty lines

### Content
- **Hero greeting** changed to `// hey, I'm a Software Engineer` with blinking cursor
- **About page** — added "When I'm Not Coding" hobbies section: Gaming (PS5), Overlanding, Travelling
- **404 page** — rewritten with personality: "Oops, wrong turn!" / "This page wandered off somewhere."
- **Resume** — professional summary rewritten to be less corporate
- **Blog posts** — "Lessons Learned" headings renamed to casual variants per post

### Copy (humanized across all pages)
- Rewrote service descriptions, experience entries, testimonials, CTAs, and hero subtitles
- Removed AI-sounding phrases ("proven track record", "scalable solutions", "cutting-edge")
- Made everything conversational and first-person

### Design (playful touches)
- **Buttons** — bounce up + scale on hover, squish on `:active`
- **Cards** — subtle tilt/rotation on hover, icon wiggle animation
- **Skill tags** — spring pop on hover
- **Hero** — gradient orbs float, name shimmers, photo tilts on hover
- **Stats** — scale up on hover with bouncy easing
- **Social icons** — rotate + scale on hover
- **Timeline numbers** — gentle pulsing glow
- **Process steps** — lift on hover with wiggling counter number
- **Blog cards** — slight tilt + arrow nudge on hover
- **Back-to-top** — bouncy pop-in animation

---

## How to Develop Further

### Local Development

No build step needed. Open any HTML file in a browser, or use a local server:

```bash
# Option A: Python
python3 -m http.server 8000

# Option B: Node
npx serve .

# Option C: VS Code Live Server extension
```

### Adding a New Page

1. Copy an existing page (e.g. `about.html`) as a template
2. Keep the `<nav>`, `<aside>` (sidebar), and `<footer>` blocks identical
3. Update the `<title>`, `<meta description>`, and page content
4. Add a nav link in **every** page's `<nav>` and `<aside>` sections (there's no shared template)

### Adding a New Blog Post

1. Copy an existing post from `blog/` as a template
2. Update the header (title, date, tags), body content, and meta tags
3. Add a card entry in `blog.html` linking to the new post
4. Blog posts use these CSS classes:
   - `.blog-post-container` — max-width wrapper
   - `.blog-post-header` — title, tags, date
   - `.blog-post` — body content (auto-styled `h2`, `h3`, `p`, `ul`, `pre`, `code`)

### Changing Colours

Edit the CSS variables in `:root` at the top of `css/styles.css`. The whole site inherits from these. Also update:
- `--accent-gradient` and `--accent-gradient-hover` (used in buttons, underlines, gradient text)
- Hard-coded `rgba(14, 165, 233, ...)` values (search for `14, 165, 233` — there are ~20 instances for glows and tag backgrounds)

### Changing Fonts

1. Update the Google Fonts `@import` URL at the top of `css/styles.css`
2. Update `--ff-primary` and/or `--ff-mono` variables

### Adding Images

Drop images in `images/` and reference with `./images/filename.ext`. Currently used images:
- `2025_TREON_017_FAHID-KHAN.jpg` — hero/OG image
- `about-img.jpeg` — about page photo

### Contact Form

The contact form on `contact.html` uses [Formspree](https://formspree.io/). The form `action` URL points to a Formspree endpoint. To change or reconnect:
1. Create a form at formspree.io
2. Replace the `action` URL in the `<form>` tag

### SEO / Meta

- `index.html` has Open Graph tags and JSON-LD structured data
- Each page has its own `<title>` and `<meta name="description">`
- `favicon.svg` is the site favicon
- Canonical URL set to `https://fahid-khan.github.io/`

### JavaScript

`js/app.js` handles:
- **Navbar** — adds `.navbar-fixed` class on scroll (>80px) for blur backdrop
- **Sidebar** — toggles `.show-sidebar` on mobile hamburger click
- **Year** — auto-fills `#date` span with current year
- **Fade-ins** — IntersectionObserver adds `.visible` to `.fade-in` elements
- **Back-to-top** — shows button after 400px scroll, smooth scrolls to top

To add scroll-triggered animations to a new section, just add the `fade-in` class to the element.

### Print Styles

`resume.html` has `@media print` styles in the CSS. The nav, sidebar, and footer hide automatically when printed. Test with `Cmd + P` before changing resume layout.

---

## Things to Consider Next

Refer to `docs/PORTFOLIO-PROJECTS.md` for 5 planned interactive portfolio projects (IoT dashboard, CI/CD visualizer, etc.) that can be built and added to the site.

Other ideas:
- **Dark/light mode toggle** — the CSS variable system makes this straightforward
- **Blog post reading time** — calculate from word count, display on cards
- **Project demos** — embed live demos or screenshots for portfolio projects
- **Analytics** — add Plausible, Umami, or similar privacy-friendly analytics
- **RSS feed** — generate a simple XML feed for blog posts
- **Image optimization** — convert JPEGs to WebP, add `loading="lazy"` attributes
- **FontAwesome upgrade** — currently on 5.12.1, could upgrade to 6.x for more icons
