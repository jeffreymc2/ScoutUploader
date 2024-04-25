"use client";

import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { HighlightVideo } from "@/lib/types/types";
import ReactPlayer from "react-player";
import Video from "next-video";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface HighlightMediaCardProps {
  highlight: HighlightVideo;
}

export const HighlightMediaCard: React.FC<HighlightMediaCardProps> = ({
  highlight,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  // const [isReady, setIsReady] = useState(false);



  const handleDialogOpen = () => {
    setIsOpen(true);
   
  };

  const getTitleWithoutBrackets = (title: string) => {
    const bracketRegex = /\[(.*?)\]/;
    const match = title.match(bracketRegex);
    return match ? match[1] : title;
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
        <Badge variant="secondary">{titleWithoutBrackets}</Badge>
      </div>
    );
  };

  return (
    <>
      <Card className="m-0 p-0 rounded-lg">
        <CardContent className="object-cover rounded-lg m-0 p-0 relative">
          <div
            className="relative w-full h-48 shadow-sm rounded-lg cursor-pointer"
            onClick={handleDialogOpen}
          >
            <Image
              src={highlight.thumbnailUrl || "/placeholder.png"}
              alt={`Thumbnail for ${highlight.title || "Highlight"}`}
              fill={true}
              className="rounded-lg object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.4}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.4}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            {renderOverlayBadge(highlight.title)}
          </div>
        </CardContent>
        <CardFooter>
          <div>
          {highlight.title && (
              <p className="text-sm leading-4 font-bold text-gray-600 mt-2">
                {getTitle(highlight.title)}
              </p>
            )}
             {highlight.description && (
              <p className="text-xs mt-1">{highlight.description}</p>
            )}
          </div>
        </CardFooter>
      </Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[66vw] flex items-center justify-center bg-white border-0 border-transparent">
          <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
            <Video
              ref={playerRef}
              className="rounded-lg absolute top-0 left-0"
              src={highlight.url}
              autoPlay={true}
              preload="auto"
              startTime={highlight.start_time}
              placeholder={highlight.thumbnailUrl || "/placeholder.png"}
            />
           
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
