import jwt from "jsonwebtoken";
import fs from "fs";
import { cookies } from "next/headers";
import Status from "@/lib/http";
declare module "jsonwebtoken" {
	export interface JwtPayload {
		user: object;
	}
}

export async function GET(request: Request) {
	const cookie = cookies();
	const JwtToken = cookie.get("token");
	// const user = await prisma.user.findFirst();
	var secret = fs.readFileSync("public.pem"); // get public key
	const BearerToken = request.headers
		.get("Authorization")
		?.replace("Bearer ", "");
	// const token = BearerToken ? BearerToken : JwtToken?.value; // that enable bearer token also
	const token = JwtToken?.value;
	var secret = fs.readFileSync("public.pem"); // get public key
	const timeout: number = parseInt(`${process.env.JWT_TIMEOUT}`) || 60;

	if (!token) {
		const expired = new Date(2002);
		return new Response(
			JSON.stringify({
				success: false,
				status: Status.HTTP_UNAUTHORIZED,
				message: "Unauthorized.",
			}),
			{
				status: Status.HTTP_UNAUTHORIZED,
				headers: {
					"Set-Cookie": `token=deleted;Secure; Path=/; Expires=${expired} Domain=localhost`,
				},
			}
		);
	}

	try {
		const { user, exp } = <jwt.JwtPayload>(
			jwt.verify(`${token}`, `${secret}`)
		);

		const refresh = jwt.sign(
			{
				user,
			},
			secret,
			{
				expiresIn: 60 * timeout,
				// expiresIn: 10,
			}
		);

		return new Response(
			JSON.stringify({
				success: true,
				status: Status.HTTP_ACCEPTED,
				data: {
					token: token,
					user: user,
				},
			}),
			{
				status: Status.HTTP_ACCEPTED,
				headers: {
					"Set-Cookie": `token=${refresh}; Secure; Path=/; Domain=localhost`,
				},
			}
		);
	} catch (error) {
		const expired = new Date(2002);
		return new Response(
			JSON.stringify({
				success: false,
				status: Status.HTTP_UNAUTHORIZED,
				message: "Invalid signature",
				// message: error,
			}),
			{
				status: Status.HTTP_UNAUTHORIZED,
				headers: {
					"Set-Cookie": `token=deleted;Secure; Path=/; Expires=${expired} Domain=localhost`,
				},
			}
		);
	}
}
