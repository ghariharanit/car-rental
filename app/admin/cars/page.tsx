import type { Metadata } from "next";
import Link from "next/link";
import { createCarAction, updateCarAction } from "@/app/actions/admin";
import { AdminMutationToast } from "@/components/admin/admin-mutation-toast";
import { DeleteCarButton } from "@/components/admin/delete-car-button";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAdminUser } from "@/lib/admin-auth";
import { getCarForAdmin, readCars } from "@/lib/cars-store";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin cars",
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function AdminCarForm({
  mode,
  action,
  car,
}: {
  mode: "create" | "edit";
  action: (formData: FormData) => void;
  car?: {
    id: number;
    name: string;
    seats: number;
    fuel: string;
    price: number;
    available: boolean;
    images: string[];
    description: string;
  };
}) {
  const isEdit = mode === "edit";

  return (
    <form action={action} className="grid gap-4">
      {isEdit ? <input type="hidden" name="id" value={car?.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`${mode}-name`}>Car name</Label>
          <Input
            id={`${mode}-name`}
            name="name"
            defaultValue={car?.name ?? ""}
            placeholder="Toyota Camry Hybrid"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${mode}-fuel`}>Fuel</Label>
          <Input
            id={`${mode}-fuel`}
            name="fuel"
            defaultValue={car?.fuel ?? ""}
            placeholder="Petrol"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${mode}-seats`}>Seats</Label>
          <Input
            id={`${mode}-seats`}
            name="seats"
            type="number"
            min={2}
            defaultValue={car?.seats ?? 5}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${mode}-price`}>Daily price (INR)</Label>
          <Input
            id={`${mode}-price`}
            name="price"
            type="number"
            min={1}
            defaultValue={car?.price ?? 2500}
            required
          />
        </div>

        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              name="available"
              defaultChecked={car?.available ?? true}
              className="size-4 rounded border-border"
            />
            Available for booking
          </label>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`${mode}-images`}>Image URLs</Label>
          <textarea
            id={`${mode}-images`}
            name="images"
            defaultValue={car?.images.join("\n") ?? ""}
            rows={4}
            className="flex min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder="One URL per line"
            required
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`${mode}-description`}>Description</Label>
          <textarea
            id={`${mode}-description`}
            name="description"
            defaultValue={car?.description ?? ""}
            rows={5}
            className="flex min-h-28 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder="Short marketing description"
            required
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit">{isEdit ? "Save changes" : "Add car"}</Button>
        {isEdit ? (
          <Link
            href="/admin/cars"
            className={cn(buttonVariants({ variant: "outline" }), "inline-flex")}
          >
            Cancel
          </Link>
        ) : null}
      </div>
    </form>
  );
}

export default async function AdminCarsPage({
  searchParams,
}: {
  searchParams?: {
    edit?: string;
    error?: string;
    created?: string;
    updated?: string;
    deleted?: string;
  };
}) {
  await requireAdminUser();

  const cars = await readCars();
  const editId = Number.parseInt(searchParams?.edit ?? "", 10);
  const selectedCar = Number.isFinite(editId)
    ? await getCarForAdmin(editId)
    : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage cars</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Create, edit, or remove cars stored in Supabase.
          </p>
        </div>
        <Badge variant="outline">{cars.length} cars</Badge>
      </div>
      <AdminMutationToast />

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Cars inventory</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Fuel</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell className="font-medium">{car.name}</TableCell>
                    <TableCell>{car.fuel}</TableCell>
                    <TableCell>{car.seats}</TableCell>
                    <TableCell>{formatInr(car.price)}</TableCell>
                    <TableCell>
                      <Badge variant={car.available ? "outline" : "secondary"}>
                        {car.available ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/cars?edit=${car.id}`}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                            "inline-flex"
                          )}
                        >
                          Edit
                        </Link>
                        <DeleteCarButton id={car.id} name={car.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{selectedCar ? `Edit ${selectedCar.name}` : "Add a new car"}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCar ? (
              <AdminCarForm mode="edit" action={updateCarAction} car={selectedCar} />
            ) : (
              <AdminCarForm mode="create" action={createCarAction} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
