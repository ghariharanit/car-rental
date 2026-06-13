import { createClient } from "@/lib/supabase/server";

export type Booking = {
  id: number;
  userId: string;
  carId: number;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
  status: string;
};

export { computeBookingTotal, billableRentalDays } from "@/lib/booking-math";
export const BOOKING_STATUSES = [
  "confirmed",
  "pending",
  "completed",
  "cancelled",
] as const;

type BookingRow = {
  id: number;
  user_id: string;
  car_id: number;
  pickup_date: string;
  return_date: string;
  total_price: number;
  status: string;
};

function mapBookingRow(row: BookingRow): Booking {
  return {
    id: row.id,
    userId: row.user_id,
    carId: row.car_id,
    pickupDate: row.pickup_date,
    returnDate: row.return_date,
    totalPrice: row.total_price,
    status: row.status,
  };
}

export async function readBookings(): Promise<Booking[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    throw new Error(`Failed to load bookings: ${error.message}`);
  }

  return (data ?? []).map(mapBookingRow);
}

export async function getBookingsForUser(userId: string): Promise<Booking[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", userId)
    .order("id", { ascending: false });

  if (error) {
    throw new Error(`Failed to load bookings: ${error.message}`);
  }

  return (data ?? []).map(mapBookingRow);
}

export type BookingWithCar = Booking & { carName: string };

export async function getBookingsWithCarForUser(
  userId: string
): Promise<BookingWithCar[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cars(name)")
    .eq("user_id", userId)
    .order("id", { ascending: false });

  if (error) {
    throw new Error(`Failed to load bookings: ${error.message}`);
  }

  return (data ?? []).map((row) => {
    const cars = row.cars as { name: string } | { name: string }[] | null;
    const carName = Array.isArray(cars)
      ? cars[0]?.name
      : cars?.name;

    return {
      ...mapBookingRow(row as BookingRow),
      carName: carName ?? `Car #${row.car_id}`,
    };
  });
}

export async function appendBooking(row: Omit<Booking, "id">): Promise<Booking> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      user_id: row.userId,
      car_id: row.carId,
      pickup_date: row.pickupDate,
      return_date: row.returnDate,
      total_price: row.totalPrice,
      status: row.status,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Failed to create booking: ${error?.message ?? "unknown"}`);
  }

  return mapBookingRow(data);
}

export type AdminBookingRow = Booking & {
  userEmail: string;
  userName: string;
  carName: string;
};

export async function getAllBookingsDetailed(): Promise<AdminBookingRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cars(name), profiles(name, email)")
    .order("id", { ascending: false });

  if (error) {
    throw new Error(`Failed to load bookings: ${error.message}`);
  }

  return (data ?? []).map((row) => {
    const cars = row.cars as { name: string } | { name: string }[] | null;
    const profiles = row.profiles as
      | { name: string; email: string | null }
      | { name: string; email: string | null }[]
      | null;
    const carName = Array.isArray(cars) ? cars[0]?.name : cars?.name;
    const profile = Array.isArray(profiles) ? profiles[0] : profiles;
    const booking = mapBookingRow(row as BookingRow);

    return {
      ...booking,
      userEmail: profile?.email ?? `user-${booking.userId.slice(0, 8)}@unknown`,
      userName: profile?.name ?? `User ${booking.userId.slice(0, 8)}`,
      carName: carName ?? `Car #${booking.carId}`,
    };
  });
}

export async function updateBookingStatus(
  id: number,
  status: (typeof BOOKING_STATUSES)[number]
): Promise<Booking | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update booking: ${error.message}`);
  }

  return data ? mapBookingRow(data) : null;
}
