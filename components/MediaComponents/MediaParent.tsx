"use client";
import React, { useState, useEffect } from "react";
import SearchComponent from "./MediaSearch";
import MediaRenderer from "./MediaRenderer";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Post } from "@/lib/types/types";
import HighlightRenderer from "./HighlightRenderer";
import { Card, CardContent } from "@/components/ui/card";

interface HighlightVideo {
  id: number;
  title: string;
  description: string;
  start_time: number;
  end_time: number;
  duration: number;
  thumbnail: string;
  created: string;
  tagged_player_keys: { Key: number; Position: string }[];
  url: string;
  highlight_type: string;
  drund_event_id: number;
  game_key: string;
  scoringapp_play_id: number;
  play_type: string;
  highlight_created: string;
}

interface MediaParentProps {
  playerId: string;
    mediaFiles: Post[];
    highlightVideos: HighlightVideo[];
    filteredResults: (Post | HighlightVideo)[];
}

const MediaParent: React.FC<MediaParentProps> = ({ playerId }) => {
  const [mediaFiles, setMediaFiles] = useState<Post[]>([]);
  const [highlightVideos, setHighlightVideos] = useState<HighlightVideo[]>([]);
  const [filteredResults, setFilteredResults] = useState<
    (Post | HighlightVideo)[]
  >([]);

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

 

  return (
    <>

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