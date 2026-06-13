import Link from "next/link";
import { notFound } from "next/navigation";
import { CarImageGallery } from "@/components/car-image-gallery";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { getCarById } from "@/lib/data";
import { getSessionUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const car = await getCarById(params.id);
  if (!car) return { title: "Car not found" };
  return {
    title: car.name,
    description: car.description.slice(0, 160),
  };
}

export default async function CarDetailPage({ params }: Props) {
  const car = await getCarById(params.id);
  if (!car) notFound();

  const session = await getSessionUser();
  const bookPath = `/cars/${params.id}/book`;
  const loginCallback = `/login?callbackUrl=${encodeURIComponent(bookPath)}`;
  const bookHref = session != null ? bookPath : loginCallback;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/cars"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-8 -ml-2 text-muted-foreground"
        )}
      >
        ← Back to cars
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <CarImageGallery name={car.name} images={car.images} />

        <div className="flex flex-col">
          <div className="flex flex-wrap items-start gap-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {car.name}
            </h1>
            <Badge variant={car.available ? "default" : "secondary"}>
              {car.available ? "Available" : "Unavailable"}
            </Badge>
          </div>

          <Separator className="my-6" />

          <dl className="grid grid-cols-2 gap-4 text-sm sm:max-w-md">
            <div>
              <dt className="text-muted-foreground">Seats</dt>
              <dd className="mt-1 font-medium">{car.seats}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Fuel</dt>
              <dd className="mt-1 font-medium">{car.fuel}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">Price per day</dt>
              <dd className="mt-1 text-lg font-semibold text-foreground">
                {formatInr(car.price)}
              </dd>
            </div>
          </dl>

          <Separator className="my-6" />

          <div>
            <h2 className="text-sm font-medium text-muted-foreground">
              Description
            </h2>
            <p className="mt-2 leading-relaxed text-foreground">
              {car.description}
            </p>
          </div>

          <div className="mt-auto pt-10">
            <Link
              href={bookHref}
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full justify-center sm:w-auto",
                !car.available && "pointer-events-none opacity-50"
              )}
              aria-disabled={!car.available}
            >
              Book Now
            </Link>
            <p className="mt-3 text-xs text-muted-foreground">
              {session
                ? "Choose pickup and return dates on the next step."
                : "Sign in to continue. After login you will open the booking form for this car."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
