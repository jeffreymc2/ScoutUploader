

"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { HighlightVideo } from "@/lib/types/types";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableHighlightVideoItem } from "@/components/MediaComponents/SortableHighlightVideoItem";
import Image from "next/image";

interface DroppablePlaylistProps {
  playlist: HighlightVideo[];
  setPlaylist: React.Dispatch<React.SetStateAction<HighlightVideo[]>>;
  onAddRemove: (video: HighlightVideo) => void;
}

export function DroppablePlaylist({ playlist, setPlaylist, onAddRemove }: DroppablePlaylistProps) {
  const { isOver, setNodeRef } = useDroppable({ id: "playlist" });
  const style = {
    backgroundColor: isOver ? "rgba(0, 0, 0, 0.1)" : undefined,
  };

  return (
    <div className="mb-4 w-full">
      <div className="flex items-center my-4">
        <Image
          src="https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/dkPlus_horizontal_primary%20(3).png"
          alt="Image"
          height={150}
          width={250}
          className="mr-2"
        />
        <h2 className="font-pgFont text-2xl">Custom Playlist</h2>
      </div>
      <SortableContext items={playlist} id="playlist" strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} style={style} className="border sm:p-2 p-0 w-full border-gray-300 rounded-lg min-h-[650px] shadow-lg  bg-gray-100">
          {playlist.filter(Boolean).map((video) => (
            <SortableHighlightVideoItem
              key={video.id}
              video={video}
              isInPlaylist={true}
              onAddRemove={() => onAddRemove(video)}
              isPlaceholder={false}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
