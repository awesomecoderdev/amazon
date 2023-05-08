import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RequestCookies {
	get(cookie: string): object;
}

function isAuthenticated(request: any) {
	return false;
}

// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest) {
	const { cookies, nextUrl } = req;
	const { pathname } = nextUrl;
	const JwtToken = cookies.get("token");
	const token = JwtToken?.value;
	var secret = process.env.JWT_SECRET; // get public key

	const isAuth = JwtToken?.value;

	const sensitiveRoutes = ["/dashboard"];
	const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
		pathname.startsWith(route)
	);

	const authRoutes = ["/login", "/register"];
	const isAuthSensitiveRoute = authRoutes.some((route) =>
		pathname.startsWith(route)
	);

	if (isAuthSensitiveRoute) {
		if (isAuth) {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}
		return NextResponse.next();
	}

	if (!isAuth && isAccessingSensitiveRoute) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	// if (pathname === "/") {
	// 	return NextResponse.redirect(new URL("/dashboard", req.url));
	// }

	// You can also set request headers in NextResponse.rewrite
	const response = NextResponse.next();
	// response.headers.set("token", String(token))
	return response;
}

// See "Matching Paths" below to learn more
// export const config = {
// 	matcher: "/about/:path*",
// };

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|vercel.svg|_next/static|_next/image|favicon.ico).*)",
	],
};
