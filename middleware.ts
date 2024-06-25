import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { protectedPaths } from "./lib/constant";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Add CORS headers to the response
  response.headers.set("Access-Control-Allow-Origin", "https://scouts.perfectgame.org");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return response;
  }


  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables");
    return NextResponse.json(
      { error: "Missing Supabase environment variables" },
      { status: 500 }
    );
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data } = await supabase.auth.getSession();
  const url = new URL(request.url);

  if (data.session) {
    return response;
  } else {
    const isProtectedPath = protectedPaths.some((path) => {
      const regex = new RegExp("^" + (path as string).replace(/:\w+/g, "[^/]+") + "$");
      return regex.test(url.pathname);
    });

    if (isProtectedPath && !url.pathname.startsWith("/auth")) {
      return NextResponse.redirect(
        new URL("/auth?next=" + url.pathname, request.url)
      );
    }
    await supabase.auth.getUser()


    return response;
  }
  
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/auth/:path*",
  ],
};