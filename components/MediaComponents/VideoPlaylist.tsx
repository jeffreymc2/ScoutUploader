"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import Player from "next-video/player";
import { VideoSkeleton } from "@/components/ui/skeletons";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon, RewindIcon, FastForwardIcon } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import useUser from "@/app/hook/useUser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VideoPlayerProps {
  playerId: string;
}

interface Video {
  highlight_type: string;
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
  const [playlists, setPlaylists] = useState<{ [key: string]: Video[] }>({});
  const [supabaseHighlights, setSupabaseHighlights] = useState<Video[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [tab, setTab] = useState<"h" | "a" | "p">("h");
  const [type, setType] = useState<
    | "h"
    | "a"
    | "l"
    | "s"
    | "d"
    | "t"
    | "hr"
    | "iphr"
    | "dp"
    | "so"
    | "dp,so"
    | "l,s,d,t,hr,iphr"
  >("h");
  const [position, setPosition] = useState<"b" | "p" | "">("");
  const [userPlaylist, setUserPlaylist] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { data: user } = useUser();
  const [thumbnailUrls, setThumbnailUrls] = useState<{ [key: string]: string }>(
    {}
  );
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  const fetchPlaylist = async (
    page: number,
    type: string,
    position: string = "",
    reset = false
  ) => {
    try {
      let url = `/api/playerhighlights?playerID=${playerId}&page=${page}&type=${type}&limit=20`;
      if (position) {
        url += `&position=${position}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error(
          `Error fetching highlights: ${response.status} ${response.statusText}`
        );
        console.error(`Error details: ${JSON.stringify(errorDetails)}`);
        setHasMore(false);
        return;
      }

      const data = await response.json();
      const videos = data.highlights || [];

      setPlaylists((prev) => ({
        ...prev,
        [type + position]: reset
          ? videos
          : [...(prev[type + position] || []), ...videos],
      }));

      setHasMore(data.next !== undefined);
      setNoResults(videos.length === 0);
      setIsLoading(false);
      if (data.next) setPage(page + 1);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      setHasMore(false);
      setNoResults(true);
      setIsLoading(false);
    }
  };

  const fetchInitialData = async (type: string, position: string = "") => {
    setIsLoading(true);
    setNoResults(false);
    setPage(1);
    setHasMore(true);
    setPlaylists({});
    await fetchPlaylist(1, type, position, true);
  };

  useEffect(() => {
    fetchInitialData("h", ""); // Fetch highlights without position
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
          const playlist = playlistData.playlist as any as Video[];
          setUserPlaylist(playlist);
        }
      }
    };

    fetchSupabasePlaylist();
  }, [user, playerId]);

  const getCurrentPlaylist = () => {
    let playlist: any[] = [];
    if (type === "h") {
      // Highlights do not use position
      playlist = [
        ...new Map(
          [...supabaseHighlights, ...(playlists[type] || [])].map((video) => [
            video.id,
            video,
          ])
        ).values(),
      ];
    } else {
      // Other types use position
      playlist = [
        ...new Map(
          [...(playlists[type + position] || [])].map((video) => [
            video.id,
            video,
          ])
        ).values(),
      ];
    }
    return playlist;
  };

  const loadMoreVideos = async () => {
    await fetchPlaylist(page, type, type === "h" ? "" : position);
  };

  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    const currentVideo = getCurrentVideo();
    if (
      currentVideo?.duration &&
      playedSeconds >= (currentVideo.start_time ?? 0) + currentVideo.duration
    ) {
      handleNextVideo();
    }
  };

  const handleNextVideo = async () => {
    setCurrentVideoIndex(
      (prevIndex) => (prevIndex + 1) % getCurrentPlaylist().length
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentVideoIndex(index);
  };

  const seekToStartTime = useCallback(() => {
    const currentVideo = getCurrentVideo();
    if (playerRef.current && currentVideo) {
      const startTime =
        typeof currentVideo.start_time === "number" &&
        isFinite(currentVideo.start_time)
          ? currentVideo.start_time
          : 0;
      playerRef.current.currentTime = startTime;
    }
  }, [currentVideoIndex, playlists, type, position]);

  useEffect(() => {
    seekToStartTime();
  }, [currentVideoIndex, seekToStartTime]);

  const handleReady = () => {
    seekToStartTime();
    const currentVideo = getCurrentVideo();
    // if (currentVideo && currentVideo.url.endsWith(".m3u8")) {
    //   // Handle HLS video if needed
    // }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      playerRef.current?.pause();
    } else {
      playerRef.current?.play();
    }
    setIsPlaying((prev) => !prev);
  };

  const handleSeek = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime += seconds;
    }
  };

  const getCurrentVideo = () => {
    return getCurrentPlaylist()[currentVideoIndex];
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const currentPlaylist = getCurrentPlaylist();

  if (isLoading) {
    return <VideoSkeleton isLoading={true} noResults={false} />;
  }

  const currentVideo = getCurrentVideo();

  const getTitle = (title?: string) => {
    if (!title) return "";
    if (title.includes("9999")) {
      return title.replace("9999", "");
    }
    const bracketRegex = /\[(.*?)\]/;
    const match = title.match(bracketRegex);
    return match ? title.replace(match[0], "") : title;
  };

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
          updateThumbnailUrl(
            video.id as string,
            "https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/638252106298352027-DKPlusHP%20(1).webp"
          );
        }}
      />
    );
  };

  const filterTitle = (title: string | undefined) => {
    if (title) {
      return title.replace(/9999/g, "");
    }
    return title;
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

  const handleTabChange = async (value: "h" | "a" | "p") => {
    setTab(value);
    if (value === "h") {
      setType("h");
      setPosition("");
      await fetchInitialData("h", "");
    } else if (value === "a") {
      setType("a"); // Set to default types for at-bats
      setPosition("b");
      await fetchInitialData("a", "b");
    } else if (value === "p") {
      setType("a"); // Set to default types for pitching
      setPosition("p");
      await fetchInitialData("a", "p");
    }
    setCurrentVideoIndex(0);
  };

  const handleTypeChange = async (value: string) => {
    setType(
      value as
        | "a"
        | "l"
        | "s"
        | "d"
        | "t"
        | "hr"
        | "iphr"
        | "dp"
        | "so"
        | "dp,so"
        | "l,s,d,t,hr,iphr"
    );
    setCurrentVideoIndex(0);
    await fetchInitialData(value, position);
  };

  const renderTypeOptions = () => {
    if (position === "b") {
      return (
        <>
          <SelectItem value="a">
            <span>All Batting</span>
          </SelectItem>
          <SelectItem value="l">
            <span>Last Pitch</span>
          </SelectItem>
          <SelectItem value="h,s">
            <span>Single</span>
          </SelectItem>
          <SelectItem value="h,d">
            <span>Double</span>
          </SelectItem>
          <SelectItem value="h,t">
            <span>Triple</span>
          </SelectItem>
          <SelectItem value="h,hr">
            <span>Homerun</span>
          </SelectItem>
          <SelectItem value="h,iphr">
            <span>In-Park Homerun</span>
          </SelectItem>
        </>
      );
    } else if (position === "p") {
      return (
        <>
          <SelectItem value="a">
            <span>All</span>
          </SelectItem>
          <SelectItem value="a,dp">
            <span>Double Play</span>
          </SelectItem>
          <SelectItem value="h,so">
            <span>Strikeout</span>
          </SelectItem>
        </>
      );
    }
    return null;
  };

  return (
    <div className="p-4 lg:p-4">
      <Tabs
        defaultValue="h"
        value={tab}
        onValueChange={(value: string) =>
          handleTabChange(value as "h" | "a" | "p")
        }
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger value="h">Highlights</TabsTrigger>
            <TabsTrigger value="a">Full At-Bats</TabsTrigger>
            <TabsTrigger value="p">Pitching</TabsTrigger>
          </TabsList>
          {tab !== "h" && (
            <div className="mt-4 lg:mt-0 lg:ml-4">
              <Select onValueChange={handleTypeChange} value={type}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>{renderTypeOptions()}</SelectContent>
              </Select>
            </div>
          )}
        </div>
        <TabsContent value={tab}>
          {isLoading ? (
            <VideoSkeleton isLoading={true} noResults={false} />
          ) : currentPlaylist.length === 0 ? (
            <VideoSkeleton
              noResults={true}
              message="No video found. Switch tabs or adjust filter."
            />
          ) : (
            <InfiniteScroll
              dataLength={currentPlaylist.length}
              next={loadMoreVideos}
              hasMore={hasMore}
              loader={""}
            >
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 ">
                <div className="w-full overflow-hidden rounded-lg relative bg-gray-100">
                  <div className="aspect-w-16 aspect-h-9 lg:aspect-none lg:m-0 p-0 lg:p-0 -m-4">
                    <Player
                      ref={playerRef}
                      src={currentVideo.url}
                      poster={thumbnailUrls[currentVideo.id as string] || ""}
                      playsInline={true}
                      onProgress={(evt: ProgressEvent<EventTarget>) =>
                        handleProgress(
                          evt as unknown as { playedSeconds: number }
                        )
                      }
                      crossOrigin="anonymous"
                      onEnded={handleNextVideo}
                      autoPlay
                      volume={.5}
                      preload="auto"
                      muted={true}
                      blurDataURL={currentVideo.thumbnailUrl}
                      onLoadedData={handleReady}
                      accentColor="#005cb9"
                      className="w-full h-full object-fill"
                      startTime={currentVideo.start_time}
                    />
                  </div>
                  {/* Custom Controls */}
                  <div className="flex justify-center bg-gray-100 lg:p-2 pt-4 mt-0">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Button
                        variant="ghost"
                        onClick={() => handleSeek(-5)}
                        className="w-28"
                      >
                        <RewindIcon className="mr-1" />5 s
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={handlePlayPause}
                        className="w-28"
                      >
                        {isPlaying ? (
                          <PauseIcon className="mr-1" />
                        ) : (
                          <PlayIcon className="mr-1" />
                        )}
                        {isPlaying ? "Pause" : "Play"}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleSeek(5)}
                        className="w-28"
                      >
                        <FastForwardIcon className="mr-1" />5 s
                      </Button>
                    </div>
                  </div>
                  {currentVideo.title && (
                    <div className="absolute text-white inset-x-0 top-0 p-4 w-full overflow-hidden rounded-lg bg-gradient-to-b from-black/50 to-transparent">
                      <div className="line-clamp-1">
                        {getTitle(currentVideo.title)}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 max-h-[60vh] lg:max-h-[465px] overflow-y-auto">
                  {currentPlaylist.map((video, index) => (
                    <div
                      key={String(video.id)}
                      className={`flex items-start gap-4 relative cursor-pointer h-24 shadow-md border border-gray-100 rounded-lg ${
                        index === currentVideoIndex
                          ? "border border-gray-300 rounded-lg shadow-sm p-0 bg-gray-100"
                          : ""
                      }`}
                      onClick={() => handleThumbnailClick(index)}
                    >
                                         {renderThumbnail(video)}

                      {video.title && renderOverlayBadge(video.title)}
                      <div className="absolute bottom-2 left-2 text-white text-xs">
                        {video.duration ? formatDuration(video.duration) : ""}
                      </div>
                      <div className="text-sm">
                        <div className="font-medium line-clamp-2 mt-2">
                          {getTitle(video.title)}
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoPlayer;
