"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
	return (
		<>
			<footer className="w-full bg-white dark:bg-gray-900">
				<div className="container relative flex flex-col px-6 py-8 mx-auto">
					<div className="flex flex-col items-center mt-12 sm:flex-row sm:justify-between">
						<p className="cursor-pointer text-gray-700 transition-colors duration-300 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400">
							<span className="text-lg mx-1">©</span>
							ProductIslands
						</p>

						<div className="mt-4 -mx-4 md:mt-0">
							<Link
								target="_blank"
								href="https://www.facebook.com/productislands"
								className="px-4 text-gray-700 transition-colors duration-300 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
							>
								Facebook
							</Link>

							<Link
								target="_blank"
								href="https://www.instagram.com/productislands/"
								className="px-4 text-gray-700 transition-colors duration-300 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
							>
								Instagram
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
}
