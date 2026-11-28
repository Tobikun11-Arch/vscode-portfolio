# Project screenshots: what to capture

Each project gets **3 landscape banners** (1920×1080), styled like the Tara Tagalog sample:
the left side has the project name pill, a headline, one line of copy and the live URL; the right side shows device mockups.

- **Web and desktop projects:** a MacBook mockup, sometimes with a phone in front of it.
- **Mobile projects:** three phones, as in the sample.

Banner 1 is the hero. Banners 2 and 3 each show one feature. The carousel swipes through them and also auto-plays.

## How to capture

**Web apps (Chrome)**
1. Open DevTools and turn on the device toolbar (Ctrl+Shift+M).
2. Set the size to **1440 × 900** and DPR to **2**.
3. Open the ⋮ menu and choose **Capture screenshot**. This saves a 2880×1800 PNG, the same ratio as a MacBook screen.
4. For a phone shot of the same site, use **390 × 844** at DPR 3.

**Mobile apps:** take a real phone screenshot or use the simulator. Hide the status-bar clutter if you can.

**Desktop app (Clovars):** maximize the window to about 1440×900 and capture **only the app window** (Win+Shift+S, Window mode).

**General rules**
- Use demo data, not real customer names, emails, phone numbers or invoice amounts. This matters most for DonClaudio's, Dyna-Mail, DynaCore and Full Turns.
- Use light mode unless the app is dark by design.
- Name files `<slug>-<n>.png` using the slug in each heading, for example `donclaudios-1.png`. Phone-size captures of a web page add `-phone`, for example `donclaudios-1-phone.png`.
- The portfolio shows a labelled stand-in with the expected file name wherever a screenshot is still missing.

---

## Web app (9)

### 1. DonClaudio's Lechon House (slug `donclaudios`)
Restaurant ordering system with a public storefront plus customer, cashier and owner dashboards. Next.js, Express and MongoDB. Live site: donclaudios.com.
1. Public home page (`/`), the hero with the lechon banner *(also capture this at phone size)*
2. Order menu (`/order`) with categories, Featured and Promos
3. Checkout (`/checkout/[id]`) with the delivery map and courier picker *(capture this at phone size too: `donclaudios-3-phone.png`)*
4. Owner dashboard home (`/owner/dashboard`) with stats
5. Cashier dashboard, Counter or Orders tab
6. Owner Inventory or Products tab

### 2. DynaCore Ledger (slug `dyc`)
Multi-tenant, QuickBooks-style back office for VA agencies: invoicing, payments, expenses, payroll and an employee portal.
1. Public landing page (`/`)
2. Owner Home with summary cards and create-action pills
3. Invoice editor (`/invoices/new`) filled in with sample lines
4. Invoices list (`/invoices`)
5. Pricing page (`/pricing`)
6. Employee view: Home with the latest payslip and leave status

### 3. Full Turns LLC (slug `fullturns`)
Service-business website plus ordering system for unit turnover, renovation, painting and cleaning. Live site: full-turn-llc.vercel.app.
1. Home page hero *(also capture this at phone size)*
2. Services page
3. Admin dashboard, Orders
4. Property-manager dashboard
5. Blog list or a blog post

### 4. Dyna-Mail (slug `dynamail`)
Cold-email campaigns with a built-in CRM and an inbox.
1. Landing page (`/`)
2. Dashboard: Cold Email, the campaign builder or the template list
3. Dashboard: CRM, the prospects or contacts table
4. A contact detail page with deals, tasks and notes
5. Dashboard: Inbox

### 5. Saju-Bazaar (slug `saju`)
Full-stack marketplace with buyer and seller dashboards and Stripe checkout. Live site: sajuu-bazaar.vercel.app.
1. Buyer dashboard home with products
2. Product detail page
3. Cart, or the Stripe checkout or success page
4. Seller dashboard Overview or Analytics
5. Seller Manage Products

### 6. Drizzy Movies (slug `drizzy`)
Movie and TV discovery app built on the TMDB API. Live site: drizzy-movies.vercel.app.
1. Home with the trending hero *(also capture this at phone size)*
2. Movie detail page (`/movie/[id]`) with cast and similar titles
3. Search results, or a trailer playing

### 7. Title Fusion (slug `titlefusion`)
Website for a title and escrow company in Minnesota and Wisconsin, with an online "Order Title" form and an admin page builder. Live site: titlefusionllc.com.
1. Home page hero *(also capture this at phone size)*
2. Order Title form (`/order-title`)
3. Our Team page
4. Builder admin (`/builder`), the section or services editor

### 8. Dynamic VA Referral Services (slug `dvars`)
Agency website for a virtual-assistant referral service, with blogs, VA success stories, a job application form and a CMS builder.
1. Home page hero *(also capture this at phone size)*
2. Services page
3. VA Success Stories, or the Team page
4. Application form (`/application`)
5. Builder admin (`/builder`)

### 9. Fluely (slug `fluely`, co-developer and QA)
Social media content planner with Kanban boards, calendar, table and timeline views, and scheduling. Live site: fluely.vercel.app.
1. Dashboard home (`/`)
2. A board in Board (Kanban) view
3. The same board in Calendar or Timeline view
4. Schedule (`/schedule`), the day-column planner
5. Content planner or social posting view

## Mobile app (2)

Take each one as a **portrait phone screenshot**. I'll use 3 phones per banner, so up to 9 screens per app is useful.

### 10. DonClaudio's Customer App (slug `customerapp`)
Expo / React Native ordering app for DonClaudio's customers.
1. Welcome or sign-in screen
2. Order tab: menu with Featured and categories
3. Product detail
4. Cart or checkout with the delivery map
5. Order tracking with the live status and prep countdown
6. Rewards with points and the QR code
7. Order history
8. Reviews
9. Profile

### 11. Vanora (slug `vanora`)
Community app for van-lifers to connect, find events and get builder help, with RevenueCat subscriptions.
1. Get Started screen
2. Profile setup, one step from 1 to 4
3. Home tab
4. Explore tab (matches or friend suggestions)
5. A profile (`profile/[id]`)
6. Builder Help, the guides list
7. Membership / subscription paywall
8. Dashboard
9. A chat screen, if there is one

## Desktop app (1)

### 12. Clovars (slug `clovars`)
Electron time-tracking app in the style of Clockify: workspaces, clients, projects, tasks, a timer and reports.
1. Time view with the timer running and the entries list
2. Reports with grouping and the CSV export
3. Work view: Projects or Clients panel
4. Workspace members and invites
5. Dashboard section
6. The mini timer or system-tray menu, cropped small (I'll float it over the MacBook)
7. Sign-in screen
