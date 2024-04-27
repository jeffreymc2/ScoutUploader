// app/components/MediaComponents/MediaParent.tsx

"use client";

import React, { useState, useEffect } from "react";
import SearchComponent from "./MediaSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaFile, HighlightVideo } from "@/lib/types/types";
import { SupabaseMediaCard } from "@/components/MediaComponents/SupbaseMediaCard";
import { HighlightMediaCard } from "@/components/MediaComponents/HighlightMediaCard";


interface MediaParentProps {
  supabaseMediaFiles: MediaFile[];
  highlightVideos: HighlightVideo[];
  children?: React.ReactNode;
}

const MediaParent: React.FC<MediaParentProps> = ({
  supabaseMediaFiles,
  highlightVideos,
  children,


}) => {
  const [filteredSupabaseFiles, setFilteredSupabaseFiles] = useState<
    MediaFile[]
  >([]);
  const [filteredHighlightVideos, setFilteredHighlightVideos] = useState<
    HighlightVideo[]
  >([]);

  useEffect(() => {
    setFilteredSupabaseFiles(supabaseMediaFiles);
    setFilteredHighlightVideos(highlightVideos);
  }, [supabaseMediaFiles, highlightVideos]);

  const handleSupabaseSearch = (searchTerm: string) => {
    const filteredFiles = supabaseMediaFiles.filter(
      (file) =>
        file.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSupabaseFiles(filteredFiles);
  };

  const handleHighlightSearch = (searchTerm: string) => {
    const filteredHighlights = highlightVideos.filter(
      (video) =>
        video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHighlightVideos(filteredHighlights);
  };

  return (
    <>
      {filteredSupabaseFiles.length > 0 && (
        <Card key={supabaseMediaFiles[0].id} className="mt-8">
          <CardHeader>
            <CardTitle>Featured Media</CardTitle>
            {/* <SearchComponent onSearch={handleSupabaseSearch} /> */}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredSupabaseFiles.map((file) => (
                <SupabaseMediaCard key={file.id} file={file} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Player Highlight Videos</CardTitle>
          <SearchComponent onSearch={handleHighlightSearch} />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredHighlightVideos.map((highlight) => (
              <HighlightMediaCard key={highlight.id} highlight={highlight} player_id={highlight.tagged_player_keys[0].key} /> 
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default MediaParent;