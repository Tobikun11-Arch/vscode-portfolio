export type ProjectKind = 'web' | 'mobile' | 'desktop'

/** One screenshot inside a device mockup. */
export interface Screen {
  /** Name of the screenshot from docs/project-screenshots.md, without extension. */
  file: string
  /** What the screen shows. Used as alt text and on the placeholder until the image exists. */
  label: string
  /** Set once the real screenshot is in /public/projects/. */
  src?: string
}

/** One landscape banner: copy on the left, device mockups on the right. */
export interface Banner {
  headline: string
  caption: string
  /**
   * Web and desktop: the first screen sits in the MacBook.
   * Mobile: three phones, left to right; the middle one is in front.
   */
  screens: Screen[]
  /** Web only: a phone in front of the MacBook showing the responsive layout. */
  phone?: Screen
  /** Desktop only: a small window floated over the MacBook (a tray menu, a mini timer). */
  float?: Screen
}

export interface Project {
  id: string
  kind: ProjectKind
  name: string
  /** Shown next to the name when it isn't solo fullstack work. */
  role?: string
  accent: string
  summary: string
  url?: { href: string; label: string }
  repo?: string
  highlights: string[]
  tech: string[]
  banners: Banner[]
}

const s = (file: string, label: string): Screen => ({ file, label })

export const PROJECTS: Project[] = [
  // ---------------- Web ----------------
  {
    id: 'donclaudios',
    kind: 'web',
    name: "DonClaudio's Lechon House",
    accent: '#e8590c',
    summary:
      'An ordering and management system for a Filipino lechon restaurant. Customers order and track their food from a public storefront, while the owner and cashiers run the business from their own dashboards.',
    url: { href: 'https://www.donclaudios.com', label: 'donclaudios.com' },
    repo: 'https://github.com/Tobikun11-Arch/DonClaudios',
    highlights: [
      'Storefront with menu, promos, holiday pre-orders and a checkout map that shows the free-delivery zone',
      'Live order tracking, rewards with QR codes, reviews and push notifications',
      'Owner dashboard for products, inventory, cashiers, promos, reports and storefront appearance',
      'Cashier counter for walk-in orders and pre-orders',
      'Express API with role-based access, email and phone verification, and rate limiting',
    ],
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'TanStack Query', 'Zustand', 'Express', 'MongoDB', 'Redis', 'Cloudinary', 'Leaflet'],
    banners: [
      {
        headline: 'Lechon orders, without the phone tag.',
        caption: 'Customers order and track online. The owner and cashiers run the store from one system.',
        screens: [s('donclaudios-1', 'Storefront home')],
        phone: s('donclaudios-1-phone', 'Storefront on a phone'),
      },
      {
        headline: 'A checkout that knows the delivery zone.',
        caption: 'Menu, promos, holiday pre-orders and a map that shows where free delivery ends.',
        screens: [s('donclaudios-2', 'Order menu')],
        phone: s('donclaudios-3-phone', 'Checkout with delivery map'),
      },
      {
        headline: 'The whole store in one dashboard.',
        caption: 'Orders, inventory, cashiers, promos and reports, split by role.',
        screens: [s('donclaudios-4', 'Owner dashboard')],
      },
    ],
  },
  {
    id: 'dyc',
    kind: 'web',
    name: 'DynaCore Ledger',
    accent: '#4c6ef5',
    summary:
      'A multi-tenant back office for small service agencies such as virtual-assistant firms. Invoicing, customers, payments, expenses, payroll and a team portal live in one QuickBooks-style app, and every agency gets its own workspace.',
    highlights: [
      'Owners and employees see different apps: employees never see the money tabs',
      'Invoices with a public link clients can open without an account',
      'Payroll that produces downloadable PDF payslips',
      'Employee portal for issue reports and leave requests, with approval status',
      'Plans with seat limits, email invites and company onboarding',
    ],
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'TanStack Query', 'Express', 'MongoDB'],
    banners: [
      {
        headline: 'A back office for agencies that bill by the hour.',
        caption: 'Invoices, payments, expenses and payroll in one workspace per agency.',
        screens: [s('dyc-2', 'Owner home')],
      },
      {
        headline: 'Invoices in a few clicks.',
        caption: 'Line items, customers and a shareable link clients open without signing in.',
        screens: [s('dyc-3', 'Invoice editor')],
      },
      {
        headline: 'Payslips and leave, without the spreadsheet.',
        caption: 'Employees see their payslips and leave status. Owners approve from the same app.',
        screens: [s('dyc-6', 'Employee home')],
      },
    ],
  },
  {
    id: 'fullturns',
    kind: 'web',
    name: 'Full Turns LLC',
    accent: '#f08c00',
    summary:
      'A website and ordering system for a company that turns over rental units: renovation, refinishing, painting, cleaning and maintenance. Property managers book and follow jobs, and admins manage orders, services and the blog.',
    url: { href: 'https://full-turn-llc.vercel.app', label: 'full-turn-llc.vercel.app' },
    repo: 'https://github.com/LinkPoint-Digital-Services/full-turns-llc',
    highlights: [
      'Public site with services, an about page and a blog',
      'Property-manager dashboard for booking and tracking turnover orders',
      'Admin dashboard for orders, services, blog posts, scheduling buffers and data backups',
      'Forms validated with React Hook Form and Zod, tables with TanStack Table',
    ],
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'TanStack Query', 'React Hook Form', 'Zod', 'Express'],
    banners: [
      {
        headline: 'Unit turnovers, booked online.',
        caption: 'Property managers book renovation, painting and cleaning, then follow every job.',
        screens: [s('fullturns-1', 'Home page')],
        phone: s('fullturns-1-phone', 'Home page on a phone'),
      },
      {
        headline: 'Every order in one table.',
        caption: 'Admins update and export orders, services and blog posts.',
        screens: [s('fullturns-3', 'Admin orders')],
      },
      {
        headline: 'A dashboard for property managers.',
        caption: 'Book a turnover and see where each unit stands.',
        screens: [s('fullturns-4', 'Property-manager dashboard')],
      },
    ],
  },
  {
    id: 'dynamail',
    kind: 'web',
    name: 'Dyna-Mail',
    accent: '#0c8599',
    summary:
      'A cold-email platform with a built-in CRM. Import prospects, build campaigns from templates, schedule the sends and answer replies from one inbox.',
    highlights: [
      'Campaign builder with templates, scheduled sending and blocked-out dates',
      'CRM with contacts, deals, tasks, notes, appointments, files and relationships',
      'Bulk prospect import',
      'Inbox that reads replies over IMAP and sends with Nodemailer',
      'Campaign charts with Recharts',
    ],
    tech: ['Next.js', 'TypeScript', 'Prisma', 'MongoDB', 'Tailwind CSS', 'shadcn/ui', 'Nodemailer', 'IMAP'],
    banners: [
      {
        headline: 'Cold email and CRM in one place.',
        caption: 'Find prospects, send campaigns and follow every reply without switching tools.',
        screens: [s('dynamail-2', 'Cold email campaigns')],
      },
      {
        headline: 'Every contact, every deal.',
        caption: 'Deals, tasks, notes and appointments live on each contact.',
        screens: [s('dynamail-3', 'CRM prospects')],
      },
      {
        headline: 'Replies land in one inbox.',
        caption: 'Read and answer replies without leaving the app.',
        screens: [s('dynamail-5', 'Inbox')],
      },
    ],
  },
  {
    id: 'saju',
    kind: 'web',
    name: 'Saju-Bazaar',
    accent: '#2f9e44',
    summary:
      'A full-stack marketplace where anyone can buy and sell. Buyers browse, add to cart and pay with Stripe. Sellers manage listings, orders and inventory from their own dashboard.',
    url: { href: 'https://sajuu-bazaar.vercel.app', label: 'sajuu-bazaar.vercel.app' },
    repo: 'https://github.com/Tobikun11-Arch/Online-Marketplace',
    highlights: [
      'Sign-in with JWT and separate buyer and seller dashboards',
      'Cart and Stripe checkout',
      'Seller analytics, product listings, inventory and orders',
      'Animated, responsive UI with Framer Motion',
    ],
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Express', 'MongoDB', 'Stripe', 'Framer Motion'],
    banners: [
      {
        headline: 'A marketplace for buying and selling.',
        caption: 'Browse products, check out with Stripe and track your orders.',
        screens: [s('saju-1', 'Buyer home')],
      },
      {
        headline: 'A seller dashboard with real numbers.',
        caption: 'Sales analytics, listings, inventory and orders in one place.',
        screens: [s('saju-4', 'Seller analytics')],
      },
      {
        headline: 'Product pages that sell.',
        caption: 'Photos, details and add-to-cart on every listing.',
        screens: [s('saju-2', 'Product page')],
      },
    ],
  },
  {
    id: 'drizzy',
    kind: 'web',
    name: 'Drizzy Movies',
    accent: '#e03131',
    summary:
      'A movie and TV discovery app built on the TMDB API. It shows trending, top-rated and upcoming titles, with trailers, full cast lists and similar titles for each one.',
    url: { href: 'https://drizzy-movies.vercel.app', label: 'drizzy-movies.vercel.app' },
    repo: 'https://github.com/Tobikun11-Arch/Drizzy-Db',
    highlights: [
      'Search across movies and TV shows',
      'Trailers, full cast and similar titles on every detail page',
      'Lazy-loaded posters and a responsive layout',
    ],
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'TMDB API'],
    banners: [
      {
        headline: 'Find something to watch tonight.',
        caption: 'Trending, top-rated and upcoming movies and shows, live from TMDB.',
        screens: [s('drizzy-1', 'Home')],
        phone: s('drizzy-1-phone', 'Home on a phone'),
      },
      {
        headline: 'Every title, every detail.',
        caption: 'Trailers, the full cast and similar titles on one page.',
        screens: [s('drizzy-2', 'Movie detail')],
      },
      {
        headline: 'Search movies and shows.',
        caption: 'Type a title and jump straight to it.',
        screens: [s('drizzy-3', 'Search results')],
      },
    ],
  },
  {
    id: 'titlefusion',
    kind: 'web',
    name: 'Title Fusion',
    accent: '#364fc7',
    summary:
      'The website for a title insurance and escrow company in Minnesota and Wisconsin. Clients order title work online, and staff update the site from a built-in page builder.',
    url: { href: 'https://www.titlefusionllc.com', label: 'titlefusionllc.com' },
    highlights: [
      'Order Title form that sends each request straight to the team by email',
      'Page builder for sections, services and team members, behind a sign-in',
      'Images on Cloudinary and an office map with Leaflet',
    ],
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'NextAuth', 'Cloudinary', 'Leaflet', 'Nodemailer'],
    banners: [
      {
        headline: 'Title and escrow, ordered online.',
        caption: 'Clients in Minnesota and Wisconsin request title work in a few steps.',
        screens: [s('titlefusion-1', 'Home page')],
        phone: s('titlefusion-1-phone', 'Home page on a phone'),
      },
      {
        headline: 'An order form that does the paperwork.',
        caption: 'Request details go straight to the closing team.',
        screens: [s('titlefusion-2', 'Order Title form')],
      },
      {
        headline: 'Staff edit the site themselves.',
        caption: 'Sections, services and team members update from a page builder.',
        screens: [s('titlefusion-4', 'Page builder')],
      },
    ],
  },
  {
    id: 'dvars',
    kind: 'web',
    name: 'Dynamic VA Referral Services',
    accent: '#1c7ed6',
    summary:
      'The company website for Dynamic VA Referral Services, which matches businesses with virtual assistants. It has services, the team, VA success stories, a blog and a job application form, all editable from a built-in CMS.',
    highlights: [
      'CMS for sections, services, team members, testimonials, blog posts and authors',
      'Job application and contact forms that email the team',
      'Blog with author pages and VA success stories',
      'Page transitions with Framer Motion',
    ],
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Prisma', 'NextAuth', 'Cloudinary'],
    banners: [
      {
        headline: 'Virtual assistants, matched to your business.',
        caption: 'Services, success stories and a blog for a VA referral agency.',
        screens: [s('dvars-1', 'Home page')],
        phone: s('dvars-1-phone', 'Home page on a phone'),
      },
      {
        headline: 'Hiring starts on the site.',
        caption: 'Virtual assistants apply through a form built into the website.',
        screens: [s('dvars-4', 'Application form')],
      },
      {
        headline: 'A CMS the team actually uses.',
        caption: 'Pages, team members, testimonials and blog posts update without a developer.',
        screens: [s('dvars-5', 'CMS builder')],
      },
    ],
  },
  {
    id: 'fluely',
    kind: 'web',
    name: 'Fluely',
    role: 'Co-developer & QA',
    accent: '#7048e8',
    summary:
      'A content planner for social media teams. Plan posts on boards, calendars and tables, work on shared boards with collaborators, and see what is due at a glance. I co-developed features and tested releases.',
    url: { href: 'https://fluely.vercel.app', label: 'fluely.vercel.app' },
    repo: 'https://github.com/Stablhr/Fluely',
    highlights: [
      'Boards with Kanban, Calendar, Table, Timeline and Map views',
      'Workspaces, collaborators, email invites and public boards',
      'Cards with comments, mentions, attachments and video embeds',
      'Day-by-day schedule with drag-and-drop between days',
      'Social post planning across Facebook, LinkedIn, YouTube and TikTok',
    ],
    tech: ['Next.js', 'React 19', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'TanStack Query', 'Express', 'MongoDB'],
    banners: [
      {
        headline: 'Plan every post in one place.',
        caption: 'Boards, calendars and schedules for social media teams.',
        screens: [s('fluely-1', 'Dashboard')],
      },
      {
        headline: 'One board, five views.',
        caption: 'Switch a board between Kanban, Calendar, Table, Timeline and Map.',
        screens: [s('fluely-2', 'Kanban board')],
      },
      {
        headline: 'Drag work onto the right day.',
        caption: 'A day-by-day planner for every card with a due date.',
        screens: [s('fluely-4', 'Schedule')],
      },
    ],
  },

  // ---------------- Mobile ----------------
  {
    id: 'customerapp',
    kind: 'mobile',
    name: "DonClaudio's Customer App",
    accent: '#e8590c',
    summary:
      "The phone app for DonClaudio's customers. It brings the web ordering experience to iOS and Android and talks to the same backend.",
    highlights: [
      'Menu with Featured, promos, categories, search, allergen filter and holiday pre-orders',
      'Checkout with a delivery map, courier picker, pick-up and reservations',
      'Live order tracking with a prep countdown and chat with the store',
      'Payments through Xendit in the in-app browser, plus cash and in-store options',
      'Rewards with a QR code, reviews, and a menu that still shows when the connection drops',
    ],
    tech: ['React Native', 'Expo', 'Expo Router', 'TypeScript', 'TanStack Query', 'Reanimated', 'SQLite'],
    banners: [
      {
        headline: 'Lechon, ordered from your phone.',
        caption: "The DonClaudio's menu, checkout and order tracking in one app.",
        screens: [
          s('customerapp-1', 'Sign in'),
          s('customerapp-2', 'Menu'),
          s('customerapp-3', 'Product'),
        ],
      },
      {
        headline: 'Track it from the oven to your door.',
        caption: 'Live order status, a prep countdown and chat with the store.',
        screens: [
          s('customerapp-4', 'Checkout'),
          s('customerapp-5', 'Order tracking'),
          s('customerapp-7', 'Order history'),
        ],
      },
      {
        headline: 'Points that turn into lechon.',
        caption: 'Earn rewards, redeem them with a QR code and leave reviews.',
        screens: [
          s('customerapp-8', 'Reviews'),
          s('customerapp-6', 'Rewards'),
          s('customerapp-9', 'Profile'),
        ],
      },
    ],
  },
  {
    id: 'vanora',
    kind: 'mobile',
    name: 'Vanora',
    accent: '#5c940d',
    summary:
      'A community app for van-lifers. Members build a verified profile, meet people on the road, join events and get help with their van builds, with paid tiers for premium features.',
    url: { href: 'https://devpost.com/software/vanora', label: 'devpost.com/software/vanora' },
    repo: 'https://github.com/Tobikun11-Arch/vanora',
    highlights: [
      'Onboarding with a four-step profile setup',
      'Explore tab with matches and activity-based friend suggestions',
      'Builder help: build guides, supplier resources, community support and troubleshooting Q&A',
      'Subscriptions with RevenueCat',
      'Supabase backend, maps and location',
    ],
    tech: ['React Native', 'Expo', 'Expo Router', 'TypeScript', 'Supabase', 'RevenueCat', 'Zustand'],
    banners: [
      {
        headline: 'Find your people on the road.',
        caption: 'A verified community for van-lifers to meet, connect and travel together.',
        screens: [
          s('vanora-1', 'Get started'),
          s('vanora-3', 'Home'),
          s('vanora-4', 'Explore'),
        ],
      },
      {
        headline: 'Help with the build.',
        caption: 'Guides, suppliers and a Q&A for van conversions.',
        screens: [
          s('vanora-2', 'Profile setup'),
          s('vanora-6', 'Builder help'),
          s('vanora-5', 'Profile'),
        ],
      },
      {
        headline: 'Premium for the full-timers.',
        caption: 'Subscriptions unlock builder help and more.',
        screens: [
          s('vanora-8', 'Dashboard'),
          s('vanora-7', 'Membership'),
          s('vanora-9', 'Chat'),
        ],
      },
    ],
  },

  // ---------------- Desktop ----------------
  {
    id: 'clovars',
    kind: 'desktop',
    name: 'Clovars',
    accent: '#1098ad',
    summary:
      'An open-source desktop time tracker for small teams, agencies and freelancers. Track hours against clients, projects and tasks, then see where the time went, without the invoicing extras.',
    url: { href: 'https://github.com/Tobikun11-Arch/clovars/releases', label: 'Download from GitHub Releases' },
    repo: 'https://github.com/Tobikun11-Arch/clovars',
    highlights: [
      'Timer you can start and stop from the system tray, plus manual time entry',
      'Clients, projects, tasks and tags',
      'Workspaces with Owner, Admin and Member roles, and invites by email or code',
      'Reports grouped by project, member or date, with CSV export',
      'Auto-updates, and every permission check runs on the server',
    ],
    tech: ['Electron', 'React', 'TypeScript', 'Vite', 'Express', 'MongoDB Atlas'],
    banners: [
      {
        headline: 'Know where the hours go.',
        caption: 'Start a timer, log time and see the totals for your whole team.',
        screens: [s('clovars-1', 'Timer and entries')],
        float: s('clovars-6', 'Mini timer'),
      },
      {
        headline: 'Reports you can hand to a client.',
        caption: 'Group hours by project, member or date and export to CSV.',
        screens: [s('clovars-2', 'Reports')],
      },
      {
        headline: 'Clients, projects and tasks, organized.',
        caption: 'Set up the work once and the timer picks from it.',
        screens: [s('clovars-3', 'Projects')],
      },
    ],
  },
]

export const projectsOf = (kind: ProjectKind) => PROJECTS.filter((p) => p.kind === kind)

/** Every screen a project's banners use, in order. */
export const screensOf = (p: Project) =>
  p.banners.flatMap((b) => [...b.screens, ...(b.phone ? [b.phone] : []), ...(b.float ? [b.float] : [])])

export const KIND_LABEL: Record<ProjectKind, string> = {
  web: 'Web app',
  mobile: 'Mobile app',
  desktop: 'Desktop app',
}
