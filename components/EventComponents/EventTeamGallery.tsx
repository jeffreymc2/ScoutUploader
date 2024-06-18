"use client";
import { useState } from "react";
import { Player, Post } from "@/lib/types/types";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupabaseMediaCard } from "@/components/MediaComponents/SupbaseMediaCard";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MediaForm from "@/components/MediaComponents/MediaForm";
import DeletePost from "@/components/UtilityComponents/DeletePost";
import useUser from "@/app/hook/useUser";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PiDotsThreeOutlineVerticalLight } from "react-icons/pi";
import { IoDownloadOutline } from "react-icons/io5";

interface EventTeamGalleryProps {
  posts: Post[];
  players: Player[];
  eventId: string;
  teamId: string;
}

const EventTeamGallery: React.FC<EventTeamGalleryProps> = ({
  posts,
  players,
  eventId,
  teamId,
}) => {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const { data: user } = useUser();

  const eventSearchProps: EventTeamGalleryProps = {
    posts: posts.map((post) => ({
      ...post,
      profile: null,
      isVideo: post.is_video || false,
    })),
    players: [],
    eventId: eventId,
    teamId: teamId,
  };

  const handleSavePlayer = async (postId: string, playerId: string) => {
    try {
      const post = posts.find((post) => post.id === postId);
      const postType = post?.event_id ? "event" : "player";

      await supabase
        .from("posts")
        .update({
          player_id: playerId,
          post_type: postType,
        })
        .eq("id", postId);

      toast.success("Player saved successfully");
      router.refresh();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to save player");
    }
  };

  const handleDownload = (url: string) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = url.split("/").pop() || "file";
        link.click();
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };

  return (
    <div className="container mx-auto px-2 py-2 md:py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {eventSearchProps.posts?.map((post) => {
          const assignedPlayer = players.find(
            (player) => player.playerid.toString() === post.player_id
          );

          return (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <SupabaseMediaCard
                file={{
                  id: post.id || "",
                  created_at: "",
                  profile: { display_name: "" },
                  name: post.image || "",
                  isVideo: post.isVideo,
                  url: post.file_url || "",
                  title: post.title || "",
                  description: post.description || "",
                  thumbnail: post.thumbnail_url || "",
                  file_url: post.file_url || "",
                  post_by: post.post_by,
                  player_id: post.player_id,
                  team_id: post.team_id,
                  image: post.image || "",
                }}
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-0">
                  <div className="px-0 mb-2">
                    <p className="text-sm leading-4 font-bold text-gray-600 mt-2">
                      {post?.title}
                    </p>
                    <p className="text-xs mt-1">{post?.description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="text-gray-500 hover:bg-gray-100 rounded-full outline-none ring-transparent focus:ring-0 focus:"
                        size="icon"
                        variant="ghost"
                      >
                        <PiDotsThreeOutlineVerticalLight className="w-6 h-6" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user?.id === post.post_by && (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <MediaForm
                                postId={post.id?.toString() || ""}
                                fileUrl={post.file_url || ""}
                                isVideo={post.isVideo}
                                thumbnailUrl={post.thumbnail_url || ""}
                                start_time={post.start_time || 0}
                              />
                            </DialogTrigger>
                          </Dialog>
                        </>
                      )}
                      {user?.id === post.post_by && (
                        <div className="mt-3">
                          <DeletePost
                            postId={post.id?.toString() || ""}
                            post_by={post.post_by || ""}
                            filePath={post.file_url || ""}
                          />
                        </div>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDownload(post.file_url || "")}
                      >
                        <span className="text-sm flex items-center cursor-pointer">
                          <IoDownloadOutline className="text-xl mr-2" />{" "}
                          Download
                        </span>{" "}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="m-4">
                <PlayerSelect
                  post={post}
                  players={players}
                  onSavePlayer={handleSavePlayer}
                />
                {assignedPlayer && (
                  <Link href={`/players/${assignedPlayer.playerid}`}>
                    <p className="text-sm text-blue-500 mt-2">
                      Player: {assignedPlayer.FullName}
                    </p>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
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

  const handleSelectChange = (value: string) => {
    const player = players.find((p) => p.playerid === parseInt(value));
    setSelectedPlayer(player || null);
  };

  const handleSave = () => {
    if (selectedPlayer) {
      onSavePlayer(post.id || "", selectedPlayer.playerid.toString());
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        onValueChange={handleSelectChange}
        value={selectedPlayer?.playerid.toString() || ""}
      >
        <SelectTrigger className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 w-full">
          <SelectValue placeholder="Select Player" />
        </SelectTrigger>
        <SelectContent>
          {players.map((player) => (
            <SelectItem
              key={player.playerid}
              value={player.playerid.toString()}
            >
              {player.FullName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        className="bg-blue-500 text-white rounded"
        onClick={handleSave}
        disabled={!selectedPlayer}
      >
        Save
      </Button>
    </div>
  );
};

export default EventTeamGallery;
