import prisma from "@/prisma/client";
import Status from "@/lib/http";
import jwt from "jsonwebtoken";
import fs from "fs";

export async function GET(request: Request) {
	const user = await prisma.user.findFirst();
	// verify a token asymmetric
	if (!fs.existsSync("public.pem")) {
		fs.writeFileSync("public.txt", "Hellow world");
	}
	// var secret = fs.readFileSync("public.pem"); // get public key
	const secret = `${process.env.JWT_SECRET}`;
	const timeout: number = parseInt(`${process.env.JWT_TIMEOUT}`) || 60;

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
	const expired = new Date();
	return new Response(
		JSON.stringify({
			success: true,
			status: Status.HTTP_ACCEPTED,
			message: "Successfully Authorized.",
		}),
		{
			status: Status.HTTP_ACCEPTED,
			headers: {
				"Set-Cookie": `token=${token}; Path=/;`,
				// "Set-Cookie": `token=${token}; Expires=${expired}  Secure; Path=/; Domain=localhost`,
				// "Set-Cookie": `token=${token}; Expires=${expired}; Path=/;`,
			},
		}
	);
}
