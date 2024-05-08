// //@/components/MediaComponents/SortableHighlightVideoItem.tsx

// "use client";

// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { HTMLAttributes } from "react";
// import { HighlightVideo } from "@/lib/types/types";
// import { HighlightVideoItem } from "@/components/MediaComponents/HighlighVideoItem";

// type Props = {
//   video: HighlightVideo;
// } & HTMLAttributes<HTMLDivElement>;

// const SortableHighlightVideoItem = ({ video, ...props }: Props) => {
//   const {
//     attributes,
//     isDragging,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({
//     id: video.id,
//   });

//   const styles = {
//     transform: CSS.Transform.toString(transform),
//     transition: transition || undefined,
    
//   };

//   return (
//     <HighlightVideoItem
//       video={video}
//       ref={setNodeRef}
//       id={video.id}
//       style={styles}
//       isOpacityEnabled={isDragging}
//       {...props}
//       {...attributes}
//       {...listeners}
//     />
//   );
// };

// export { SortableHighlightVideoItem };

// @/components/MediaComponents/SortableHighlightVideoItem.tsx
"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HighlightVideoItem } from "@/components/MediaComponents/HighlighVideoItem";
import { HighlightVideo } from "@/lib/types/types";

interface SortableHighlightVideoItemProps {
  video: HighlightVideo;
}

const SortableHighlightVideoItem: React.FC<SortableHighlightVideoItemProps> = ({ video }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: video.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <HighlightVideoItem video={video} />
    </div>
  );
};

export { SortableHighlightVideoItem };