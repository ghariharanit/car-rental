"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function safeCallbackUrl(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== "string") return null;
  const t = raw.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return null;
  return t;
}

function withQuery(path: string, key: string, value: string): string {
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
}

export async function loginAction(formData: FormData): Promise<{
  error: string;
} | void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const callbackRaw = String(formData.get("callbackUrl") ?? "").trim();
  const callback = safeCallbackUrl(callbackRaw);

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Invalid email or password." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role =
    user?.app_metadata?.role === "admin" ? "admin" : "user";

  if (role === "admin") {
    redirect(withQuery("/admin/dashboard", "loggedIn", "1"));
  }

  const dest = callback && callback !== "/login" ? callback : "/";
  redirect(withQuery(dest, "loggedIn", "1"));
}

export async function logoutAction(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/?loggedOut=1");
}
