// app/components/MediaComponents/MediaParent.tsx

"use client";

import React, { useState, useEffect } from "react";
import MediaGrid from "./MediaGrid";
import SearchComponent from "./MediaSearch";
import { Card, CardContent } from "@/components/ui/card";
import { MediaFile } from "@/lib/types/types";


interface MediaParentProps {
  supabaseMediaFiles: MediaFile[];
  highlightVideos: MediaFile[];
  children?: React.ReactNode;
}
const MediaParent: React.FC<MediaParentProps> = ({
  supabaseMediaFiles,
  highlightVideos,
}) => {
  const [filteredMediaFiles, setFilteredMediaFiles] = useState<MediaFile[]>([]);

  useEffect(() => {
    const allMediaFiles = [...supabaseMediaFiles, ...highlightVideos];
    setFilteredMediaFiles(allMediaFiles);
  }, [supabaseMediaFiles, highlightVideos]);

  const handleSearch = (searchTerm: string, filterOption: string) => {
    let filteredMedia: MediaFile[] = [];

    if (filterOption === "all" || filterOption === "scoutUploads") {
      filteredMedia = supabaseMediaFiles.filter(
        (file) =>
          file.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          file.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterOption === "all" || filterOption === "highlights") {
      const filteredHighlights = highlightVideos.filter(
        (video) =>
          video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      filteredMedia = [...filteredMedia, ...filteredHighlights];
    }

    setFilteredMediaFiles(filteredMedia);
  };

  return (
    <>
      <SearchComponent onSearch={handleSearch} />
      <Card>
        <CardContent>
          <MediaGrid mediaFiles={filteredMediaFiles} />
        </CardContent>
      </Card>
    </>
  );
};

export default MediaParent;