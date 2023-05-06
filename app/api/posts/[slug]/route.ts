import prisma from "@/prisma/client";
import { cookies } from "next/headers";
import Status from "@/lib/http";

interface Context {
	params: {
		slug: string;
	};
}

export async function GET(request: Request, context: Context) {
	const { slug } = context.params;
	const cookie = cookies();
	const token = cookie.get("token");
	console.log({ slug });

	const post = await prisma.post.findMany({
		where: {
			slug: `${slug}`,
		},
		select: {
			id: true,
			title: true,
			slug: true,
			content: true,
			author: {
				select: {
					name: true,
				},
			},
		},
	});

	console.log("post", post);

	if (post.length == 0) {
		return new Response(
			JSON.stringify({
				success: false,
				status: Status.HTTP_OK,
				message: "Post not found.",
			}),
			{
				status: Status.HTTP_OK,
			}
		);
	}

	return new Response(
		JSON.stringify({
			success: true,
			status: Status.HTTP_OK,
			data: {
				post,
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