"use server";

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { computeBookingTotal } from "@/lib/booking-math";
import { appendBooking } from "@/lib/bookings";
import { getCarById } from "@/lib/data";

export async function createBookingAction(
  formData: FormData
): Promise<{ error: string } | void> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must be signed in to book." };
  }

  const carIdRaw = formData.get("carId");
  const carId =
    typeof carIdRaw === "string" ? Number.parseInt(carIdRaw, 10) : NaN;
  const pickupDate = String(formData.get("pickupDate") ?? "").trim();
  const returnDate = String(formData.get("returnDate") ?? "").trim();

  if (!Number.isFinite(carId) || carId < 1) {
    return { error: "Invalid car." };
  }

  const car = await getCarById(carId);
  if (!car) {
    return { error: "Car not found." };
  }
  if (!car.available) {
    return { error: "This vehicle is not available for booking." };
  }

  const totals = computeBookingTotal(car.price, pickupDate, returnDate);
  if (!totals) {
    return {
      error: "Pick valid pickup and return dates (return on or after pickup).",
    };
  }

  await appendBooking({
    userId: user.id,
    carId,
    pickupDate,
    returnDate,
    totalPrice: totals.totalPrice,
    status: "confirmed",
  });

  redirect("/my-bookings?booked=1");
}
