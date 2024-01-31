"use client";
import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { Button } from "./ui/button";

export default function Uploader() {
	const [uppy] = useState(
		() =>
			new Uppy({
				restrictions: {
					maxNumberOfFiles: 1,
					allowedFileTypes: ["image/*"],
					maxFileSize: 5 * 1000 * 1000,
				},
			})
	);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button id="upload-trigger"></button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Daily Upload</DialogTitle>
					<DialogDescription>Select your photo.</DialogDescription>
				</DialogHeader>
				<div className=" space-y-5">
					<Dashboard
						uppy={uppy}
						className="w-auto"
						hideUploadButton
					/>
					<Button className="w-full">Upload</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
