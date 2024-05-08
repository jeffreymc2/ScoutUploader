// @/components/VideoPlayer.tsx
// @/components/VideoPlayer.tsx
"use client";
import React, { useEffect, useState, createContext } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import useUser from "@/app/hook/useUser";
import ReactPlayer from "react-player";

interface Video {
  id: number;
  url: string;
  title: string;
  start_time: number;
  duration: number;
}

interface VideoPlayerContextValue {
  currentVideo: Video | null;
  setCurrentVideo: (video: Video) => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextValue>({
  currentVideo: null,
  setCurrentVideo: () => {},
});

const VideoPlayer: React.FC = () => {
  const [playlist, setPlaylist] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const { data: user } = useUser();

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (user) {
        const { data: playlistData, error } = await supabaseBrowser()
          .from("playlists")
          .select("playlist")
          .eq("user_id", user.id)
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

  const playerRef = React.useRef<ReactPlayer | null>(null);

  const onReady = React.useCallback(() => {
    if (playerRef.current && currentVideo) {
      playerRef.current.seekTo(currentVideo.start_time, "seconds");
    }
  }, [playerRef.current, currentVideo]);

  const handleVideoEnded = () => {
    const nextVideoIndex = playlist.findIndex(
      (video) => video.id === currentVideo?.id
    );
    if (nextVideoIndex !== -1 && nextVideoIndex < playlist.length - 1) {
      setCurrentVideo(playlist[nextVideoIndex + 1]);
    } else {
      setCurrentVideo(null);
    }
  };

  if (playlist.length === 0 && !currentVideo) {
    return <div>Loading...</div>;
  }

  return (
    <VideoPlayerContext.Provider value={{ currentVideo, setCurrentVideo }}>
      <div>
        {currentVideo ? (
          <ReactPlayer
            url={currentVideo.url}
            controls
            playing
            onEnded={handleVideoEnded}
            onReady={onReady}
          />
        ) : (
          <div>No video selected</div>
        )}
        {currentVideo && <h3>{currentVideo.title}</h3>}
        {/* Display other video information as needed */}
      </div>
    </VideoPlayerContext.Provider>
  );
};

export default VideoPlayer;
export { VideoPlayerContext };

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
//           .eq("user_id", user.id)
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