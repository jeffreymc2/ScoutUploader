"use client";

import React, { useState, useEffect } from "react";
import SearchComponent from "./MediaSearch";
import MediaRenderer from "./MediaRenderer";
import { Post, HighlightVideo } from "@/lib/types/types";
import HighlightRenderer from "./HighlightRenderer";
import { Card, CardContent } from "@/components/ui/card";

export interface MediaParentProps {
  playerId: string;
  children: React.ReactNode;
  posts: Post[];
}

const MediaParent: React.FC<MediaParentProps> = ({ playerId, children, posts }) => {
  const [mediaFiles, setMediaFiles] = useState<Post[]>([]);
  const [highlightVideos, setHighlightVideos] = useState<HighlightVideo[]>([]);
  const [filteredResults, setFilteredResults] = useState<(Post | HighlightVideo)[]>([]);

  useEffect(() => {
    setMediaFiles(posts);

    // Fetch highlight videos from the API endpoint
    const fetchHighlightVideos = async () => {
      const response = await fetch(`/api/playerhighlights?playerID=${playerId}`);
      const data = await response.json();
      setHighlightVideos(data.highlightsList);
      console.log(data);
    };

    fetchHighlightVideos();
  }, [playerId, posts]);

  const handleSearch = (searchTerm: string, filterOption: string) => {
    let filteredMedia: (Post | HighlightVideo)[] = [];

    if (filterOption === "all" || filterOption === "scoutUploads") {
      filteredMedia = mediaFiles.filter(
        (file) =>
          file.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (file.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
    }

    if (filterOption === "all" || filterOption === "highlights") {
      const filteredHighlights = highlightVideos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (video.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
      filteredMedia = [...filteredMedia, ...filteredHighlights];
    }

    setFilteredResults(filteredMedia);
  };

  return (
    <>
      <SearchComponent onSearch={handleSearch} />
      {filteredResults.length > 0 ? (
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {children}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaFiles.map((file) => (
                <MediaRenderer key={file.id} file={file} />
              ))}
              {highlightVideos.map((video) => (
                <HighlightRenderer key={`highlight-${video.id}`} highlight={video} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default MediaParent;