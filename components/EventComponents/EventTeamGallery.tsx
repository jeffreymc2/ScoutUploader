// components/EventTeamGallery.tsx
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
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import MediaRenderer from "../MediaComponents/MediaRenderer";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { RiDeleteBin5Line } from "react-icons/ri";
import DeletePost from "../UtilityComponents/DeletePost";
import Link from "next/link";

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
  eventId,
  teamId,
}) => {
  const supabase = supabaseBrowser();

  const router = useRouter();

  const eventSearchProps: EventTeamGalleryProps = {
    posts: posts.map((post) => ({
      ...post,
      profile: null,
      image: post.event_id
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/events/${post.post_by}/${post.event_id}/${post.team_id}/${post.name}`
        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/players/${post.post_by}/${post.player_id}/${post.name}`,
      isVideo: isVideoFile(post.name ?? ""),
    })),
    players: [],
    eventId: eventId,
    teamId: teamId,
    image: "",
  };

  const handleSavePlayer = async (postId: string, playerId: string) => {
    try {
      await supabase
        .from("posts")
        .update({
          player_id: playerId,
          post_type: "",
        })
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
            <div key={post.id} className="relative">
              <MediaRenderer file={{ ...post, post_type: post.post_type || "" }} />
              <AlertDialog>
                <AlertDialogTrigger>
                  <RiDeleteBin5Line className="w-6 h-6 text-gray-900 absolute top-[208px] left-[50px]" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this file from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <DeletePost
                      post_by={post.post_by?.toString() || ""}
                      image={post.name || ""}
                      event_id={post.event_id || ""}
                      team_id={post.team_id || ""}
                    />
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div onClick={(event) => event.stopPropagation()}>
              <PlayerSelect
                post={post}
                players={players}
                onSavePlayer={handleSavePlayer}
              />
            </div>
            {assignedPlayer && (
              <Link className="text-xs my-2" href={`/players/${assignedPlayer.playerid}`}>
                Current Player Selected: <span className="text-blue-500">{assignedPlayer.FullName} | Player ID:{" "}
                  {assignedPlayer.playerid}</span>
              </Link>
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
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleSelectChange = (value: string) => {
    const player = players.find((p) => p.playerid === parseInt(value));
    setSelectedPlayer(player || null);
  };

  const handleSave = () => {
    if (selectedPlayer) {
      onSavePlayer(post.id || "", selectedPlayer.playerid.toString());
      toast.success("Player saved successfully");
    }
  };

  const handleSelectClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsSelectOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between relative">
        <Select
          onOpenChange={setIsSelectOpen}
          onValueChange={handleSelectChange}
          value={selectedPlayer?.playerid.toString() || ""}
        >
          <SelectTrigger className="w-full mt-2" onClick={handleSelectClick}>
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
          disabled={!selectedPlayer || isSelectOpen}
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
  const videoExtensions = [
    ".mp4",
    ".webm",
    ".ogg",
    ".mov",
    ".avi",
    ".flv",
    ".wmv",
  ];
  return videoExtensions.some((extension) =>
    fileName.toLowerCase().endsWith(extension)
  );
}