import prisma from "@/prisma/client";
import { Post, User } from "@prisma/client";
import { cookies } from "next/headers";
import Status from "@/lib/http";

interface Data {
	name: String;
}

export async function GET(request: Request) {
	// const query = request?.nextUrl?.searchParams;
	const cookieStore = cookies();
	const token = cookieStore.get("token");

	const posts: Array<Post> = await prisma.post.findMany({
		where: {
			OR: [
				{
					title: {
						contains: "dolorem eum magni eos aperiam quia",
					},
				},
				{
					title: {
						contains: "qui est esse",
					},
				},
			],
		},
		// cursor: { id: 5 },
		take: 10,
	});

	return new Response(
		JSON.stringify({
			success: true,
			status: Status.HTTP_OK,
			data: {
				count: posts.length,
				posts,
			},
		}),
		{
			status: Status.HTTP_OK,
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
