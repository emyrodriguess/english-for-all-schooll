import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getPublicEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const env = getPublicEnv();

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });

          Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  let profile: {
    active: boolean;
    role: string;
    must_change_password: boolean;
  } | null = null;
  if (userId) {
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("active,role,must_change_password")
      .eq("id", userId)
      .maybeSingle();
    profile = currentProfile;
  }
  const isAuthorized = Boolean(profile?.active && profile.role === "admin");
  const pathname = request.nextUrl.pathname;

  let destination: URL | null = null;
  if (pathname === "/admin") {
    destination = new URL(
      isAuthorized
        ? profile?.must_change_password
          ? "/admin/alterar-senha"
          : "/admin/dashboard"
        : "/admin/login",
      request.url,
    );
  } else if (pathname === "/admin/login" && isAuthorized) {
    destination = new URL(
      profile?.must_change_password
        ? "/admin/alterar-senha"
        : "/admin/dashboard",
      request.url,
    );
  } else if (pathname !== "/admin/login" && !isAuthorized) {
    destination = new URL("/admin/login", request.url);
    const nextPath = `${pathname}${request.nextUrl.search}`;
    if (
      nextPath.startsWith("/admin/") &&
      !nextPath.startsWith("/admin/login")
    ) {
      destination.searchParams.set("next", nextPath);
    }
  } else if (
    isAuthorized &&
    profile?.must_change_password &&
    pathname !== "/admin/alterar-senha"
  ) {
    destination = new URL("/admin/alterar-senha", request.url);
  } else if (
    isAuthorized &&
    !profile?.must_change_password &&
    pathname === "/admin/alterar-senha"
  ) {
    destination = new URL("/admin/dashboard", request.url);
  }

  if (destination) {
    const redirectResponse = NextResponse.redirect(destination);
    response.cookies
      .getAll()
      .forEach((cookie) => redirectResponse.cookies.set(cookie));
    redirectResponse.headers.set(
      "Cache-Control",
      "private, no-store, max-age=0, must-revalidate",
    );
    return redirectResponse;
  }

  response.headers.set(
    "Cache-Control",
    "private, no-store, max-age=0, must-revalidate",
  );
  return response;
}
