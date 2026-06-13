# DriveEase Car Rental

DriveEase is a car-rental web app built with Next.js App Router and Supabase
for authentication and data storage.

## Features

- Browse cars and view car details
- Filter catalog by name, fuel, seats, and max price
- Supabase Auth login (seeded demo user and admin accounts)
- Create bookings and view my bookings
- Admin panel for dashboard stats, cars CRUD, and booking status updates

## Prerequisites

- Node.js 18+ (Node.js 20 recommended)
- npm
- A Supabase project ([supabase.com](https://supabase.com))

## Setup

1. Copy environment variables:

```bash
cp .env.local.example .env.local
```

2. Fill in `.env.local` from your Supabase project dashboard
   (**Project Settings → API**):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (required for `npm run seed` only)

3. Apply database migrations from [`supabase/migrations/`](supabase/migrations/)
   using the Supabase SQL editor or CLI, then seed demo data:

```bash
npm install
npm run seed
```

4. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo credentials

Seeded by `npm run seed` (development only):

- User: `user@gmail.com` / `123456`
- Admin: `admin@gmail.com` / `admin123`

## Useful scripts

```bash
npm run dev
npm run lint
npm run test
npm run build
npm run seed
npm run test:e2e
```

Run `npm run seed` before end-to-end tests on a fresh Supabase project.

## Project structure

- `app/` — Next.js routes and server actions
- `lib/supabase/` — Supabase SSR client helpers
- `lib/data.ts`, `lib/cars-store.ts`, `lib/bookings.ts` — data access
- `scripts/seed-supabase.ts` — demo users, cars, and bookings
- `supabase/migrations/` — Postgres schema and RLS policies
