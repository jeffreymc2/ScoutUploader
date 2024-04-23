import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import SearchComponent from "./MediaSearch";
import MediaRenderer from "./MediaRenderer";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Post } from "@/lib/types/types";
import HighlightRenderer from "./HighlightRenderer";

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

const MediaParent: React.FC = () => {
  const { player_id } = useParams<{ player_id: string }>();
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
        .eq("player_id", player_id);

      if (error) {
        console.error("Error fetching media files:", error);
      } else {
        setMediaFiles(data as Post[]);
      }
    };

    // Fetch highlight videos from the API endpoint
    const fetchHighlightVideos = async () => {
      const response = await fetch(`/api/highlights?playerID=${player_id}`);
      const data = await response.json();
      setHighlightVideos(data.highlightsList);
    };

    fetchMediaFiles();
    fetchHighlightVideos();
  }, [player_id]);

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
    <div>
      <SearchComponent onSearch={handleSearch} />
      <div>
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
      </div>
    </div>
  );
};

export default MediaParent;