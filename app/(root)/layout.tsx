import type { Metadata } from "next";
import { StreamVideoProvider } from "@/providers/StreamClientProvider";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Voom",
	description: "A full stack video conferencing app developed using NextJS",
	icons: {
		icon: "/icons/logo.svg",
	},
};

const RootLayout = ({ children }: { children: ReactNode }) => {
	return (
		<main>
			<StreamVideoProvider>{children}</StreamVideoProvider>
		</main>
	);
};

export default RootLayout;
