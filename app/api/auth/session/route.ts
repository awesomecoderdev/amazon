import jwt from "jsonwebtoken";
import fs from "fs";
import prisma from "@/prisma/client";
import { cookies } from "next/headers";
import Status from "@/lib/http";
import { NextRequest } from "next/server";
declare module "jsonwebtoken" {
	export interface JwtPayload {
		user: object;
	}
}

export const config = {
	runtime: "edge", // for Edge API Routes only
	// runtime: "nodejs", // for Edge API Routes only
};
export const revalidate = 1;
// false | 'force-cache' | 0 | number

export async function GET(request: Request) {
	const cookie = cookies();
	const JwtToken = cookie.get("token");
	// const user = await prisma.user.findFirst();
	// var secret = fs.readFileSync("public.pem"); // get public key
	const secret = `${process.env.JWT_SECRET}`;
	const BearerToken = request.headers
		.get("Authorization")
		?.replace("Bearer ", "");
	// const token = BearerToken ? BearerToken : JwtToken?.value; // that enable bearer token also
	const token = JwtToken?.value;

	// console.log("headers", request.headers);

	// return new Response(
	// 	JSON.stringify({
	// 		success: true,
	// 		status: Status.HTTP_OK,
	// 		token: token ?? "no",
	// 	}),
	// 	{
	// 		status: Status.HTTP_OK,
	// 	}
	// );

	if (!token) {
		const expired = new Date(2000);
		return new Response(
			JSON.stringify({
				success: false,
				status: Status.HTTP_UNAUTHORIZED,
				message: "Unauthorized.",
				// token,
			}),
			{
				status: Status.HTTP_UNAUTHORIZED,
				headers: {
					"Set-Cookie": `token=deleted; Path=/; Expires=${expired};`,
				},
			}
		);
	}

	try {
		const { user, exp } = <jwt.JwtPayload>(
			jwt.verify(`${token}`, `${secret}`)
		);

		return new Response(
			JSON.stringify({
				success: true,
				status: Status.HTTP_ACCEPTED,
				data: {
					// token: token,
					user: user,
				},
			}),
			{
				status: Status.HTTP_ACCEPTED,
				// headers: {
				// 	"Set-Cookie": `token=${token}; Secure; Path=/; Domain=localhost`,
				// },
			}
		);
	} catch (error) {
		const expired = new Date(2000);
		return new Response(
			JSON.stringify({
				success: false,
				status: Status.HTTP_UNAUTHORIZED,
				message: "Unauthorized.",
				// message: error,
			}),
			{
				status: Status.HTTP_UNAUTHORIZED,
				headers: {
					"Set-Cookie": `token=deleted; Path=/; Expires=${expired};`,
				},
			}
		);
	}
}

export async function notAllowed(request: Request) {
	return new Response(
		JSON.stringify({
			success: false,
			status: Status.HTTP_METHOD_NOT_ALLOWED,
			message: "Method Not Allowed.",
		}),
		{
			status: Status.HTTP_METHOD_NOT_ALLOWED,
		}
	);
}

export {
	notAllowed as POST,
	notAllowed as PUT,
	notAllowed as PATCH,
	notAllowed as DELETE,
	notAllowed as OPTIONS,
};
