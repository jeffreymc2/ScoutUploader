//  Purpose: Component that allows for the reordering of HighlightVideos in a playlist.
//  The component uses the useDroppable hook from the @dnd-kit/core package to enable drop functionality.
//  The component receives a playlist prop that contains an array of HighlightVideo objects.
//  The component renders the SortableHighlightVideoItem component for each HighlightVideo in the playlist.
//  The component returns a div element that is used as the drop target for the HighlightVideos.
//  The component uses the useDroppable hook to handle the drop functionality.
//  The component sets the style of the drop target based on whether a HighlightVideo is being dragged over it.
//  The component returns the SortableHighlightVideoItem component for each HighlightVideo in the playlist.
//  The SortableHighlightVideoItem component is a custom component that displays a single HighlightVideo item with drag and drop functionality.

// "use client";
// import React from "react";
// import { useDroppable } from "@dnd-kit/core";
// import { HighlightVideo } from "@/lib/types/types";
// import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
// import { SortableHighlightVideoItem } from "@/components/MediaComponents/SortableHighlightVideoItem";
// import Image from "next/image";

// interface DroppablePlaylistProps {
//   playlist: HighlightVideo[];
//   setPlaylist: React.Dispatch<React.SetStateAction<HighlightVideo[]>>;
// }

// export function DroppablePlaylist({ playlist, setPlaylist }: DroppablePlaylistProps) {
//   const { isOver, setNodeRef } = useDroppable({ id: "playlist" });
//   const style = {
//     backgroundColor: isOver ? "rgba(0, 0, 0, 0.1)" : undefined,
//     touchAction: 'none',
//   };

//   return (
//     <div className="mb-4 w-full">
//       <div className="flex items-center my-4">
//         <Image
//           src="https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/dkPlus_horizontal_primary%20(3).png"
//           alt="Image"
//           height={75}
//           width={250}
//           className="mr-4"
//         />
//         <h2 className="font-pgFont text-2xl">Custom Playlist</h2>
//       </div>
//       <SortableContext items={playlist} id="playlist" strategy={verticalListSortingStrategy}>
//         <div ref={setNodeRef} style={style} className="p-4 border border-gray-300 rounded-lg min-h-[500px] shadow-lg mr-4 bg-gray-100">
//           {playlist.map((video) => (
//             <SortableHighlightVideoItem key={video.id} video={video} />
//           ))}
//         </div>
//       </SortableContext>
//     </div>
//   );
// }

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
