# Maxx Fitness Gym

Frontend for Maxx Fitness Gym — a gym membership website and admin panel.
Built with Next.js (App Router), JavaScript, Tailwind CSS, and shadcn/ui.
No backend yet: every page reads from the static mock data in `data/`, kept
separate from the UI so it's a straight swap-in once real APIs exist.

## Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS 3
- shadcn/ui (Radix UI primitives + class-variance-authority)
- lucide-react icons
- sonner (toasts)

## Getting started

This project was authored without network access, so dependencies have
**not** been installed or build-verified in a sandbox. Standard setup:

```bash
npm install
npm run dev
```

Then open http://localhost:3000 for the public Home page, and
http://localhost:3000/admin/dashboard for the admin panel.

## Routes

| Route                 | Page                    |
| ---------------------- | ------------------------ |
| `/`                    | Public Home              |
| `/admin/dashboard`     | Admin Dashboard          |
| `/admin/attendance`    | Admin Attendance Tracking|
| `/admin/payment`       | Admin Take Payment       |

## Project structure

```
app/
  layout.js              Root layout: fonts, metadata, toast host
  (public)/
    layout.js             Public layout: Navbar + Footer
    page.js                Home page
  admin/
    layout.js             Admin layout: Sidebar + mobile header + Footer
    dashboard/
      page.js               Server wrapper (metadata)
      dashboard-view.js      Client view (stat cards, activity table)
    attendance/
      page.js
      attendance-view.js
    payment/
      page.js               Renders <PaymentFormCard />

components/
  ui/                     shadcn/ui primitives (button, card, table, ...)
  Navbar.js, Footer.js, AdminSidebar.js, AdminHeader.js
  StatCard.js, StatusBadge.js, MemberTable.js, AttendanceTable.js
  SearchBar.js, DatePickerField.js
  HeroSection.js, ProgramCard.js, BmiCalculator.js, LocationSection.js
  PaymentFormCard.js

data/
  site-data.js            Home page content
  dashboard-data.js       Stat cards + recent activity
  attendance-data.js      Member roster (attendance)
  payment-data.js         Member roster (payment) + payment methods

lib/
  utils.js                cn() className helper
  format.js                Number/date/currency formatting helpers
  attendance.js            Deterministic mock attendance generator
```

## Notes on the mock data

- Images use [Lorem Picsum](https://picsum.photos) placeholder photos via
  `next/image`, seeded per section so they stay stable across reloads.
  Swap these for real photography whenever it's ready — no code changes
  needed beyond the `src` values in `data/site-data.js`.
- Attendance records are generated deterministically per date via a seeded
  PRNG in `lib/attendance.js`, so the table works correctly for "today"
  and any past date without needing a real backend.
- Every data file is documented with JSDoc `@typedef` comments describing
  its shape, so the structure is clear without TypeScript.

## Replacing mock data with a real API

1. Fill in `.env.example` → copy to `.env.local` with real values.
2. Replace the static exports in `data/*.js` with `fetch` calls (or move
   the fetching into Server Components / Route Handlers).
3. Components already treat the data as props/imports, so most UI code
   doesn't need to change — only the data layer does.
