// components/MediaComponents/SupabaseMediaCard.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MediaFile } from "@/lib/types/types";
import Video from "next-video";

interface SupabaseMediaCardProps {
  file: MediaFile;
}

export const SupabaseMediaCard: React.FC<SupabaseMediaCardProps> = ({
  file,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDialogOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div
        className="relative w-full h-48 sm:h-72 shadow-sm rounded-lg cursor-pointer"
        onClick={handleDialogOpen}
      >
        {file.isVideo ? (
          <Video
            src={file?.image ?? (file?.url || "")}
            className="rounded-lg object-cover w-full h-full"
            preload="auto"
            controls={false}
            autoPlay={false}
            
          />
        ) : (
          <Image
            src={file?.name ?? (file?.url || "")}
            alt={file.name || "Image"}
            fill={true}
            className="rounded-lg object-cover"
          />
        )}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {file.isVideo ? (
          <DialogContent className="sm:max-w-[66vw]">
            <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
              <Video
                src={file.name ?? (file.url || "")}
                className="rounded-lg absolute top-0 left-0"
                autoPlay={true}
                preload="auto"
                controls={true}
                startTime={1}
                style={{ objectFit: "fill" }}
              />
            </div>
          </DialogContent>
        ) : (
          <DialogContent className="sm:max-w-[66vw]">
            <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
              <Image
                src={file.name ?? (file?.url || "")}
                alt={file?.url || "Image"}
                fill={true}
                className="rounded-lg object-cover"
              />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};