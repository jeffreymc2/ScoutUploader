//app/components/MediaComponents/MediaParent.tsx

"use client";

import React, { useState, useEffect } from "react";
import SearchComponent from "./MediaSearch";
import MediaRenderer from "./MediaRenderer";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Post, HighlightVideo } from "@/lib/types/types";
import HighlightRenderer from "./HighlightRenderer";
import { Card, CardContent } from "@/components/ui/card";

interface MediaParentProps {
  playerId: string;
}

const MediaParent: React.FC<MediaParentProps> = ({ playerId }) => {
  const [mediaFiles, setMediaFiles] = useState<Post[]>([]);
  const [highlightVideos, setHighlightVideos] = useState<HighlightVideo[]>([]);
  const [filteredResults, setFilteredResults] = useState<(Post | HighlightVideo)[]>([]);

  useEffect(() => {
    // Fetch media files from Supabase
    const fetchMediaFiles = async () => {
      const { data, error } = await supabaseBrowser()
        .from("posts")
        .select("*")
        .eq("player_id", playerId);

      if (error) {
        console.error("Error fetching media files:", error);
      } else {
        setMediaFiles(data as Post[]);
      }
    };

    // Fetch highlight videos from the API endpoint
    const fetchHighlightVideos = async () => {
      const response = await fetch(`/api/highlights?playerID=${playerId}`);
      const data = await response.json();
      setHighlightVideos(data.highlightsList);
    };

    fetchMediaFiles();
    fetchHighlightVideos();
  }, [playerId]);

  const handleSearch = (searchTerm: string, filterOption: string) => {
    let filteredMedia: (Post | HighlightVideo)[] = [];

    if (filterOption === "all" || filterOption === "scoutUploads") {
      filteredMedia = mediaFiles.filter((file) =>
        file.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterOption === "all" || filterOption === "highlights") {
      const filteredHighlights = highlightVideos.filter((video) =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      filteredMedia = [...filteredMedia, ...filteredHighlights];
    }

    setFilteredResults(filteredMedia);
  };

  return (
    <>
      <SearchComponent onSearch={handleSearch} />

      <Card>
        <CardContent>
          {filteredResults.map((file) =>
            file.hasOwnProperty("title") ? (
              <HighlightRenderer
                key={`highlight-${file.id}`}
                highlight={file as HighlightVideo}
              />
            ) : (
              <MediaRenderer key={file.id} file={file as Post} />
            )
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default MediaParent;