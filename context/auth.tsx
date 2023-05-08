"use client";
import useSWR from "swr";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import axios from "@/lib/axios";

interface AuthUserContextType {
	Provider: any;
}

interface CurrentAuthContextType {
	user: any;
}

type Props = {
	children: React.ReactNode;
	cookie: object | any;
};

const AuthUserContext: AuthUserContextType =
	React.createContext<CurrentAuthContextType>({
		user: null,
	});

export default function useNextAuth(middleware = null) {
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const router = useRouter();

	useEffect(() => {
		if (user || error) {
			setIsLoading(false);
		}
		// if (middleware == "guest" && user) router.push("/");
		// if (middleware == "auth" && !user && error) router.push("/login");
	});

	const {
		data: user,
		error,
		mutate,
	}: {
		data: any;
		error: any;
		mutate: any;
	} = useSWR("/api/auth/session", () =>
		axios
			.post("/api/auth/session")
			.then((response) => response.data.data.user)
	);

	const login = async ({ setErrors, ...props }: { setErrors: any }) => {
		setErrors([]);
		axios
			.post("/api/auth/login", props)
			.then(() => mutate() && router.push("/"))
			.catch((error) => {
				if (error.response.status != 422) throw error;
				setErrors(Object.values(error.response.data.errors).flat());
			});
	};

	const logout = async () => {
		await axios.post("/api/auth/logout");
		mutate(null);
		router.push("/login");
	};

	return {
		error,
		user,
		login,
		logout,
		isLoading,
	};
}

export const AuthContextProvider = ({ children, cookie }: Props) => {
	const router = useRouter();
	const pathname = usePathname();
	const token = cookie?.value;

	const { error, user, login, logout, isLoading } = useNextAuth();
	let option: any = {
		user,
		login,
		logout,
		isLoading,
		error,
	} as {
		user: object | null | undefined;
		login: void | any;
		logout: void | any;
		isLoading: boolean;
		error: any;
	};

	if (token) {
		try {
			const session = JSON.parse(atob(`${token.split(".")[1]}`));
			if (session?.user?.email) {
				const userSession = session.user;
				if (!user) {
					option.user = userSession;
				}
			}
		} catch (error) {
			// unauthorized
		}
	}

	const authRoutes = ["/login", "/register"];
	const sensitiveRoutes = ["/dashboard"];
	const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
		pathname.startsWith(route)
	);
	const isAuthSensitiveRoute = authRoutes.some((route) =>
		pathname.startsWith(route)
	);

	if (error) {
		if (isAccessingSensitiveRoute) {
			router.refresh();
			router.push("/login");
		}
	} else {
		if (isAuthSensitiveRoute) {
			router.refresh();
			router.push("/dashboard");
		}
	}

	return (
		<AuthUserContext.Provider value={option}>
			{children}
		</AuthUserContext.Provider>
	);
};

export const useAuth = () => React.useContext<any>(AuthUserContext);
