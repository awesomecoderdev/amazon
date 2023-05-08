import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RequestCookies {
	get(cookie: string): object;
}

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const { cookies, nextUrl } = request;
	const { pathname } = nextUrl;
	const JwtToken = cookies.get("token");
	const token = JwtToken?.value;
	var secret = process.env.JWT_SECRET; // get public key
	// console.log("token", token);

	// console.log({ cookies: cookies.get("token")?.value }); // => 'fast'
	// console.log({ pathname, token });

	// You can also set request headers in NextResponse.rewrite
	const response = NextResponse.next();
	response.headers.set("token", String(token));
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

// import { getToken } from 'next-auth/jwt'
// import { withAuth } from 'next-auth/middleware'
// import { NextResponse } from 'next/server'

// export default withAuth(
//   async function middleware(req) {
//     const pathname = req.nextUrl.pathname

//     // Manage route protection
//     const isAuth = await getToken({ req })
//     const isLoginPage = pathname.startsWith('/login')

//     const sensitiveRoutes = ['/dashboard']
//     const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
//       pathname.startsWith(route)
//     )

//     if (isLoginPage) {
//       if (isAuth) {
//         return NextResponse.redirect(new URL('/dashboard', req.url))
//       }

//       return NextResponse.next()
//     }

//     if (!isAuth && isAccessingSensitiveRoute) {
//       return NextResponse.redirect(new URL('/login', req.url))
//     }

//     if (pathname === '/') {
//       return NextResponse.redirect(new URL('/dashboard', req.url))
//     }
//   },
//   {
//     callbacks: {
//       async authorized() {
//         return true
//       },
//     },
//   }
// )

// export const config = {
//   matchter: ['/', '/login', '/dashboard/:path*'],
// }
