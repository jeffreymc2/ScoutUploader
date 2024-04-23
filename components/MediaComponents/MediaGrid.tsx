// app/components/MediaComponents/MediaGrid.tsx

"use client";

import React from "react";
import MediaCard from "./MediaCard";
import { MediaFile } from "@/lib/types/types";



interface MediaGridProps {
  mediaFiles: MediaFile[];
}

const MediaGrid: React.FC<MediaGridProps> = ({ mediaFiles }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {mediaFiles.map((file) => (
        <MediaCard key={file.id} file={file} />
      ))}
    </div>
  );
};

export default MediaGrid;