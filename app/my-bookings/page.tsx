import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { MyBookingsBookedToast } from "@/components/my-bookings-booked-toast";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSessionUser } from "@/lib/auth";
import { getBookingsWithCarForUser } from "@/lib/bookings";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My bookings",
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function MyBookingsPage() {
  const user = await getSessionUser();
  const rows = user ? await getBookingsWithCarForUser(user.id) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Suspense fallback={null}>
        <MyBookingsBookedToast />
      </Suspense>

      <h1 className="text-3xl font-bold tracking-tight">My bookings</h1>
      <p className="mt-3 text-muted-foreground">
        Signed in as{" "}
        <span className="font-medium text-foreground">{user?.email}</span>.
      </p>

      {rows.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            You do not have any bookings yet.
          </p>
          <Link
            href="/cars"
            className={cn(buttonVariants(), "mt-6 inline-flex")}
          >
            Browse cars
          </Link>
        </div>
      ) : (
        <div className="mt-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Car</TableHead>
                <TableHead>Pickup</TableHead>
                <TableHead>Return</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.carName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {b.pickupDate}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {b.returnDate}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatInr(b.totalPrice)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {b.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
