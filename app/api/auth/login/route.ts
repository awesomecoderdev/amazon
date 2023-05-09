import prisma from "@/prisma/client";
import Status, { MethodNotALlowed } from "@/lib/http";
import jwt from "jsonwebtoken";
import fs from "fs";

export async function POST(request: Request) {
	const secret = `${process.env.JWT_SECRET}`;
	const timeout: number = parseInt(`${process.env.JWT_TIMEOUT}`) || 60;
	const req = await request.json();
	const { uid, email, password, displayName, photoURL, apiKey } = req;
	const encryptedPassword = password ? btoa(`${password}`) : null;

	const user = await prisma.user.findUnique({
		where: {
			email: email,
		},
	});

	if (uid && email && displayName && photoURL && apiKey) {
		if (user) {
			const update = await prisma.user.update({
				where: {
					email: email,
				},
				data: {
					name: displayName,
					avatar: photoURL,
				},
			});

			const token = jwt.sign(
				{
					user: {
						name: displayName,
						email: user?.email,
						avatar: photoURL,
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
		} else {
			const user = await prisma.user.create({
				data: {
					name: displayName,
					email: email,
					password: uid,
					avatar: photoURL,
				},
			});

			const token = jwt.sign(
				{
					user: {
						name: user?.name,
						email: user?.email,
						avatar: user?.avatar,
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
	}

	if (user && email && password == encryptedPassword) {
		const token = jwt.sign(
			{
				user: {
					name: user?.name,
					email: user?.email,
					avatar: user?.avatar,
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

	// verify a token asymmetric
	// if (!fs.existsSync("public.pem")) {
	// 	fs.writeFileSync("public.txt", "Hellow world");
	// }
	// var secret = fs.readFileSync("public.pem"); // get public key
}

export {
	MethodNotALlowed as GET,
	MethodNotALlowed as PUT,
	MethodNotALlowed as PATCH,
	MethodNotALlowed as DELETE,
	MethodNotALlowed as OPTIONS,
};
