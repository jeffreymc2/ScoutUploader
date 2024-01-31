import Uploader from "@/components/Uploader";
import { supabaseServer } from "@/lib/supabase/server";
import React from "react";
import Image from "next/image";
export default async function page() {
	const supabase = supabaseServer();

	const { data } = await supabase
		.from("posts")
		.select("*,profiles(display_name)")
		.order("created_at", { ascending: false });

	const posts = data?.map((post) => {
		return {
			image: `https://keanyssgpgbjyamedini.supabase.co/storage/v1/object/public/images/${post.post_by}/${post.id}/${post.name}`,
			...post,
		};
	});

	return (
		<div>
			<div className="grid grid-cols-3 gap-10">
				{posts?.map((post) => {
					return (
						<div
							key={post.id}
							className=" rounded-md w-full space-y-5"
						>
							<div className="w-full h-96 relative rounded-md border">
								<Image
									src={post.image}
									alt={post.description || ""}
									fill
									className=" rounded-md object-cover object-center"
								/>
							</div>
							<h1>@{post.profiles?.display_name}</h1>
						</div>
					);
				})}
			</div>
			<Uploader />
		</div>
	);
}
