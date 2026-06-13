export type Car = {
  id: number;
  name: string;
  seats: number;
  fuel: string;
  price: number;
  available: boolean;
  images: string[];
  description: string;
};

export function mapCarRow(row: {
  id: number;
  name: string;
  seats: number;
  fuel: string;
  price: number;
  available: boolean;
  images: string[];
  description: string;
}): Car {
  return {
    id: row.id,
    name: row.name,
    seats: row.seats,
    fuel: row.fuel,
    price: row.price,
    available: row.available,
    images: row.images ?? [],
    description: row.description,
  };
}

export function getDistinctFuels(carsList: Car[]): string[] {
  return Array.from(new Set(carsList.map((c) => c.fuel))).sort();
}

export function getDistinctSeatCounts(carsList: Car[]): number[] {
  return Array.from(new Set(carsList.map((c) => c.seats))).sort(
    (a, b) => a - b
  );
}

export type CarFilterState = {
  query: string;
  fuel: string;
  seats: string;
  maxPrice: string;
};

export function filterCars(list: Car[], f: CarFilterState): Car[] {
  const q = f.query.trim().toLowerCase();
  return list.filter((car) => {
    if (q && !car.name.toLowerCase().includes(q)) return false;
    if (f.fuel !== "all" && car.fuel !== f.fuel) return false;
    if (f.seats !== "all" && String(car.seats) !== f.seats) return false;
    if (f.maxPrice !== "all") {
      const max = Number(f.maxPrice);
      if (!Number.isNaN(max) && car.price > max) return false;
    }
    return true;
  });
}
