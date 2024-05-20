"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { HighlightVideo } from "@/lib/types/types";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableHighlightVideoItem } from "@/components/MediaComponents/SortableHighlightVideoItem";
import Image from "next/image";
import { RiAddCircleLine, RiSubtractLine } from "react-icons/ri";
import { IoIosInformationCircleOutline } from "react-icons/io";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DroppablePlaylistProps {
  playlist: HighlightVideo[];
  setPlaylist: React.Dispatch<React.SetStateAction<HighlightVideo[]>>;
  onAddRemove: (video: HighlightVideo) => void;
}

export function DroppablePlaylist({
  playlist,
  setPlaylist,
  onAddRemove,
}: DroppablePlaylistProps) {
  const { isOver, setNodeRef } = useDroppable({ id: "playlist" });
  const style = {
    backgroundColor: isOver ? "rgba(0, 0, 0, 0.1)" : undefined,
  };

  return (
    <div className="mb-4 w-full">
      <div className="flex flex-col sm:flex-row items-center my-2">
      <Image
        src="https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/dkPlus_horizontal_primary%20(3).png"
        alt="Image"
        height={150}
        width={250}
        className="mr-2"
      />
      <div className="flex items-center">
        <h2 className="font-pgFont text-2xl sm:mr-4">Custom Playlist</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoIosInformationCircleOutline className="text-2xl text-gray-500 cursor-pointer ml-1" />
            </TooltipTrigger>
            <TooltipContent className="bg-white p-4 rounded-lg shadow-lg max-w-[250px]">
              <div className="text-gray-500 text-sm ml-2 mb-2">
                <p>Use the drag handles to reorder your playlist.</p>
                <p className="mt-2">
                  Your playlist will be displayed on your main profile and
                  visible to scouts, college coaches, and fans in the DKPlus
                  Highlights Social Feeds.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row items-center text-gray-500 text-sm ml-2 mb-2 sm:mb-0 sm:ml-4">
      <div className="flex items-center whitespace-nowrap">
        <p>Click the</p>
        <RiSubtractLine className="text-xl text-red-500 mx-1" />
        <p>icon</p>
      </div>
      <p className="sm:ml-1">
        to remove a highlight from your custom playlist.
      </p>
    </div>
      <SortableContext
        items={playlist}
        id="playlist"
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          style={style}
          className="border sm:p-2 p-0 w-full border-gray-300 rounded-lg min-h-[650px] shadow-lg  bg-gray-100"
        >
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
