import React from "react";
import Profile from "./Profile";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
	return (
		<div className="flex justify-between items-center h-20">
			<Link href="/">
				<Image 
					src={"https://vyrybefhmqnaxzfijbpl.supabase.co/storage/v1/object/public/brandlogos/png/pg_horizontal_primary_1.png"} 
					alt={""}				
					width={250}
					height={50}
					>
					</Image>
					
			</Link>
			<Profile />
		</div>
	);
}
