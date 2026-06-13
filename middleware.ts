import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

function isCarBookPath(pathname: string): boolean {
  return /^\/cars\/[^/]+\/book$/.test(pathname);
}

function needsAuthCheck(pathname: string): boolean {
  return (
    pathname.startsWith("/login") ||
    pathname.startsWith("/my-bookings") ||
    pathname.startsWith("/admin") ||
    isCarBookPath(pathname)
  );
}

function getUserRole(user: {
  app_metadata?: Record<string, unknown>;
}): "user" | "admin" {
  return user.app_metadata?.role === "admin" ? "admin" : "user";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!needsAuthCheck(pathname)) {
    return updateSession(request);
  }

  const supabaseResponse = await updateSession(request);
  const { createServerClient } = await import("@supabase/ssr");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = user ? getUserRole(user) : null;

  if (pathname.startsWith("/login")) {
    if (user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = role === "admin" ? "/admin/dashboard" : "/";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
    return supabaseResponse;
  }

  if (pathname.startsWith("/admin")) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    if (role !== "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
    return supabaseResponse;
  }

  if (pathname.startsWith("/my-bookings") || isCarBookPath(pathname)) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return supabaseResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2)$).*)",
  ],
};
