// components/PlayerMediaGallery.tsx
"use client";
import { useState } from "react";
import { Player, Post, EventSearch } from "@/lib/types/types";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PlayerMediaGalleryProps {
  posts: Post[];
  events: EventSearch[];
  playerId: string;
}

interface EventSelectProps {
    post: Post;
    events: EventSearch[];
    onSaveEvent: (postId: string, eventId: string) => void;
  }

const PlayerMediaGallery: React.FC<PlayerMediaGalleryProps> = ({
  posts,
  events,
  playerId,
}) => {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const { data: user } = useUser();

  const playerSearchProps: PlayerMediaGalleryProps = {
    posts: posts.map((post) => ({
      ...post,
      profile: null,
      image: post.event_id
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/events/${post.post_by}/${post.event_id}/${post.team_id}/${post.name}`
        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/players/${post.post_by}/${post.player_id}/${post.name}`,
      isVideo: isVideoFile(post.name ?? ""),
    })),
    events: [],
    playerId: playerId,
  };

  const handleSaveEvent = async (postId: string, eventId: string) => {
    try {
      const post = posts.find((post) => post.id === postId);
      const postType = post?.event_id ? "event" : "player";

      await supabase
        .from("posts")
        .update({
          event_id: eventId,
          post_type: postType,
        })
        .eq("id", postId);

      toast.success("Event saved successfully");
      router.refresh();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to save event");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {playerSearchProps.posts?.map((post) => {
        const assignedEvent = events.find(
          (event) => event.EventID.toString() === post.event_id
        );

        return (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden"
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
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500">
                  {post.title}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="text-gray-500  hover:bg-gray-100 rounded-full"
                      size="icon"
                      variant="ghost"
                    >
                      <MoveHorizontalIcon className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user?.id === post.post_by && (
                      <>
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
              <p className="text-sm">{post.description}</p>

              <EventSelect
                post={post}
                events={events}
                onSaveEvent={handleSaveEvent}
              />
              {assignedEvent && (
                <Link href={`/events/${assignedEvent.EventID}`}>
                  <p className="text-sm text-blue-500 mt-2">
                    Event: {assignedEvent.EventName}
                  </p>
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};



const EventSelect: React.FC<EventSelectProps> = ({
  post,
  events,
  onSaveEvent,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<EventSearch | null>(null);

  const handleSelectChange = (value: string) => {
    const event = events.find((e) => e.EventID === parseInt(value));
    setSelectedEvent(event || null);
  };

  const handleSave = () => {
    if (selectedEvent) {
      onSaveEvent(post.id || "", selectedEvent.EventID.toString());
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        onValueChange={handleSelectChange}
        value={selectedEvent?.EventID.toString() || ""}
      >
        <SelectTrigger className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 w-full">
          <SelectValue placeholder="Select Event" />
        </SelectTrigger>
        <SelectContent>
          {events.map((event) => (
            <SelectItem key={event.EventID} value={event.EventID.toString()}>
              {event.EventName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        className="bg-blue-500 text-white rounded"
        onClick={handleSave}
        disabled={!selectedEvent}
      >
        Save
      </Button>
    </div>
  );
};

export default PlayerMediaGallery;

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
