"use client";

import { useMemo, useState } from "react";
import type { Car } from "@/lib/car-catalog";
import {
  filterCars,
  getDistinctFuels,
  getDistinctSeatCounts,
} from "@/lib/car-catalog";
import { CarCard } from "@/components/car-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRICE_CAPS = [
  { value: "all", label: "Any daily rate" },
  { value: "2000", label: "Up to ₹2,000 / day" },
  { value: "3500", label: "Up to ₹3,500 / day" },
  { value: "5000", label: "Up to ₹5,000 / day" },
  { value: "8000", label: "Up to ₹8,000 / day" },
] as const;

export function CarsCatalog({ cars }: { cars: Car[] }) {
  const [query, setQuery] = useState("");
  const [fuel, setFuel] = useState<string>("all");
  const [seats, setSeats] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<string>("all");

  const fuels = useMemo(() => getDistinctFuels(cars), [cars]);
  const seatOptions = useMemo(() => getDistinctSeatCounts(cars), [cars]);

  const filtered = useMemo(
    () =>
      filterCars(cars, {
        query,
        fuel,
        seats,
        maxPrice,
      }),
    [cars, query, fuel, seats, maxPrice]
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="car-search">Search by name</Label>
          <Input
            id="car-search"
            placeholder="e.g. Swift, BMW…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label>Fuel</Label>
          <Select value={fuel} onValueChange={(v) => setFuel(v ?? "all")}>
            <SelectTrigger className="w-full min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All fuels</SelectItem>
              {fuels.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Seats</Label>
          <Select value={seats} onValueChange={(v) => setSeats(v ?? "all")}>
            <SelectTrigger className="w-full min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              {seatOptions.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} seats
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Max price</Label>
          <Select
            value={maxPrice}
            onValueChange={(v) => setMaxPrice(v ?? "all")}
          >
            <SelectTrigger className="w-full min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRICE_CAPS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {cars.length} vehicles
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
          <p className="font-medium text-foreground">No cars match your filters</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try clearing the search or choosing “All” for fuel, seats, or max
            price.
          </p>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((car) => (
            <li key={car.id}>
              <CarCard car={car} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
