# User Guide: Food Distribution QR App

# ব্যবহারকারী নির্দেশিকা: খাদ্য বিতরণ QR অ্যাপ

This guide explains every step with simple words. Follow the steps in order.

---

## What You Need

Before you start, make sure you have:

1. **A phone or computer** with a web browser (Google Chrome is best)
2. **A CSV file** with your list of people who will get food (names and phone numbers)
3. **A printer** to print QR cards (you need this before distribution day)

That's it. No internet needed after you open the app.

---

## PART 1: Getting the App Ready

### Step 1: Open the App

- Find the file called **`app.html`** (it is inside the `dist` folder)
- Double-tap it on your phone, or double-click it on your computer
- It will open in your web browser
- You will see a **blue bar** at the top that says "খাদ্য বিতরণ" (Food Distribution)
- At the bottom, you will see **three tabs**: Setup, Scan, Reports

### Step 2: Change the Language (if you want English)

- Look at the **top right corner** of the blue bar
- You will see a button that says **"English"**
- Tap it to switch to English
- Tap it again to go back to Bengali
- You can switch anytime

---

## PART 2: Before Distribution Day (Setup)

Do these steps **the day before** you give out food. You need a computer and printer for this part.

### Step 3: Add Your Event Name and Date

- You should be on the **Setup** tab (the first tab)
- You will see two boxes at the top:
  - **Event Name** — Type the name of your event (example: "Ramadan Food Distribution")
  - **Event Date** — Tap and pick the date of distribution
- This information will appear on your reports later

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
- Red error message saying "must have a name column" = Your CSV file does not have a column called "name". Fix your spreadsheet.
- Red error message saying "must have a phone column" = Your CSV file does not have a column called "phone". Fix your spreadsheet.
- Some rows were skipped = Those rows had no name. Check your spreadsheet for empty rows.

### Step 5: Check Your List

- After importing, you will see a number showing **how many people** were loaded
- Below that is the list of everyone
- You can **search** by typing a name in the search box
- Scroll through and make sure the names look correct
- Each person has an **ID** like `FD-0001` — this is created automatically

### Step 6: Print QR Cards

This is very important. Each person needs a printed QR card to bring on distribution day.

1. Tap the big blue button that says **"Generate QR Cards"**
2. A new page will open showing all the QR cards
3. The cards are arranged **8 per page** on A4 paper
4. Each card shows:
   - A **QR code** (the black square pattern)
   - The person's **name**
   - Their **ID** (like FD-0001)
   - The last 4 digits of their **phone number**
   - The **event name**
5. Tap the **"Print Cards"** button at the top
6. Print on regular A4 paper
7. **Cut the cards** along the dotted lines with scissors
8. **Give one card to each person** before distribution day

**Tips for printing:**
- Use a laser printer if possible (the QR codes will be sharper)
- Print a test page first to make sure the QR codes are clear
- Keep extra blank cards in case someone loses theirs

---

## PART 3: Distribution Day (Scanning)

This is the main event. You will use your **phone** to scan QR cards as people come to collect food.

### Step 7: Open the Scan Tab

- Open the app on your **phone**
- Tap the **"Scan"** tab at the bottom (the middle tab with the camera icon)
- You will see two numbers at the top:
  - **Green number** = how many people have collected food so far
  - **Red number** = how many people have NOT collected food yet
- Below that is a **progress bar** showing how far along you are

### Step 8: Start the Camera

1. Tap the big blue button that says **"Start Scanner"**
2. Your phone will ask: **"Allow camera access?"** — tap **YES / ALLOW**
3. You will see your camera view on screen
4. There is a **square box** in the middle — this is where you aim the QR code

### Step 9: Scan a Person's QR Card

1. Ask the person to **hold up their QR card**
2. Point your phone camera at the QR code
3. Hold it steady inside the square box
4. The app will automatically read the QR code (you don't need to tap anything)

**After scanning, you will see ONE of THREE results:**

#### GREEN screen = This person has NOT collected food yet

- You will see a **green screen** with a checkmark
- It shows the person's **name** and **ID**
- It also shows the **last 4 digits of their phone number** — ask the person to confirm this matches their phone
- Tap **"Confirm Collection"** to mark them as collected
- Then give them their food
- The counter at the top will update

#### RED screen = This person ALREADY collected food

- You will see a **red screen** with a stop sign
- It says **"ALREADY COLLECTED"**
- It shows **when** they collected (the time)
- It says **"DO NOT GIVE FOOD"**
- Tap **"Dismiss"** to close
- Tell the person they already received their food

#### YELLOW screen = Unknown QR code

- You will see a **yellow/amber screen**
- It says **"UNKNOWN CODE"**
- This means the QR code is not in your list
- The card might be from a different event, or it might be fake
- Tap **"Search by Name"** to try finding them manually
- Or tap **"Dismiss"** to close

### Step 10: If the Camera Doesn't Work — Use Manual Search

Sometimes the camera won't work, or a person lost their QR card. You can search by name instead:

1. Tap the **"Search by Name"** button below the scanner
2. A search box will appear
3. Type the person's **name** (or their ID like FD-0001, or their last 4 phone digits)
4. Matching people will appear in a list
5. Find the right person and tap the green **"Confirm Collection"** button next to their name
6. This works exactly like scanning — it marks them as collected

### Step 11: If Someone Shows Up Who Is NOT On the List

Sometimes extra people come who were not on the original list. You can add them:

1. Go to the **Setup** tab
2. Tap **"Add Walk-in"**
3. Type their **name** and **phone number**
4. Tap **"Save"**
5. They will be added to the list with a note that says "walk-in"
6. Go back to the **Scan** tab
7. You can now search for them by name and mark them as collected

### Step 12: Stop the Scanner

- When you are done scanning, tap the red **"Stop Scanner"** button
- This turns off the camera and saves battery
- You can start it again anytime

---

## PART 4: After Distribution (Reports)

### Step 13: View the Report

1. Tap the **"Reports"** tab at the bottom (the last tab)
2. You will see four numbers:
   - **Total** — total number of people on the list
   - **Collected** — how many people got food
   - **Remaining** — how many people did NOT get food
   - **Walk-ins** — how many extra people were added

### Step 14: Download the Full Report

1. Tap the blue **"Export Report CSV"** button
2. A CSV file will download to your phone or computer
3. This file has EVERYONE on the list with:
   - Their name, phone, ID
   - Whether they collected (Yes/No)
   - What time they collected
   - Any notes

### Step 15: Download the Uncollected List

1. Tap the **"Uncollected List"** button
2. A CSV file will download
3. This file has ONLY the people who **did not come** to collect food
4. You can use this list to follow up with them later

---

## PART 5: Common Questions

### "I closed the app. Is my data lost?"

**No.** Your data is saved in the browser. Open the app again and everything will be there. But do NOT clear your browser data/cache, or you will lose everything.

### "Can I use this on two phones at the same time?"

**No.** Each phone has its own separate data. If you scan on Phone A, Phone B will not know about it. Use ONE phone for scanning.

### "My camera is blurry and won't scan."

- Clean your camera lens with a cloth
- Make sure there is enough light
- Hold the card about 15-20 cm (6-8 inches) from the camera
- Hold your hand steady
- If it still doesn't work, use **Manual Search** instead

### "A person says they didn't collect but the app says they did."

The app is correct — someone already scanned their card. Check the time shown on the red screen. Possible reasons:
- Someone else used their card
- They came earlier and forgot
- A volunteer scanned them by mistake

### "I need to UN-mark someone who was marked as collected."

This app does not have an undo button (to prevent mistakes). If this happens, make a note and fix it in the CSV report later.

### "Can I import a new list of people?"

Yes. Go to Setup, import a new CSV. **Warning:** This will REPLACE your old list. Export your report first if you need the old data.

### "The app shows a blank/white screen."

- Try a different browser (use Google Chrome)
- Make sure the file is called `app.html` and you opened it from your device
- Try refreshing the page (pull down on phone, or press F5 on computer)

### "How do I clear everything and start fresh?"

1. Go to the **Setup** tab
2. Scroll down
3. Tap the red **"Clear All Data"** button
4. Confirm when asked
5. All data will be deleted — you can now import a new list

---

## PART 6: Tips for a Smooth Distribution Day

1. **Charge your phone** fully the night before
2. **Bring a power bank** just in case
3. **Print extra QR cards** for people who lose theirs
4. **Test the scanner** with one card before the event starts
5. **Have one person dedicated to scanning** — don't pass the phone around
6. **Stand in shade** if possible — screens are hard to read in direct sunlight
7. **Use manual search** if the line is long and scanning is slow
8. **Export your report** as soon as distribution ends, before anything happens to the phone
9. **Keep the printed cards** — you may need them for records

---

## Summary of the Three Tabs

| Tab | When to use | What it does |
|-----|-------------|-------------|
| **Setup** | Before distribution day | Import people list, print QR cards |
| **Scan** | On distribution day | Scan QR cards, give food, search by name |
| **Reports** | After distribution | See totals, download reports |
