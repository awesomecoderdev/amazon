import prisma from "@/prisma/client";
import { cookies } from "next/headers";
import Status from "@/lib/http";

export async function GET(request: Request) {
	const cookieStore = cookies();
	const token = cookieStore.get("token");
	const user = await prisma.user.findFirst();

	return new Response(
		JSON.stringify({
			success: true,
			status: Status.HTTP_ACCEPTED,
			data: {
				user,
			},
		}),
		{
			status: Status.HTTP_ACCEPTED,
			// headers: {
			// 	"Set-Cookie": `token=${btoa(JSON.stringify(posts))},count=${
			// 		posts.length
			// 	}`,
			// },
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
	notAllowed as POST,
	notAllowed as PUT,
	notAllowed as PATCH,
	notAllowed as DELETE,
	notAllowed as OPTIONS,
};
