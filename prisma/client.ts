import { PrismaClient } from "@prisma/client";

declare global {
	namespace NodeJS {
		interface Global {}
	}
}

// add prisma to the NodeJS global type
interface CustomNodeJsGlobal extends NodeJS.Global {
	prisma: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

prisma.$use(async (params, next) => {
	if (params.model === "User") {
		if (params.action === "create" || params.action === "update") {
			if (params.args.data.password) {
				const hashPass = btoa(`${params.args.data.password}`);
				params.args.data.password = hashPass;
			}
		}
	}
	return next(params);
});

export default prisma;

// import { PrismaClient } from "@prisma/client";

// declare global {
//   var prisma: PrismaClient | undefined;
// }

// const client = globalThis.prisma || new PrismaClient();
// if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

// export default client;
