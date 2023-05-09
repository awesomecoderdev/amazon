import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const classNames = (...classes: ClassValue[]) => {
	return twMerge(clsx(classes));
	// return classes.filter(Boolean).join(" ");
};
