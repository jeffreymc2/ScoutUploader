"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Player from "next-video/player";
import { VideoSkeleton } from "@/components/ui/skeletons";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button } from "@/components/ui/button";
import {
  PlayIcon,
  PauseIcon,
  RewindIcon,
  FastForwardIcon,
  StarIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import useUser from "@/app/hook/useUser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { debounce } from "lodash";

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
  const [currentTime, setCurrentTime] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { data: user } = useUser();
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [tab, setTab] = useState<"s" | "h" | "a" | "p" | "c">("s");
  const [type, setType] = useState<"h" | "a" | "l" | "s" | "d" | "t" | "hr" | "iphr" | "dp" | "so" | "dp,so" | "l,s,d,t,hr,iphr">("h");
  const [position, setPosition] = useState<"b" | "p" | "">("");
  const [userPlaylist, setUserPlaylist] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasCustomPlaylist, setHasCustomPlaylist] = useState(false);
  const [thumbnailUrls, setThumbnailUrls] = useState<{ [key: string]: string }>({});
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showcaseVideos, setShowcaseVideos] = useState<Video[]>([]);

  const fetchPlaylist = useCallback(async (
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

      setPlaylists((prev) => {
        const updatedPlaylists = {
          ...prev,
          [type + position]: reset
            ? videos
            : [...(prev[type + position] || []), ...videos],
        };
        return updatedPlaylists;
      });

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
  }, [playerId]);

  const fetchInitialData = useCallback(async (type: string, position: string = "") => {
    setIsLoading(true);
    setNoResults(false);
    setPage(1);
    setHasMore(true);
    setPlaylists({});
    await fetchPlaylist(1, type, position, true);
  }, [fetchPlaylist]);

  const fetchSupabasePlaylist = useCallback(async (): Promise<Video[]> => {
    if (!user) {
      console.warn("User is not authenticated.");
      return [];
    }

    try {
      const { data: playlistData, error } = await supabaseBrowser()
        .from("playlists")
        .select("playlist")
        .eq("user_id", user.id)
        .eq("player_id", playerId)
        .single();

      if (error) {
        console.error("Error fetching playlist from Supabase:", error);
        return [];
      }

      if (!playlistData || !playlistData.playlist) {
        console.warn("No playlist found for the given user and player ID.");
        return [];
      }

      return playlistData.playlist as unknown as Video[];
    } catch (err) {
      console.error("Unexpected error fetching playlist from Supabase:", err);
      return [];
    }
  }, [user, playerId]);

  const fetchShowcaseVideos = useCallback(async (): Promise<Video[]> => {
    try {
      const response = await fetch(`/api/blive/?playerID=${playerId}`);

      if (!response.ok) {
        throw new Error(`Error fetching showcase videos: ${response.statusText}`);
      }

      const videos: Video[] = await response.json();
      return videos;
    } catch (error) {
      console.error("Error fetching showcase videos:", error);
      return [];
    }
  }, [playerId]);

  useEffect(() => {
    const initializeData = async () => {
      const supabasePlaylist = await fetchSupabasePlaylist();
      setUserPlaylist(supabasePlaylist);
      setHasCustomPlaylist(supabasePlaylist.length > 0);

      const showcaseVideos = await fetchShowcaseVideos();
      setShowcaseVideos(showcaseVideos);

      let initialTab: "a" | "c" | "h" | "p" | "s" = "h";

      if (supabasePlaylist.length > 0) {
        initialTab = "c";
      } else if (showcaseVideos.length > 0) {
        initialTab = "s";
      }

      setTab(initialTab);
      await fetchInitialData(initialTab === "h" ? "h" : initialTab, "");
    };

    initializeData();
  }, [playerId, user, fetchSupabasePlaylist, fetchShowcaseVideos, fetchInitialData]);

  useEffect(() => {
    if (hasCustomPlaylist) {
      setTab("c");
    } else {
      fetchInitialData("h", "");
    }
  }, [hasCustomPlaylist, fetchInitialData]);

  const getCurrentPlaylist = useMemo(() => {
    if (tab === "c") return userPlaylist;
    if (tab === "s") return showcaseVideos;

    let playlist: Video[] = [];
    if (type === "h") {
      playlist = [
        ...new Map(
          [...supabaseHighlights, ...(playlists[type] || [])].map((video) => [
            `${video.id}-${video.url}`,
            video,
          ])
        ).values(),
      ];
    } else {
      playlist = [
        ...new Map(
          [...(playlists[type + position] || [])].map((video) => [
            `${video.id}-${video.url}`,
            video,
          ])
        ).values(),
      ];
    }
    return playlist;
  }, [tab, userPlaylist, showcaseVideos, type, position, supabaseHighlights, playlists]);

  const currentVideo = useMemo(() => getCurrentPlaylist[currentVideoIndex], [getCurrentPlaylist, currentVideoIndex]);

  const loadMoreVideos = useCallback(debounce(async () => {
    await fetchPlaylist(page, type, type === "h" ? "" : position);
  }, 200), [fetchPlaylist, page, type, position]);

  const handleNextVideo = useCallback(() => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % getCurrentPlaylist.length);
    setIsTransitioning(false);
  }, [getCurrentPlaylist]);

  const handleProgress = useCallback(({ playedSeconds }: { playedSeconds: number }) => {
    if (currentVideo?.duration === undefined) {
      return;
    }

    if (
      currentVideo?.duration &&
      playedSeconds >= currentVideo.duration &&
      !isTransitioning
    ) {
      setIsTransitioning(true);
      handleNextVideo();
    }
  }, [currentVideo, isTransitioning, handleNextVideo]);

  useEffect(() => {
    if (currentVideo && isPlaying) {
      const duration = currentVideo.duration || playerRef.current?.duration;
      if (duration) {
        const timer = setTimeout(() => {
          handleNextVideo();
        }, duration * 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [currentVideo, isPlaying, handleNextVideo]);

  const handleThumbnailClick = useCallback((index: number) => {
    setCurrentVideoIndex(index);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      playerRef.current?.pause();
    } else {
      playerRef.current?.play();
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  const handleSeek = useCallback((seconds: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime += seconds;
    }
  }, []);

  const formatDuration = useCallback((duration: number | undefined) => {
    if (!duration || duration < 0) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const getTitle = useCallback((title?: string) => {
    if (!title) return "";
    if (title.includes("9999")) {
      return title.replace("9999", "");
    }
    const bracketRegex = /\[(.*?)\]/;
    const match = title.match(bracketRegex);
    return match ? title.replace(match[0], "") : title;
  }, []);

  const handleLike = useCallback(() => {
    setIsLiked((prev) => !prev);
    // Add logic to update the like status on the backend or perform any other actions
  }, []);

  const handleFavorite = useCallback(() => {
    setIsFavorite((prev) => !prev);
    // Add logic to update the favorite status on the backend or perform any other actions
  }, []);

  const updateThumbnailUrl = useCallback((videoId: string, url: string) => {
    setThumbnailUrls((prevUrls) => ({
      ...prevUrls,
      [videoId]: url,
    }));
  }, []);

const renderThumbnail = useCallback((video: Video) => {
  const thumbnailUrl =
    thumbnailUrls[video.id] ||
    video.thumbnailUrl ||
    "https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/638252106298352027-DKPlusHP%20(1).webp";

  return (
    <div className="w-[130px] h-full relative">
      <Image
        alt="Thumbnail"
        src={thumbnailUrl}
        fill
        className="rounded-lg w-fuil h-full object-cover"
        onError={() => {
          updateThumbnailUrl(
            video.id as string,
            "https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/638252106298352027-DKPlusHP%20(1).webp"
          );
        }}
      />
    </div>
  );
}, [thumbnailUrls, updateThumbnailUrl]);

  const renderOverlayBadge = useCallback(() => {
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
  }, []);

  const handleTabChange = useCallback(async (value: "s" | "a" | "p" | "c" | "h") => {
    setTab(value);
    if (value === "h") {
      setType("h");
      setPosition("");
      await fetchInitialData("h", "");
    } else if (value === "a") {
      setType("a");
      setPosition("b");
      await fetchInitialData("a", "b");
    } else if (value === "p") {
      setType("a");
      setPosition("p");
      await fetchInitialData("a", "p");
    } else if (value === "s") {
      setCurrentVideoIndex(0);
    }
    setCurrentVideoIndex(0);
  }, [fetchInitialData]);

  const handleTypeChange = useCallback(async (value: string) => {
    setType(value as any);
    setCurrentVideoIndex(0);
    await fetchInitialData(value, position);
  }, [fetchInitialData, position]);

  const renderTypeOptions = useCallback(() => {
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
    if (position === "") {
      return (
        <>
          <SelectItem value="h">
            <span>All</span>
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
          <SelectItem value="h,so">
            <span>Strikeout {"(P)"}</span>
          </SelectItem>
        </>
      );
    }
    return null;
  }, [position]);

  return (
      <div className="p-4 lg:p-4">
        <Tabs
          defaultValue={tab}
          value={tab}
          onValueChange={(value) => handleTabChange(value as "s" | "h" | "a" | "p" | "c")}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
            <div className="overflow-x-auto pb-2 lg:pb-0">
              <TabsList className="w-max lg:w-auto flex-nowrap whitespace-nowrap">
                {hasCustomPlaylist && (
                  <TabsTrigger value="c" className="flex-shrink-0">Featured Playlist</TabsTrigger>
                )}
                <TabsTrigger value="s" className="flex-shrink-0">Showcase</TabsTrigger>
                <TabsTrigger value="h" className="flex-shrink-0">Highlights</TabsTrigger>
                <TabsTrigger value="a" className="flex-shrink-0">Full At-Bats</TabsTrigger>
                <TabsTrigger value="p" className="flex-shrink-0">Pitching</TabsTrigger>
              </TabsList>
            </div>
            {tab !== "c" && tab !== "s" && (
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
          ) : getCurrentPlaylist.length === 0 ? (
            <VideoSkeleton noResults={true} isLoading={false} />
          ) : (
            <InfiniteScroll
              dataLength={getCurrentPlaylist.length}
              next={loadMoreVideos}
              hasMore={hasMore}
              loader={""}
            >
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 ">
                <div className="w-full overflow-hidden rounded-lg relative bg-gray-100">
                  <div className="aspect-w-16 aspect-h-9 lg:aspect-none lg:m-0 p-0 lg:p-0 sm:h-[415px]">
                    <Player
                      key={`${currentVideo.id}-${currentVideo.url}`}
                      ref={playerRef}
                      src={currentVideo.url}
                      poster={thumbnailUrls[currentVideo.id as string] || ""}
                      playsInline={true}
                      onProgress={(evt: ProgressEvent<EventTarget>) =>
                        handleProgress(
                          evt as unknown as { playedSeconds: number }
                        )
                      }
                      onEnded={handleNextVideo}
                      autoPlay
                      volume={0.5}
                      onTimeUpdate={(evt: Event) =>
                        setCurrentTime(
                          (evt.target as HTMLVideoElement).currentTime
                        )
                      }
                      muted={true}
                      blurDataURL={currentVideo.thumbnailUrl}
                      accentColor="#005cb9"
                      className="w-full h-full object-fill"
                      startTime={currentVideo?.start_time || 0}
                      
                    />
                  </div>
                  {/* Custom Controls */}
                  <div className="bg-gray-100 p-0 px-2 lg:px-0 lg:p-2 mt-0 flex items-center justify-between">
                    <div className="flex items-center gap-2 pl-2">
                      <ThumbsUpIcon
                        onClick={handleLike}
                        className={`text-xs h-4 w-4 ${
                          isLiked ? "text-blue-500" : ""
                        }`}
                      />
                      <StarIcon
                        onClick={handleFavorite}
                        className={`text-xs h-4 w-4 ${
                          isFavorite ? "text-blue-500" : ""
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-2 justify-center flex-grow">
                      <Button
                        variant="ghost"
                        onClick={() => handleSeek(-5)}
                        className="flex items-center justify-center p-1"
                      >
                        <RewindIcon className="mr-1 text-xs w-4 h-4" />5 s
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={handlePlayPause}
                        className="flex items-center justify-center p-1"
                      >
                        {isPlaying ? (
                          <PauseIcon className="mr-1 text-xs w-4 h-4" />
                        ) : (
                          <PlayIcon className="mr-1 text-xs w-4 h-4" />
                        )}
                        {isPlaying ? "Pause" : "Play"}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleSeek(5)}
                        className="flex items-center justify-center p-1"
                      >
                        <FastForwardIcon className="mr-1 text-xs w-4 h-4" />5 s
                      </Button>
                    </div>

                    <div className="flex items-center pr-2">
                      <div className="text-center text-xs">
                        {formatDuration(currentVideo?.duration || 0)}
                      </div>
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
                  {getCurrentPlaylist.map((video, index) => (
                    <div
                      key={`${video.id}-${video.url}`}
                      className={`flex items-start gap-4 relative cursor-pointer min-h-20 shadow-md border border-gray-100 rounded-lg ${
                        index === currentVideoIndex
                          ? "border border-gray-300 rounded-lg shadow-sm p-0 bg-gray-100"
                          : ""
                      }`}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <div className="w-[130px] h-full relative">
                      {renderThumbnail(video)}
                      </div>
                      {video.title && renderOverlayBadge()}
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

export default React.memo(VideoPlayer);