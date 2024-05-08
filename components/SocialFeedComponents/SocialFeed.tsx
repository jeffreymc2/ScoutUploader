// app/components/Feed.tsx
import { CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { supabaseServer } from "@/lib/supabase/server";
import MediaCard from "./MediaCard";
import SearchBar from "./SearchBar";
import { HighlightVideo, Post } from "@/lib/types/types";
import { HighlightMediaCard } from "@/components/MediaComponents/HighlightMediaCard";
import { SupabaseMediaCard } from "@/components/MediaComponents/SupbaseMediaCard";

export default async function Feed() {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("posts")
    .select("id, created_at, player_id, name, object_id, post_by, event_id, team_id, post_type, title, description, featured_image");

  if (error) {
    console.error("Error fetching media:", error);
    return <div>Error loading feed</div>;
  }

  const media: Post[] = data.map((item) => ({
    id: item.id || '', // Assign an empty string if 'id' is undefined
    created_at: item.created_at,
    player_id: item?.player_id,
    name: item?.name,
    object_id: item?.object_id,
    post_by: item?.post_by,
    profile: null,
    image: constructImageUrl(item) ?? '', // Provide a default value of an empty string if 'image' is undefined
    event_id: item?.event_id,
    featured_image: item?.featured_image,
    team_id: item?.team_id,
    isVideo: item?.post_type === "video",
    post_type: item?.post_type,
    title: item?.title,
    description: item?.description,
    MediaFileURL: '', // Add the missing 'MediaFileURL' property        
  
    }));


  return (
    <div className="max-w-xl mx-auto">
      <div className="flex flex-col space-y-4">
        <SearchBar />
        {media.map((item) => (
          <>
          <MediaCard key={item.id} media={item} />
          </>
        ))}
        {Array.isArray(Highlight) && Highlight.map((highlight: HighlightVideo) => ( 
          <HighlightMediaCard key={highlight.id} highlight={highlight} />
        ))  
        }
      </div>
    </div>
  );
}

function constructImageUrl(post: any): string | undefined {
  if (post.event_id && post.post_by && post.team_id && post.name) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/events/${post.post_by}/${post.event_id}/${post.team_id}/${post.name}`;
  } else if (post.post_by && post.player_id && post.name) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/players/${post.post_by}/${post.player_id}/${post.name}`;
  }
  
  return undefined;
}