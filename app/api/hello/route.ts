import { NextApiResponse } from "next";
import prisma from "@/prisma/client";

interface Data {
	name: String;
}

export async function GET(request: Request) {
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
		// cursor: { id: 5 },
		// take: 3,
	});
	// console.log("request.headers", request.cookies.get("posts"));

	return Response.json({ posts });
}
