"use client";
import React, { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import useUser from "@/app/hook/useUser";
import ReactPlayer from "react-player";
import { Json } from "@/lib/types/types";
import { VideoSkeleton } from "@/components/ui/skeletons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";

interface VideoPlayerProps {
  playerId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ playerId }) => {
  const [playlist, setPlaylist] = useState<{ [key: string]: Json }[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const { data: user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchPlaylist = async () => {
      let playlistData: { [key: string]: Json }[] = [];
  
      if (user) {
        const { data, error } = await supabaseBrowser()
          .from("playlists")
          .select("playlist")
          .eq("user_id", user?.id)
          .eq("player_id", playerId)
          .maybeSingle();
  
        if (!error && data?.playlist) {
          playlistData = data.playlist as { [key: string]: Json }[];
        }
      }
  
      // Fetch highlights from the API
      const highlightsResponse = await fetch(
        process.env.NEXT_PUBLIC_URL + `/api/playerhighlights?playerID=${playerId}`
      );
      const highlightsData = await highlightsResponse.json();
      const highlightVideos = highlightsData.highlights || [];
  
      // If there are saved playlists, use them; otherwise, use the highlights
      setPlaylist(playlistData.length > 0 ? playlistData : highlightVideos);
    };
  
    fetchPlaylist();
  }, [user, playerId]);

  const playerRef = React.useRef<ReactPlayer | null>(null);

  const onReady = React.useCallback(() => {
    if (playerRef.current) {
      const currentVideo = playlist[currentVideoIndex];
      playerRef.current.seekTo(currentVideo.start_time as number, "seconds");
    }
  }, [currentVideoIndex, playlist]);

  const handleProgress = (state: { playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);

    const currentVideo = playlist[currentVideoIndex];
    if (
      state.playedSeconds >=
      (currentVideo.start_time as number) + (currentVideo.duration as number)
    ) {
      handleNextVideo();
    }
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    setCurrentTime(0);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentVideoIndex(index);
    setCurrentTime(0);
  };

  if (playlist.length === 0) {
    return <VideoSkeleton />;
  }

  const currentVideo = playlist[currentVideoIndex];

  const getTitle = (title: string) => {
    const bracketRegex = /\[(.*?)\]/;
    const match = title.match(bracketRegex);
    return match ? title.replace(match[0], "") : title;
  };

  const getTitleWithoutBrackets = (title: string) => {
    const bracketRegex = /\[(.*?)\]/;
    const match = title.match(bracketRegex);
    return match ? match[1] : title;
  };

  const renderOverlayBadge = (title: string) => {
    const titleWithoutBrackets = getTitleWithoutBrackets(title);
    return (
      <div className="absolute top-2 left-2">
        <Badge variant="secondary">
          <Image
            className="mr-2"
            src={
              "https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/dkPlus_icon_inverse.png"
            }
            width={55}
            height={10}
            alt={""}
          ></Image>{" "}
        </Badge>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 p-4 lg:p-4">
      <div className="w-full overflow-hidden rounded-lg relative">
        <div className="aspect-w-16 aspect-h-9">
          <ReactPlayer
            url={currentVideo.url as string}
            controls={true}
            playing={true}
            volume={0}
            width={"100%"}
            height={"100%"}
            onProgress={handleProgress}
            onReady={onReady}
            onEnded={handleNextVideo}
            className="w-full h-full rounded-lg object-cover"
            ref={playerRef}
          />
        </div>
  
        {currentVideo.title && (
          <div className="absolute text-white inset-x-0 top-0 p-4 w-full overflow-hidden rounded-lg bg-gradient-to-b from-black/50 to-transparent">
            <div className="line-clamp-1">
              {" "}
              {getTitle(currentVideo.title as string)}
            </div>
          </div>
        )}
      </div>
  
      <div className="flex flex-col gap-2 max-h-[413px] overflow-y-auto">
        {playlist.map((video, index) => (
          <div
            key={String(video.id)}
            className={`flex items-start gap-4 relative cursor-pointer h-24 ${
              index === currentVideoIndex
                ? "border border-gray-800 rounded-lg p-0"
                : ""
            }`}
            onClick={() => handleThumbnailClick(index)}
          >
            <Image
              alt="Thumbnail"
              className="aspect-video rounded-lg object-cover h-full w-auto"
              height={94}
              src={String(video.thumbnailUrl)}
              width={168}
              onError={(e) => {
                e.currentTarget.src =
                  "https://scouts.perfectgame.org/_next/image?url=https%3A%2F%2Favkhdvyjcweghosyfiiw.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fmisc%2F638252106298352027-DKPlusHP%2520(1).webp&w=3840&q=75";
              }}
            />
  
            {video.title && renderOverlayBadge(video.title as string)}
            <div className="absolute bottom-2 left-2 text-white text-xs">
              0:{String(video.duration)}
            </div>
            <div className="text-sm">
              <div className="font-medium line-clamp-2 mt-2">
                {getTitle(video.title as string)}
              </div>
              <div className="text-xs text-gray-500 line-clamp-1 dark:text-gray-400">
                {typeof video.created === "string" ||
                typeof video.created === "number"
                  ? new Date(video.created).toLocaleDateString()
                  : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
