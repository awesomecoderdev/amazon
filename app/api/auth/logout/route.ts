import jwt from "jsonwebtoken";
import Status from "@/lib/http";

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
	notAllowed as GET,
	notAllowed as PUT,
	notAllowed as PATCH,
	notAllowed as DELETE,
	notAllowed as OPTIONS,
};
