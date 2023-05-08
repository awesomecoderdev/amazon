"use client";
import useSWR from "swr";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

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
			.get("/api/auth/session")
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
		user,
		login,
		logout,
		isLoading,
	};
}

export const AuthContextProvider = ({ children, cookie }: Props) => {
	const { user, login, logout, isLoading } = useNextAuth();
	let option: any = {
		user,
		login,
		logout,
		isLoading,
	} as {
		user: object | null | undefined;
		login: void | any;
		logout: void | any;
		isLoading: boolean;
	};
	const token = cookie?.value;

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

	return (
		<AuthUserContext.Provider value={option}>
			{children}
		</AuthUserContext.Provider>
	);
};

export const useAuth = () => React.useContext(AuthUserContext);
