import prisma from "@/prisma/client";
import { cookies } from "next/headers";
import Status from "@/lib/http";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
	const cookieStore = cookies();
	const token = cookieStore.get("token");
	const user = await prisma.user.findFirst();

	const jwttoken = jwt.sign(
		{
			user,
		},
		"awesomecoder.dev",
		{
			expiresIn: 60 * 60,
		}
	);

	return new Response(
		JSON.stringify({
			status: Status.HTTP_ACCEPTED,
			data: {
				user,
				jwttoken,
				decode: atob(
					"eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6ImF3ZXNvbWVjb2Rlci5kZXZAZ21haWwuY29tIiwicGFzc3dvcmQiOiJjR0Z6YzNkdmNtUT0iLCJuYW1lIjoiTWQuIElicmFoaW0gS2hvbGlsIiwiYmlvIjpudWxsfSwiaWF0IjoxNjgzMjg1MDM5LCJleHAiOjE2ODMyODg2Mzl9"
				),
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
