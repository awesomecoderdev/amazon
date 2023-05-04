import { NextApiResponse } from "next";
import prisma from "@/prisma/client";
import { cookies } from "next/headers";
import Status from "@/lib/http";

interface Data {
	name: String;
}

export async function GET(request: Request, context: any) {
	const { params } = context;
	const { slug } = params;
	const query = request?.nextUrl?.searchParams;
	const cookieStore = cookies();
	const token = cookieStore.get("token");

	console.log({ slug, params, query, token: token?.value });
	// const req = await fetch("https://jsonplaceholder.typicode.com/posts");
	// const res = await req.json();

	// const posts = res.map((post) => {
	// 	return {
	// 		title: post.title,
	// 		content: post.body,
	// 	};
	// });

	// const user = await prisma.user.create({
	// 	data: {
	// 		name: "Md. Ibrahim Kholil",
	// 		email: "awesomecoder.dev@gmail.com",
	// 		password: "password",
	// 		posts: {
	// 			create: posts,
	// 		},
	// 	},
	// });
	// console.log("user", user);
	// const user = await prisma.user.findFirst();

	// const posts = await prisma.post.create({
	// 	data: {
	// 		title: "Hello World",
	// 		authorId: user.id,
	// 	},
	// });

	const posts = await prisma.post.findMany({
		// where: {
		// 	id: {
		// 		in: [1, 2],
		// 	},
		// },
		select: {
			id: true,
			title: true,
			author: {
				select: {
					name: true,
				},
			},
		},
		// include: {
		// 	author: true,
		// },
		cursor: { id: 5 },
		take: 10,
	});

	return new Response(
		JSON.stringify({
			status: Status.HTTP_ACCEPTED,
			data: {
				count: posts.length,
				posts,
			},
		}),
		{
			status: 201,
			headers: {
				"Set-Cookie": `token=${btoa(JSON.stringify(posts))},count=${
					posts.length
				}`,
			},
		}
	);
}
