import jwt from "jsonwebtoken";
import Status, { MethodNotALlowed } from "@/lib/http";

declare module "jsonwebtoken" {
	export interface JwtPayload {
		user: object;
	}
}

export async function POST(request: Request) {
	const expired = new Date(2000);
	return new Response(
		JSON.stringify({
			success: false,
			status: Status.HTTP_OK,
			message: "Successfully logged out.",
		}),
		{
			status: Status.HTTP_OK,
			headers: {
				"Set-Cookie": `token=deleted; Path=/; Expires=${expired};`,
			},
		}
	);
}

export {
	MethodNotALlowed as GET,
	MethodNotALlowed as PUT,
	MethodNotALlowed as PATCH,
	MethodNotALlowed as DELETE,
	MethodNotALlowed as OPTIONS,
};
