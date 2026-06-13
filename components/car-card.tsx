import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/lib/car-catalog";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function CarCard({ car }: { car: Car }) {
  const src = car.images[0] ?? "";

  return (
    <Card className="h-full overflow-hidden pt-0 transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-muted">
        {src ? (
          <Image
            src={src}
            alt={car.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
        {!car.available ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[2px]">
            <Badge variant="secondary">Unavailable</Badge>
          </div>
        ) : null}
      </div>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{car.name}</CardTitle>
          <Badge variant="outline" className="shrink-0 font-normal">
            {car.fuel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 pb-2 text-sm text-muted-foreground">
        <p>{car.seats} seats</p>
        <p className="font-medium text-foreground">
          {formatInr(car.price)}
          <span className="font-normal text-muted-foreground"> / day</span>
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Link
          href={`/cars/${car.id}`}
          className={cn(buttonVariants(), "w-full justify-center")}
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
