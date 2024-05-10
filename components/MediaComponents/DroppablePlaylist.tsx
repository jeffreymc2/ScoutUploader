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
}

export function DroppablePlaylist({ playlist, setPlaylist }: DroppablePlaylistProps) {
  const { isOver, setNodeRef } = useDroppable({ id: "playlist" });
  const style = {
    backgroundColor: isOver ? "rgba(0, 0, 0, 0.1)" : undefined,
    touchAction: 'none',
  };

  return (
    <div className="mb-4 w-full">
      <div className="flex items-center my-4">
        <Image
          src="https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/dkPlus_horizontal_primary%20(3).png"
          alt="Image"
          height={75}
          width={250}
          className="mr-4"
        />
        <h2 className="font-pgFont text-2xl">Custom Playlist</h2>
      </div>
      <SortableContext items={playlist} id="playlist" strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} style={style} className="p-4 border border-gray-300 rounded-lg min-h-[500px] shadow-lg mr-4 bg-gray-100">
          {playlist.map((video) => (
            <SortableHighlightVideoItem key={video.id} video={video} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}