"use server";

import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin-auth";
import { BOOKING_STATUSES, updateBookingStatus } from "@/lib/bookings";
import type { Car } from "@/lib/car-catalog";
import { createCar, deleteCar, getCarForAdmin, updateCar } from "@/lib/cars-store";

function parseNumber(raw: FormDataEntryValue | null): number {
  if (typeof raw !== "string") {
    return Number.NaN;
  }
  return Number.parseInt(raw, 10);
}

function parseImages(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string") {
    return [];
  }

  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

type ParsedCarInput =
  | { error: string }
  | { value: Omit<Car, "id"> };

function parseCarInput(formData: FormData): ParsedCarInput {
  const name = String(formData.get("name") ?? "").trim();
  const fuel = String(formData.get("fuel") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const seats = parseNumber(formData.get("seats"));
  const price = parseNumber(formData.get("price"));
  const images = parseImages(formData.get("images"));
  const available = String(formData.get("available") ?? "") === "on";

  if (!name || !fuel || !description) {
    return { error: "Name, fuel, and description are required." } as const;
  }

  if (!Number.isFinite(seats) || seats < 2) {
    return { error: "Seats must be a valid number." } as const;
  }

  if (!Number.isFinite(price) || price < 1) {
    return { error: "Price must be a valid number." } as const;
  }

  if (images.length === 0) {
    return { error: "Add at least one image URL." } as const;
  }

  return {
    value: {
      name,
      seats,
      fuel,
      price,
      available,
      images,
      description,
    },
  } as const;
}

export async function createCarAction(formData: FormData) {
  await requireAdminUser();

  const parsed = parseCarInput(formData);
  if ("error" in parsed) {
    redirect(`/admin/cars?error=${encodeURIComponent(parsed.error)}`);
  }

  await createCar(parsed.value);
  redirect("/admin/cars?created=1");
}

export async function updateCarAction(formData: FormData) {
  await requireAdminUser();

  const id = parseNumber(formData.get("id"));
  if (!Number.isFinite(id)) {
    redirect("/admin/cars?error=Invalid%20car%20id");
  }

  const parsed = parseCarInput(formData);
  if ("error" in parsed) {
    redirect(`/admin/cars?edit=${id}&error=${encodeURIComponent(parsed.error)}`);
  }

  const updated = await updateCar(id, parsed.value);
  if (!updated) {
    redirect("/admin/cars?error=Car%20not%20found");
  }

  redirect(`/admin/cars?updated=${id}`);
}

export async function deleteCarAction(formData: FormData) {
  await requireAdminUser();

  const id = parseNumber(formData.get("id"));
  if (!Number.isFinite(id)) {
    redirect("/admin/cars?error=Invalid%20car%20id");
  }

  const car = await getCarForAdmin(id);
  if (!car) {
    redirect("/admin/cars?error=Car%20not%20found");
  }

  const deleted = await deleteCar(id);
  if (!deleted) {
    redirect("/admin/cars?error=Car%20not%20found");
  }

  redirect("/admin/cars?deleted=1");
}

export async function updateBookingStatusAction(formData: FormData) {
  await requireAdminUser();

  const id = parseNumber(formData.get("id"));
  const status = String(formData.get("status") ?? "").trim();

  if (!Number.isFinite(id)) {
    redirect("/admin/bookings?error=Invalid%20booking%20id");
  }

  if (!BOOKING_STATUSES.includes(status as (typeof BOOKING_STATUSES)[number])) {
    redirect("/admin/bookings?error=Invalid%20status");
  }

  const updated = await updateBookingStatus(
    id,
    status as (typeof BOOKING_STATUSES)[number]
  );

  if (!updated) {
    redirect("/admin/bookings?error=Booking%20not%20found");
  }

  redirect(`/admin/bookings?updated=${id}`);
}
