# DriveEase — Car Rental Web Application

**A Next.js Proof-of-Concept for Online Car Booking and Admin Management**

---

**Submitted by:** [Student Name]  
**Registration No.:** [Registration Number]  
**Department:** [Department Name]  
**Institution:** [College Name]  
**Academic Year:** [Academic Year]

---

## DECLARATION

I, **[Student Name]**, hereby declare that the project work entitled **"DriveEase — Car Rental Web Application"** submitted to **[College Name]** is a record of an original work done by me under the guidance of **[Guide Name]**, and this work has not been submitted elsewhere for the award of any degree or diploma.

**Place:** [Place]  
**Date:** [Date]  
**Signature:** ___________________

---

## ACKNOWLEDGEMENT

I would like to express my sincere gratitude to my project guide, **[Guide Name]**, for their valuable guidance, encouragement, and support throughout the development of this project.

I am thankful to **[College Name]** and the faculty of **[Department Name]** for providing the resources and environment needed to complete this work.

I also extend my thanks to my family and friends for their constant motivation during this project.

---

## INDEX

| S.No | Section | Page |
|------|---------|------|
| 1 | Declaration | |
| 2 | Acknowledgement | |
| 3 | Index | |
| 4 | Abstract | |
| 5 | Introduction | |
| 5.1 | Background | |
| 5.2 | Problem Statement | |
| 5.3 | Objectives | |
| 5.4 | Scope of the Project | |
| 6 | System Analysis | |
| 6.1 | Existing System | |
| 6.2 | Proposed System | |
| 6.3 | User Roles | |
| 6.4 | Feasibility Study | |
| 7 | System Specification | |
| 7.1 | Hardware Requirements | |
| 7.2 | Software Requirements | |
| 7.3 | Functional Requirements | |
| 7.4 | Non-Functional Requirements | |
| 8 | Software Description | |
| 8.1 | Technology Stack | |
| 8.2 | System Architecture | |
| 8.3 | Key Modules | |
| 9 | Project Description | |
| 9.1 | Application Routes | |
| 9.2 | Data Model | |
| 9.3 | Phase-wise Implementation | |
| 9.4 | Authentication and Security | |
| 9.5 | Booking System | |
| 9.6 | Admin Panel | |
| 10 | System Testing | |
| 10.1 | Unit Testing | |
| 10.2 | End-to-End Testing | |
| 10.3 | Manual Test Checklist | |
| 11 | System Implementation | |
| 11.1 | Installation and Setup | |
| 11.2 | Project Structure | |
| 11.3 | Build and Deployment | |
| 12 | Conclusion and Future Enhancement | |
| 13 | Appendix | |
| 14 | Bibliography and References | |

---

## ABSTRACT

DriveEase is a web-based car rental application developed as a proof-of-concept (POC) using Next.js 14 with the App Router. The system allows visitors to browse a catalog of rental cars, apply filters by name, fuel type, seats, and price, and view detailed car information. Registered users can log in with mock credentials, book cars by selecting pickup and return dates, and view their booking history. Administrators access a dedicated panel to view dashboard statistics, manage the car fleet (create, update, delete), and update booking statuses.

The application uses TypeScript for type safety, Tailwind CSS and shadcn/ui for responsive UI components, and JSON files for data persistence instead of a production database. Authentication is implemented using HMAC-signed HTTP-only session cookies with middleware-based route protection. Server Actions handle booking creation and admin mutations with server-side file writes.

This POC demonstrates the complete product flow from catalog browsing through booking and administration. It is intended for local demonstration and learning purposes only and is not production-ready due to plain-text password storage and file-based persistence limitations.

---

## INTRODUCTION

### 5.1 Background

The car rental industry increasingly relies on digital platforms to manage fleet inventory, accept online bookings, and provide customers with self-service access to vehicle information and reservations. Web applications offer centralized catalogs, role-based access for staff and customers, and automated price calculation based on rental duration.

Modern full-stack frameworks such as Next.js enable rapid development of such applications with server-side rendering, API routes, and integrated authentication patterns suitable for proof-of-concept and prototype deployments.

### 5.2 Problem Statement

Traditional car rental operations often depend on manual phone bookings, paper records, and disconnected systems for fleet management. Customers lack a unified interface to browse available vehicles, compare prices, and track their reservations. Administrators need a single dashboard to monitor bookings and maintain the car catalog.

There is a need for a structured web application that demonstrates the core flows of an online car rental service: catalog discovery, user authentication, booking management, and administrative control.

### 5.3 Objectives

The primary objectives of the DriveEase project are:

1. Build a responsive web application shell with navigation, home page, and mobile-friendly layout (Phase 1).
2. Implement a car catalog with search and filter capabilities and individual car detail pages (Phase 2).
3. Provide mock authentication with user and admin roles, session cookies, and protected routes (Phase 3).
4. Enable authenticated users to create bookings with date selection and automatic price calculation, and view their booking history (Phase 4).
5. Deliver an admin panel with dashboard statistics, cars CRUD, and booking status management (Phase 5).
6. Apply UX polish including loading skeletons, error pages, toast notifications, and empty states (Phase 6).

### 5.4 Scope of the Project

DriveEase is scoped as a local demonstration POC. Data is stored in JSON files (`cars.json`, `users.json`, `bookings.json`) on the server filesystem. Passwords are stored in plain text for demo purposes only. The application does not integrate payment gateways, email notifications, or a production database. All features are designed to run on a developer machine using `npm run dev`.

---

## SYSTEM ANALYSIS

### 6.1 Existing System

In a conventional manual car rental setup, customers contact the agency by phone or in person to inquire about vehicle availability. Staff maintain records in spreadsheets or paper logs. Pricing is calculated manually. There is no self-service portal for customers to browse the fleet or view past bookings. Administrative tasks such as adding new vehicles or updating availability require direct database or spreadsheet edits without a unified UI.

### 6.2 Proposed System

DriveEase replaces the manual workflow with a single web application:

- **Public catalog:** Visitors browse cars at `/cars`, filter by criteria, and view details at `/cars/[id]`.
- **User portal:** Logged-in users book cars at `/cars/[id]/book` and view reservations at `/my-bookings`.
- **Admin portal:** Administrators manage the fleet and bookings at `/admin/dashboard`, `/admin/cars`, and `/admin/bookings`.

Data flows from UI components through library modules to JSON files. Middleware intercepts requests to enforce authentication and role-based access before pages render.

### 6.3 User Roles

| Role | Description | Access |
|------|-------------|--------|
| Visitor | Unauthenticated user | Home, car catalog, car detail (browse only) |
| User | Registered customer | All visitor routes plus booking and my bookings |
| Admin | Fleet manager | All user routes plus admin dashboard, cars CRUD, booking management |

**User flow (customer):** Home → Cars → Car Detail → Login (if needed) → Book → My Bookings

**User flow (admin):** Login → Admin Dashboard → Cars / Bookings management

### 6.4 Feasibility Study

- **Technical feasibility:** Next.js 14, React 18, and TypeScript provide a mature ecosystem. JSON file persistence is sufficient for a single-user demo environment. Middleware and Server Actions are built into the framework.
- **Operational feasibility:** Demo credentials allow immediate testing without registration workflows. Admin and user roles share a single login page with role-based redirect.
- **Economic feasibility:** The entire stack is open source (Next.js, React, Tailwind, Vitest, Playwright). No licensing or cloud costs are required for local development.

---

## SYSTEM SPECIFICATION

### 7.1 Hardware Requirements

| Component | Minimum Requirement |
|-----------|---------------------|
| Processor | Dual-core CPU or equivalent |
| RAM | 4 GB (8 GB recommended) |
| Storage | 500 MB free disk space for project and dependencies |
| Display | 1280×720 or higher resolution |
| Network | Internet connection for npm install and external car images |

### 7.2 Software Requirements

| Software | Version |
|----------|---------|
| Node.js | 18+ (20 recommended) |
| npm | Bundled with Node.js |
| Operating System | Windows, macOS, or Linux |
| Web Browser | Chrome, Firefox, Edge, or Safari (latest) |
| Code Editor | VS Code or equivalent (optional) |

### 7.3 Functional Requirements

| Phase | Requirement | Status |
|-------|-------------|--------|
| 1 | Navbar, Footer, mobile hamburger nav, home hero with Browse Cars CTA | Implemented |
| 2 | 10 mock cars in JSON, grid listing, search/filter, car detail page | Implemented |
| 3 | Mock login, signed session cookie, middleware guards, AuthProvider | Implemented |
| 4 | Booking form with dates, price calculation, my bookings page | Implemented |
| 5 | Admin dashboard, cars CRUD, booking status updates | Implemented |
| 6 | Loading skeletons, 404 page, Sonner toasts, empty states, README | Implemented |

### 7.4 Non-Functional Requirements

- **Responsive design:** Layout adapts to mobile, tablet, and desktop viewports using Tailwind CSS breakpoints.
- **Role-based access control:** Middleware and layout guards restrict admin and booking routes.
- **Server-side validation:** Booking dates, credentials, and admin mutations are validated on the server.
- **Accessibility:** Semantic HTML, ARIA attributes on navigation, and keyboard-friendly forms.

---

## SOFTWARE DESCRIPTION

### 8.1 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 14.2 (App Router) | Routing, SSR, Server Actions |
| Language | TypeScript 5 | Static typing |
| UI Library | React 18 | Component-based UI |
| Styling | Tailwind CSS 3.4 | Utility-first CSS |
| Components | shadcn/ui | Button, Card, Table, Sheet, etc. |
| Notifications | Sonner | Toast messages |
| Unit Tests | Vitest 2.1 | Library function tests |
| E2E Tests | Playwright 1.59 | Browser automation tests |
| Persistence | JSON files | cars, users, bookings data |

### 8.2 System Architecture

The application follows a layered architecture:

1. **Presentation layer (`app/` + `components/`):** Pages, layouts, and reusable UI components.
2. **Business logic layer (`lib/`):** Authentication, data access, booking calculations, and file I/O.
3. **Data layer (`data/*.json`):** Persistent storage for cars, users, and bookings.
4. **Security layer (`middleware.ts`):** Route protection and session verification.

Server Actions in `app/actions/` handle mutations (login, logout, create booking, admin CRUD) and write to JSON files or cookies on the server.

### 8.3 Key Modules

| Module | Path | Responsibility |
|--------|------|----------------|
| Auth | `lib/auth.ts` | Credential verification, session user lookup |
| Session token | `lib/session-token.ts` | HMAC-signed token create/verify |
| Data (read) | `lib/data.ts` | Car listing, filtering, get by ID |
| Cars store (write) | `lib/cars-store.ts` | Admin car CRUD via filesystem |
| Bookings | `lib/bookings.ts` | Read/write bookings, detailed joins |
| Booking math | `lib/booking-math.ts` | Rental days and total price calculation |
| Admin auth | `lib/admin-auth.ts` | Layout-level admin guard |
| Middleware | `middleware.ts` | Login redirect, admin/user route protection |

---

## PROJECT DESCRIPTION

### 9.1 Application Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home page with hero and Browse Cars button |
| `/cars` | Public | Car catalog with search and filters |
| `/cars/[id]` | Public | Car detail with gallery and Book Now |
| `/cars/[id]/book` | Authenticated user | Booking form with date pickers |
| `/login` | Public | Email/password login for user and admin |
| `/my-bookings` | Authenticated user | Table of user's bookings |
| `/admin/dashboard` | Admin | Statistics and quick actions |
| `/admin/cars` | Admin | Cars list, create, edit, delete |
| `/admin/bookings` | Admin | All bookings with status dropdown |

### 9.2 Data Model

**User** (`data/users.json`):
- id, email, password, role (user | admin), name

**Car** (`data/cars.json`):
- id, name, seats, fuel, price (per day), available (boolean), images (array), description

**Booking** (`data/bookings.json`):
- id, userId, carId, pickupDate, returnDate, totalPrice, status (confirmed | completed | cancelled)

Relationships: User places many Bookings; Car appears in many Bookings.

### 9.3 Phase-wise Implementation

**Phase 1 — Layout shell:** Root layout wraps all pages with Navbar, Footer, AuthProvider, and Sonner toast provider. Mobile navigation uses shadcn Sheet component.

**Phase 2 — Catalog:** `CarsCatalog` component renders a responsive grid of `CarCard` components. Filters include name search, fuel type, seats, and maximum price. Empty state shown when no cars match filters.

**Phase 3 — Authentication:** Single `/login` page accepts credentials validated against `users.json`. On success, an HTTP-only signed cookie is set. Users redirect to `/`; admins redirect to `/admin/dashboard`. Navbar shows user name and logout when authenticated.

**Phase 4 — Booking:** Dedicated `/cars/[id]/book` page hosts `CarBookingForm` with native date inputs. Total price = billable rental days × car price per day. `createBookingAction` appends to `bookings.json` and redirects to `/my-bookings?booked=1`.

**Phase 5 — Admin:** Admin layout with sidebar navigation. Dashboard shows total cars, available cars, total bookings. Cars page supports inline create/edit forms and delete with confirmation. Bookings page lists all reservations with status update dropdown.

**Phase 6 — Polish:** Loading skeletons on `/cars` and `/cars/[id]`. Custom `not-found.tsx` for 404 errors. Toast components for login, booking success, and admin mutations. Empty states on catalog filter and my bookings.

### 9.4 Authentication and Security

- Session tokens are HMAC-signed payloads stored in an HTTP-only cookie (`driveease_session`).
- Middleware verifies tokens on protected routes before allowing access.
- Admin routes require `role === "admin"`; non-admin users redirect to home.
- Unauthenticated users redirect to `/login?callbackUrl=...` for protected paths.

**Mock credentials:**
- User: user@gmail.com / 123456
- Admin: admin@gmail.com / admin123

**POC limitations:** Passwords stored in plain text; no bcrypt hashing. Session secret defaults to a dev value unless `SESSION_SECRET` env var is set.

### 9.5 Booking System

Booking creation flow:
1. User selects pickup and return dates on the booking form.
2. `billableRentalDays` calculates inclusive rental days from date range.
3. `computeBookingTotal` multiplies days by car's daily price.
4. Server Action validates dates, car availability, and user session.
5. New booking appended to `bookings.json` with status "confirmed".
6. User redirected to my bookings with success toast.

### 9.6 Admin Panel

- **Dashboard:** Cards for total cars, available cars, total bookings; latest booking summary; links to cars and bookings pages.
- **Cars management:** Table listing all cars; form to add new car; edit via query parameter form; delete with browser confirm dialog.
- **Bookings management:** Table with user name, car name, dates, total, status; dropdown to update status via Server Action.

**Known limitation:** Catalog reads cars via static import in `data.ts` while admin writes use runtime filesystem in `cars-store.ts`. Admin car changes may not appear on the public catalog until application rebuild.

---

## SYSTEM TESTING

### 10.1 Unit Testing

Vitest runs unit tests for core library functions:

| Test File | Coverage |
|-----------|----------|
| `lib/data.test.ts` | getAllCars, getCarById, filterCars, distinct fuels/seats |
| `lib/bookings.test.ts` | billableRentalDays, computeBookingTotal |

Run with: `npm run test`

### 10.2 End-to-End Testing

Playwright e2e specs cover critical user journeys:

| Spec File | Coverage |
|-----------|----------|
| `e2e/home.spec.ts` | Hero, CTA, navbar links |
| `e2e/cars.spec.ts` | 10 cars displayed, search/filter, empty state |
| `e2e/car-detail.spec.ts` | Metadata, Book CTA, unavailable car, 404 |
| `e2e/login.spec.ts` | Form, invalid credentials, user callback, admin redirect |
| `e2e/auth-guard.spec.ts` | Guards on my-bookings, admin, book route |
| `e2e/bookings.spec.ts` | Seeded bookings list, create booking flow |
| `e2e/admin.spec.ts` | Non-admin blocked, dashboard, car CRUD, status update |
| `e2e/phase6.spec.ts` | Custom 404, login error feedback |

Run with: `npm run test:e2e`

### 10.3 Manual Test Checklist

1. Open home page; click Browse Cars; verify 10 cars load.
2. Filter by fuel type and price; verify results update.
3. Open car detail; click Book Now while logged out; verify redirect to login.
4. Log in as user@gmail.com; complete a booking; verify my bookings page.
5. Log out; log in as admin@gmail.com; verify redirect to admin dashboard.
6. Add, edit, and delete a car in admin cars page.
7. Update a booking status in admin bookings page.
8. Visit invalid URL; verify custom 404 page.

---

## SYSTEM IMPLEMENTATION

### 11.1 Installation and Setup

```bash
# Clone or navigate to project directory
cd car-rental

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in a browser.

Optional: set `SESSION_SECRET` environment variable for production-like session signing.

### 11.2 Project Structure

```
car-rental/
├── app/                    # Next.js App Router pages and layouts
│   ├── actions/            # Server Actions (auth, booking, admin)
│   ├── admin/              # Admin panel routes
│   ├── cars/               # Catalog and detail routes
│   ├── login/              # Login page
│   └── my-bookings/        # User bookings page
├── components/             # React components
│   ├── admin/              # Admin-specific components
│   ├── providers/          # Auth and toast providers
│   └── ui/                 # shadcn UI primitives
├── data/                   # JSON data files
│   ├── cars.json
│   ├── users.json
│   └── bookings.json
├── e2e/                    # Playwright end-to-end tests
├── lib/                    # Business logic and utilities
├── projectplan/            # Phase documentation
├── docs/                   # Project reports
└── middleware.ts           # Route protection
```

### 11.3 Build and Deployment

```bash
# Lint
npm run lint

# Production build
npm run build

# Start production server
npm start
```

For POC purposes, local development mode is sufficient. Production deployment would require a Node.js hosting environment, environment variables for session secret, and migration from JSON files to a real database.

---

## CONCLUSION AND FUTURE ENHANCEMENT

### Conclusion

DriveEase successfully implements the planned car rental POC across six development phases. The application delivers a complete customer journey from browsing the fleet through booking and viewing reservations, as well as a full admin workflow for fleet and booking management. The use of Next.js App Router, Server Actions, middleware-based auth, and shadcn/ui components demonstrates modern full-stack web development patterns suitable for academic project presentation.

Unit and end-to-end tests provide automated verification of core functionality. UX polish items including loading states, toast notifications, and empty states improve the demonstration quality of the application.

### Future Enhancements

1. **Database integration:** Replace JSON files with PostgreSQL or MongoDB for scalable persistence.
2. **Secure authentication:** Hash passwords with bcrypt; add registration, password reset, and OAuth providers.
3. **Payment gateway:** Integrate Stripe or Razorpay for online payment at booking time.
4. **Email notifications:** Send booking confirmation and reminder emails.
5. **Availability calendar:** Block dates when cars are already booked.
6. **Image upload:** Allow admins to upload car photos instead of external URLs.
7. **Catalog sync fix:** Unify car read path so admin edits reflect immediately on public catalog.
8. **Production deployment:** Deploy to Vercel, AWS, or similar with CI/CD pipeline.

---

## APPENDIX

### Appendix A — Route Protection Map

| Route Pattern | Visitor | User | Admin |
|---------------|---------|------|-------|
| `/`, `/cars`, `/cars/[id]` | Yes | Yes | Yes |
| `/login` | Yes | Redirect if logged in | Redirect if logged in |
| `/cars/[id]/book` | Redirect to login | Yes | Yes |
| `/my-bookings` | Redirect to login | Yes | Yes |
| `/admin/*` | Redirect to login | Redirect to home | Yes |

### Appendix B — Sample Data Structures

**User record:**
```json
{
  "id": 1,
  "email": "user@gmail.com",
  "password": "123456",
  "role": "user",
  "name": "Demo User"
}
```

**Car record:**
```json
{
  "id": 1,
  "name": "Toyota Innova Crysta",
  "seats": 7,
  "fuel": "Diesel",
  "price": 4200,
  "available": true,
  "images": ["https://..."],
  "description": "Spacious MPV for family trips..."
}
```

**Booking record:**
```json
{
  "id": 1,
  "userId": 1,
  "carId": 2,
  "pickupDate": "2026-04-01",
  "returnDate": "2026-04-03",
  "totalPrice": 8400,
  "status": "confirmed"
}
```

### Appendix C — Screenshot Placeholders

Insert screenshots captured from http://localhost:3000:

1. Home page — hero section with Browse Cars button
2. Cars listing — grid with filters
3. Car detail — gallery and Book Now button
4. Login page — email and password form
5. My Bookings — user booking table
6. Admin Dashboard — statistics cards

### Appendix D — npm Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright e2e tests |

---

## BIBLIOGRAPHY & REFERENCES

1. Next.js Documentation — https://nextjs.org/docs
2. React Documentation — https://react.dev
3. TypeScript Documentation — https://www.typescriptlang.org/docs
4. Tailwind CSS Documentation — https://tailwindcss.com/docs
5. shadcn/ui — https://ui.shadcn.com
6. Sonner Toast Library — https://sonner.emilkowal.ski
7. Vitest — https://vitest.dev
8. Playwright — https://playwright.dev
9. MDN Web Docs — https://developer.mozilla.org
