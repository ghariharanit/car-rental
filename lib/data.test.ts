import { describe, expect, it } from "vitest";
import {
  filterCars,
  getDistinctFuels,
  getDistinctSeatCounts,
  type Car,
} from "./car-catalog";

const sampleCars: Car[] = [
  {
    id: 1,
    name: "Maruti Swift",
    seats: 5,
    fuel: "Petrol",
    price: 1650,
    available: true,
    images: [],
    description: "Compact hatch",
  },
  {
    id: 2,
    name: "Tata Nexon EV",
    seats: 5,
    fuel: "Electric",
    price: 3800,
    available: true,
    images: [],
    description: "Electric SUV",
  },
  {
    id: 3,
    name: "Toyota Innova Crysta",
    seats: 7,
    fuel: "Diesel",
    price: 4200,
    available: true,
    images: [],
    description: "Family MPV",
  },
];

describe("getDistinctFuels / getDistinctSeatCounts", () => {
  it("returns sorted unique fuels", () => {
    const fuels = getDistinctFuels(sampleCars);
    expect(fuels).toEqual(["Diesel", "Electric", "Petrol"]);
  });

  it("returns sorted unique seat counts", () => {
    const seats = getDistinctSeatCounts(sampleCars);
    expect(seats).toEqual([5, 7]);
  });
});

describe("filterCars", () => {
  it("filters by case-insensitive name substring", () => {
    const out = filterCars(sampleCars, {
      query: "swift",
      fuel: "all",
      seats: "all",
      maxPrice: "all",
    });
    expect(out).toHaveLength(1);
    expect(out[0]?.name).toBe("Maruti Swift");
  });

  it("filters by fuel", () => {
    const out = filterCars(sampleCars, {
      query: "",
      fuel: "Electric",
      seats: "all",
      maxPrice: "all",
    });
    expect(out.every((c) => c.fuel === "Electric")).toBe(true);
  });

  it("filters by seats", () => {
    const out = filterCars(sampleCars, {
      query: "",
      fuel: "all",
      seats: "7",
      maxPrice: "all",
    });
    expect(out.every((c) => c.seats === 7)).toBe(true);
  });

  it("filters by max price cap", () => {
    const out = filterCars(sampleCars, {
      query: "",
      fuel: "all",
      seats: "all",
      maxPrice: "2000",
    });
    expect(out.every((c) => c.price <= 2000)).toBe(true);
  });

  it("returns empty when nothing matches", () => {
    const out = filterCars(sampleCars, {
      query: "zzznomatchzzz",
      fuel: "all",
      seats: "all",
      maxPrice: "all",
    });
    expect(out).toEqual([]);
  });
});
