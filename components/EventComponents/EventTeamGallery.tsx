// components/EventTeamGallery.tsx
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
import { SupabaseMediaCard } from "../MediaComponents/SupbaseMediaCard";
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
  const { data: user } = useUser();

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
     console.log("postId:", postId);
  console.log("playerId:", playerId);
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

  return (
    <div className="container mx-auto px-2 py-2 md:py-4">
      <div className="flex items-center justify-between mb-2">
        {/* <div className="flex items-center gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <SelectValue placeholder="Filter by" />
              <ChevronDownIcon className="w-4 h-4 ml-2" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="photos">Photos</SelectItem>
              <SelectItem value="videos">Videos</SelectItem>
              <SelectItem value="documents">Documents</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm">Save</Button>
        </div> */}
        {/* <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">Sort by:</span>
          <Select defaultValue="date">
            <SelectTrigger className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <SelectValue placeholder="Date" />
              <ChevronDownIcon className="w-4 h-4 ml-2" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>
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
                  url: post.image || "",
                  title: post.title || "",
                  description: post.description || "",
                  thumbnail: post.thumbnail || "",
                  post_by: post.post_by,
                  player_id: post.player_id,
                  team_id: post.team_id,
                  image: post.image || "",
                }}
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-0">
                  {/* <span className="text-sm leading-4 font-bold text-gray-600 mt-2">
                  {post.title}
                </span> */}
                  <div className="px-0 mb-2">
                    <p className="text-sm leading-4 font-bold text-gray-600 mt-2">
                      {post?.title}
                    </p>
                    <p className="text-xs mt-1">{post?.description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="text-gray-500 hover:bg-gray-100 rounded-full outline-none ring-transparent	focus:ring-0 focus:"
                        size="icon"
                        variant="ghost"
                      >
                        <PiDotsThreeOutlineVerticalLight className="w-6 h-6" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user?.id === post.post_by && (
                        <>
                          <DropdownMenuItem></DropdownMenuItem>
                          <Dialog>
                            <DialogTrigger asChild>
                              <MediaForm
                                postId={post.id?.toString() || ""}
                                mediaUrl={post.image || ""}
                                isVideo={post.isVideo}
                                thumbnailUrl={post.thumbnail || ""}
                              />
                            </DialogTrigger>
                          </Dialog>
                        </>
                      )}
                      {user?.id === post.post_by && (
                        <div className="mt-3">
                          <DeletePost
                            post_by={post.post_by || ""}
                            image={post.image || ""}
                            event_id={post.player_id || undefined}
                            team_id={post.team_id}
                          />
                        </div>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDownload(post.image || "")}
                      >
                        Download
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
    console.log("selectedPlayer:", selectedPlayer);
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
        <SelectTrigger className="px-4 py-2 rounded-md bg-gray-100 text-gray-700  w-full">
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

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MoveHorizontalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  );
}

function handleDownload(url: string) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "file";
      link.click();
    })
    .catch((error) => {
      console.error("Error downloading file:", error);
    });
}
