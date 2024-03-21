import Uploader from "@/components/Uploader";
import { supabaseServer } from "@/lib/supabase/server";
import React from "react";
import Image from "next/image";
import DeletePost from "@/components/DeletePost";
import { Butterfly_Kids } from "next/font/google";
import { Button } from "@/components/ui/button";
import UploadButton from "@/components/UploadButton";

export default async function Page() {
  const supabase = supabaseServer();
  const { data } = await supabase
    .from("posts")
    .select("*,profiles(display_name)")
    .order("created_at", { ascending: false });

  const posts = data?.map((post) => ({
    image: `${post.post_by}/${post.id}/${post.player_id}/${post.name}`,
    ...post,
  }));

  const imgeUrlHost = "https://rfgveuhgzxqkaualspln.supabase.co/storage/v1/object/public/images/";

  return (
    <div>
	<Uploader />

      <div className="grid grid-cols-3 gap-10 mt-10">
        {posts?.map((post) => (
          <div key={post.id} className="rounded-md w-full space-y-5 relative">
            <div className="w-full h-96 relative rounded-md border">
              <Image
                src={imgeUrlHost + post.image}
                alt={post.player_id || ""}
                fill
                className="rounded-md object-cover object-center"
              />
            </div>
            <p className="text-xs">Posted by: @{post.profiles?.display_name}</p>
            <p className="text-lg font-pgFont">Player Id: {post.player_id}</p>
            <DeletePost post_by={post.post_by} image={post.image} />
          </div>
        ))}
      </div>
    </div>
  );
}