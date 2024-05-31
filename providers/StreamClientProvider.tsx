"use client";

import { useState, useEffect } from "react";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { tokenProvider } from "@/actions/stream.action";
import Loader from "@/components/Loader";

export const StreamVideoProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [videoClient, setVideoClient] = useState<StreamVideoClient>();
	const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

	const { user, isLoaded } = useUser();

	useEffect(() => {
		if (!isLoaded || !user) {
			return;
		}
		if (!apiKey) {
			throw new Error("Stream API key missing");
		}

		// Creates a web socket connection
		const client = new StreamVideoClient({
			apiKey: apiKey,
			user: {
				id: user?.id,
				name: user?.username || user?.id,
				image: user?.imageUrl,
			},
			tokenProvider,
		});

		setVideoClient(client);
	}, [user, isLoaded]);

	if (!videoClient) {
		return <Loader />;
	}

	return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};
