// app/components/Feed.tsx
import { supabaseServer } from "@/lib/supabase/server";
import MediaCard from "./MediaCard";
import SearchBar from "./SearchBar";
import { Post, Playlist, HighlightVideo } from "@/lib/types/types";

export default async function Feed() {
  const supabase = supabaseServer();

  const { data: playlistsData, error: playlistsError } = await supabase
    .from("playlists")
    .select("created_at, name, updated_at, playlist");

  if (playlistsError) {
    console.error("Error fetching playlists:", playlistsError);
    return <div>Error loading feed</div>;
  }

  const playlists: Playlist[] = (playlistsData as unknown as Playlist[]) || [];

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex flex-col space-y-4">
        {/* <SearchBar /> */}
        {playlists.map((playlist, index) => (
          <div key={index}>
            {playlist.playlist.map((video) => (
              <MediaCard key={video.id} media={video} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}