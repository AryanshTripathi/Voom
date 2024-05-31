"use client";

import Loader from "@/components/Loader";
import MeetingTypeList from "@/components/MeetingTypeList";
import { useGetCalls } from "@/hooks/useGetCalls";
import React, { useEffect, useState } from "react";

const Home = () => {
	const now = new Date();

	const time = now.toLocaleTimeString("en-IN", {
		hour: "2-digit",
		minute: "2-digit",
	});
	const date = new Intl.DateTimeFormat("en-IN", {
		dateStyle: "full",
	}).format(now);

	const [meetingTime, setMeetingTime] = useState<String | undefined>(undefined);
	const { upcomingCalls, isLoading } = useGetCalls();

	// An effect to check if there are any meetings scheduled today. If yes, return the earliest one's time
	useEffect(() => {
		let firstUpcomingCall = null;
		if (upcomingCalls.length > 0) {
			firstUpcomingCall = upcomingCalls[upcomingCalls.length - 1];
		}

		console.log(firstUpcomingCall);
		const todayDate = now.toLocaleDateString();
		const upcomingMeetingDate =
			firstUpcomingCall?.state.startsAt?.toLocaleDateString();

		console.log(todayDate, upcomingMeetingDate);

		if (todayDate === upcomingMeetingDate) {
			setMeetingTime(
				firstUpcomingCall?.state.startsAt?.toLocaleTimeString("en-IN", {
					hour: "2-digit",
					minute: "2-digit",
				})
			);
		}
	}, [upcomingCalls]);

	return (
		<section className="flex size-full flex-col gap-10 text-white">
			<div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
				<div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
					<h2 className="glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal">
						{isLoading === true ? (
							<Loader />
						) : meetingTime === undefined ? (
							"No meetings scheduled for today"
						) : (
							`Upcoming meeting at ${meetingTime.toLocaleUpperCase()}`
						)}
					</h2>
					<div className="flex flex-col gap-2">
						<h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
						<p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
					</div>
				</div>
			</div>

			<MeetingTypeList />
		</section>
	);
};

export default Home;
