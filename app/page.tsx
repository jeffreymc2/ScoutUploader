// app/page.tsx
import { supabaseServer } from "@/lib/supabase/server";
import Uploader from "@/components/Uploader";
import EventSearch from "@/components/EventSearch";
import PlayerSearch from "@/components/PlayerSearch";
import PlayerSearchByName from "@/components/PlayerSearchByName";
import SearchComponent from "@/components/SearchComponent";



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
        profiles: { display_name: string | null } | null;
        image: string;
      }[]
    | undefined = [];

  if (playerId) {
    const supabase = supabaseServer();
    const { data } = await supabase
      .from("posts")
      .select("*,profiles(display_name)")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false });

    posts =
      data?.map((post) => ({
        image: `${post.post_by}/${post.player_id}/${post.name}`,
        ...post,
      })) || [];
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mt-5 font-pgFont">
        Search for Players
      </h1>
      <SearchComponent posts={posts} />
    </div>
  );
}