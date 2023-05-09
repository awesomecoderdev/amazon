import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Status, { MethodNotALlowed } from "@/lib/http";
declare module "jsonwebtoken" {
	export interface JwtPayload {
		user: object;
	}
}

// export const runtime = "edge";
export const revalidate = 2;

export async function POST(request: Request) {
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

export {
	MethodNotALlowed as GET,
	MethodNotALlowed as PUT,
	MethodNotALlowed as PATCH,
	MethodNotALlowed as DELETE,
	MethodNotALlowed as OPTIONS,
};
