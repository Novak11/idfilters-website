Next.js 14 website for ID Filters, generated from the locally scraped `idfilters.rs` content (see `../mirror/` and `../metadata/`).

## Getting Started

Install deps (already installed in this workspace) and run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Content source (scrape → website)

- Scraped HTML lives in `../mirror/www.idfilters.rs/`
- Seed URLs are in `../metadata/urls.txt`
- Extracted site content (generated) is `src/content/pages.json`
- Images are copied to `public/wp-content/uploads/` so existing asset paths like `/wp-content/uploads/...` keep working

Regenerate extracted content (after re-scraping or edits):

```bash
npm run extract:content
```

Sync images from the mirror into `public/`:

```bash
mkdir -p public/wp-content
rsync -a --delete ../mirror/www.idfilters.rs/wp-content/uploads/ public/wp-content/uploads/
```

## Structure

- `src/app/page.tsx` – redesigned homepage (featured products + applications)
- `src/app/proizvodi/page.tsx` – products index (with search query param)
- `src/app/aplikacija/page.tsx` – applications index
- `src/app/kontakt/page.tsx` – contact page (mailto-based form)
- `src/app/[...slug]/page.tsx` – renders all other scraped pages from `src/content/pages.json`
- `src/app/sitemap.ts` + `src/app/robots.ts` – SEO endpoints

## Build

```bash
npm run build
npm run start
```
