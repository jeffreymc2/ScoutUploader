"use client";

import React, { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import useUser from "@/app/hook/useUser";
// import Video from "next-video";
import ReactPlayer from "react-player";

interface Video {
    id: number;
    url: string;
    title: string;
    // Add other properties as needed
}

const VideoPlayer: React.FC = () => {
  const [playlist, setPlaylist] = useState<Video[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const { data: user } = useUser();

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (user) {
        const { data: playlistData, error } = await supabaseBrowser()
          .from("playlists")
          .select("playlist")
          .eq("user_id", "3faf9652-84d8-4b76-8b44-8e1f3b7ff7fd")
          .single();

        if (error) {
          console.error("Error fetching playlist:", error);
        } else {
          setPlaylist(playlistData?.playlist as unknown as Video[]);
        }
      }
    };

    fetchPlaylist();
  }, [user]);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  if (playlist.length === 0) {
    return <div>Loading...</div>;
  }

  const currentVideo = playlist[currentVideoIndex];

  return (
    <div>
      <ReactPlayer url={currentVideo.url} controls onEnded={handleVideoEnded} />
      <h3>{currentVideo.title}</h3>
      {/* Display other video information as needed */}
    </div>
  );
};

export default VideoPlayer;