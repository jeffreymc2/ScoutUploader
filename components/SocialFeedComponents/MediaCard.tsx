// app/components/MediaCard.tsx
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
  PlayCircleIcon,
  ShareIcon,
  StarIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { useState } from "react";
import { Post } from "@/lib/types/types";
import Image from "next/image";
import { Skeleton } from "./Skeleton"; // Assuming you have a Skeleton component

interface MediaCardProps {
  media: Post;
}

export default function MediaCard({ media }: MediaCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Implement like functionality
    console.log(`Liked media with ID: ${media.id}`);
  };

  const handleComment = () => {
    // Implement comment functionality
    console.log(`Commented on media with ID: ${media.id}`);
  };

  const handleShare = () => {
    // Implement share functionality
    console.log(`Shared media with ID: ${media.id}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="secondary">{media.player_id || "Unknown"}</Badge>
          {media.featured_image && <StarIcon className="text-blue-500" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {media.isVideo ? (
            <>
              {/* Adjust height as needed */}
              <div className={`relative ${mediaLoaded ? 'hidden' : 'block'}`}>
              <video src={media.image} className="w-full" controls onLoad={() => setMediaLoaded(true)} />
              <PlayCircleIcon className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl" />
            </div>
            </>
          ) : (
            <>
                {/* Match the aspect ratio */}
                <Image
                    alt={media.title ?? ""}
                    className="w-full"
                    height={200}
                    src={media.image}
                    style={{
                        aspectRatio: "385/200",
                        objectFit: "cover",
                    }}
                    width={385}
                    onLoad={() => setMediaLoaded(true)}
                />
            </>
          )}
        </div>
        <h3 className="text-lg font-semibold mt-3">{media.title}</h3>
        <p className="text-sm text-gray-600">{media.description}</p>
      </CardContent>
      <CardFooter className="flex space-x-4">
        <Button variant="ghost" onClick={handleLike}>
          <ThumbsUpIcon className={`mr-1 ${isLiked ? "text-blue-500" : ""}`} />
          Like
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
  );
}
