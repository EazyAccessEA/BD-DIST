# BD-DIST: Food Distribution QR Verification System

Offline-first bilingual (Bengali/English) web app for managing food distribution to 1,000+ beneficiaries in Bangladesh. Scan QR codes to verify identity and prevent duplicate collection. No server, no install, no accounts — runs entirely in a mobile browser.

## Features

- **CSV Import** — Load your beneficiary list from any spreadsheet
- **QR Card Generation** — Print QR cards (8 per A4 page) for each beneficiary
- **Camera QR Scanning** — Scan cards to instantly verify and mark collection
- **Duplicate Prevention** — Blocks already-collected beneficiaries with a clear red warning
- **Manual Search** — Find people by name, ID, or phone when QR scanning isn't possible
- **Walk-in Support** — Add unregistered people on the spot
- **CSV Reports** — Export full distribution reports and uncollected lists
- **Bilingual UI** — Full Bengali + English with one-tap toggle
- **100% Offline** — All data stored in browser localStorage, works without internet

## Quick Start

1. Open `dist/app.html` in any modern browser (Chrome recommended)
2. Import your CSV beneficiary list in the **Setup** tab
3. Print QR cards for all beneficiaries
4. On distribution day, use the **Scan** tab to scan QR cards
5. After the event, export reports from the **Reports** tab

## CSV Format

Your CSV file needs two columns: `name` and `phone`.

```csv
name,phone
আব্দুল করিম,01712345678
ফাতেমা বেগম,01898765432
```

- **Encoding**: UTF-8 (required for Bengali script)
- **Phone**: Bangladeshi format, 11 digits starting with `01`
- Column names are flexible: `name`/`নাম`/`full_name` and `phone`/`ফোন`/`mobile` all work
- A sample file is included at `input/sample.csv`

## Project Structure

```
BD-DIST/
├── dist/app.html           # Single distributable file (open this!)
├── src/
│   ├── index.html           # Shell HTML with tab navigation
│   ├── css/                 # Modular stylesheets
│   │   ├── base.css         # Reset, variables, typography
│   │   ├── components.css   # Buttons, cards, modals, alerts
│   │   ├── layout.css       # Tab panels, grid, responsive
│   │   └── print.css        # QR card print layout
│   ├── js/                  # Application modules
│   │   ├── app.js           # Main init, tab routing, state
│   │   ├── csv-parser.js    # CSV import/export logic
│   │   ├── data-manager.js  # localStorage CRUD, event metadata
│   │   ├── qr-generator.js  # QR code creation + card layout
│   │   ├── scanner.js       # Camera QR scanning (html5-qrcode)
│   │   ├── ui.js            # DOM helpers, toasts, modals
│   │   ├── search.js        # Manual name/ID search
│   │   ├── stats.js         # Dashboard counters + progress
│   │   └── i18n.js          # Bengali/English translations
│   └── vendor/              # Bundled third-party libraries
│       ├── qrcode-generator.min.js
│       └── html5-qrcode.min.js
├── build.sh                 # Assembles src/ into dist/app.html
├── input/sample.csv         # Template CSV file
├── CLAUDE.md                # Development instructions
└── USER-GUIDE.md            # Step-by-step user instructions
```

## Building from Source

The build script combines all source files into a single portable HTML file:

```bash
bash build.sh
```

Output: `dist/app.html` (~456 KB) — copy this one file anywhere.

## Technical Details

- **Vanilla JS** — zero framework dependencies
- **localStorage** — data persists across refreshes, no server needed
- **Mobile-first** — 48px+ touch targets, high contrast, works in sunlight
- **Vendor libs**: qrcode-generator (v1.4.4) for QR creation, html5-qrcode (v2.3.8) for camera scanning
- **WCAG AA** contrast minimum on all critical UI elements

## Browser Support

- Chrome/Edge 80+ (recommended)
- Safari 14+
- Firefox 78+
- Android Chrome (primary target)

## License

MIT
