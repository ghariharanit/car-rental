import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllBookingsDetailed } from "@/lib/bookings";
import { requireAdminUser } from "@/lib/admin-auth";
import { getCarStats } from "@/lib/cars-store";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default async function AdminDashboardPage() {
  const user = await requireAdminUser();
  const carStats = await getCarStats();
  const bookings = await getAllBookingsDetailed();
  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed").length;
  const latestBooking = bookings[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-bold tracking-tight">Admin dashboard</h1>
      <p className="mt-3 text-muted-foreground">
        Welcome,{" "}
        <span className="font-medium text-foreground">{user?.name}</span>.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total cars</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{carStats.totalCars}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Available cars</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{carStats.availableCars}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{bookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Confirmed bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{confirmedBookings}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link href="/admin/cars" className={cn(buttonVariants(), "inline-flex")}>
              Manage cars
            </Link>
            <Link
              href="/admin/bookings"
              className={cn(buttonVariants({ variant: "outline" }), "inline-flex")}
            >
              Review bookings
            </Link>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "ghost" }), "inline-flex")}
            >
              Back to site
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest booking</CardTitle>
          </CardHeader>
          <CardContent>
            {latestBooking ? (
              <div className="space-y-1 text-sm">
                <p className="font-medium text-foreground">{latestBooking.carName}</p>
                <p className="text-muted-foreground">{latestBooking.userEmail}</p>
                <p className="text-muted-foreground">
                  {latestBooking.pickupDate} to {latestBooking.returnDate}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No bookings yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
