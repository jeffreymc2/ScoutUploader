"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import ReactPlayer from "react-player";
import useUser from "@/app/hook/useUser";
import { Json } from "@/lib/types/types";
import { VideoSkeleton } from "@/components/ui/skeletons";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import InfiniteScroll from "react-infinite-scroll-component";
import { supabaseBrowser } from "@/lib/supabase/browser";

interface VideoPlayerProps {
  playerId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ playerId }) => {
  const [playlists, setPlaylists] = useState<{
    [key: string]: { [key: string]: Json }[];
  }>({
    h: [],
    a: [],
    l: [],
    p: [],
  });
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [type, setType] = useState("h");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isPitcher, setIsPitcher] = useState(false);
  const [thumbnailUrls, setThumbnailUrls] = useState<{ [key: string]: string }>(
    {}
  );
  const { data: user } = useUser();
  const playerRef = useRef<ReactPlayer | null>(null);
  const [videoDurations, setVideoDurations] = useState<{
    [key: string]: number;
  }>({});
  const [supabasePlaylist, setSupabasePlaylist] = useState<{ [key: string]: Json }[]>([]);

  const fetchPlaylist = async (page: number, type: string, reset = false) => {
    try {
      const highlightsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/playerhighlights?playerID=${playerId}&page=${page}&type=${type}`
      );
      const highlightsData = await highlightsResponse.json();
      const highlightVideos = highlightsData.highlights || [];

      const isPitchingVideo = highlightVideos.some(
        (video: { tagged_player_keys: any[] }) =>
          video.tagged_player_keys?.some(
            (player: any) =>
              player.Key === parseInt(playerId) && player.Position === "p"
          )
      );

      if (isPitchingVideo) {
        setIsPitcher(true);
      }

      setPlaylists((prev) => ({
        ...prev,
        [type]: reset
          ? highlightVideos
          : [
              ...prev[type],
              ...highlightVideos.filter(
                (video: {
                  id:
                    | string
                    | number
                    | boolean
                    | Json[]
                    | { [key: string]: Json }
                    | null;
                }) => !prev[type].some((prevVideo) => prevVideo.id === video.id)
              ),
            ],
      }));

      if (highlightVideos.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching playlist:", error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchPlaylist(1, "h", true);
    fetchPlaylist(1, "a", true);
    fetchPlaylist(1, "l", true);
    fetchPlaylist(1, "p", true);
  }, []);

  useEffect(() => {
    const fetchSupabasePlaylist = async () => {
      if (user) {
        const { data: playlistData, error } = await supabaseBrowser()
          .from("playlists")
          .select("playlist")
          .eq("user_id", user.id)
          .eq("player_id", playerId)
          .single();
  
        if (error) {
          console.error("Error fetching playlist from Supabase:", error);
        } else if (playlistData) {
          const playlist = playlistData.playlist as { [key: string]: Json }[];
          setSupabasePlaylist(playlist);
        }
      }
    };
  
    fetchSupabasePlaylist();
  }, [user, playerId]);

  useEffect(() => {
    setCurrentVideoIndex(0);
    setHasMore(true);
    setPage(1);
  }, [type]);

  useEffect(() => {
    if (type === "h" && supabasePlaylist.length > 0) {
      setCurrentVideoIndex(0);
    } else if (playlists[type].length > 0) {
      setCurrentVideoIndex(0);
    }
  }, [playlists, supabasePlaylist, type]);

  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    const currentVideo = type === "h" && supabasePlaylist.length > 0
      ? supabasePlaylist[currentVideoIndex]
      : playlists[type][currentVideoIndex];

    if (
      playedSeconds >=
      (currentVideo.start_time as number) + (currentVideo.duration as number)
    ) {
      handleNextVideo();
    }
  };

  const handleNextVideo = () => {
    const playlistLength = type === "h" && supabasePlaylist.length > 0
      ? supabasePlaylist.length
      : playlists[type].length;

    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % playlistLength);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentVideoIndex(index);
  };

  const loadMoreVideos = () => {
    fetchPlaylist(page + 1, type);
    setPage((prevPage) => prevPage + 1);
  };

  const seekToStartTime = useCallback(() => {
    const currentVideo = type === "h" && supabasePlaylist.length > 0
      ? supabasePlaylist[currentVideoIndex]
      : playlists[type][currentVideoIndex];

    if (
      playerRef.current &&
      currentVideo &&
      isFinite(currentVideo.start_time as number)
    ) {
      playerRef.current.seekTo(currentVideo.start_time as number, "seconds");
    }
  }, [currentVideoIndex, playlists, supabasePlaylist, type]);

  useEffect(() => {
    seekToStartTime();
  }, [currentVideoIndex, seekToStartTime]);

  const handleReady = () => {
    const internalPlayer = playerRef.current?.getInternalPlayer("hls");
    if (internalPlayer) {
      internalPlayer.currentLevel = -1;
      seekToStartTime();
    }

    const currentVideo = type === "h" && supabasePlaylist.length > 0
      ? supabasePlaylist[currentVideoIndex]
      : playlists[type][currentVideoIndex];

    if (playerRef.current && currentVideo.id) {
      const duration = playerRef.current.getDuration();
      setVideoDurations((prevDurations) => ({
        ...prevDurations,
        [currentVideo.id as string]: duration,
      }));
    }
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if ((type === "h" && supabasePlaylist.length === 0 && playlists[type].length === 0) || (type !== "h" && playlists[type].length === 0)) {
    return <VideoSkeleton />;
  }

  const currentVideo = type === "h" && supabasePlaylist.length > 0
    ? supabasePlaylist[currentVideoIndex]
    : playlists[type][currentVideoIndex];

  const updateThumbnailUrl = (videoId: string, url: string) => {
    setThumbnailUrls((prevUrls) => ({
      ...prevUrls,
      [videoId]: url,
    }));
  };

  const renderThumbnail = (video: any) => {
    const thumbnailUrl =
      thumbnailUrls[video.id] ||
      video.thumbnailUrl ||
      "https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/638252106298352027-DKPlusHP%20(1).webp";

    return (
      <Image
        alt="Thumbnail"
        className="aspect-video rounded-lg object-cover h-full w-auto"
        height={50}
        src={thumbnailUrl}
        width={130}
        onError={() => {
          updateThumbnailUrl(
            video.id,
            "https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/638252106298352027-DKPlusHP%20(1).webp"
          );
        }}
      />
    );
  };

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
            src="https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/dkPlus_icon_inverse.png"
            width={55}
            height={10}
            alt=""
          />
        </Badge>
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-4">
      <Tabs defaultValue="h" onValueChange={(value) => setType(value)}>
        <TabsList>
          <TabsTrigger value="h">Highlights</TabsTrigger>
          <TabsTrigger value="a">Full At-Bats</TabsTrigger>
          <TabsTrigger value="l">Last Pitch</TabsTrigger>
          {isPitcher && <TabsTrigger value="p">Pitching</TabsTrigger>}
        </TabsList>
        <TabsContent value={type}>
          <InfiniteScroll
            dataLength={type === "h" && supabasePlaylist.length > 0 ? supabasePlaylist.length : playlists[type].length}
            next={loadMoreVideos}
            hasMore={hasMore}
            loader={""}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
              <div className="w-full overflow-hidden rounded-lg relative">
                <div className="aspect-w-16 aspect-h-9">
                  <ReactPlayer
                    ref={playerRef}
                    url={currentVideo.url as string}
                    playing
                    controls
                    width="100%"
                    height="100%"
                    onProgress={handleProgress}
                    onEnded={handleNextVideo}
                    onReady={handleReady}
                    config={{
                      file: {
                        hlsOptions: {
                          autoStartLoad: true,
                          startPosition: -1,
                          capLevelToPlayerSize: true,
                          maxBufferLength: 30,
                          maxMaxBufferLength: 60,
                        },
                      },
                    }}
                  />
                </div>

                {currentVideo.title && (
                  <div className="absolute text-white inset-x-0 top-0 p-4 w-full overflow-hidden rounded-lg bg-gradient-to-b from-black/50 to-transparent">
                    <div className="line-clamp-1">
                      {getTitle(currentVideo.title as string)}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 max-h-[413px] overflow-y-auto">
                {(type === "h" && supabasePlaylist.length > 0 ? supabasePlaylist : playlists[type]).map((video, index) => (
                  <div
                    key={String(video.id)}
                    className={`flex items-start gap-4 relative cursor-pointer h-24 shadow-lg border border-gray-100 rounded-lg ${
                      index === currentVideoIndex
                        ? "border border-gray-300 rounded-lg shadow-sm p-0 bg-gray-100"
                        : ""
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    {renderThumbnail(video)}
                    {video.title && renderOverlayBadge(video.title as string)}
                    <div className="absolute bottom-2 left-2 text-white text-xs">
                      {video.duration
                        ? formatDuration(video.duration as number)
                        : video.id && videoDurations[video.id as string]
                        ? formatDuration(videoDurations[video.id as string])
                        : ""}
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
          </InfiniteScroll>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoPlayer;

