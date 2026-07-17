# WorshipDuo &amp; TEAM — Nursing Home Ministry

The website for **Jess &amp; Keith: WorshipDuo &amp; TEAM**, a nursing-home worship
ministry in partnership with Redeeming Grace Church, Bethel Park, PA.

A single-page, fully static site — no build step, no dependencies — designed to be
hosted on **GitHub Pages**.

## Structure

```
index.html            # the whole site
assets/
  css/styles.css      # design system + all styling
  js/main.js          # nav, scroll reveals, gallery filter + lightbox
  img/                # web-optimized photos (WebP + JPEG fallback)
photos/               # original source photos (not served)
content/              # brief + source PDF (not served)
CNAME                 # custom domain: worshipduo.com
.nojekyll             # serve assets as-is (skip Jekyll processing)
robots.txt / sitemap.xml
```

## Design

- **Palette** — maroon `#62313A`, cream `#F4D4A4`, teal `#077582`, with sage / blush /
  slate accents for the training-partner cards.
- **Type** — Fraunces (display serif) + Source Sans 3 (body), loaded from Google Fonts.
- **Motion** — Ken Burns hero, scroll-reveal, animated 3-step "Get Involved" flow,
  filterable gallery with a keyboard-accessible lightbox. All motion respects
  `prefers-reduced-motion`.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy (GitHub Pages)

1. Push to the `main` branch of the `worshipduo.github.io` repository.
2. In **Settings → Pages**, set the source to `main` / root.
3. The `CNAME` file points the site at **worshipduo.com** — add the matching DNS
   records at your domain registrar (an `ALIAS`/`A` record to GitHub Pages).

## Editing photos

Optimized images were generated from `photos/` with `sips` + `cwebp`. To regenerate,
re-run the processing steps (resize to target width, export `.jpg` at q82 and `.webp`
at q80; the two phone-screenshot photos are center-cropped to remove UI chrome).
