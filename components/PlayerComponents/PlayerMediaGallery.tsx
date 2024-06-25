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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PiDotsThreeOutlineVerticalLight } from "react-icons/pi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IoDownloadOutline } from "react-icons/io5";

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

export function SortableItem(props: { id: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
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
      image: post.is_video ? post.thumbnail_url || "" : post.file_url || "",
      isVideo: post.is_video || false, // Fix: Ensure isVideo is always of type boolean
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

  // Filter out the 9999 from the description
  const filterDescription = (description: string | undefined) => {
    if (description) {
      return description.replace(/9999/g, "");
    }
    return description;
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
            className="bg-white rounded-lg shadow-md overflow-hidden "
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
            <div className="p-2">
              <div className="flex items-center justify-between mb-0">
                <div className="px-0 mb-4">
                  {post?.title && (
                    <p className="text-sm leading-4 font-bold text-gray-600 mt-2">
                      {post?.title}
                    </p>
                  )}
                  {filterDescription(post.description) && (
                    <p className="text-xs mt-1">
                      {filterDescription(post.description)}
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="text-gray-500 hover:bg-gray-100 rounded-full outline-none ring-transparent	focus:ring-0 focus:"
                      size="icon"
                      variant="ghost"
                    >
                      <PiDotsThreeOutlineVerticalLight className="w-7 h-7" />
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
                          filePath={`scoutuploads/${
                            post.event_id ? "events" : "players"
                          }/${post.post_by}/${
                            post.event_id || post.player_id
                          }/${post.name}`}
                        />
                      </div>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleDownload(post.file_url || "")}
                    >
                      <IoDownloadOutline className="w-6 h-6 ml-0 p-0"/>
                      Download
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="relative bottom-0 left-0 right-0 p-2 bg-white bg-opacity-80">
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
      link.download = url.split("/").pop() || "file";
      link.click();
    })
    .catch((error) => {
      console.error("Error downloading file:", error);
    });
}
