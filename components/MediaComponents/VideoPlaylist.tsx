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

interface Video {
  id: string | number;
  url: string;
  title?: string;
  created?: string;
  description?: string;
  thumbnailUrl?: string;
  start_time?: number;
  duration?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ playerId }) => {
  const [playlists, setPlaylists] = useState<{ [key: string]: Video[] }>({
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

  const fetchPlaylist = async (page: number, type: string, reset = false) => {
    try {
      const highlightsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/playerhighlights?playerID=${playerId}&page=${page}&type=${type}`
      );
      const highlightsData = await highlightsResponse.json();
      const highlightVideos = highlightsData.highlights || [];

      const isPitchingVideo = highlightVideos.some((video: { tagged_player_keys: any[] }) =>
        video.tagged_player_keys?.some((player: any) => player.Key === parseInt(playerId) && player.Position === "p")
      );

      if (isPitchingVideo) {
        setIsPitcher(true);
      }

      setPlaylists((prev) => ({
        ...prev,
        [type]: reset ? highlightVideos : [...prev[type], ...highlightVideos.filter((video: { id: any }) => !prev[type].some((prevVideo) => prevVideo.id === video.id))],
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
    const fetchData = async () => {
      await Promise.all([
        fetchPlaylist(1, "h", true),
        fetchPlaylist(1, "a", true),
        fetchPlaylist(1, "l", true),
        fetchPlaylist(1, "p", true),
      ]);
    };
    fetchData();
  }, [playerId]);

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
          const playlist = playlistData.playlist as unknown as Video[];
          setPlaylists((prev) => ({
            ...prev,
            user: playlist,
          }));
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

  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    const currentVideo = playlists[type][currentVideoIndex];
    if (currentVideo?.duration && playedSeconds >= (currentVideo.start_time ?? 0) + currentVideo.duration) {
      handleNextVideo();
    }
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % playlists[type].length);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentVideoIndex(index);
  };

  const loadMoreVideos = () => {
    fetchPlaylist(page + 1, type);
    setPage((prevPage) => prevPage + 1);
  };

  const seekToStartTime = useCallback(() => {
    const currentVideo = playlists[type][currentVideoIndex];
    if (playerRef.current && currentVideo && typeof currentVideo.start_time === "number" && isFinite(currentVideo.start_time)) {
      playerRef.current.seekTo(currentVideo.start_time, "seconds");
    }
  }, [currentVideoIndex, playlists, type]);

  useEffect(() => {
    seekToStartTime();
  }, [currentVideoIndex, seekToStartTime]);

  const handleReady = () => {
    const currentVideo = playlists[type][currentVideoIndex];
    if (currentVideo && currentVideo.url.endsWith(".m3u8")) {
      const internalPlayer = playerRef.current?.getInternalPlayer("hls");
      if (internalPlayer) {
        internalPlayer.currentLevel = -1;
      }
    } else {
      seekToStartTime();
    }
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (playlists[type].length === 0) {
    return <VideoSkeleton />;
  }

  const currentVideo = playlists[type][currentVideoIndex];

  const updateThumbnailUrl = (videoId: string, url: string) => {
    setThumbnailUrls((prevUrls) => ({
      ...prevUrls,
      [videoId]: url,
    }));
  };

  const renderThumbnail = (video: Video) => {
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
          updateThumbnailUrl(video.id as string, "https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/638252106298352027-DKPlusHP%20(1).webp");
        }}
      />
    );
  };

  const getTitle = (title?: string) => {
    if (!title) return "";
    const bracketRegex = /\[(.*?)\]/;
    const match = title.match(bracketRegex);
    return match ? title.replace(match[0], "") : title;
  };

  const getTitleWithoutBrackets = (title?: string) => {
    if (!title) return "";
    const bracketRegex = /\[(.*?)\]/;
    const match = title.match(bracketRegex);
    return match ? match[1] : title;
  };

  const renderOverlayBadge = (title?: string) => {
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
            dataLength={playlists[type].length}
            next={loadMoreVideos}
            hasMore={hasMore}
            loader={""}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
              <div className="w-full overflow-hidden rounded-lg relative">
                <div className="aspect-w-16 aspect-h-9">
                  <ReactPlayer
                    ref={playerRef}
                    url={currentVideo.url}
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
                      {getTitle(currentVideo.title)}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 max-h-[413px] overflow-y-auto">
                {playlists[type].map((video, index) => (
                  <div
                    key={String(video.id)}
                    className={`flex items-start gap-4 relative cursor-pointer h-24 shadow-lg border border-gray-100 rounded-lg ${
                      index === currentVideoIndex ? "border border-gray-300 rounded-lg shadow-sm p-0 bg-gray-100" : ""
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    {renderThumbnail(video)}
                    {video.title && renderOverlayBadge(video.title)}
                    <div className="absolute bottom-2 left-2 text-white text-xs">
                      {video.duration ? formatDuration(video.duration) : ""}
                    </div>
                    <div className="text-sm">
                      <div className="font-medium line-clamp-2 mt-2">{getTitle(video.title)}</div>
                      <div className="text-xs text-gray-500 line-clamp-1 dark:text-gray-400">
                        {typeof video.created === "string" || typeof video.created === "number"
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
