import prisma from "@/prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Status, { MethodNotALlowed } from "@/lib/http";

export async function POST(request: Request, context: any) {
	const cookie = cookies();
	const JwtToken = cookie.get("token");
	// const user = await prisma.user.findFirst();
	const secret: string = String(process.env.JWT_SECRET); // get public key
	const token = JwtToken?.value;

	if (token) {
		try {
			const { user, exp } = <jwt.JwtPayload>(
				jwt.verify(`${token}`, `${secret}`)
			);

			return new Response(
				JSON.stringify({
					success: true,
					status: Status.HTTP_NOT_ACCEPTABLE,
					message: "Already logged in.",
				}),
				{
					status: Status.HTTP_NOT_ACCEPTABLE,
					headers: {
						"Set-Cookie": `token=${token}; Secure; Path=/; Domain=localhost`,
					},
				}
			);
		} catch (error) {
			// go next step
		}
	}

	try {
		const { name, email, password } = await request.json();

		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (user) {
			return new Response(
				JSON.stringify({
					success: false,
					status: Status.HTTP_BAD_REQUEST,
					message: "User already exist.",
				}),
				{
					status: Status.HTTP_BAD_REQUEST,
				}
			);
		} else {
			const user = await prisma.user.create({
				data: {
					name,
					email,
					password,
				},
			});

			const timeout: number =
				parseInt(`${process.env.JWT_TIMEOUT}`) || 60;

			const token = jwt.sign(
				{
					user: {
						name: user?.name,
						email: user?.email,
						role: "user",
					},
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
					status: Status.HTTP_CREATED,
					data: {
						name,
						email,
						password,
						user,
					},
				}),
				{
					status: Status.HTTP_CREATED,
					headers: {
						// "Set-Cookie": `token=${token}; Secure; Path=/; Domain=localhost`,
						"Set-Cookie": `token=${token}; Path=/;`,
					},
				}
			);
		}
	} catch (error) {
		return new Response(
			JSON.stringify({
				success: true,
				status: Status.HTTP_BAD_REQUEST,
				message: "Bad request.",
			}),
			{
				status: Status.HTTP_BAD_REQUEST,
			}
		);
	}
}

export {
	MethodNotALlowed as GET,
	MethodNotALlowed as PUT,
	MethodNotALlowed as PATCH,
	MethodNotALlowed as DELETE,
	MethodNotALlowed as OPTIONS,
};
