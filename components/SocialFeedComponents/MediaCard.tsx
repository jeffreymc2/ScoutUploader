// app/components/MediaCard.tsx
"use client";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquareIcon, ShareIcon, ThumbsUpIcon } from "lucide-react";
import { useState } from "react";
import { Post, Playlist, HighlightVideo } from "@/lib/types/types";
import Image from "next/image";
import React from "react";
import ReactPlayer from "react-player";

interface MediaCardProps {
  media: Post | Playlist | HighlightVideo;
}

export default function MediaCard({ media }: MediaCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

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

  const isHighlightVideo = (media: Post | Playlist | HighlightVideo): media is HighlightVideo => {
    return (media as HighlightVideo).url !== undefined;
  };

  const getTitleWithoutBrackets = (title: string) => {
    const bracketRegex = /\[(.*?)\]/;
    const match = title.match(bracketRegex);
    return match ? match[1] : title;
  };

  const playerRef = React.useRef<ReactPlayer | null>(null);

  const onReady = React.useCallback(() => {
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
          <Image className="mr-2" src={"https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/dkPlus_icon_inverse.png"} width={55} height={10} alt={""} />
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

  return (
    <>
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
            <ReactPlayer
              url={media.url as string}
              controls={true}
              playing={false}
              muted={true}
              volume={0}
              width={"100%"}
              height={"100%"}
              onProgress={handleProgress}
              onReady={onReady}
              className="w-full h-full rounded-lg object-cover"
              ref={playerRef}
            />
          )}
          {media.title && (
            <p className="text-md leading-4 font-bold text-gray-600 mt-2">
              {getTitle(media.title)}
            </p>
          )}
          {filterDescription(media.description) && (
            <p className="text-xs mt-1">
              {filterDescription(media.description)}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex space-x-4">
          <Button variant="ghost" onClick={handleLike}>
            <ThumbsUpIcon className={`mr-1 ${isLiked ? "text-blue-500" : ""}`} />
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
        </CardFooter>
      </Card>
    </>
  );
}