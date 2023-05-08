"use client";
import React, { Fragment, useEffect } from "react";

interface AuthUserContextType {
	Provider: any;
}

interface CurrentAuthContextType {
	user: any;
}

interface UseNextAuthType {
	user: any;
	isLoading: boolean;
	setUser: void;
	setIsLoading: void;
}

type Props = {
	children: React.ReactNode;
};

const AuthUserContext: AuthUserContextType =
	React.createContext<CurrentAuthContextType>({
		user: null,
	});

const fetchAuth = async () => {
	const req = await fetch("/api/auth/session");
	const res = await req.json();
	console.log("res", res);
	return res;
};

export default async function useNextAuth() {
	const [user, setUser] = React.useState<object | undefined | null>(null);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	const clear = () => {
		setUser(null);
		setIsLoading(false);
	};

	useEffect(() => {
		// declare the async data fetching function
		// // call the function
		// const result = fetchAuth()
		// 	// make sure to catch any error
		// 	.catch(console.error);
		// // ❌ don't do this, it won't work as you expect!
		// if (result.success) {
		// 	setUser(result.data.user);
		// 	setIsLoading(false);
		// } else {
		// 	setUser({
		// 		name: "demo",
		// 	});
		// 	setIsLoading(false);
		// }
	}, []);

	return {
		user,
		isLoading,
		setUser,
		setIsLoading,
	} as {
		user: any;
		isLoading: boolean;
	};
}

export const AuthContextProvider = async ({ children }: Props) => {
	const auth = await useNextAuth();
	return (
		<AuthUserContext.Provider value={auth}>
			{children}
		</AuthUserContext.Provider>
	);
};

export const useAuth = () => React.useContext(AuthUserContext);
