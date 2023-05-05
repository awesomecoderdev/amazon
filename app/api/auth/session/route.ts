import jwt from "jsonwebtoken";
import fs from "fs";
import prisma from "@/prisma/client";
import { cookies } from "next/headers";
import Status from "@/lib/http";
declare module "jsonwebtoken" {
	export interface JwtPayload {
		user: object;
	}
}

export async function GET(request: Request) {
	const cookie = cookies();
	const token = cookie.get("token");
	// const user = await prisma.user.findFirst();
	var secret = fs.readFileSync("public.pem"); // get public key

	if (!token) {
		return new Response(
			JSON.stringify({
				success: false,
				status: Status.HTTP_UNAUTHORIZED,
				message: "Unauthorized.",
			}),
			{
				status: Status.HTTP_UNAUTHORIZED,
			}
		);
	}

	try {
		const { user, exp } = <jwt.JwtPayload>(
			jwt.verify(`${token.value}`, `${secret}`)
		);

		return new Response(
			JSON.stringify({
				success: true,
				status: Status.HTTP_ACCEPTED,
				data: {
					token: token.value,
					user: user,
					date: exp ? new Date(exp * 1000) : new Date(),
				},
			}),
			{
				status: Status.HTTP_ACCEPTED,
				headers: {
					"Set-Cookie": `token=${token.value}; Secure; Path=/; Domain=localhost`,
				},
			}
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				success: false,
				status: Status.HTTP_UNAUTHORIZED,
				message: "Invalid signature",
			}),
			{
				status: Status.HTTP_UNAUTHORIZED,
			}
		);
	}
}
