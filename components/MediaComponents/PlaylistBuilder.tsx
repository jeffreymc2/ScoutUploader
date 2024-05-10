"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  TouchSensor,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { HighlightVideo } from "@/lib/types/types";
import { SortableHighlightVideoItem } from "./SortableHighlightVideoItem";
import { HighlightVideoItem } from "@/components/MediaComponents/HighlighVideoItem";
import { supabaseBrowser } from "@/lib/supabase/browser";
import useUser from "@/app/hook/useUser";
import { DroppablePlaylist } from "./DroppablePlaylist";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";
import Image from "next/image";

interface PlaylistBuilderProps {
  initialVideos: HighlightVideo[];
  playerId: string;
}

export function PlaylistBuilder({ initialVideos, playerId }: PlaylistBuilderProps) {
  const [videos, setVideos] = useState<HighlightVideo[]>(initialVideos);
  const [playlist, setPlaylist] = useState<HighlightVideo[]>([]);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const { data: user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchSavedPlaylist = async () => {
      if (user) {
        const { data: playlistData, error } = await supabaseBrowser()
          .from("playlists")
          .select("playlist")
          .eq("user_id", user.id)
          .eq("player_id", playerId)
          .single();

        if (error) {
          console.error("Error fetching saved playlist:", error);
        } else {
          const fetchedPlaylist = playlistData?.playlist as HighlightVideo[];
          setPlaylist(fetchedPlaylist || []);
          setVideos(
            initialVideos.filter(
              (video) =>
                !fetchedPlaylist?.some(
                  (savedVideo) => savedVideo.id === video.id
                )
            )
          );
        }
      }
    };

    fetchSavedPlaylist();
  }, [user, initialVideos, playerId]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveVideoId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const activeContainer = active.data.current?.sortable.containerId;
      const overContainer = over?.data.current?.sortable.containerId;

      if (activeContainer !== overContainer) {
        const activeIndex =
          activeContainer === "videos"
            ? videos.findIndex((video) => video.id === active.id)
            : playlist.findIndex((video) => video.id === active.id);

        if (activeIndex !== -1) {
          const [removed] =
            activeContainer === "videos"
              ? videos.splice(activeIndex, 1)
              : playlist.splice(activeIndex, 1);

          if (activeContainer === "videos") {
            setVideos([...videos]);
            setPlaylist([...playlist, removed]);
          } else {
            setPlaylist([...playlist]);
            setVideos([...videos, removed]);
          }
        }
      } else {
        const items = activeContainer === "videos" ? videos : playlist;
        const oldIndex = items.findIndex((video) => video.id === active.id);
        const newIndex = items.findIndex((video) => video.id === over?.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const reorderedItems = arrayMove(items, oldIndex, newIndex);
          activeContainer === "videos"
            ? setVideos(reorderedItems)
            : setPlaylist(reorderedItems);
        }
      }
    }

    setActiveVideoId(null);
  };

  const savePlaylist = async () => {
    if (user) {
      const { data: existingPlaylist, error: fetchError } = await supabaseBrowser()
        .from("playlists")
        .select("id")
        .eq("user_id", user.id)
        .eq("player_id", playerId)
        .single();

      if (fetchError) {
        console.error("Error fetching existing playlist:", fetchError);
        return;
      }

      if (existingPlaylist) {
        // Update the existing playlist
        const { error: updateError } = await supabaseBrowser()
          .from("playlists")
          .update({
            playlist: playlist as any[],
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingPlaylist.id);

        if (updateError) {
          console.error("Error updating playlist:", updateError);
          toast.error("Failed to update playlist");
        } else {
          console.log("Playlist updated successfully");
          toast.success("Playlist updated successfully");
        }
      } else {
        // Create a new playlist
        const { error: insertError } = await supabaseBrowser()
          .from("playlists")
          .insert({
            user_id: user.id,
            player_id: playerId,
            name: "My Playlist",
            playlist: playlist as any[],
          })
          .single();

        if (insertError) {
          console.error("Error creating playlist:", insertError);
          toast.error("Failed to create playlist");
        } else {
          console.log("Playlist created successfully");
          toast.success("Playlist created successfully");
        }
      }

      router.refresh();
    } else {
      toast.error("You must be logged in to save a playlist");
    }
  };

  const activeVideo =
    activeVideoId &&
    (videos.find((video) => video.id === activeVideoId) ||
      playlist.find((video) => video.id === activeVideoId));

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 ml-4 mr-4">
            <div className="mb-4 w-full">
              <div className="flex items-center my-4">
                <Image
                  src="https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/dkPlus_horizontal_primary%20(3).png"
                  alt="Image"
                  height={75}
                  width={250}
                  className="mr-4"
                />
                <h2 className="font-pgFont text-2xl">Highlights</h2>
              </div>
              <SortableContext
                items={videos}
                id="videos"
                strategy={verticalListSortingStrategy}
              >
                {videos.map((video) => (
                  <SortableHighlightVideoItem key={video.id} video={video} />
                ))}
              </SortableContext>
            </div>
            <div>
              <DroppablePlaylist
                playlist={playlist}
                setPlaylist={setPlaylist}
              />
              <Button onClick={savePlaylist} disabled={!user}>
                Save Playlist
              </Button>
            </div>
          </div>
        </Card>
        <DragOverlay>
          {activeVideo ? <HighlightVideoItem video={activeVideo} /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}