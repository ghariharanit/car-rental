import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createAdminClient } from "../lib/supabase/admin";

type SeedCar = {
  id: number;
  name: string;
  seats: number;
  fuel: string;
  price: number;
  available: boolean;
  images: string[];
  description: string;
};

type SeedBooking = {
  id: number;
  userId: number;
  carId: number;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
  status: string;
};

const DEMO_USERS = [
  {
    email: "user@gmail.com",
    password: "123456",
    name: "Demo User",
    role: "user" as const,
  },
  {
    email: "admin@gmail.com",
    password: "admin123",
    name: "Admin",
    role: "admin" as const,
  },
];

function loadJson<T>(relativePath: string): T {
  const filePath = resolve(process.cwd(), relativePath);
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

async function findUserIdByEmail(
  admin: ReturnType<typeof createAdminClient>,
  email: string
): Promise<string | null> {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error) {
    throw new Error(`Failed to list users: ${error.message}`);
  }
  const match = data.users.find(
    (user) => user.email?.toLowerCase() === email.toLowerCase()
  );
  return match?.id ?? null;
}

async function ensureDemoUsers(admin: ReturnType<typeof createAdminClient>) {
  for (const demo of DEMO_USERS) {
    const existingId = await findUserIdByEmail(admin, demo.email);

    if (existingId) {
      await admin.auth.admin.updateUserById(existingId, {
        password: demo.password,
        app_metadata: { role: demo.role },
        user_metadata: { name: demo.name },
      });
      await admin
        .from("profiles")
        .upsert({
          id: existingId,
          name: demo.name,
          email: demo.email,
        });
      console.log(`Updated demo user: ${demo.email}`);
      continue;
    }

    const { data, error } = await admin.auth.admin.createUser({
      email: demo.email,
      password: demo.password,
      email_confirm: true,
      app_metadata: { role: demo.role },
      user_metadata: { name: demo.name },
    });

    if (error || !data.user) {
      throw new Error(
        `Failed to create ${demo.email}: ${error?.message ?? "unknown"}`
      );
    }

    await admin.from("profiles").upsert({
      id: data.user.id,
      name: demo.name,
      email: demo.email,
    });

    console.log(`Created demo user: ${demo.email}`);
  }
}

async function seedCars(admin: ReturnType<typeof createAdminClient>) {
  const cars = loadJson<SeedCar[]>("scripts/seed-data/cars.json");

  const { error: deleteError } = await admin.from("cars").delete().neq("id", 0);
  if (deleteError) {
    throw new Error(`Failed to clear cars: ${deleteError.message}`);
  }

  const { error } = await admin.from("cars").insert(
    cars.map((car) => ({
      id: car.id,
      name: car.name,
      seats: car.seats,
      fuel: car.fuel,
      price: car.price,
      available: car.available,
      images: car.images,
      description: car.description,
    }))
  );

  if (error) {
    throw new Error(`Failed to seed cars: ${error.message}`);
  }

  const { error: seqError } = await admin.rpc("reset_cars_id_seq");
  if (seqError) {
    throw new Error(`Failed to reset cars sequence: ${seqError.message}`);
  }

  console.log(`Seeded ${cars.length} cars`);
}

async function seedBookings(
  admin: ReturnType<typeof createAdminClient>,
  demoUserId: string
) {
  const bookings = loadJson<SeedBooking[]>("scripts/seed-data/bookings.json");

  const { error: deleteError } = await admin
    .from("bookings")
    .delete()
    .neq("id", 0);
  if (deleteError) {
    throw new Error(`Failed to clear bookings: ${deleteError.message}`);
  }

  const { error } = await admin.from("bookings").insert(
    bookings.map((booking) => ({
      id: booking.id,
      user_id: demoUserId,
      car_id: booking.carId,
      pickup_date: booking.pickupDate,
      return_date: booking.returnDate,
      total_price: booking.totalPrice,
      status: booking.status,
    }))
  );

  if (error) {
    throw new Error(`Failed to seed bookings: ${error.message}`);
  }

  const { error: seqError } = await admin.rpc("reset_bookings_id_seq");
  if (seqError) {
    throw new Error(`Failed to reset bookings sequence: ${seqError.message}`);
  }

  console.log(`Seeded ${bookings.length} bookings`);
}

async function main() {
  const admin = createAdminClient();

  console.log("Seeding demo users...");
  await ensureDemoUsers(admin);

  const demoUserId = await findUserIdByEmail(admin, "user@gmail.com");
  if (!demoUserId) {
    throw new Error("Demo user not found after seed");
  }

  console.log("Seeding cars...");
  await seedCars(admin);

  console.log("Seeding bookings...");
  await seedBookings(admin, demoUserId);

  console.log("Seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
