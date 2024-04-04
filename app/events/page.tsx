// app/page.tsx
import { supabaseServer } from "@/lib/supabase/server";
import EventSearchComponent from "@/components/EventSearchComponent";
import React from "react";

export default async function Page({ searchParams }: { searchParams: any }) {
  const playerId = searchParams.player_id ?? null;

  let posts:
    | {
        created_at: string;
        player_id: string | null;
        id: string;
        name: string;
        object_id: string;
        post_by: string;
        profile: { display_name: string | null } | null;
        image: string;
      }[]
    | undefined = [];

  if (playerId) {
    const supabase = supabaseServer();
    
    const { data } = await supabase
      .from("posts")
      .select("*,profile(display_name)")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false });

    posts =
      data?.map((post) => ({
        image: `${post.post_by}/${post.player_id}/${post.name}`,
        ...post,
      })) || [];

  }

  return (
    <>
    <h1 className="text-2xl font-bold mt-5 font-pgFont">
        Search & Upload Media
      </h1>
      <EventSearchComponent posts={[]}  />
      <div className="mt-8">
        <h2 className="text-lg font-pgFont text-gray-600 font-semibold">How to Search for Events</h2>
        <p className="mt-2 text-gray-600 text-md">
          To find a specific event, you can search by the event&apos;s name or ID. If you&apos;re searching by name, type
          the full or partial name of the event into the search bar and click Search. For ID searches, enter the
          unique event ID. Results will include all matches for your search criteria. You can then select a team associated with the event to upload media specific to that team, and then assign the media to a player.
        </p>
        <p className="mt-4 text-md text-gray-600">Example searches:</p>
        <ul className="list-disc pl-6 mt-2 text-gray-600 text-sm">
          <li>Showcase</li>
          <li>World Series</li>
          <li>Event ID: 77808</li>
        </ul>
      </div>
      </>
  );
}



