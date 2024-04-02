// app/page.tsx
import { supabaseServer } from "@/lib/supabase/server";

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
      <SearchComponent posts={[]} />
    </>
  );
}
