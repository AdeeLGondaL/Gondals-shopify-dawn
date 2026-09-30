# Gondals Shopify theme

Custom Dawn 16 theme for **Gondals**, a German-registered dropshipping store (Spocket) selling
home essentials, home decor (incl. marble/granite mosaics) and leather accessories to Germany and the EU.
Design reference: saamaan.pk (layout and UX only; Gondals keeps its own colors and branding).

## Store

| Item | Value |
|---|---|
| Store | `xvv6ud-hq.myshopify.com` (password protected, trial plan) |
| Theme | `Gondals-shopify-dawn/main`, id `210818531719`, **published (live)** since 30 Sep 2026, synced from this repo's `main` via Shopify's GitHub integration |
| Other themes | Horizon (unpublished), a Shopify CLI development theme |
| Currency / market | EUR, Germany + EU, English + German |
| Support email | gondals@online.de (placeholder until domain is bought) |

## Brand

- Colors: teal `#30AABD`, deep teal `#00353D`, white `#FFFFFF`. Sale red `#E5484D`, savings green `#16A34A` on `#DCFCE7`.
- Font: Montserrat (semibold headings, regular body).
- Logo: inline SVG in `snippets/gondals-logo.liquid` (variants: `stacked` used in header, `full`, `icon`, `text`).
- Tone: clean and modern.

## UI/UX engineering rules

- **No generic placeholders:** no bright primary gradients, no rounded-full pill buttons everywhere, no floating cards with big drop shadows unless explicitly asked.
  Explicitly requested exceptions (saamaan.pk style): the header nav rolling pill hover and the liquid-fill button hover.
- **Typography first:** clear hierarchy with Montserrat, explicit letter-spacing (tight, about -0.02em, on headings) and explicit line-heights.
- **Micro-interactions:** subtle, intentional easing such as `cubic-bezier(0.4, 0, 0.2, 1)` (`--gondals-ease`). No linear, bouncy or aggressive large-scale animations.
  `--gondals-expo` (`cubic-bezier(0.3, 1, 0.3, 1)`) is reserved for the saamaan-style nav/button hovers.
- **Shopify best practices:** layouts at premium e-commerce standard (Shopify Polaris): generous whitespace, subtle 1px borders (`#E2E8F0`-like, `--gondals-line`), muted background containers (`--gondals-soft`).

## Copy rules (learned from saamaan.pk)

Say more with less. Every word must carry a fact, a label or an action.

1. **Labels, not sentences.** Section titles are 1–3 word nouns: "Top selling", "Latest collection", "Shop by category". Category names double as titles.
2. **Facts beat adjectives.** Numbers, conditions and names only: "Free shipping over €49", "Delivery in 3–7 days", "PayPal, Klarna & cards". Never "fast", "friendly", "premium", "thoughtfully chosen".
3. **No slogans or poetic lines.** No "Make your home feel like you", "Everyday carry, upgraded". Headlines name what is sold, optionally with a price hook ("Vases & ceramics from €29").
4. **Eyebrows are rare.** Use one only when it adds information (a discount, "New", "Just dropped"). Never repeat the title in the eyebrow.
5. **Two-line trust points.** 2–3 word title + one short factual line with a number or condition ("Free shipping" / "On orders over €49"). No trailing periods.
6. **Price speaks in numbers.** Badges are "-25%", "New", "Save €10". Never "Sale!", "Hot deal", "Amazing price".
7. **CTAs are 1–2 words, verb first.** "Buy now", "View all", "Shop now", "Add to cart", "See all results". Name the category only when it disambiguates ("Shop leather").
8. **Titles, not descriptions, on collection pages.** Breadcrumb + title + sub-category chips. No description paragraph repeating what the chips already say.
9. **Product titles carry the specs** (item + material/size/count), not marketing ("Slim Leather Bifold Wallet", "Microfiber Cleaning Cloths (12 pack)").
10. **Footer is plain.** Plain link names ("Contact", "Shipping & payment", "Privacy policy"), raw contact values (email, phone), "© 2026 Gondals — All rights reserved." No brand slogan.
11. **Empty states redirect.** "No results for 'x'" + a short path forward ("Try a category:" + chips). Never a dead end.
12. **Sentence case** for all UI text (Gondals choice for EN; saamaan uses Title Case). No trailing periods on labels, buttons or single-line points.
13. **German copy follows the same rules**; keep EN and DE the same length class (short stays short).

## Workflow rules

- Push directly to `main`. Shopify auto-syncs within ~30-60s.
- **Never mention Claude/AI anywhere in commits, PRs or code comments. No `Co-Authored-By` lines.**
- Run `python3 scripts/validate-settings.py` before every push that touches `config/*.json`, `templates/*.json` or `sections/*.json`.
  Shopify **silently rejects** a whole JSON file if any value is off a range step, not in a select's options, or an unknown setting/block.
- Dynamic sources in JSON templates are restricted: `{{ product.vendor }}` works, `{{ product.type }}` got the whole template rejected.
- A JSON template that references a **new block type** can be rejected if pushed in the same commit as the section that defines it. Push the section first, then the template (or re-touch the template after).
- Verify a sync landed by checking the file's `updatedAt` via the Shopify Admin API, not by assuming.
  The GitHub sync can **silently skip some files of a push** (seen with `assets/gondals.css` and locales while a new section in the same push synced).
  Fix: re-touch the skipped file (whitespace change) in a new commit and push again.
- A `link_list` setting's `default` may only be `main-menu` or `footer`; any other handle makes Shopify reject the whole section file (set the menu in the template JSON instead).
- Dawn hides `div:empty` (`display: none`). Empty decorative divs (overlays) need `display: block !important` or use a `span`.
- Keep Dawn core edits minimal; brand styles live in `assets/gondals.css` (loaded after `base.css` in `layout/theme.liquid`).
- Respect `prefers-reduced-motion` for any new animation.
- If the theme editor is used, Shopify may commit back to GitHub: `git pull --rebase` before starting work.

## Custom code map

| File | Purpose |
|---|---|
| `assets/gondals.css` | All brand styling (header, hero, cards, rows, product page, sticky ATC, ticker, floating buttons) |
| `sections/gondals-hero.liquid` | Promo slideshow (upload or external image URL per slide) |
| `sections/gondals-categories.liquid` | Round category circles |
| `sections/gondals-product-row.liquid` | Product slider row: eyebrow, title, View all pill, arrows |
| `sections/gondals-promo-tiles.liquid` | Image promo tiles |
| `sections/gondals-ticker.liquid` | Infinite scrolling USP ticker |
| `sections/gondals-collection-header.liquid` | Collection page header: breadcrumb, title, description, sub-category chips from the main menu's child links |
| `sections/gondals-legal-page.liquid` + `templates/page.legal.json` | Legal page layout: title, text column, sidebar from menu `legal` |
| `sections/gondals-withdrawal-form.liquid` + `templates/page.withdrawal.json` | Online withdrawal form ("Vertrag hier widerrufen") via contact form |
| `snippets/header-search.liquid` + `sections/predictive-search.liquid` | Search side panel with category chips; placeholder thumbnails |
| `docs/legal/*.html` | Source drafts of the legal pages (not synced to Shopify) |
| `assets/gondals-menu.js` / `assets/gondals-hover.js` | Header dropdown hover-intent + animated close / liquid-fill button hover exit direction |
| `sections/trust-bar.liquid` | Icon trust points |
| `sections/main-product.liquid` | Dawn + blocks `gondals_delivery`, `gondals_trust`, savings under price, sticky ATC |
| `snippets/card-product.liquid` | Dawn + `-%` badge, savings pill, Buy now button, placeholder image fallback |
| `snippets/gondals-*.liquid` | logo, whatsapp (hidden until number set), back-to-top, delivery, pdp-trust, savings, sticky-atc, placeholder-gallery |
| `snippets/gondals-free-shipping.liquid` + `assets/gondals-free-shipping.js` | Free-shipping progress bar in cart drawer and cart page (threshold setting, animated fill) |
| `sections/header.liquid` | Uses stacked logo; layout is saamaan-style (search left, logo center, icons right, nav row below) via CSS |
| `scripts/validate-settings.py` | Validates JSON settings against section schemas |

Theme settings group **Gondals** (`config/settings_schema.json`): Buy now toggle, free shipping threshold, WhatsApp number/message/position.
Locale strings live under the `gondals` key in `locales/en.default.json` and `locales/de.json` (keep both in sync).

## Placeholder content (replace before launch)

- 9 placeholder products tagged `placeholder` (bulk delete later). Trial plans block image uploads, so images are external Unsplash URLs in product metafield `gondals.placeholder_images` (`list.url`); theme falls back to them only when a product has no media.
- Collections are **smart collections by tag**: `home-essentials`, `home-decor`, `leather-accessories`. Sub-menus filter by tags `kitchen`, `storage`, `cleaning`, `wall-art`, `lighting`, `vases`, `mosaics`, `wallets`, `belts`, `bags`. Tag Spocket imports accordingly.
- Policies, shipping threshold (€49), 14-day returns, delivery days (3-7), newsletter "10% off" and social links are placeholders.

## Germany / EU compliance notes

- Legal pages exist as **drafts with [placeholders]** (pages `impressum`, `agb`, `widerrufsbelehrung`, `versand-zahlung`, `widerruf`; menus `legal`, `footer-legal`, `footer`).
  Before launch: fill owner name, phone, VAT ID, return address, shipping costs; have them legally reviewed (or replace with a legal-text service);
  paste the final texts into Settings → Policies too (the API token lacks `write_legal_policies`), so checkout links them.
- Privacy policy is still Shopify's English auto-text: replace with a German GDPR Datenschutzerklärung.
- Online withdrawal ("Vertrag hier widerrufen", EU rule from 19 June 2026): form at `/pages/widerruf`, linked in the footer on every page.
  Shopify's contact form does **not** email the customer, so every submission needs a manual (or Flow/app) confirmation of receipt.
- Still needed: cookie consent configured, prices incl. VAT with shipping cost info.
- Strikethrough prices must reflect the lowest price of the last 30 days (PAngV).
- Do not add fabricated social proof ("X just bought") or fake countdown timers.

## Backlog

1. Finalise legal texts (see compliance notes) and German translations of menus/UI copy (Translate & Adapt)
2. Real hero/collection images once on a paid plan; remove placeholder products
3. Domain (recommended: gondals.de)
4. Optional: more filters (product type, material) via the Search & Discovery app; FAQ page
