import { CarsCatalog } from "@/components/cars-catalog";
import { getAllCars } from "@/lib/data";

export default async function CarsPage() {
  const cars = await getAllCars();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Browse cars
        </h1>
        <p className="mt-3 text-muted-foreground">
          Filter by name, fuel, seats, or max daily rate. Listings are loaded
          from your Supabase database.
        </p>
      </div>
      <CarsCatalog cars={cars} />
    </div>
  );
}
