# BD-DIST: Food Distribution QR Verification System

## Project Overview

A single-file offline web app (`app.html`) for managing food distribution to 1,000+ pre-registered beneficiaries in Bangladesh. Ensures each person collects exactly once using a two-stage QR card verification system. Fully bilingual (Bengali/English).

## Architecture

**Single HTML file** — zero dependencies, zero server, zero internet on distribution day. Everything embedded: CSS, JS, libraries, icons. Runs in Chrome on any Android phone.

### Embedded Libraries
- `qrcode-generator` (~15KB minified) — QR code generation
- `html5-qrcode` (~90KB minified) — camera-based QR scanning via phone

### Data Storage
- `localStorage` only — persists between sessions, fully offline
- Key `fd_beneficiaries` — JSON array of all beneficiary records
- Key `fd_event_meta` — event name, date, metadata

### Data Model
```json
{
  "id": "FD-0001",
  "name": "আব্দুল করিম / Abdul Karim",
  "phone": "01712345678",
  "phone_last4": "5678",
  "collected": false,
  "collected_at": null,
  "notes": ""
}
```

### QR Code Content
Each QR encodes **only** the ID string (e.g., `FD-0001`). No personal data. Smaller QR = faster scan + smaller print.

## Design Principles

### God-Tier Design Requirements
1. **Mobile-first** — designed for one-handed operation on a 5-6" Android screen
2. **Large touch targets** — minimum 48px tap targets, preferably 56px+
3. **High contrast** — works in outdoor sunlight (dark text on light bg, vivid status colors)
4. **Instant feedback** — green flash for success, red flash for duplicate, with haptic vibration
5. **Bengali-first UI** — all labels, buttons, and status messages in Bengali with English fallback
6. **Zero learning curve** — a volunteer who's never used the app should understand it in 30 seconds
7. **Beautiful but functional** — modern card-based UI, smooth transitions, clear visual hierarchy
8. **Accessible typography** — large font sizes (18px+ body, 24px+ headings), clear Bengali rendering

### Color System
- **Primary**: Deep blue (#1a56db) — trust, reliability
- **Success**: Green (#059669) — ✅ give food
- **Danger**: Red (#dc2626) — 🚫 already collected
- **Warning**: Amber (#d97706) — ⚠️ unknown/attention needed
- **Surface**: Clean white (#ffffff) with subtle gray (#f9fafb) cards
- **Text**: Near-black (#111827) for readability

### Status Screens (Full-Screen Takeover)
- **GIVE FOOD**: Full green screen, person's name huge, phone verification, confirm button
- **ALREADY COLLECTED**: Full red screen, name, timestamp of previous collection, dismiss
- **UNKNOWN CODE**: Full amber screen, option to search by name or dismiss

## Three App Modes

### 1. Setup Mode (📋 সেটআপ)
- Import CSV (name, phone columns — auto-detect column mapping)
- Review beneficiary list with search/filter
- Auto-flag duplicate phone numbers
- Generate printable QR cards (8 per A4 page)
- Card layout: QR code + Name (Bengali) + ID + last 4 digits phone + event name
- Cards sorted alphabetically for card desk volunteer
- Export cards as printable HTML page

### 2. Scan Day Mode (📷 বিতরণ)
- Live counter: "collected / total" with progress bar
- Big SCAN button opens camera
- Scan → lookup → full-screen status result
- Manual search backup (search by name if QR won't scan)
- "Add Walk-in" for unregistered people
- Confirmation step before marking collected (prevents accidental taps)

### 3. Reports Mode (📊 রিপোর্ট)
- Summary: total, collected, remaining, collection rate
- Timeline chart (collections per hour)
- List of uncollected beneficiaries
- Export full report as CSV
- "Clear All Data" with double-confirmation

## Two-Stage Physical Process

**Stage 1 — Card Desk (entry point, separate volunteer):**
Person gives name → volunteer finds pre-printed card in alphabetical stack → asks last 4 digits of phone → match → hands card → card removed from stack (can't be issued again)

**Stage 2 — Food Station (volunteer with scanning phone):**
Person presents card → scan QR → app verifies → green = give food → volunteer retains card after scan

## Edge Cases
- QR won't scan → "Search by Name" fallback
- Phone dies → data persists in localStorage, reopen app
- Person not on list → "Add Walk-in" button
- Duplicate names → unique ID + phone distinguishes
- Card lost → search by name, mark manually

## File Structure
```
BD-DIST/
├── CLAUDE.md              ← This file
├── app.html               ← The entire application (single file)
├── sample-beneficiaries.csv  ← Template CSV for the user
└── README.md              ← Quick-start guide (if needed)
```

## CSV Format Expected
```csv
name,phone
আব্দুল করিম,01712345678
ফাতেমা বেগম,01898765432
```
- Minimum columns: `name`, `phone`
- Phone numbers: Bangladeshi format (011/013/014/015/016/017/018/019 prefix)
- UTF-8 encoding for Bengali text
- Auto-detection: app tries common column names (name/নাম, phone/ফোন/mobile/মোবাইল)

## Bengali Language Labels
All UI text must have Bengali with English tooltip/fallback:
- সেটআপ (Setup)
- বিতরণ (Distribution)
- রিপোর্ট (Reports)
- স্ক্যান করুন (Scan)
- খাদ্য দিন ✅ (Give Food)
- ইতিমধ্যে সংগ্রহ করেছে 🚫 (Already Collected)
- অজানা কোড ⚠️ (Unknown Code)
- নাম দিয়ে খুঁজুন (Search by Name)
- মোট (Total)
- সংগৃহীত (Collected)
- বাকি (Remaining)

## File Structure
```
BD-DIST/
├── CLAUDE.md                  ← Project spec
├── app.html                   ← Main HTML shell (< 200 lines)
├── css/
│   └── style.css              ← All styles (< 350 lines)
├── js/
│   ├── app.js                 ← Core: tabs, lang toggle, init (< 80 lines)
│   ├── data.js                ← localStorage CRUD, CSV parse/export (< 170 lines)
│   ├── setup.js               ← CSV import, list review, QR card gen (< 190 lines)
│   ├── scanner.js             ← QR scanning, manual search, overlays (< 200 lines)
│   └── reports.js             ← Stats, uncollected list, export (< 90 lines)
├── lib/
│   ├── qrcode.min.js          ← QR generation library (vendored)
│   └── html5-qrcode.min.js    ← QR scanning library (vendored)
└── sample-beneficiaries.csv   ← Template CSV
```

## Build Rules
1. **No file over 600 lines** — modular, readable, maintainable
2. **No build step** — open app.html directly in browser
3. **All files in one folder** — portable via USB, WhatsApp zip, etc.
4. **Test on mobile viewport** — 375px width minimum
5. **localStorage only** — no IndexedDB, no cookies, no server calls
6. **Graceful degradation** — if camera fails, manual search still works
7. **Print CSS** — QR cards page must have proper print styles
