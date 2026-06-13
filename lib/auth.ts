export type SessionPayload = {
  id: string;
  email: string;
  role: "user" | "admin";
  name: string;
};

function parseRole(value: unknown): "user" | "admin" {
  return value === "admin" ? "admin" : "user";
}

export function mapSupabaseUser(user: {
  id: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}): SessionPayload {
  const name =
    (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
    user.email?.split("@")[0] ||
    "User";

  return {
    id: user.id,
    email: user.email ?? "",
    role: parseRole(user.app_metadata?.role),
    name,
  };
}

export async function getSessionUser(): Promise<SessionPayload | null> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const session = mapSupabaseUser(user);

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.name) {
    session.name = profile.name;
  }

  return session;
}
