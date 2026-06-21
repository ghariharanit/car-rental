# DriveEase — Demo Guide

Quick reference for demonstrating the live DriveEase car rental application.

## Live demo URL

**https://car-rental-xi-murex.vercel.app/**

Open this URL in a modern browser (Chrome, Edge, Firefox, or Safari).

---

## Demo credentials

| Role | Email | Password | After login |
|------|-------|----------|-------------|
| **Customer** | `user@gmail.com` | `123456` | Home page or the page you were trying to open |
| **Admin** | `admin@gmail.com` | `admin123` | Admin dashboard |

Use the **customer** account to browse, book cars, and view **My Bookings**.  
Use the **admin** account to manage the fleet and all bookings.

---

## How to use the app

### As a visitor (no login)

1. Open the **Home** page and click **Browse Cars**.
2. On **Cars**, search or filter by name, fuel type, seats, or max price.
3. Open a car to see photos, specs, daily rate, and **Book Now**.

### As a customer

1. Go to **Login** and sign in with `user@gmail.com` / `123456`.
2. Open a car → **Book Now** → choose pickup and return dates → confirm.
3. Open **My Bookings** to see your reservations and status.

### As an admin

1. Go to **Login** and sign in with `admin@gmail.com` / `admin123`.
2. You are redirected to the **Admin dashboard** (fleet and booking stats).
3. Use **Cars** to add, edit, or delete vehicles (changes appear on the public catalog).
4. Use **Bookings** to view all reservations and update status (confirmed, pending, completed, cancelled).

---

## Pages and links

Base URL: `https://car-rental-xi-murex.vercel.app`

| Page | Link | Access | Description |
|------|------|--------|-------------|
| Home | [/](https://car-rental-xi-murex.vercel.app/) | Public | Landing page with hero and **Browse Cars** button. |
| Car catalog | [/cars](https://car-rental-xi-murex.vercel.app/cars) | Public | Grid of rental cars with search and filters. |
| Car detail | [/cars/1](https://car-rental-xi-murex.vercel.app/cars/1) | Public | Example detail page (use `/cars/2` … `/cars/10` for other cars). Shows gallery, price, and **Book Now**. |
| Login | [/login](https://car-rental-xi-murex.vercel.app/login) | Public | Email/password sign-in; demo credentials shown on the form. |
| Book a car | [/cars/1/book](https://car-rental-xi-murex.vercel.app/cars/1/book) | Customer (login required) | Date pickers and booking confirmation; guests are sent to login first. |
| My bookings | [/my-bookings](https://car-rental-xi-murex.vercel.app/my-bookings) | Customer (login required) | Table of the signed-in user’s bookings. |
| Admin dashboard | [/admin/dashboard](https://car-rental-xi-murex.vercel.app/admin/dashboard) | Admin only | Summary counts and latest booking; links to Cars and Bookings. |
| Admin cars | [/admin/cars](https://car-rental-xi-murex.vercel.app/admin/cars) | Admin only | Fleet list, create/edit/delete cars. |
| Admin bookings | [/admin/bookings](https://car-rental-xi-murex.vercel.app/admin/bookings) | Admin only | All customer bookings with status dropdown. |

**Note:** Replace `1` in car URLs with any car ID from the catalog (seeded data uses IDs 1–10).

---

## Suggested demo flow (5 minutes)

1. **Home → Cars** — Show catalog and filters.  
2. **Car detail** — Open one car, show images and price.  
3. **Book Now (logged out)** — Show redirect to login.  
4. **Login as customer** — Complete a booking.  
5. **My Bookings** — Show the new reservation.  
6. **Logout → Login as admin** — Show dashboard, edit a car or booking status.  
7. **Public Cars** — Confirm admin changes appear on the catalog.

---

## Technical notes

- Data is stored in **Supabase** (PostgreSQL); the live site uses the configured Supabase project on Vercel.
- Demo users and cars are created with `npm run seed` during project setup.
- If login fails on a fresh deployment, ensure Vercel has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set and demo data is seeded.

For full setup and architecture, see [driveease-project-report.md](./driveease-project-report.md).
