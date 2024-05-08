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
import { VideoSkeleton } from "@/components/ui/skeletons";
import Image from "next/image";
import Link from "next/link";
import { MaximizeIcon, PlayIcon, Volume2Icon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useRouter } from 'next/navigation'; // Import useRouter


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
  const router = useRouter(); // Get the router instance


  useEffect(() => {
    const fetchPlaylist = async () => {
      if (user) {
        const { data: playlistData, error } = await supabaseBrowser()
          .from("playlists")
          .select("playlist")
          .eq("user_id", user.id)
          // .eq("user_id", user2)

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

  const handleUpdateVideo = async () => {
    try {
      const { data: playlistData, error: fetchError } = await supabaseBrowser()
        .from("playlists")
        .select("playlist")
        .eq("user_id", user?.id || "")
        // .eq("user_id", user2 || "")

        .single();

      if (fetchError) {
        console.error("Error fetching playlist:", fetchError);
        return;
      }

      const updatedPlaylist = (
        playlistData?.playlist as { [key: string]: Json }[]
      ).map((video, index) =>
        index === currentVideoIndex
          ? { ...video, start_time: newStartTime, duration: newDuration }
          : video
      );

      const { error: updateError } = await supabaseBrowser()
        .from("playlists")
        .update({ playlist: updatedPlaylist })
        .eq("user_id", user?.id || "")
        // .eq("user_id", user2 || "")

        .single();

      if (updateError) {
        console.error("Error updating playlist:", updateError);
        toast.error("Failed to update video", {
          error: updateError,
        } as ExternalToast);
      } else {
        setPlaylist(updatedPlaylist);
        setNewStartTime(0);
        setNewDuration(0);
        router.refresh(); // Refresh the page after successful update

        toast.success("Video updated successfully");
      }
    } catch (error) {
      console.error("Error updating playlist:", error);
      toast.error("An error occurred while updating the video");
    }
  };

  if (playlist.length === 0) {
    return <VideoSkeleton />;
  }

  const currentVideo = playlist[currentVideoIndex];

  // return (
  //   <div>
  //     <ReactPlayer
  //       url={currentVideo.url as string}
  //       controls={true}
  //       playing={true}
  //       onProgress={handleProgress}
  //       onReady={onReady}
  //       ref={playerRef}
  //     />
  //     <h3>{currentVideo.title as string}</h3>
  //     {/* {editVideoId !== null && ( */}
  //       <div>
  //         <Label>
  //           New Start Time:
  //           <Input
  //             type="number"
  //             placeholder={(currentVideo.start_time as number).toString()}
  //             value={newStartTime}
  //             onChange={(e) => setNewStartTime(Number(e.target.value))}
  //           />
  //         </Label>
  //         <Label>
  //         New Duration:
  //         <Input
  //           type="number"
  //           placeholder={(currentVideo.duration as number).toString()}
  //           value={newDuration}
  //           onChange={(e) => setNewDuration(Number(e.target.value))}
  //         />
  //       </Label>
  //       <Button onClick={handleUpdateVideo}>Save</Button>
  //       </div>
  //     {/* )} */}
  //   </div>
  // );



  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 p-4 lg:p-8">
      <div className="w-full max-w-screen-xl aspect-video overflow-hidden rounded-lg relative">
        <ReactPlayer
          url={currentVideo.url as string}
          controls={true}
          playing={true}
          onProgress={handleProgress}
          onReady={onReady}
          ref={playerRef}
        />
        <div className="absolute text-white inset-x-0 top-0 p-4 text-lg bg-gradient-to-b from-black/50 to-transparent">
          <div className="line-clamp-1">{currentVideo.title as string}</div>
        </div>
        <Slider className="absolute bottom-0 left-0 right-0"
          defaultValue={[currentVideo.start_time as number]}
          max={currentVideo.duration as number + 40}
          step={1}
          value={[newDuration]} // Fix: Wrap newDuration in an array
          onChange={(e) => setNewDuration(Number((e.target as HTMLInputElement).value))}
        />
      </div>

      <div className="col-span-1 grid gap-2 max-h-[350px] overflow-y-auto">
        {playlist.map((video) => (
          
          <div
            key={String(video.id)}
            className="flex items-start gap-4 relative"
          >
            <Link className="absolute inset-0" href="#">
              <span className="sr-only">View</span>
            </Link>
            <Image
              alt="Thumbnail"
              className="aspect-video rounded-lg object-cover"
              height={94}
              src={String(video.thumbnailUrl)}
              width={168}
            />
            <div className="text-sm">
              <div className="font-medium line-clamp-2">
                {String(video.title)}
              </div>
              <div className="text-xs text-gray-500 line-clamp-1 dark:text-gray-400">
             {(typeof video.created === 'string' || typeof video.created === 'number') ? new Date(video.created).toLocaleDateString() : ""}
              </div>
              <div className="text-xs text-gray-500 line-clamp-1 dark:text-gray-400">
                5:32 · 5 days ago
              </div>
            </div>
          </div>
        ))}
      </div>
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
