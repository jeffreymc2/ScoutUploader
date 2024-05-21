"use client";
import { Badge } from "@/components/ui/badge";
import {
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquareIcon,
  ShareIcon,
  ThumbsUpIcon,
  PlayIcon,
  PauseIcon,
  RewindIcon,
  FastForwardIcon,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Post, Playlist, HighlightVideo } from "@/lib/types/types";
import Image from "next/image";
import React from "react";
import ReactPlayer from "react-player";
import LazyLoad from "react-lazyload";
import { Separator } from "@/components/ui/separator";
interface MediaCardProps {
  media: Post | Playlist | HighlightVideo;
}

export default function MediaCard({ media }: MediaCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const playerRef = useRef<ReactPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleLike = () => {
    if (!isLiked) {
      setLikeCount((prevCount) => prevCount + 1);
    } else {
      setLikeCount((prevCount) => Math.max(prevCount - 1, 0));
    }
    setIsLiked(!isLiked);
    console.log(`Liked media with ID: ${media.id}`);
  };

  const handleComment = () => {
    console.log(`Commented on media with ID: ${media.id}`);
  };

  const handleShare = () => {
    console.log(`Shared media with ID: ${media.id}`);
  };

  const isHighlightVideo = (
    media: Post | Playlist | HighlightVideo
  ): media is HighlightVideo => {
    return (media as HighlightVideo).url !== undefined;
  };

  const isPost = (media: Post | Playlist | HighlightVideo): media is Post => {
    return (media as Post).file_url !== undefined;
  };

  const getTitleWithoutBrackets = (title: string) => {
    const bracketRegex = /\[(.*?)\]/;
    const match = title.match(bracketRegex);
    return match ? match[1] : title;
  };

  const onReady = useCallback(() => {
    if (playerRef.current && isHighlightVideo(media)) {
      playerRef.current.seekTo(media.start_time as number, "seconds");
    }
  }, [playerRef.current, media]);

  const handleProgress = (state: { playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);

    if (isHighlightVideo(media)) {
      if (
        state.playedSeconds >=
        (media.start_time as number) + (media.duration as number)
      ) {
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % 1);
        setCurrentTime(0);
      }
    }
  };

  const getTitle = (title: string) => {
    const bracketRegex = /\[(.*?)\]/;
    const match = title.match(bracketRegex);
    return match ? title.replace(match[0], "") : title;
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
          />
        </Badge>
      </div>
    );
  };

  const filterDescription = (description: string | undefined) => {
    if (description) {
      return description.replace(/9999/g, "");
    }
    return description;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (amount: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(
        playerRef.current.getCurrentTime() + amount,
        "seconds"
      );
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (playerRef.current) {
            if (entry.isIntersecting) {
              playerRef.current.getInternalPlayer().play();
            } else {
              playerRef.current.getInternalPlayer().pause();
              if (isHighlightVideo(media)) {
                playerRef.current.seekTo(media.start_time as number, "seconds");
              }
            }
          }
        });
      },
      {
        threshold: 0.5, // Play the video when 50% of it is visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [media]);

  return (
    <div ref={containerRef}>
      <div className="flex items-center my-4 mx-auto">
        <Image
          src="https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/dkPlus_horizontal_primary%20(3).png"
          alt="Image"
          height={75}
          width={250}
          className="mr-4"
        />
        <h2 className="font-pgFont text-2xl">Highlights</h2>
      </div>
      <Card className="w-full mb-4 rounded-lg shadow-lg">
        <CardContent className="mt-4">
          {isHighlightVideo(media) && (
            <div
              className="relative"
              style={{
                paddingBottom: "100%",
                minHeight: "450px",
              }}
            >
              <LazyLoad offset={100} height={450}>
                <ReactPlayer
                  url={media.url as string}
                  controls={false} // Disable controls
                  playing={isPlaying}
                  muted={true}
                  volume={0}
                  width="100%"
                  height="100%"
                  onProgress={handleProgress}
                  onReady={onReady}
                  className="absolute top-0 left-0 w-full h-full rounded-lg object-cover"
                  ref={playerRef}
                  config={{
                    file: {
                      attributes: {
                        playsInline: true, // Important for iOS
                        preload: "auto", // Preload video
                        style: {
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        },
                      },
                      hlsOptions: {
                        startLevel: 0, // Start with the lowest quality
                        maxBufferLength: 30, // Adjust buffer length to manage quality adaptation
                        maxMaxBufferLength: 60, // Adjust maximum buffer length
                        liveSyncDurationCount: 3, // Adjust live sync duration
                      },
                    },
                  }}
                />
              </LazyLoad>
            </div>
          )}
          {isPost(media) && (
            <div className="relative" style={{ paddingBottom: "100%" }}>
              <LazyLoad offset={100} height={500}>
                {media.is_video ? (
                  <ReactPlayer
                    url={media.file_url as string}
                    controls={false} // Disable controls
                    playing={isPlaying}
                    muted={true}
                    playsInline
                    volume={0}
                    width="100%"
                    height="100%"
                    preload="auto" // Preload video
                    className="absolute top-0 left-0 w-full h-full rounded-lg object-cover"
                    config={{
                      file: {
                        attributes: {
                          playsInline: true, // Important for iOS
                          preload: "auto", // Preload video
                          style: {
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <Image
                    src={media.file_url as string}
                    alt={media.title || "Image"}
                    width={500}
                    height={500}
                    className="absolute top-0 left-0 w-full h-full rounded-lg object-cover"
                  />
                )}
              </LazyLoad>
            </div>
          )}
          <div className="grid grid-cols-3 items-center justify-center gap-4 my-2">
            <Button variant="ghost" onClick={() => handleSeek(-5)}>
              <RewindIcon className="mr-1" />
              5 secs
            </Button>
            <Button variant="ghost" onClick={handlePlayPause}>
              {isPlaying ? (
                <PauseIcon className="mr-1" />
              ) : (
                <PlayIcon className="mr-1" />
              )}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button variant="ghost" onClick={() => handleSeek(5)}>
              <FastForwardIcon className="mr-1" />
              5 secs
            </Button>
          </div>
          <Separator  />
          <div className="px-4 pt-2">    
          {media.title && (
            <p className="text-md leading-4 font-bold text-gray-600 mt-1">
              {getTitle(media.title)}
            </p>
          )}
          {filterDescription(media.description) && (
            <p className="text-xs mt-1">
              {filterDescription(media.description)}
            </p>
          )}
          </div>
        </CardContent>
        <div className="flex items-center justify-between px-4 py-0">
        <Separator  />
        </div>

          <div className="grid grid-cols-3 items-center justify-center gap-4 my-2">

          <Button variant="ghost" onClick={handleLike}>
            <ThumbsUpIcon
              className={`mr-1 ${isLiked ? "text-blue-500" : ""}`}
            />
            {likeCount > 0 ? `${likeCount} Likes` : "Like"}
          </Button>
          <Button variant="ghost" onClick={handleComment}>
            <MessageSquareIcon className="mr-1" />
            Comment
          </Button>
          <Button variant="ghost" onClick={handleShare}>
            <ShareIcon className="mr-1" />
            Share
          </Button>
        </div>
      </Card>
    </div>
  );
}
