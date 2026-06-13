#!/usr/bin/env python3
"""Generate DriveEase project report as a Word document."""

from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.shared import Inches, Pt

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "docs" / "driveease-project-report.docx"

FONT = "Times New Roman"
SECTION_SIZE = Pt(24)
BODY_SIZE = Pt(12)
HEADING_SIZE = Pt(14)


def set_run_font(run, size=BODY_SIZE, bold=False):
    run.font.name = FONT
    run.font.size = size
    run.font.bold = bold
    run._element.rPr.rFonts.set(qn("w:eastAsia"), FONT)


def add_body(doc, text):
    p = doc.add_paragraph()
    run = p.add_run(text)
    set_run_font(run)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.15
    return p


def add_bullet(doc, text):
    p = doc.add_paragraph(style="List Bullet")
    run = p.add_run(text)
    set_run_font(run)
    return p


def add_section_heading(doc, title):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(title)
    set_run_font(run, size=SECTION_SIZE, bold=True)
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(12)
    return p


def add_subheading(doc, title):
    p = doc.add_paragraph()
    run = p.add_run(title)
    set_run_font(run, size=HEADING_SIZE, bold=True)
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(6)
    return p


def add_page_break(doc):
    doc.add_page_break()


def add_table(doc, headers, rows):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = "Table Grid"
    hdr_cells = table.rows[0].cells
    for i, header in enumerate(headers):
        hdr_cells[i].text = header
        for paragraph in hdr_cells[i].paragraphs:
            for run in paragraph.runs:
                set_run_font(run, bold=True)
    for row_idx, row_data in enumerate(rows):
        row_cells = table.rows[row_idx + 1].cells
        for col_idx, cell_text in enumerate(row_data):
            row_cells[col_idx].text = str(cell_text)
            for paragraph in row_cells[col_idx].paragraphs:
                for run in paragraph.runs:
                    set_run_font(run)
    doc.add_paragraph()
    return table


def build_document():
    doc = Document()
    section = doc.sections[0]
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)

    style = doc.styles["Normal"]
    style.font.name = FONT
    style.font.size = BODY_SIZE

    # Title page
    for _ in range(6):
        doc.add_paragraph()
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = title.add_run("DriveEase — Car Rental Web Application")
    set_run_font(run, size=SECTION_SIZE, bold=True)

    subtitle = doc.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = subtitle.add_run(
        "A Next.js Proof-of-Concept for Online Car Booking and Admin Management"
    )
    set_run_font(run, size=HEADING_SIZE)

    doc.add_paragraph()
    for line in [
        "Submitted by: [Student Name]",
        "Registration No.: [Registration Number]",
        "Department: [Department Name]",
        "Institution: [College Name]",
        "Academic Year: [Academic Year]",
    ]:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(line)
        set_run_font(run)

    add_page_break(doc)

    # DECLARATION
    add_section_heading(doc, "DECLARATION")
    add_body(
        doc,
        'I, [Student Name], hereby declare that the project work entitled '
        '"DriveEase — Car Rental Web Application" submitted to [College Name] '
        "is a record of an original work done by me under the guidance of "
        "[Guide Name], and this work has not been submitted elsewhere for "
        "the award of any degree or diploma.",
    )
    add_body(doc, "Place: [Place]")
    add_body(doc, "Date: [Date]")
    add_body(doc, "Signature: ___________________")
    add_page_break(doc)

    # ACKNOWLEDGEMENT
    add_section_heading(doc, "ACKNOWLEDGEMENT")
    add_body(
        doc,
        "I would like to express my sincere gratitude to my project guide, "
        "[Guide Name], for their valuable guidance, encouragement, and support "
        "throughout the development of this project.",
    )
    add_body(
        doc,
        "I am thankful to [College Name] and the faculty of [Department Name] "
        "for providing the resources and environment needed to complete this work.",
    )
    add_body(
        doc,
        "I also extend my thanks to my family and friends for their constant "
        "motivation during this project.",
    )
    add_page_break(doc)

    # INDEX
    add_section_heading(doc, "INDEX")
    add_table(
        doc,
        ["S.No", "Section", "Page"],
        [
            ("1", "Declaration", ""),
            ("2", "Acknowledgement", ""),
            ("3", "Index", ""),
            ("4", "Abstract", ""),
            ("5", "Introduction", ""),
            ("5.1", "Background", ""),
            ("5.2", "Problem Statement", ""),
            ("5.3", "Objectives", ""),
            ("5.4", "Scope of the Project", ""),
            ("6", "System Analysis", ""),
            ("6.1", "Existing System", ""),
            ("6.2", "Proposed System", ""),
            ("6.3", "User Roles", ""),
            ("6.4", "Feasibility Study", ""),
            ("7", "System Specification", ""),
            ("8", "Software Description", ""),
            ("9", "Project Description", ""),
            ("10", "System Testing", ""),
            ("11", "System Implementation", ""),
            ("12", "Conclusion and Future Enhancement", ""),
            ("13", "Appendix", ""),
            ("14", "Bibliography and References", ""),
        ],
    )
    add_page_break(doc)

    # ABSTRACT
    add_section_heading(doc, "ABSTRACT")
    add_body(
        doc,
        "DriveEase is a web-based car rental application developed as a proof-of-concept "
        "(POC) using Next.js 14 with the App Router. The system allows visitors to browse "
        "a catalog of rental cars, apply filters by name, fuel type, seats, and price, and "
        "view detailed car information. Registered users can log in with mock credentials, "
        "book cars by selecting pickup and return dates, and view their booking history. "
        "Administrators access a dedicated panel to view dashboard statistics, manage the "
        "car fleet (create, update, delete), and update booking statuses.",
    )
    add_body(
        doc,
        "The application uses TypeScript for type safety, Tailwind CSS and shadcn/ui for "
        "responsive UI components, and JSON files for data persistence instead of a "
        "production database. Authentication is implemented using HMAC-signed HTTP-only "
        "session cookies with middleware-based route protection. Server Actions handle "
        "booking creation and admin mutations with server-side file writes.",
    )
    add_body(
        doc,
        "This POC demonstrates the complete product flow from catalog browsing through "
        "booking and administration. It is intended for local demonstration and learning "
        "purposes only and is not production-ready due to plain-text password storage "
        "and file-based persistence limitations.",
    )
    add_page_break(doc)

    # INTRODUCTION
    add_section_heading(doc, "INTRODUCTION")
    add_subheading(doc, "5.1 Background")
    add_body(
        doc,
        "The car rental industry increasingly relies on digital platforms to manage fleet "
        "inventory, accept online bookings, and provide customers with self-service access "
        "to vehicle information and reservations. Web applications offer centralized "
        "catalogs, role-based access for staff and customers, and automated price "
        "calculation based on rental duration.",
    )
    add_body(
        doc,
        "Modern full-stack frameworks such as Next.js enable rapid development of such "
        "applications with server-side rendering, API routes, and integrated authentication "
        "patterns suitable for proof-of-concept and prototype deployments.",
    )

    add_subheading(doc, "5.2 Problem Statement")
    add_body(
        doc,
        "Traditional car rental operations often depend on manual phone bookings, paper "
        "records, and disconnected systems for fleet management. Customers lack a unified "
        "interface to browse available vehicles, compare prices, and track their "
        "reservations. Administrators need a single dashboard to monitor bookings and "
        "maintain the car catalog.",
    )
    add_body(
        doc,
        "There is a need for a structured web application that demonstrates the core flows "
        "of an online car rental service: catalog discovery, user authentication, booking "
        "management, and administrative control.",
    )

    add_subheading(doc, "5.3 Objectives")
    objectives = [
        "Build a responsive web application shell with navigation, home page, and mobile-friendly layout (Phase 1).",
        "Implement a car catalog with search and filter capabilities and individual car detail pages (Phase 2).",
        "Provide mock authentication with user and admin roles, session cookies, and protected routes (Phase 3).",
        "Enable authenticated users to create bookings with date selection and automatic price calculation, and view their booking history (Phase 4).",
        "Deliver an admin panel with dashboard statistics, cars CRUD, and booking status management (Phase 5).",
        "Apply UX polish including loading skeletons, error pages, toast notifications, and empty states (Phase 6).",
    ]
    for obj in objectives:
        add_bullet(doc, obj)

    add_subheading(doc, "5.4 Scope of the Project")
    add_body(
        doc,
        "DriveEase is scoped as a local demonstration POC. Data is stored in JSON files "
        "(cars.json, users.json, bookings.json) on the server filesystem. Passwords are "
        "stored in plain text for demo purposes only. The application does not integrate "
        "payment gateways, email notifications, or a production database. All features are "
        "designed to run on a developer machine using npm run dev.",
    )
    add_page_break(doc)

    # SYSTEM ANALYSIS
    add_section_heading(doc, "SYSTEM ANALYSIS")
    add_subheading(doc, "6.1 Existing System")
    add_body(
        doc,
        "In a conventional manual car rental setup, customers contact the agency by phone "
        "or in person to inquire about vehicle availability. Staff maintain records in "
        "spreadsheets or paper logs. Pricing is calculated manually. There is no "
        "self-service portal for customers to browse the fleet or view past bookings.",
    )

    add_subheading(doc, "6.2 Proposed System")
    add_body(
        doc,
        "DriveEase replaces the manual workflow with a single web application. Visitors "
        "browse cars at /cars, filter by criteria, and view details at /cars/[id]. "
        "Logged-in users book cars at /cars/[id]/book and view reservations at "
        "/my-bookings. Administrators manage the fleet and bookings at /admin/dashboard, "
        "/admin/cars, and /admin/bookings.",
    )

    add_subheading(doc, "6.3 User Roles")
    add_table(
        doc,
        ["Role", "Description", "Access"],
        [
            ("Visitor", "Unauthenticated user", "Home, car catalog, car detail"),
            ("User", "Registered customer", "All visitor routes plus booking and my bookings"),
            ("Admin", "Fleet manager", "All user routes plus admin dashboard, cars CRUD, bookings"),
        ],
    )

    add_subheading(doc, "6.4 Feasibility Study")
    add_bullet(doc, "Technical feasibility: Next.js 14, React 18, and TypeScript provide a mature ecosystem.")
    add_bullet(doc, "Operational feasibility: Demo credentials allow immediate testing without registration.")
    add_bullet(doc, "Economic feasibility: The entire stack is open source with no licensing costs for local development.")
    add_page_break(doc)

    # SYSTEM SPECIFICATION
    add_section_heading(doc, "SYSTEM SPECIFICATION")
    add_subheading(doc, "7.1 Hardware Requirements")
    add_table(
        doc,
        ["Component", "Minimum Requirement"],
        [
            ("Processor", "Dual-core CPU or equivalent"),
            ("RAM", "4 GB (8 GB recommended)"),
            ("Storage", "500 MB free disk space"),
            ("Display", "1280×720 or higher"),
            ("Network", "Internet for npm install and external images"),
        ],
    )

    add_subheading(doc, "7.2 Software Requirements")
    add_table(
        doc,
        ["Software", "Version"],
        [
            ("Node.js", "18+ (20 recommended)"),
            ("npm", "Bundled with Node.js"),
            ("Operating System", "Windows, macOS, or Linux"),
            ("Web Browser", "Chrome, Firefox, Edge, or Safari (latest)"),
        ],
    )

    add_subheading(doc, "7.3 Functional Requirements")
    add_table(
        doc,
        ["Phase", "Requirement", "Status"],
        [
            ("1", "Navbar, Footer, mobile nav, home hero", "Implemented"),
            ("2", "10 mock cars, grid listing, search/filter, detail page", "Implemented"),
            ("3", "Mock login, signed session cookie, middleware guards", "Implemented"),
            ("4", "Booking form, price calculation, my bookings page", "Implemented"),
            ("5", "Admin dashboard, cars CRUD, booking status updates", "Implemented"),
            ("6", "Loading skeletons, 404 page, toasts, empty states, README", "Implemented"),
        ],
    )

    add_subheading(doc, "7.4 Non-Functional Requirements")
    add_bullet(doc, "Responsive design using Tailwind CSS breakpoints.")
    add_bullet(doc, "Role-based access control via middleware and layout guards.")
    add_bullet(doc, "Server-side validation for booking dates, credentials, and admin mutations.")
    add_bullet(doc, "Semantic HTML and ARIA attributes for accessibility.")
    add_page_break(doc)

    # SOFTWARE DESCRIPTION
    add_section_heading(doc, "SOFTWARE DESCRIPTION")
    add_subheading(doc, "8.1 Technology Stack")
    add_table(
        doc,
        ["Layer", "Technology", "Purpose"],
        [
            ("Framework", "Next.js 14.2 (App Router)", "Routing, SSR, Server Actions"),
            ("Language", "TypeScript 5", "Static typing"),
            ("UI Library", "React 18", "Component-based UI"),
            ("Styling", "Tailwind CSS 3.4", "Utility-first CSS"),
            ("Components", "shadcn/ui", "Button, Card, Table, Sheet, etc."),
            ("Notifications", "Sonner", "Toast messages"),
            ("Unit Tests", "Vitest 2.1", "Library function tests"),
            ("E2E Tests", "Playwright 1.59", "Browser automation tests"),
            ("Persistence", "JSON files", "cars, users, bookings data"),
        ],
    )

    add_subheading(doc, "8.2 System Architecture")
    add_body(
        doc,
        "The application follows a layered architecture: (1) Presentation layer (app/ + "
        "components/) for pages and UI; (2) Business logic layer (lib/) for auth, data "
        "access, and booking calculations; (3) Data layer (data/*.json) for persistence; "
        "(4) Security layer (middleware.ts) for route protection and session verification.",
    )
    add_body(
        doc,
        "Server Actions in app/actions/ handle mutations (login, logout, create booking, "
        "admin CRUD) and write to JSON files or cookies on the server.",
    )

    add_subheading(doc, "8.3 Key Modules")
    add_table(
        doc,
        ["Module", "Path", "Responsibility"],
        [
            ("Auth", "lib/auth.ts", "Credential verification, session user lookup"),
            ("Session token", "lib/session-token.ts", "HMAC-signed token create/verify"),
            ("Data (read)", "lib/data.ts", "Car listing, filtering, get by ID"),
            ("Cars store (write)", "lib/cars-store.ts", "Admin car CRUD via filesystem"),
            ("Bookings", "lib/bookings.ts", "Read/write bookings, detailed joins"),
            ("Booking math", "lib/booking-math.ts", "Rental days and total price calculation"),
            ("Admin auth", "lib/admin-auth.ts", "Layout-level admin guard"),
            ("Middleware", "middleware.ts", "Login redirect, route protection"),
        ],
    )
    add_page_break(doc)

    # PROJECT DESCRIPTION
    add_section_heading(doc, "PROJECT DESCRIPTION")
    add_subheading(doc, "9.1 Application Routes")
    add_table(
        doc,
        ["Route", "Access", "Description"],
        [
            ("/", "Public", "Home page with hero and Browse Cars button"),
            ("/cars", "Public", "Car catalog with search and filters"),
            ("/cars/[id]", "Public", "Car detail with gallery and Book Now"),
            ("/cars/[id]/book", "Authenticated user", "Booking form with date pickers"),
            ("/login", "Public", "Email/password login for user and admin"),
            ("/my-bookings", "Authenticated user", "Table of user's bookings"),
            ("/admin/dashboard", "Admin", "Statistics and quick actions"),
            ("/admin/cars", "Admin", "Cars list, create, edit, delete"),
            ("/admin/bookings", "Admin", "All bookings with status dropdown"),
        ],
    )

    add_subheading(doc, "9.2 Data Model")
    add_bullet(doc, "User (data/users.json): id, email, password, role, name")
    add_bullet(doc, "Car (data/cars.json): id, name, seats, fuel, price, available, images, description")
    add_bullet(doc, "Booking (data/bookings.json): id, userId, carId, pickupDate, returnDate, totalPrice, status")
    add_body(doc, "Relationships: User places many Bookings; Car appears in many Bookings.")

    add_subheading(doc, "9.3 Phase-wise Implementation")
    phases = [
        "Phase 1 — Layout shell: Root layout with Navbar, Footer, AuthProvider, and Sonner toast provider.",
        "Phase 2 — Catalog: CarsCatalog component with responsive grid, filters, and empty state.",
        "Phase 3 — Authentication: Single /login page with signed HTTP-only cookie and role-based redirect.",
        "Phase 4 — Booking: /cars/[id]/book page with date inputs and automatic price calculation.",
        "Phase 5 — Admin: Dashboard, cars CRUD, and booking status management.",
        "Phase 6 — Polish: Loading skeletons, custom 404, toast notifications, and empty states.",
    ]
    for phase in phases:
        add_bullet(doc, phase)

    add_subheading(doc, "9.4 Authentication and Security")
    add_bullet(doc, "Session tokens are HMAC-signed payloads in an HTTP-only cookie (driveease_session).")
    add_bullet(doc, "Middleware verifies tokens on protected routes before allowing access.")
    add_bullet(doc, "User credentials: user@gmail.com / 123456")
    add_bullet(doc, "Admin credentials: admin@gmail.com / admin123")
    add_body(
        doc,
        "POC limitations: Passwords stored in plain text; no bcrypt hashing. Session secret "
        "defaults to a dev value unless SESSION_SECRET environment variable is set.",
    )

    add_subheading(doc, "9.5 Booking System")
    add_body(
        doc,
        "Users select pickup and return dates. billableRentalDays calculates inclusive rental "
        "days. computeBookingTotal multiplies days by the car's daily price. createBookingAction "
        "validates dates and availability, appends to bookings.json, and redirects to my bookings.",
    )

    add_subheading(doc, "9.6 Admin Panel")
    add_bullet(doc, "Dashboard: Statistics cards for cars and bookings; latest booking summary.")
    add_bullet(doc, "Cars management: Table listing, add/edit forms, delete with confirmation.")
    add_bullet(doc, "Bookings management: Table with status update dropdown via Server Action.")
    add_body(
        doc,
        "Known limitation: Catalog reads cars via static import in data.ts while admin writes "
        "use runtime filesystem in cars-store.ts. Admin car changes may not appear on the public "
        "catalog until application rebuild.",
    )
    add_page_break(doc)

    # SYSTEM TESTING
    add_section_heading(doc, "SYSTEM TESTING")
    add_subheading(doc, "10.1 Unit Testing")
    add_table(
        doc,
        ["Test File", "Coverage"],
        [
            ("lib/data.test.ts", "getAllCars, getCarById, filterCars, distinct fuels/seats"),
            ("lib/bookings.test.ts", "billableRentalDays, computeBookingTotal"),
        ],
    )
    add_body(doc, "Run with: npm run test")

    add_subheading(doc, "10.2 End-to-End Testing")
    add_table(
        doc,
        ["Spec File", "Coverage"],
        [
            ("e2e/home.spec.ts", "Hero, CTA, navbar links"),
            ("e2e/cars.spec.ts", "10 cars, search/filter, empty state"),
            ("e2e/car-detail.spec.ts", "Metadata, Book CTA, unavailable car, 404"),
            ("e2e/login.spec.ts", "Form, invalid credentials, user callback, admin redirect"),
            ("e2e/auth-guard.spec.ts", "Guards on my-bookings, admin, book route"),
            ("e2e/bookings.spec.ts", "Seeded bookings list, create booking flow"),
            ("e2e/admin.spec.ts", "Non-admin blocked, dashboard, car CRUD, status update"),
            ("e2e/phase6.spec.ts", "Custom 404, login error feedback"),
        ],
    )
    add_body(doc, "Run with: npm run test:e2e")

    add_subheading(doc, "10.3 Manual Test Checklist")
    checklist = [
        "Open home page; click Browse Cars; verify 10 cars load.",
        "Filter by fuel type and price; verify results update.",
        "Open car detail; click Book Now while logged out; verify redirect to login.",
        "Log in as user@gmail.com; complete a booking; verify my bookings page.",
        "Log out; log in as admin@gmail.com; verify redirect to admin dashboard.",
        "Add, edit, and delete a car in admin cars page.",
        "Update a booking status in admin bookings page.",
        "Visit invalid URL; verify custom 404 page.",
    ]
    for item in checklist:
        add_bullet(doc, item)
    add_page_break(doc)

    # SYSTEM IMPLEMENTATION
    add_section_heading(doc, "SYSTEM IMPLEMENTATION")
    add_subheading(doc, "11.1 Installation and Setup")
    add_body(doc, "cd car-rental")
    add_body(doc, "npm install")
    add_body(doc, "npm run dev")
    add_body(doc, "Open http://localhost:3000 in a browser.")
    add_body(doc, "Optional: set SESSION_SECRET environment variable for session signing.")

    add_subheading(doc, "11.2 Project Structure")
    structure = """car-rental/
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
├── e2e/                    # Playwright end-to-end tests
├── lib/                    # Business logic and utilities
├── projectplan/            # Phase documentation
├── docs/                   # Project reports
└── middleware.ts           # Route protection"""
    add_body(doc, structure)

    add_subheading(doc, "11.3 Build and Deployment")
    add_body(doc, "npm run lint — Run ESLint")
    add_body(doc, "npm run build — Production build")
    add_body(doc, "npm start — Start production server")
    add_page_break(doc)

    # CONCLUSION
    add_section_heading(doc, "CONCLUSION AND FUTURE ENHANCEMENT")
    add_subheading(doc, "Conclusion")
    add_body(
        doc,
        "DriveEase successfully implements the planned car rental POC across six development "
        "phases. The application delivers a complete customer journey from browsing the fleet "
        "through booking and viewing reservations, as well as a full admin workflow for fleet "
        "and booking management.",
    )

    add_subheading(doc, "Future Enhancements")
    future = [
        "Database integration: Replace JSON files with PostgreSQL or MongoDB.",
        "Secure authentication: Hash passwords with bcrypt; add registration and OAuth.",
        "Payment gateway: Integrate Stripe or Razorpay for online payment.",
        "Email notifications: Send booking confirmation and reminder emails.",
        "Availability calendar: Block dates when cars are already booked.",
        "Image upload: Allow admins to upload car photos.",
        "Catalog sync fix: Unify car read path for immediate admin edit reflection.",
        "Production deployment: Deploy with CI/CD pipeline.",
    ]
    for item in future:
        add_bullet(doc, item)
    add_page_break(doc)

    # APPENDIX
    add_section_heading(doc, "APPENDIX")
    add_subheading(doc, "Appendix A — Route Protection Map")
    add_table(
        doc,
        ["Route Pattern", "Visitor", "User", "Admin"],
        [
            ("/, /cars, /cars/[id]", "Yes", "Yes", "Yes"),
            ("/login", "Yes", "Redirect if logged in", "Redirect if logged in"),
            ("/cars/[id]/book", "Redirect to login", "Yes", "Yes"),
            ("/my-bookings", "Redirect to login", "Yes", "Yes"),
            ("/admin/*", "Redirect to login", "Redirect to home", "Yes"),
        ],
    )

    add_subheading(doc, "Appendix B — Sample Data Structures")
    add_body(
        doc,
        'User: {"id": 1, "email": "user@gmail.com", "password": "123456", '
        '"role": "user", "name": "Demo User"}',
    )
    add_body(
        doc,
        'Car: {"id": 1, "name": "Toyota Innova Crysta", "seats": 7, "fuel": "Diesel", '
        '"price": 4200, "available": true, "images": [...], "description": "..."}',
    )
    add_body(
        doc,
        'Booking: {"id": 1, "userId": 1, "carId": 2, "pickupDate": "2026-04-01", '
        '"returnDate": "2026-04-03", "totalPrice": 8400, "status": "confirmed"}',
    )

    add_subheading(doc, "Appendix C — Screenshot Placeholders")
    screenshots = [
        "Home page — hero section with Browse Cars button",
        "Cars listing — grid with filters",
        "Car detail — gallery and Book Now button",
        "Login page — email and password form",
        "My Bookings — user booking table",
        "Admin Dashboard — statistics cards",
    ]
    for i, s in enumerate(screenshots, 1):
        add_bullet(doc, f"{i}. {s}")

    add_subheading(doc, "Appendix D — npm Scripts Reference")
    add_table(
        doc,
        ["Command", "Description"],
        [
            ("npm run dev", "Start development server"),
            ("npm run build", "Production build"),
            ("npm start", "Start production server"),
            ("npm run lint", "Run ESLint"),
            ("npm run test", "Run Vitest unit tests"),
            ("npm run test:e2e", "Run Playwright e2e tests"),
        ],
    )
    add_page_break(doc)

    # BIBLIOGRAPHY
    add_section_heading(doc, "BIBLIOGRAPHY & REFERENCES")
    refs = [
        "Next.js Documentation — https://nextjs.org/docs",
        "React Documentation — https://react.dev",
        "TypeScript Documentation — https://www.typescriptlang.org/docs",
        "Tailwind CSS Documentation — https://tailwindcss.com/docs",
        "shadcn/ui — https://ui.shadcn.com",
        "Sonner Toast Library — https://sonner.emilkowal.ski",
        "Vitest — https://vitest.dev",
        "Playwright — https://playwright.dev",
        "MDN Web Docs — https://developer.mozilla.org",
    ]
    for i, ref in enumerate(refs, 1):
        add_body(doc, f"{i}. {ref}")

    return doc


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = build_document()
    doc.save(str(OUTPUT))
    print(f"Generated: {OUTPUT}")


if __name__ == "__main__":
    main()
