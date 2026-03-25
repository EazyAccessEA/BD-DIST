# User Guide: Food Distribution App

# ব্যবহারকারী নির্দেশিকা: খাদ্য বিতরণ অ্যাপ

This guide explains every step with simple words. Follow the steps in order.

---

## What You Need

Before you start, make sure you have:

1. **A phone** with a web browser (Google Chrome is best)
2. **A CSV file** with your list of people who will get food (names and phone numbers)
3. **A printer at home** (before you travel) — to print checklists and token slips

That's it. No internet needed after you open the app.

---

## PART 1: Getting the App Ready

### Step 1: Open the App

- Find the file called **`app.html`** (it is inside the `dist` folder)
- Double-tap it on your phone, or double-click it on your computer
- It will open in your web browser
- You will see a **blue bar** at the top that says "খাদ্য বিতরণ" (Food Distribution)
- At the bottom, you will see **four tabs**: Setup, Distribute, QR Scan, Reports

### Step 2: Change the Language (if you want English)

- Look at the **top right corner** of the blue bar
- You will see a button that says **"English"**
- Tap it to switch to English
- Tap it again to go back to Bengali
- You can switch anytime

---

## PART 2: Before You Travel (Setup at Home)

Do these steps **at home before you travel to Bangladesh**. You need a computer and printer for this part.

### Step 3: Add Your Event Name and Date

- You should be on the **Setup** tab (the first tab)
- You will see two boxes at the top:
  - **Event Name** — Type the name of your event (example: "Ramadan Food Distribution")
  - **Event Date** — Tap and pick the date of distribution
- This information will appear on your printouts and reports

### Step 4: Import Your List of People

You need a CSV file. This is a simple spreadsheet file. It must have two columns: **name** and **phone**.

**How to make a CSV file:**

1. Open Google Sheets or Microsoft Excel
2. In the first row, type `name` in column A and `phone` in column B
3. Below that, type each person's name and phone number, one per row
4. Save or download the file as **CSV** format

**Example of what your file should look like:**

| name | phone |
|------|-------|
| আব্দুল করিম | 01712345678 |
| ফাতেমা বেগম | 01898765432 |

**How to import the file:**

1. On the Setup tab, find the box that says **"Import Beneficiary List"**
2. Tap on it
3. Your phone or computer will ask you to pick a file
4. Find your CSV file and select it
5. Wait a moment
6. You will see a **green message** that says how many people were loaded
7. Below that, you will see the list of all the people

**If something goes wrong:**
- Red error saying "must have a name column" = Fix your spreadsheet column headers.
- Red error saying "must have a phone column" = Fix your spreadsheet column headers.
- Some rows were skipped = Those rows had no name. Check for empty rows.

### Step 5: Check Your List

- After importing, you will see a number showing **how many people** were loaded
- Below that is the list of everyone
- You can **search** by typing a name in the search box
- Scroll through and make sure the names look correct
- Each person has an **ID** like `FD-0001` — this is created automatically

### Step 6: Print Your Materials (BEFORE traveling)

You have **three things** you can print. Print at least the first two AT HOME before you fly.

#### A. Paper Checklist (MOST IMPORTANT)

This is your **backup if the phone dies**. It is a list of every person with a checkbox next to their name. You can use it with just a pen.

1. Tap the blue button that says **"Generate Checklist"**
2. A new page opens showing a table of all people
3. Tap **Print** at the top
4. Print on regular A4 paper
5. **Bring this with you.** If your phone battery dies, you can still mark people off with a pen.

Each page has ~40 names with:
- A checkbox to mark with a pen
- Their name, ID, and last 4 digits of phone

#### B. Token Slips (hand out instead of QR cards)

These are simple numbered cards. Much easier than QR cards — any printer works, and you can even write them by hand if needed.

1. Tap **"Generate Tokens"**
2. A new page opens showing small slips, 20 per page
3. Each slip has the person's **ID number** and **name**
4. Print and **cut along the dotted lines**
5. **Give one slip to each person** before distribution day
6. On distribution day, they show their slip, you type the ID in the app

#### C. QR Cards (optional, need good printer)

Only use these if you have a good printer with clear output. They allow camera scanning.

1. Tap **"Generate QR Cards"**
2. Print on A4 paper (8 cards per page)
3. Cut and give one to each person

**You do NOT need QR cards.** The Distribute tab works perfectly with just names or token numbers.

### Step 7: Save a Backup (VERY IMPORTANT)

Before you travel, save your data in case something goes wrong:

1. Tap the **Reports** tab
2. Scroll down to **"Data Backup"**
3. Tap **"Save Backup"**
4. A `.json` file will download to your computer
5. **Keep this file safe** — email it to yourself, save it to your phone
6. If you ever lose your data, you can restore from this file

---

## PART 3: Distribution Day (THE MAIN EVENT)

### Option A: Distribute Tab (RECOMMENDED — no camera needed)

This is the easiest way. It uses no camera, saves battery, and works even in bright sunlight.

#### Step 8: Open the Distribute Tab

- Open the app on your **phone**
- Tap the **"Distribute"** tab (second tab with the checkmark)
- You will see:
  - **Green number** = people who got food so far
  - **Red number** = people still waiting
  - A **search box**
  - The **full list** of everyone, sorted by name

#### Step 9: Find a Person

You have THREE ways to find someone:

**Way 1: Search by name**
- Type their name in the search box
- Matching people appear instantly

**Way 2: Use the alphabet sidebar**
- Look at the **right edge** of the screen
- You will see letters (ক, খ, গ... or A, B, C...)
- Tap a letter to jump to names starting with that letter

**Way 3: Scroll the list**
- Just scroll through — names are in alphabetical order
- Blue letter headers show each section

#### Step 10: Give Food

1. Find the person in the list
2. Tap the green **"GIVE FOOD"** button next to their name
3. A popup appears showing their **name, ID, and phone last 4 digits**
4. **Ask them to confirm** — "Is your phone number ending in **5678**?"
5. If they confirm, tap **"GIVE FOOD"** again
6. They are now marked with a green checkmark
7. Give them their food!

**If someone is already marked green** = they already collected. Do not give again.

### Option B: QR Scan Tab (only if you printed QR cards)

Use this ONLY if you printed QR cards AND your phone has enough battery.

#### Step 11: Start the Scanner

1. Tap the **"QR Scan"** tab (third tab with camera icon)
2. Tap **"Start Scanner"**
3. Allow camera access when asked
4. Point camera at QR code

**After scanning:**
- **GREEN screen** = Give food. Tap "Confirm Collection"
- **RED screen** = Already collected. Do NOT give food.
- **YELLOW screen** = Unknown code. Try searching by name.

#### Step 12: Stop the Scanner When Not Needed

- The camera **eats battery fast**
- Tap **"Stop Scanner"** when taking a break
- If your battery gets low (below 20%), the app will warn you to switch to the Distribute tab

### Option C: Paper Checklist (if phone dies)

If your phone runs out of battery:

1. Take out the **printed paper checklist** you printed at home
2. When someone comes, find their name on the list
3. **Mark the checkbox with a pen**
4. That's it — it works without any technology
5. When you get to a charger, open the app and update it from the paper

### Step 13: Adding Walk-in People (not on the list)

Sometimes extra people come who were not on the original list:

1. Go to the **Setup** tab
2. Tap **"Add Walk-in"**
3. Type their **name** and **phone number**
4. Tap **"Save"**
5. Go back to **Distribute** tab — they will now be in the list

---

## PART 4: After Distribution (Reports)

### Step 14: Save Your Data First

**Before doing anything else**, save a backup:

1. Go to **Reports** tab
2. Tap **"Save Backup"** in the Data Backup section
3. This saves everything in case your phone is lost or reset

### Step 15: View the Report

You will see four numbers:
- **Total** — total number of people on the list
- **Collected** — how many people got food
- **Remaining** — how many people did NOT get food
- **Walk-ins** — how many extra people were added

### Step 16: Download Reports

**Full Report:**
1. Tap **"Export Report CSV"**
2. A file downloads with everyone's status

**Uncollected List:**
1. Tap **"Uncollected List"**
2. A file downloads with ONLY the people who did not come
3. Use this for follow-up

### Step 17: Restore from Backup (if needed)

If you lose your data (phone reset, browser cleared):

1. Open the app
2. Go to **Reports** tab
3. Tap **"Restore Backup"**
4. Pick the `.json` backup file you saved earlier
5. All your data will be restored

---

## PART 5: Common Questions

### "I have no printer in Bangladesh. What do I do?"

**Print everything at home before you travel.** You need:
- The paper checklist (most important — your pen-and-paper backup)
- Token slips (give one to each person as their "ticket")
- You do NOT need QR cards

### "The beneficiaries don't have phones. Is that a problem?"

**No.** The phone numbers are only used for verification (you check the last 4 digits). The beneficiary does NOT need a phone. They just need their token slip or to know their name.

### "My phone battery is dying. What do I do?"

1. Stop the camera scanner (it drains battery fast)
2. Use the **Distribute** tab instead (name search uses almost no battery)
3. If the phone dies completely, use your **printed paper checklist** with a pen
4. When you find a charger, open the app — your data is still there

### "I closed the app. Is my data lost?"

**No.** Your data is saved in the browser. Open the app again and everything will be there. But do NOT clear your browser data/cache, or you will lose everything. That's why you should save a backup file.

### "Can I use this on two phones at the same time?"

**No.** Each phone has its own separate data. Use ONE phone for the whole distribution.

### "My camera is blurry and won't scan."

Don't worry about it. Use the **Distribute** tab instead — it's actually faster than scanning. Just search by name and tap "GIVE FOOD".

### "A person says they didn't collect but the app says they did."

The app is correct — someone already marked their entry. Check the time shown. Possible reasons:
- Someone else used their token/card
- They came earlier and forgot
- A volunteer marked them by mistake

### "I need to UN-mark someone who was marked as collected."

This app does not have an undo button (to prevent fraud). Make a note and fix it in the CSV report later.

### "The app shows a blank/white screen."

- Try Google Chrome browser
- Make sure you opened the file called `app.html`
- Try refreshing the page

### "How do I start fresh?"

1. Go to **Setup** tab
2. Tap **"Clear All Data"**
3. Confirm when asked
4. All data is deleted

---

## PART 6: Preparation Checklist

### At Home (Before Traveling)

- [ ] Make CSV file with all beneficiary names and phone numbers
- [ ] Open app and import the CSV file
- [ ] Check the list — are all names correct?
- [ ] Print the **paper checklist** (your backup)
- [ ] Print **token slips** (to give to beneficiaries)
- [ ] Optionally print QR cards (only if you have a good printer)
- [ ] Save a **backup file** and email it to yourself
- [ ] Test the app on your phone — make sure it works

### Pack These Items

- [ ] Phone (charged 100%)
- [ ] Power bank
- [ ] Printed paper checklists
- [ ] Printed token slips (or QR cards)
- [ ] A pen (for paper backup)
- [ ] Scissors (to cut token slips if not pre-cut)

### On Distribution Day

- [ ] Open app, check data is loaded
- [ ] Use **Distribute** tab as main workflow
- [ ] Switch to QR Scan only if needed and battery is good
- [ ] Add walk-ins as they arrive
- [ ] Save backup periodically if distribution is long

### After Distribution

- [ ] Save backup immediately
- [ ] Export full report CSV
- [ ] Export uncollected list for follow-up

---

## Summary of the Four Tabs

| Tab | When to use | What it does |
|-----|-------------|-------------|
| **Setup** | Before traveling | Import list, print checklists/tokens/QR cards, add walk-ins |
| **Distribute** | On distribution day | Search by name, tap to give food (NO camera needed) |
| **QR Scan** | On distribution day (optional) | Scan QR cards with camera (uses more battery) |
| **Reports** | After distribution | See totals, download reports, save/restore backups |
