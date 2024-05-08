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
} from "../ui/dialog";
import Video from "next-video";
import { RiDraggable } from "react-icons/ri";

type Props = {
  video: HighlightVideo;
  isOpacityEnabled?: boolean;
  isDragging?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const HighlightVideoItem = forwardRef<HTMLDivElement, Props>(
  function HighlightVideoItem(
    { video, isOpacityEnabled, isDragging, style, ...props },
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
      const bracketRegex = /\[(.*?)\]/;
      const match = title.match(bracketRegex);
      return match ? match[1] : title;
    };

    const getTitle = (title: string) => {
      const bracketRegex = /\[(.*?)\]/;
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
      transform: isDragging ? "scale(1.05)" : "scale(1)",
      ...style,
    };

    return (
      <>
        <div className="grid">
          <Card
            className="flex items-center gap-4 rounded-lg bg-white"
            onClick={handleDialogOpen}
            ref={ref}
            style={styles}
            {...props}
          >
            <Image
              src={
                video.thumbnailUrl ||
                "https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/638252106298352027-DKPlusHP%20(1).webp"
              }
              alt="Image"
              className="rounded-md object-cover"
              height="128"
              style={{ aspectRatio: "128/128", objectFit: "cover" }}
              width="128"
            />
            <div className="flex-1">
              {video.title && (
                <p className="text-sm leading-4 font-bold text-gray-600 mt-2">
                  {getTitle(video.title)}
                </p>
              )}
              {filterDescription(video.description) && (
                <p className="text-xs mt-1">
                  {filterDescription(video.description)}
                </p>
              )}
            </div>
            <RiDraggable className="text-3xl text-gray-400" />
          </Card>
        </div>
      </>
    );
  }
);

export { HighlightVideoItem };