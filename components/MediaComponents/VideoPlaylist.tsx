"use client";
import React, { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import useUser from "@/app/hook/useUser";
import ReactPlayer from "react-player";
import { Json } from "@/lib/types/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { ExternalToast, toast } from "sonner";

interface Video {
  id: number;
  url: string;
  title: string;
  start_time: number;
  duration: number;
}

const VideoPlayer: React.FC = () => {
  const [playlist, setPlaylist] = useState<{ [key: string]: Json }[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const { data: user } = useUser();
  const user2 = "3faf9652-84d8-4b76-8b44-8e1f3b7ff7fd";
  const [editVideoId, setEditVideoId] = useState<number | null>(null);
  const [newStartTime, setNewStartTime] = useState<number>(0);
  const [newDuration, setNewDuration] = useState<number>(0);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (user) {
        const { data: playlistData, error } = await supabaseBrowser()
          .from("playlists")
          .select("playlist")
          .eq("user_id", user2)
          .single();
        if (error) {
          console.error("Error fetching playlist:", error);
        } else {
          setPlaylist(playlistData?.playlist as { [key: string]: Json }[]);
        }
      }
    };
    fetchPlaylist();
  }, [user]);

  const playerRef = React.useRef<ReactPlayer | null>(null);

  const onReady = React.useCallback(() => {
    if (playerRef.current) {
      const currentVideo = playlist[currentVideoIndex];
      playerRef.current.seekTo(currentVideo.start_time as number, "seconds");
    }
  }, [playerRef.current, currentVideoIndex, playlist]);

  const handleProgress = (state: { playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);

    const currentVideo = playlist[currentVideoIndex];
    if (
      state.playedSeconds >=
      (currentVideo.start_time as number) + (currentVideo.duration as number)
    ) {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % playlist.length);
      setCurrentTime(0);
    }
  };

  const handleUpdateVideo = async (videoId: number) => {
    try {
      const updatedPlaylist = playlist.map((video) =>
        video.id === videoId ? { ...video, start_time: newStartTime } : video
      );
  
      const { data, error } = await supabaseBrowser()
        .from("playlists")
        .update({ playlist: updatedPlaylist })
        .eq("user_id", user2)
        .single();
      
        toast.success("Video updated successfully", { data } as ExternalToast);
      if (error) {
        console.error("Error updating playlist:", error);
      } else {
        setPlaylist(data as { [key: string]: Json }[]);
        setEditVideoId(null);
        setNewStartTime(0);
        setNewDuration(0);
      }
    } catch (error) {
      console.error("Error updating playlist:", error);
    }
  };

  if (playlist.length === 0) {
    return <div>Loading...</div>;
  }

  const currentVideo = playlist[currentVideoIndex];

  return (
    <div>
      <ReactPlayer
        url={currentVideo.url as string}
        controls
        playing
        onProgress={handleProgress}
        onReady={onReady}
        ref={playerRef}
      />
      <h3>{currentVideo.title as string}</h3>
      {/* {editVideoId !== null && ( */}
        <div>
          <Label>
            New Start Time:
            <Input
              type="number"
              placeholder={(currentVideo.start_time as number).toString()}
              value={newStartTime}
              onChange={(e) => setNewStartTime(Number(e.target.value))}
            />
          </Label>
          <Label>
            New Duration:
            <Input
              type="number"
              placeholder={(currentVideo.duration as number).toString()}
              value={newDuration}
              onChange={(e) => setNewDuration(Number(e.target.value))}
            />
          </Label>
          <Button onClick={() => editVideoId !== null && handleUpdateVideo(editVideoId)}>Save</Button>
        </div>
      {/* )} */}
    </div>
  );
};

export default VideoPlayer;

// // @/components/VideoPlayer.tsx
// "use client";
// import React, { useEffect, useState } from "react";
// import { supabaseBrowser } from "@/lib/supabase/browser";
// import useUser from "@/app/hook/useUser";
// import ReactPlayer from "react-player";

// interface Video {
//   id: number;
//   url: string;
//   title: string;
//   start_time: number;
//   duration: number;
//   // Add other properties as needed
// }

// const VideoPlayer: React.FC = () => {
//   const [playlist, setPlaylist] = useState<Video[]>([]);
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const { data: user } = useUser();

//   const user2 = "3faf9652-84d8-4b76-8b44-8e1f3b7ff7fd"





//   useEffect(() => {
//     const fetchPlaylist = async () => {
//       if (user) {
//         const { data: playlistData, error } = await supabaseBrowser()
//           .from("playlists")
//           .select("playlist")
//           .eq("user_id", user2)
//           .single();

//         if (error) {
//           console.error("Error fetching playlist:", error);
//         } else {
//           setPlaylist(playlistData?.playlist as unknown as Video[]);
//         }
//       }
//     };

//     fetchPlaylist();
//   }, [user]);

//   const playerRef = React.useRef<ReactPlayer | null>(null);

// const onReady = React.useCallback(() => {
//   if (playerRef.current) {
//     playerRef.current.seekTo(currentVideo.start_time, 'seconds');
//   }
// }, [playerRef.current]);

//   const handleVideoEnded = () => {
//     setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % playlist.length);
//   };

//   if (playlist.length === 0) {
//     return <div>Loading...</div>;
//   }

//   const currentVideo = playlist[currentVideoIndex];

//   return (
//     <div>
//       <ReactPlayer
//         url={currentVideo.url}
//         controls
//         playing
//         onEnded={handleVideoEnded}
//         onReady={onReady}
//       />
//       <h3>{currentVideo.title}</h3>
//       {/* Display other video information as needed */}
//     </div>
//   );
// };

// export default VideoPlayer;