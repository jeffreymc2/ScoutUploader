//  Purpose: Component to display a single highlight video item that can be sorted by dragging and dropping.
//  The component is used in the HighlightVideoList component.
//  The component uses the useSortable hook from the @dnd-kit/sortable package to enable drag and drop functionality.
//  The component receives a video prop that contains the data for the highlight video item.
//  The component renders the HighlightVideoItem component with the video prop and the dragHandleProps prop from the useSortable hook.
//  The dragHandleProps prop is used to attach the drag and drop functionality to the component.
//  The component returns the HighlightVideoItem component wrapped in a div element.
//  The div element has a style prop that applies the transform and transition styles from the useSortable hook.
//  The component returns the HighlightVideoItem component with the video prop and the dragHandleProps prop.
//  The HighlightVideoItem component is a custom component that displays a single highlight video item.


"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HighlightVideoItem } from "@/components/MediaComponents/HighlighVideoItem";
import { HighlightVideo } from "@/lib/types/types";

interface SortableHighlightVideoItemProps {
  video: HighlightVideo;
  isInPlaylist: boolean;
  onAddRemove: () => void;
  isPlaceholder?: boolean;
}

export const SortableHighlightVideoItem: React.FC<SortableHighlightVideoItemProps> = ({
  video,
  isInPlaylist,
  onAddRemove,
  isPlaceholder
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: video.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isPlaceholder) {
    return <div className="sortable-placeholder h-[60px] w-[90px] bg-gray-200 border-dashed border-2 border-gray-400" />;
  }

  return (
    <div ref={setNodeRef} style={style}>
      <HighlightVideoItem
        video={video}
        isInPlaylist={isInPlaylist}
        onAddRemove={onAddRemove}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};
