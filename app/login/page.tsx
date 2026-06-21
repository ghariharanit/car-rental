import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { getSessionUser } from "@/lib/auth";

type Props = {
  searchParams: { callbackUrl?: string };
};

export default async function LoginPage({ searchParams }: Props) {
  const session = await getSessionUser();
  if (session?.role === "admin") {
    redirect("/admin/dashboard");
  }
  if (session) {
    redirect("/");
  }

  const callbackUrl = searchParams.callbackUrl;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Login</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Sign in with a demo account to book cars, view your reservations, or
        access the admin panel.
      </p>
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  );
}
