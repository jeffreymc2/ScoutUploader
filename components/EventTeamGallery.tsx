// components/EventTeamGallery.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Player, Post } from "@/lib/types/types";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
// import DeletePost from "@/components/DeletePost";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import MediaRenderer from "./MediaRenderer";
// import DeleteEventsPost from "./DeleteEventPost";

interface EventTeamGalleryProps {
  posts: Post[];
  players: Player[];
  eventId: string;
  teamId: string;
  image: string;
}

const EventTeamGallery: React.FC<EventTeamGalleryProps> = ({
  posts,
  players,

}) => {
  const supabase = supabaseBrowser();
  // const imageUrlHost =
  //   process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/events/";

  const router = useRouter();

  const eventSearchProps: EventTeamGalleryProps = {
    posts: posts.map((post) => ({
      ...post,
      profiles: null,
      image: post.event_id
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/events/${post.post_by}/${post.event_id}/${post.team_id}/${post.name}`
        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${post.post_by}/${post.player_id}/${post.name}`,
      isVideo: isVideoFile(post.name),
    })),
    players: [],
    eventId: "",
    teamId: "",
    image: ""
  };

  const handleSavePlayer = async (postId: string, playerId: string) => {
    try {
      await supabase
        .from("posts")
        .update({ player_id: playerId })
        .eq("id", postId);
    } catch (error) {
      console.error("Error updating post:", error);
    }
    router.refresh();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-2">
      {eventSearchProps.posts?.map((post) => {
        const assignedPlayer = players.find(
          (player) => player.playerid.toString() === post.player_id
        );

        return (
          // This div wraps each post's content, ensuring they're grouped
          <div key={post.id} className="flex flex-col">
            <div className="relative w-full h-60">
              {/* Adjust h-60 as needed to control image height */}
              <MediaRenderer file={post} />
            </div>

            <PlayerSelect
              post={post}
              players={players}
              onSavePlayer={handleSavePlayer}
            />
            {assignedPlayer && (
              <p className="text-xs my-2">
                Current Player Selected: {assignedPlayer.FullName} | Player ID:{" "}
                {assignedPlayer.playerid}
              </p>
            )}
            {!assignedPlayer && (
              <p className="text-xs my-2">
                No player has been assigned to this file.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

interface PlayerSelectProps {
  post: Post;
  players: Player[];
  onSavePlayer: (postId: string, playerId: string) => void;
}

const PlayerSelect: React.FC<PlayerSelectProps> = ({
  post,
  players,
  onSavePlayer,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const handleChange = (playerId: string) => {
    const player = players.find((p) => p.playerid === parseInt(playerId));
    setSelectedPlayer(player || null);
  };

  const handleSave = () => {
    if (selectedPlayer) {
      onSavePlayer(post.id, selectedPlayer.playerid.toString());
      toast.success("Player saved successfully");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between relative">
        <Select
          onValueChange={handleChange}
          value={selectedPlayer?.playerid.toString() || ""}
        >
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select Player" />
          </SelectTrigger>
          <SelectContent className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-2">
            {players.map((player) => (
              <SelectItem
                key={player.playerid}
                value={player.playerid.toString()}
              >
                {player.FullName} | ID: {player.playerid} | Jersey#:{" "}
                {player.jerseynumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          className="mx-2 bg-blue-500 text-white rounded"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default EventTeamGallery;
// Helper function to determine if a file is a video based on its extension
function isVideoFile(fileName: string) {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".flv", ".wmv"];
  return videoExtensions.some((extension) => fileName.toLowerCase().endsWith(extension));
}