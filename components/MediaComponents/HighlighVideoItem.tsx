"use client";
import { CSSProperties, forwardRef, HTMLAttributes } from "react";
import { HighlightVideo } from "@/lib/types/types";
import { Card } from "../ui/card";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Video from "next-video";
import { RiDraggable } from "react-icons/ri";

type Props = {
  video: HighlightVideo;
  isOpacityEnabled?: boolean;
  isDragging?: boolean;
  dragHandleProps?: any;
} & HTMLAttributes<HTMLDivElement>;

const HighlightVideoItem = forwardRef<HTMLDivElement, Props>(
  function HighlightVideoItem(
    { video, isOpacityEnabled, isDragging, style, dragHandleProps, ...props },
    ref
  ) {
    const [isOpen, setIsOpen] = useState(false);

    const handleDialogOpen = () => {
      setIsOpen(true);
    };

    const handleDialogClose = () => {
      setIsOpen(false);
    };

    const getTitleWithoutBrackets = (title: string) => {
      const bracketRegex = /\[(.+?)\]/;
      const match = title.match(bracketRegex);
      return match ? match[1] : title;
    };

    const getTitle = (title: string) => {
      const bracketRegex = /\[(.+?)\]/;
      const match = title.match(bracketRegex);
      return match ? title.replace(match[0], "") : title;
    };

    const filterDescription = (description: string | undefined) => {
      if (description) {
        return description.replace(/9999/g, "");
      }
      return description;
    };

    const styles: CSSProperties = {
      opacity: isOpacityEnabled ? "0.4" : "1",
      cursor: isDragging ? "grabbing" : "grab",
      ...style,
    };

    return (
      <>
        <div className="grid">
          <Card className="flex items-center gap-4 rounded-lg bg-white mb-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Image
                  src={
                    video.thumbnailUrl ||
                    "https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/638252106298352027-DKPlusHP%20(1).webp"
                  }
                  alt="Image"
                  className="rounded-lg object-cover cursor-pointer"
                  height="94"
                  style={{ aspectRatio: "168/94", objectFit: "cover" }}
                  width="168"
                />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[850px]">
                <DialogHeader>
                  <DialogTitle>{getTitleWithoutBrackets(video.title)}</DialogTitle>
                  <DialogDescription>
                    {filterDescription(video.description)}
                  </DialogDescription>
                </DialogHeader>
                <Video 
                    src={video.url} 
                    className="object-cover rounded-md" 
                    startTime={video.start_time}
                    />
              </DialogContent>
            </Dialog>
            <div className="flex-1">
              {video.title && (
                <p className="text-sm leading-4 font-bold text-gray-600 mt-2">
                  {getTitle(video.title)}
                </p>
              )}
              {filterDescription(video.description) && (
                <p className="text-xs mt-1">{filterDescription(video.description)}</p>
              )}
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-white">
              <RiDraggable
                className="text-3xl text-gray-400"
                style={styles}
                {...dragHandleProps}
              />
            </div>
          </Card>
        </div>
      </>
    );
  }
);

export { HighlightVideoItem };
