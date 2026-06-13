import { createClient } from "@/lib/supabase/server";
import { mapCarRow, type Car } from "@/lib/car-catalog";

export type { Car, CarFilterState } from "@/lib/car-catalog";
export {
  filterCars,
  getDistinctFuels,
  getDistinctSeatCounts,
} from "@/lib/car-catalog";

export async function getAllCars(): Promise<Car[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .order("id");

  if (error) {
    throw new Error(`Failed to load cars: ${error.message}`);
  }

  return (data ?? []).map(mapCarRow);
}

export async function getCarById(
  id: string | number
): Promise<Car | undefined> {
  const n = typeof id === "string" ? Number.parseInt(id, 10) : id;
  if (Number.isNaN(n)) return undefined;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", n)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load car: ${error.message}`);
  }

  return data ? mapCarRow(data) : undefined;
}
