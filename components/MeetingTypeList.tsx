//@ts-ignore
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "./ui/input";

const MeetingTypeList = () => {
	const [meetingState, setMeetingState] = useState<
		"isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
	>();

	const router = useRouter();

	const { toast } = useToast();

	const { user } = useUser();
	const client = useStreamVideoClient();
	const [values, setValues] = useState({
		dateTime: new Date(),
		description: "",
		link: "",
	});
	const [callDetails, setCallDetails] = useState<Call>();

	const createMeeting = async () => {
		console.log("click");
		if (!user || !client) {
			return;
		}

		try {
			if (!values.dateTime) {
				toast({ title: "Please select a date and time" });
				return;
			}

			const id = crypto.randomUUID();
			const call = client.call("default", id);

			if (!call) {
				throw new Error("Can't create a call");
			}

			const startsAt =
				values.dateTime.toISOString() || new Date(Date.now()).toISOString();
			const description = values.description || "Instant Meeting";

			await call.getOrCreate({
				data: {
					starts_at: startsAt,
					custom: {
						description,
					},
				},
			});

			setCallDetails(call);

			if (!values.description) {
				router.push(`/meeting/${call.id}`);
			}

			toast({ title: "Meeting created" });
		} catch (error) {
			console.log(error);
		}
	};

	const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

	return (
		<section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
			<HomeCard
				img="/icons/add-meeting.svg"
				title="New Meeting"
				description="Start an instant meeting"
				handleClick={() => {
					setMeetingState("isInstantMeeting");
				}}
				className="bg-orange-1"
			/>
			<HomeCard
				img="/icons/schedule.svg"
				title="Schedule Meeting"
				description="Plan your meeting"
				handleClick={() => {
					setMeetingState("isScheduleMeeting");
				}}
				className="bg-blue-1"
			/>
			<HomeCard
				img="/icons/join-meeting.svg"
				title="Join Meeting"
				description="Via Invitation Link"
				handleClick={() => {
					setMeetingState("isJoiningMeeting");
				}}
				className="bg-yellow-1"
			/>
			<HomeCard
				img="/icons/recordings.svg"
				title="View Recordings"
				description="Check out your recordings"
				handleClick={() => {
					router.push("/recordings");
				}}
				className="bg-purple-1"
			/>
			{!callDetails ? (
				<MeetingModal
					isOpen={meetingState === "isScheduleMeeting"}
					onClose={() => {
						setMeetingState(undefined);
					}}
					title="Create meeting"
					handleClick={createMeeting}>
					<div className="flex flex-col gap-2.5">
						<label className="text-base text-normal leading-[22px] text-sky-2">
							Add a description
						</label>
						<Textarea
							className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
							onChange={(e) => {
								setValues((prev) => ({ ...prev, description: e.target.value }));
							}}
						/>
					</div>
					<div className="flex w-full flex-col gap-2.5">
						<label className="text-base text-normal leading-[22px] text-sky-2">
							Select a date and time
						</label>
						<ReactDatePicker
							selected={values.dateTime}
							onChange={(date) => {
								setValues((prev) => ({ ...prev, dateTime: date! }));
							}}
							showTimeSelect
							timeFormat="HH:mm"
							timeIntervals={15}
							timeCaption="time"
							dateFormat={"MMMM d, yyyy h:mm aa"}
							className="w-full rounded bg-dark-2 p-2 focus:outline-none"
						/>
					</div>
				</MeetingModal>
			) : (
				<MeetingModal
					isOpen={meetingState === "isScheduleMeeting"}
					onClose={() => {
						setMeetingState(undefined);
					}}
					title="Meeting Created"
					className="text-center"
					buttonText="Copy Meeting Link"
					handleClick={() => {
						navigator.clipboard.writeText(meetingLink);
						toast({ title: "Link Copied" });
					}}
					image="/icons/checked.svg"
					buttonIcon="/icons/copy.svg"
				/>
			)}
			<MeetingModal
				isOpen={meetingState === "isInstantMeeting"}
				onClose={() => {
					setMeetingState(undefined);
				}}
				title="Start an instant meeting"
				className="text-center"
				buttonText="Start Meeting"
				handleClick={createMeeting}
			/>
			<MeetingModal
				isOpen={meetingState === "isJoiningMeeting"}
				onClose={() => {
					setMeetingState(undefined);
				}}
				title="Type the link here"
				className="text-center"
				buttonText="Join Meeting"
				handleClick={() => {
					router.push(values.link);
				}}>
				<Input
					placeholder="Meeting Link"
					className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
					onChange={(e) => {
						setValues((prev) => ({ ...prev, link: e.target.value }));
					}}
				/>
			</MeetingModal>
		</section>
	);
};

export default MeetingTypeList;
