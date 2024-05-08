"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { HighlightVideo } from "@/lib/types/types";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableHighlightVideoItem } from "@/components/MediaComponents/SortableHighlightVideoItem";

interface DroppablePlaylistProps {
  playlist: HighlightVideo[];
  setPlaylist: React.Dispatch<React.SetStateAction<HighlightVideo[]>>;
}

export function DroppablePlaylist({ playlist, setPlaylist }: DroppablePlaylistProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: "playlist",
  });

  const style = {
    backgroundColor: isOver ? "rgba(0, 0, 0, 0.1)" : undefined,
  };

  return (
    <div className="mb-4 w-full">
    <SortableContext items={playlist} id="playlist" strategy={verticalListSortingStrategy}>
      <div className="mb-4 w-full">
        <h2 className="my-4 font-pgFont text-2xl">Highlight Playlist</h2>
        <div ref={setNodeRef} style={style} className="p-4 border border-gray-300 rounded-lg min-h-[500px] shadow-lg mr-4 bg-gray-100">
          {playlist.map((video) => (
            <SortableHighlightVideoItem key={video.id} video={video} />
          ))}
        </div>
      </div>
    </SortableContext>
    </div>
  );
}