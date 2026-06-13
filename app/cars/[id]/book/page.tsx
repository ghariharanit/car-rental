import Link from "next/link";
import { notFound } from "next/navigation";
import { CarBookingForm } from "@/components/car-booking-form";
import { buttonVariants } from "@/components/ui/button";
import { getCarById } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: { id: string } };

function todayIsoLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const car = await getCarById(params.id);
  if (!car) return { title: "Book car" };
  return { title: `Book ${car.name}` };
}

export default async function BookCarPage({ params }: Props) {
  const car = await getCarById(params.id);
  if (!car) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href={`/cars/${params.id}`}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-8 -ml-2 text-muted-foreground"
        )}
      >
        ← Back to car
      </Link>

      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Reserve this car
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Choose dates for <span className="text-foreground">{car.name}</span>.
        Your booking is saved to Supabase when you confirm.
      </p>

      <div className="mt-10">
        {car.available ? (
          <CarBookingForm
            carId={car.id}
            carName={car.name}
            pricePerDay={car.price}
            minDate={todayIsoLocal()}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            This vehicle is not available.{" "}
            <Link href="/cars" className="font-medium text-foreground underline">
              Browse other cars
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
