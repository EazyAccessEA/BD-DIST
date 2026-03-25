# BD-DIST: Food Distribution QR Verification System

## Project Overview

A single-page web application for verifying food distribution to 1,000+ pre-registered beneficiaries in Bangladesh. Runs entirely offline in a mobile browser. No server, no install, no accounts.

## Architecture

### File Size Rule (HARD LIMIT)
**No single file may ever exceed 600 lines.** If a file approaches this limit, it MUST be split into smaller modules. This applies to ALL files — HTML, JS, CSS, docs, everything.

### App Structure
The app is composed of modular JS/CSS files during development, assembled for distribution:

```
BD-DIST/
├── CLAUDE.md
├── src/
│   ├── index.html          — Shell HTML with tab navigation
│   ├── css/
│   │   ├── base.css        — Reset, variables, typography
│   │   ├── components.css  — Buttons, cards, modals, alerts
│   │   ├── layout.css      — Tab panels, grid, responsive
│   │   └── print.css       — QR card print layout (8 per A4)
│   ├── js/
│   │   ├── app.js          — App init, tab routing, state
│   │   ├── csv-parser.js   — CSV import/export logic
│   │   ├── data-manager.js — localStorage CRUD, event meta
│   │   ├── qr-generator.js — QR code creation + card layout
│   │   ├── scanner.js      — Camera QR scanning (html5-qrcode)
│   │   ├── ui.js           — DOM helpers, alerts, modals
│   │   ├── search.js       — Manual name/ID search fallback
│   │   ├── stats.js        — Dashboard counters + charts
│   │   └── i18n.js         — Bengali/English translation strings
│   └── vendor/
│       ├── qrcode-generator.min.js
│       └── html5-qrcode.min.js
├── build.sh                — Concatenates src/ into dist/app.html
├── dist/
│   └── app.html            — Single distributable file
├── input/
│   └── sample.csv          — Template CSV for beneficiaries
├── printouts/              — Generated QR card sheets go here
└── reports/                — Exported distribution reports
```

### Key Technical Decisions
- **Vanilla JS only** — zero framework dependencies
- **localStorage** for persistence — works offline, survives refresh
- **Embedded vendor libs** — qrcode-generator (~15KB) and html5-qrcode (~90KB) bundled inline
- **Mobile-first CSS** — large touch targets (min 48px), high contrast
- **Bilingual** — full Bengali (বাংলা) + English support, user toggleable

## Design Standards

### God-Tier Design Principles
1. **Clarity over cleverness** — every screen has ONE primary action
2. **Big touch targets** — minimum 48px height, 16px padding on all interactive elements
3. **High contrast** — WCAG AA minimum, prefer AAA for critical UI (green/red status)
4. **Immediate feedback** — every tap produces visible response within 100ms
5. **Forgiving** — confirmation on destructive actions, undo where possible
6. **Status always visible** — collected/remaining counter on every scan screen
7. **Works in sunlight** — bold colors, strong contrast, no subtle grays

### Color System
```
--primary:     #1565C0  (blue — actions, navigation)
--success:     #2E7D32  (green — give food confirmed)
--danger:      #C62828  (red — already collected, block)
--warning:     #F57F17  (amber — caution, walk-in)
--surface:     #FFFFFF  (cards, panels)
--background:  #F5F5F5  (page bg)
--text:        #212121  (primary text)
--text-muted:  #757575  (secondary text)
```

### Typography
- Bengali script: use system font `"Noto Sans Bengali", "Kalpurush", sans-serif`
- English: `"Inter", "Segoe UI", system-ui, sans-serif`
- Minimum body text: 16px (never smaller on mobile)
- Headers: bold, 20-28px range
- Status messages (✅/🚫): 24px+ bold

### Component Patterns
- **Buttons**: rounded corners (8px), solid fills, no outlines for primary actions
- **Cards**: white bg, subtle shadow, 16px padding, 12px border-radius
- **Modals**: centered, dark overlay, max-width 90vw, auto-height
- **Alerts**: full-width banners, icon + text, auto-dismiss success after 3s
- **Tabs**: bottom navigation on mobile (3 tabs: Setup, Scan, Reports)

## Bilingual Support (i18n)

All user-facing strings MUST exist in both English and Bengali. The i18n module maps string keys to both languages. User can toggle language with a button in the header.

Example:
```js
const strings = {
  'scan.give_food': { en: 'GIVE FOOD', bn: 'খাবার দিন' },
  'scan.already_collected': { en: 'ALREADY COLLECTED', bn: 'ইতিমধ্যে সংগ্রহ করা হয়েছে' },
  ...
}
```

## Data Model

### Beneficiary Object
```js
{
  id: "FD-0001",           // Auto-generated unique ID
  name: "আব্দুল করিম",      // Name (Bengali or English from CSV)
  phone: "01712345678",    // Full phone (stored, never fully displayed)
  phone_last4: "5678",     // Last 4 digits (for verification display)
  collected: false,        // Has this person collected food?
  collected_at: null,      // ISO timestamp when collected
  notes: ""               // Optional notes (walk-in, disputed, etc.)
}
```

### QR Code Content
Each QR encodes ONLY the ID string: `FD-0001`. Nothing else.

## Development Rules

1. **600 line limit** — split any file approaching this limit
2. **No external CDN** — all dependencies embedded or vendored
3. **Test on mobile** — primary target is Android Chrome
4. **Bengali first** — default language is Bengali, English as secondary
5. **Accessible** — proper aria labels, keyboard navigation, screen reader hints
6. **No alert()** — use custom modal/toast components
7. **No console.log in production** — use a debug flag
8. **Defensive coding** — validate CSV input, handle malformed QR gracefully
9. **Idempotent operations** — scanning the same QR twice shows "already collected", never errors

## Build Process

`build.sh` concatenates all source files into a single `dist/app.html`:
1. Inline all CSS into `<style>` tags
2. Inline all JS into `<script>` tags
3. Inline vendor libs
4. Result: one portable HTML file

## CSV Format Expected

```csv
name,phone
আব্দুল করিম,01712345678
ফাতেমা বেগম,01898765432
```

- Minimum columns: `name`, `phone`
- Phone: Bangladeshi format (11 digits starting with 01)
- Encoding: UTF-8 (for Bengali script)
- Optional columns are ignored but preserved
