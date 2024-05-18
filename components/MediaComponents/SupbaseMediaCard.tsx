"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MediaFile } from "@/lib/types/types";
import ReactPlayer from "react-player";
import { PlayCircleIcon } from "@heroicons/react/24/outline";

interface SupabaseMediaCardProps {
  file: MediaFile;
}

const isVideoFile = (fileName: string) => {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".flv", ".wmv"];
  return videoExtensions.some((extension) => fileName.toLowerCase().endsWith(extension));
};

export const SupabaseMediaCard: React.FC<SupabaseMediaCardProps> = ({ file }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDialogOpen = () => {
    setIsOpen(true);
  };

  const handleDialogClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative w-full h-48 sm:h-48 shadow-sm rounded-lg cursor-pointer" onClick={handleDialogOpen}>
        {isVideoFile(file.file_url ?? "") ? (
          <>
            <ReactPlayer
              url={file.file_url}
              className="rounded-lg object-cover w-full h-full"
              light={file.thumbnail_url}
              controls={false}
              width={"100%"}
              height={"100%"}
              style={{ objectFit: "cover" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircleIcon className="h-12 w-12 text-white opacity-80" />
            </div>
          </>
        ) : (
          <Image src={file.file_url ?? ""} alt={file.name || "Image"} fill={true} className="rounded-lg object-cover w-full h-full" />
        )}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[66vw]">
          <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
            {isVideoFile(file.file_url ?? "") ? (
              <ReactPlayer
                url={file.file_url}
                className="rounded-lg absolute top-0 left-0"
                playing={true}
                controls={true}
                width={"100%"}
                height={"100%"}
                style={{ objectFit: "fill" }}
              />
            ) : (
              <Image src={file.file_url ?? ""} alt={file.name || "Image"} fill={true} className="rounded-lg object-cover" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};