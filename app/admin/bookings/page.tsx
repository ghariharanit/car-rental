import type { Metadata } from "next";
import { updateBookingStatusAction } from "@/app/actions/admin";
import { AdminMutationToast } from "@/components/admin/admin-mutation-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAdminUser } from "@/lib/admin-auth";
import { BOOKING_STATUSES, getAllBookingsDetailed } from "@/lib/bookings";

export const metadata: Metadata = {
  title: "Admin bookings",
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function AdminBookingsPage() {
  await requireAdminUser();
  const bookings = await getAllBookingsDetailed();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage bookings</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Review all reservations and update their status from one place.
          </p>
        </div>
        <Badge variant="outline">{bookings.length} bookings</Badge>
      </div>
      <AdminMutationToast />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>All bookings</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Car</TableHead>
                <TableHead>Pickup</TableHead>
                <TableHead>Return</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>#{booking.id}</TableCell>
                  <TableCell>
                    <div className="min-w-44">
                      <p className="font-medium">{booking.userName}</p>
                      <p className="text-xs text-muted-foreground">{booking.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{booking.carName}</TableCell>
                  <TableCell>{booking.pickupDate}</TableCell>
                  <TableCell>{booking.returnDate}</TableCell>
                  <TableCell>{formatInr(booking.totalPrice)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <form
                      action={updateBookingStatusAction}
                      className="flex min-w-56 justify-end gap-2"
                    >
                      <input type="hidden" name="id" value={booking.id} />
                      <select
                        name="status"
                        defaultValue={booking.status}
                        aria-label={`Status for booking ${booking.id}`}
                        className="h-8 rounded-lg border border-input bg-background px-3 text-sm"
                      >
                        {BOOKING_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <Button type="submit" variant="outline" size="sm">
                        Save
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
