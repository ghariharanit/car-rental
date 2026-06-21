/**
 * Capture application screenshots for docs/driveease-project-report.md
 * Requires: npm run dev (or BASE_URL), seeded Supabase demo data, Playwright browsers.
 */
import { mkdirSync } from "fs";
import { join } from "path";
import { chromium } from "@playwright/test";

const OUT_DIR = join(process.cwd(), "docs", "screenshots");
const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

async function waitForLoginForm(page: import("@playwright/test").Page) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Sign in" }).waitFor({ timeout: 15_000 });
}

async function signInAsAdmin(page: import("@playwright/test").Page) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel("Email").fill("admin@gmail.com");
  await page.getByLabel("Password").fill("admin123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/admin\/dashboard/, { timeout: 30_000 });
}

async function capture(name: string, page: import("@playwright/test").Page) {
  const path = join(OUT_DIR, name);
  await page.screenshot({ path, fullPage: true });
  console.log(`Saved ${path}`);
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });

  await page.goto(BASE_URL);
  await page.waitForLoadState("networkidle");
  await capture("01-home.png", page);

  await page.goto(`${BASE_URL}/cars`);
  await page.waitForLoadState("networkidle");
  await capture("02-cars-catalog.png", page);

  await page.goto(`${BASE_URL}/cars/1`);
  await page.waitForLoadState("networkidle");
  await capture("03-car-detail.png", page);

  await waitForLoginForm(page);
  await page.waitForLoadState("networkidle");
  await capture("04-login.png", page);

  await page.getByLabel("Email").fill("user@gmail.com");
  await page.getByLabel("Password").fill("123456");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), {
    timeout: 30_000,
  });
  await page.goto(`${BASE_URL}/my-bookings`);
  await page.waitForLoadState("networkidle");
  await capture("05-my-bookings.png", page);

  await page.goto(`${BASE_URL}/cars/1/book`);
  await page.waitForLoadState("networkidle");
  await capture("06-booking-form.png", page);

  await browser.close();

  const adminBrowser = await chromium.launch();
  const adminPage = await adminBrowser.newPage({
    viewport: { width: 1280, height: 800 },
  });
  await signInAsAdmin(adminPage);
  await capture("07-admin-dashboard.png", adminPage);

  await adminPage.goto(`${BASE_URL}/admin/cars`);
  await adminPage.waitForLoadState("networkidle");
  await capture("08-admin-cars.png", adminPage);

  await adminPage.goto(`${BASE_URL}/admin/bookings`, {
    waitUntil: "domcontentloaded",
  });
  await adminPage.getByRole("heading", { level: 1 }).waitFor({ timeout: 15_000 });
  await adminPage.waitForLoadState("networkidle");
  await capture("09-admin-bookings.png", adminPage);

  await adminBrowser.close();
  console.log("Done. Add Supabase/Vercel screenshots manually as 10-supabase-tables.png and 11-vercel-deploy.png if needed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
