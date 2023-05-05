import prisma from "@/prisma/client";
import { cookies } from "next/headers";
import Status from "@/lib/http";

export async function GET(request: Request) {
	const cookieStore = cookies();
	const token = cookieStore.get("token");
	const user = await prisma.user.findFirst();

	return new Response(
		JSON.stringify({
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
