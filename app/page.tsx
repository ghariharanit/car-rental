import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-muted/40"
        aria-hidden
      />
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28 md:py-36">
        <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Rent with confidence
        </p>
        <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Find Your Perfect Rental Car
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
          Browse our fleet, compare daily rates, and book in minutes — fast,
          simple, and secure.
        </p>
        <Link
          href="/cars"
          className={cn(buttonVariants({ size: "lg" }), "mt-10")}
        >
          Browse Cars
        </Link>
      </div>
    </section>
  );
}
