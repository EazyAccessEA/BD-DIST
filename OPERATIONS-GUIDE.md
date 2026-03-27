# How This System Works

# এই সিস্টেম কিভাবে কাজ করে

Simple step-by-step for everyone involved.

---

## THE BIG PICTURE

You have a list of people. Each person gets food ONE time only. Nobody gets food twice. Nobody gets missed. That's the goal.

### The 3 Phases

```
PHASE 1: BEFORE YOU GO (at home, on your computer)
         ↓
PHASE 2: BEFORE DISTRIBUTION DAY (in Bangladesh, give out tokens)
         ↓
PHASE 3: DISTRIBUTION DAY (give food, check names off)
```

---

## PHASE 1: BEFORE YOU GO (At Home)

**Who does this:** You (the organizer), on your computer.

**Time needed:** 1-2 hours.

### Step 1: Make Your List

Open Excel or Google Sheets. Make a list like this:

```
name              | phone       | household
-------------------|-------------|----------
আব্দুল করিম        | 01712345678 | করিম পরিবার
ফাতেমা করিম        | 01712345678 | করিম পরিবার
মোহাম্মদ রহিম      | 01898765432 | রহিম পরিবার
```

- **name** = the person's full name
- **phone** = their phone number (or a neighbor's number if they don't have one)
- **household** = family name (so you can give food to the whole family at once)

Save this as a **CSV file**.

### Step 2: Load the List into the App

1. Open `app.html` in Chrome on your computer
2. Tap **Setup** tab
3. Type your event name and date
4. Tap **"Import Beneficiary List"** and pick your CSV file
5. Check the list looks correct

### Step 3: Set Up Rations

Tell the app what each person gets:

1. In Setup tab, find **"Ration Package"**
2. Tap **"+ Add Item"**
3. Type: Rice, 5, kg
4. Tap **"+ Add Item"** again
5. Type: Oil, 2, L
6. Keep adding until you've listed everything

### Step 4: Print Everything (THIS IS CRITICAL)

Print THREE things. You need all of them.

**Print 1: TOKEN SLIPS (give to people)**

1. Tap **"Generate Tokens"**
2. Print all pages
3. Cut along dotted lines
4. Each token has TWO parts:
   - **TOP HALF** = person keeps this (their ticket)
   - **BOTTOM HALF** = you tear off and collect on distribution day

**Print 2: PAPER CHECKLIST (your master list)**

1. Tap **"Generate Checklist"**
2. Print all pages
3. This is your backup. It has every name with:
   - A checkbox
   - Their ID number
   - Last 4 digits of phone
   - Space for thumbprint/signature

**Print 3: (Optional) QR CARDS**

Only if you have a good printer. Not required.

### Step 5: Save a Backup

1. Go to **Reports** tab
2. Tap **"Save Backup"**
3. Email the backup file to yourself

### Step 6: Load the App on Your Phone

1. Open `app.html` in Chrome **on your phone**
2. Import the same CSV file
3. Set up the same rations
4. Save a backup on your phone too

### What to Pack

```
✅ Phone (fully charged)
✅ Power bank
✅ Printed token slips (cut into pieces)
✅ Printed paper checklists (2 copies)
✅ Pens (at least 3)
✅ Scissors (if tokens not pre-cut)
✅ A box or bag (to collect torn stubs)
```

---

## PHASE 2: BEFORE DISTRIBUTION DAY (In Bangladesh)

**Who does this:** You + a local helper.

**Time needed:** 1-2 days before distribution.

### Step 7: Give Out Tokens

Go door to door (or through a community leader) and give each person their token slip.

Tell each person:

> "Bring this slip on [DATE] to [LOCATION] to collect your food.
> Do not lose it. Do not give it to anyone else.
> Come yourself or send a family member with the slip."

**If you can't find someone:** Leave their token with a neighbor or community leader.

**If someone is not on the list:** You can add them later as a "walk-in" on distribution day.

---

## PHASE 3: DISTRIBUTION DAY

### The Setup (30 minutes before)

You need **2-3 people** at the distribution point:

```
STATION 1: CHECK-IN (1 person)
  → Checks token, finds name, marks collection

STATION 2: FOOD GIVING (1-2 people)
  → Hands out the food packages
```

**Station 1 person needs:**
- Your phone with the app open (Distribute tab)
- Printed paper checklist as backup
- A pen
- A box to collect torn token stubs

**Station 2 people need:**
- The food packages
- Nothing else

### How Each Person Goes Through the Line

Here is what happens when one person arrives:

```
Person arrives with token
        ↓
Station 1: "Show me your token"
        ↓
Station 1: Tear off bottom stub, put in box
        ↓
Station 1: Find name in the app (search or scroll)
        ↓
Is the button GREEN ("GIVE FOOD")?
        ↓
   YES → Tap it, confirm, tell them to go to Station 2
   NO  → They already collected. Tell them politely.
        ↓
Station 2: Give them their food package
        ↓
DONE. Next person.
```

### Step 8: Check In Each Person (Station 1)

#### If you have your phone working:

1. Open the **Distribute** tab
2. When a person arrives:
   - **Option A:** Type their name in the search box
   - **Option B:** Tap the letter on the right sidebar to jump to their name
   - **Option C:** Type their token ID (like FD-0042) in the search box
3. You see their name with a green **"GIVE FOOD"** button
4. Tap **"GIVE FOOD"**
5. A popup shows their name and phone last 4 digits
6. Ask: "Your phone number ends in **5678**, correct?"
7. If yes, tap **"GIVE FOOD"** to confirm
8. Tell them to go to Station 2 for their food

#### If someone already collected:

- Their name shows a **green checkmark** instead of a button
- It shows the time they collected
- Say: "You already collected at [TIME]. You cannot collect again."
- Do NOT give them food

#### If your phone dies or runs out of battery:

1. Take out the **printed paper checklist**
2. Find the person's name on the list
3. Check their token ID matches
4. **Mark the checkbox with your pen**
5. **Get their thumbprint** in the signature column (press their thumb on an ink pad, then on the paper)
6. Send them to Station 2

#### If someone comes WITHOUT a token:

1. Ask their name
2. Search for them in the app
3. If found: verify using phone last 4 digits, then mark as collected
4. If NOT found: add them as a walk-in (Setup tab → "Add Walk-in")
5. Note: people without tokens should go to the **end of the line**

#### If someone sends another person to collect (proxy):

1. Search for the actual beneficiary name in the app
2. Tap **"GIVE FOOD"**
3. In the popup, check the box **"Collected by proxy"**
4. Type the name of the person who came instead
5. Confirm

### Step 9: Keep Count

The app shows you at all times:
- **Green number** = how many people got food
- **Red number** = how many are still waiting
- **Progress bar** = how far along you are

### Step 10: Handle Problems

| Problem | What to do |
|---------|-----------|
| Person lost their token | Search by name in the app. Verify with phone number. |
| Person not on the list | Add as walk-in in Setup tab. Note their details. |
| Marked wrong person | Tap the green checkmark → "Undo" → pick reason → undo it |
| Phone battery dying | Stop using camera. The Distribute tab uses almost no battery. |
| Phone completely dead | Use the paper checklist with a pen. Get thumbprints. |
| Someone complains they didn't get food but app says they did | Check the time. Someone else may have used their token. |
| Family wants to collect together | If they have household groups, mark one person and app asks "Mark all family?" |

---

## AFTER DISTRIBUTION

### Step 11: Immediately After

1. **Save a backup** (Reports → Save Backup)
2. **Export the report** (Reports → Export Report CSV)
3. **Count the collected stubs** in your box — this number should match the "Collected" number in the app

### Step 12: If You Used Paper Checklist (phone died)

When you get to a charger:
1. Open the app
2. Go through the paper checklist
3. For each person marked with a ✓, find them in the Distribute tab and mark them
4. This syncs your paper records with the app

### Step 13: Get the Uncollected List

1. Reports → **"Uncollected List"**
2. This gives you a list of people who did NOT come
3. You can follow up with them or schedule a second distribution

---

## HOW DUPLICATION IS PREVENTED

There are **5 layers** of protection against someone getting food twice:

```
LAYER 1: TOKEN SYSTEM
  → Each person has exactly ONE token
  → You tear off the stub when they arrive
  → No stub = no food

LAYER 2: APP CHECK
  → The app shows GREEN (give food) or CHECKMARK (already given)
  → You cannot mark someone twice — the app blocks it

LAYER 3: PHONE VERIFICATION
  → When you tap "Give Food", the app shows last 4 phone digits
  → Ask the person: "Your number ends in 5678?"
  → If they say no, it might be the wrong person

LAYER 4: PAPER CHECKLIST
  → Even if the phone fails, the paper checklist has checkboxes
  → One mark per person, in pen (can't erase)

LAYER 5: STUB COLLECTION
  → Count the torn stubs at the end
  → Should match the app's "Collected" number
  → If numbers don't match, investigate
```

### What if someone tries to cheat?

| Cheat attempt | How it's caught |
|---|---|
| Come twice with same token | Token stub already torn off. App shows already collected. |
| Borrow someone else's token | Phone number verification fails (wrong last 4 digits). |
| Come without token, give fake name | Search won't find them. Or if name exists, phone check fails. |
| Send two family members separately | Household grouping marks all members at once. |
| Fake token from another event | Token ID won't be found in the app. Shows "unknown". |

---

## EXPLAINING TO VOLUNTEERS

### For the person at Station 1 (Check-in):

Tell them this:

> "When someone comes:
> 1. Take their token
> 2. Tear off the bottom part, put it in the box
> 3. Find their name on the phone [show them how to search]
> 4. If it says GREEN, tap it and say YES
> 5. If it shows a CHECKMARK, say 'you already got food'
> 6. If the phone dies, use this paper list and tick the box with a pen"

Practice with them 3-4 times before the event starts.

### For the people at Station 2 (Food giving):

Tell them this:

> "Only give food to people who come from Station 1.
> Each person gets: [list the ration package].
> Do not give food to anyone who didn't go through Station 1."

---

## QUICK REFERENCE CARD

Print this and tape it next to Station 1:

```
┌─────────────────────────────────────────┐
│           STATION 1 - CHECK IN          │
│                                         │
│  1. Take token                          │
│  2. Tear stub → put in box              │
│  3. Search name in phone app            │
│  4. GREEN button = tap → give food      │
│  5. CHECKMARK = already collected       │
│  6. No token = search by name           │
│  7. Phone dead = use paper checklist    │
│                                         │
│  VERIFY: "Phone ends in ____?"          │
│  PROXY: Check "proxy" box + write name  │
│  PROBLEM: Call [organizer name/number]  │
└─────────────────────────────────────────┘
```

---

## NUMBERS TO KNOW

After the event, you should have:

- **Collected stubs in box** = same as app's "Collected" number
- **Checklist marks** (if used) = same as app's "Collected" number
- **Food packages given out** = same as above
- If any number doesn't match → something went wrong, investigate
