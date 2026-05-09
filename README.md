# Aleksandar Aničić — Portfolio (v2, SEO + bilingual)

Pure HTML/CSS/JS. No build step. No dependencies.
Domain: **byanicic.com**

## File tree
```
/index.html              ← page + all SEO meta + JSON-LD
/sitemap.xml             ← single URL, ready to expand
/robots.txt              ← allow-all + sitemap pointer
/site.webmanifest        ← PWA manifest
/css/style.css
/js/main.js
/icons/                  ← favicons (SVG + PNG set)
  favicon.svg
  favicon-16.png · favicon-32.png · favicon-192.png · favicon-512.png
  apple-touch-icon.png · maskable-512.png
  safari-pinned-tab.svg
/images/
  logo.svg               ← PLACEHOLDER — replace with your real logo
  logo.png               ← PLACEHOLDER — replace with your real logo
  og-cover.jpg           ← 1200×630 social share image
  og-cover.svg           ← source for the OG cover (edit if needed)
```

## Drop your logo in
The site loads the logo via a `<picture>` element that prefers SVG and
falls back to PNG. Put your files at:

- `/images/logo.svg` (preferred — scales perfectly)
- `/images/logo.png` (fallback — high resolution, ~360px wide minimum)

Rules:
- Use **one tamna (dark) version**. The header is on cream, so a dark
  logo is correct. The footer is on dark — CSS automatically inverts
  it via `filter: invert(1) brightness(1.1)`.
- That auto-inversion works perfectly for **monochrome** logos
  (one solid colour or near-black). If your logo has multiple colours
  or an accent, send me both versions and I'll wire up two sources.
- The logo height in the header is 32px (26px on mobile). Design with
  some padding so it doesn't kiss the edges.

## SEO checklist — what's already done

**On-page**
- Single H1 per page, semantic H2/H3 hierarchy
- `<title>` + `<meta description>` tuned for "Web designer Belgrade"
  and English/international queries
- Keywords meta with both English and Serbian (Beograd, dizajner) terms
- Canonical URL set to `https://byanicic.com/`
- Hreflang tags for `en`, `sr`, and `x-default`
- `lang="en"` on `<html>`, but Serbian terms are present in keywords,
  alt text, and structured data so Google's local index picks you up
- Descriptive alt text on every image and SVG mockup
- Skip link for screen readers
- Proper ARIA labels on nav, sections, and decorative elements
- Internal anchor links to all sections

**Technical**
- `sitemap.xml` with hreflang alternates
- `robots.txt` pointing to the sitemap
- Full favicon set (SVG + 16/32/192/512 PNG, Apple touch, mask icon)
- PWA-ready `site.webmanifest`
- Open Graph tags (Facebook, LinkedIn, Slack, iMessage)
- Twitter Card tags
- `theme-color` for mobile browser chrome
- Geo meta (lat/lng for Belgrade) — helps local search
- JSON-LD structured data: **Person** + **ProfessionalService** + **WebSite**,
  with Service offers (Web Design, UI/UX, WordPress, Design Systems, Brand)
- Lazy-loaded images, `display=swap` on fonts
- `prefers-reduced-motion` respected throughout
- `viewport-fit=cover` for iOS notch handling

## Before you go live, do this

1. **Replace `images/logo.svg` and `images/logo.png`** with your real logo.
2. **Confirm social URLs** in `index.html` — LinkedIn already points to
   `linkedin.com/in/byanicic/`. Update Dribbble, Behance and Instagram
   handles to match your real profiles (search the file for those domains).
3. **Email** — `byanicic@gmail.com` is wired throughout (CTA button,
   footer, JSON-LD `Person` and `ProfessionalService`).
4. **Phone** — `+381 69 4544520` is wired into the CTA section as a
   tappable `tel:` link and into the JSON-LD `ProfessionalService`.
5. **Update `<lastmod>` in `sitemap.xml`** when you change content.
6. **(Optional) Replace `og-cover.jpg`** with a custom design (1200×630).
   Source SVG is in `/images/og-cover.svg`.
7. After deploy, submit `https://byanicic.com/sitemap.xml` to:
   - Google Search Console
   - Bing Webmaster Tools
8. Test the rich result preview at:
   - https://search.google.com/test/rich-results
   - https://developers.facebook.com/tools/debug/ (OG)
   - https://cards-dev.twitter.com/validator (Twitter Card)

## To run locally
```bash
python3 -m http.server 8000
# or
npx serve .
```

## Customising
Design tokens (colours, fonts, spacing, motion) are at the top of
`css/style.css` under `:root`. Change them once and the whole site shifts.
