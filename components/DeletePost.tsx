"use client";
import React from "react";
import { Button } from "./ui/button";
import useUser from "@/app/hook/useUser";

export default function DeletePost({
	post_by,
	image,
}: {
	post_by: string;
	image: string;
}) {
	const { data: user, isFetching } = useUser();

	const handleDelete = () => {};

	if (isFetching) {
		return <></>;
	}
	if (user?.id === post_by) {
		return (
			<div className=" absolute top-0 right-5">
				<Button onClick={handleDelete}>Delete</Button>
			</div>
		);
	}
	return <></>;
}
