import { createClient } from "@/lib/supabase/server";
import type { Car } from "@/lib/car-catalog";
import { mapCarRow } from "@/lib/car-catalog";

export async function readCars(): Promise<Car[]> {
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

export async function getCarForAdmin(id: number): Promise<Car | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load car: ${error.message}`);
  }

  return data ? mapCarRow(data) : undefined;
}

export async function createCar(input: Omit<Car, "id">): Promise<Car> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cars")
    .insert(input)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Failed to create car: ${error?.message ?? "unknown"}`);
  }

  return mapCarRow(data);
}

export async function updateCar(
  id: number,
  input: Omit<Car, "id">
): Promise<Car | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cars")
    .update(input)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update car: ${error.message}`);
  }

  return data ? mapCarRow(data) : null;
}

export async function deleteCar(id: number): Promise<boolean> {
  const supabase = createClient();
  const { error, count } = await supabase
    .from("cars")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete car: ${error.message}`);
  }

  return (count ?? 0) > 0;
}

export async function getCarStats() {
  const supabase = createClient();
  const { count: totalCars, error: totalError } = await supabase
    .from("cars")
    .select("*", { count: "exact", head: true });

  if (totalError) {
    throw new Error(`Failed to count cars: ${totalError.message}`);
  }

  const { count: availableCars, error: availableError } = await supabase
    .from("cars")
    .select("*", { count: "exact", head: true })
    .eq("available", true);

  if (availableError) {
    throw new Error(`Failed to count available cars: ${availableError.message}`);
  }

  const total = totalCars ?? 0;
  const available = availableCars ?? 0;

  return {
    totalCars: total,
    availableCars: available,
    unavailableCars: total - available,
  };
}
