import type { NextApiResponse } from 'next';
import prisma from "@/prisma/client";

interface Data {
	name: String;
}

export async function GET(request: Request) {
	// const user = await prisma.user.create({
	// 	data: {
	// 		name: "Alice",
	// 		email: "alice@prisma.io",
	// 		posts: {
	// 			create: { title: "Hello World" },
	// 		},
	// 		profile: {
	// 			create: { bio: "I like turtles" },
	// 		},
	// 	},
	// });
	// const user = await prisma.user.findFirst();

	// const posts = await prisma.post.create({
	// 	data: {
	// 		title: "Hello World",
	// 		authorId: user.id,
	// 	},
	// });

	const posts = await prisma.post.findMany({
		include: {
			author: true,
		},
	});

	return Response<NextApiResponse>.json({ posts });
	// return Response.json({ name: "John Doe", request, allUsers, user });
}
