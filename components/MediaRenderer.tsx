// app/components/MediaRenderer.tsx

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ReactPlayer from "react-player";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlayCircleIcon } from "lucide-react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { Separator } from "@/components/ui/separator";
import { supabaseBrowser } from "@/lib/supabase/browser";

const supabase = supabaseBrowser();

interface MediaRendererProps {
  file: {
    id: string;
    image: string;
    post_by: string;
    name: string;
    event_id?: string;
    isVideo?: boolean;
    thumbnail_url?: string;
  };
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ file }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = () => {
    fetch(file.image)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };

  return (
    <>
      <Dialog onOpenChange={setIsOpen}>
        {file.isVideo ? (
          <DialogContent className="sm:max-w-[66vw] flex items-center justify-center bg-transparent border-0 border-transparent">
            <div className="relative w-full h-0 pb-[56.25%]">
              <ReactPlayer
                className="rounded-lg absolute top-0 left-0"
                url={file.image}
                controls
                width="100%"
                height="100%"
              />
            </div>
          </DialogContent>
        ) : (
          <DialogContent className="min-h-[70vh] sm:min-h-[66vh] bg-transparent border-0 border-transparent">
            <Image
              src={file.image}
              alt={`Media posted by ${file.post_by || "Unknown"}`}
              fill={true}
              className="rounded-sm object-contain"
            />
          </DialogContent>
        )}
        <div
          className="relative w-full h-48 shadow-sm rounded-lg cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          {file.isVideo ? (
            file.thumbnail_url ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <DialogTrigger>
                  <Image
                    src={file.thumbnail_url}
                    alt={`Thumbnail posted by ${file.post_by || "Unknown"}`}
                    fill={true}
                    className="rounded-sm object-cover object-center"
                  />
                </DialogTrigger>
                <DialogTrigger className="z-10">
                  <PlayCircleIcon className="w-12 h-12 text-white z-10" />
                </DialogTrigger>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircleIcon className="w-12 h-12 text-white z-10" />
              </div>
            )
          ) : (
            <DialogTrigger>
              <Image
                src={file.image}
                alt={`Thumbnail posted by ${file.post_by || "Unknown"}`}
                fill={true}
                className="rounded-sm object-cover object-top"
              />
            </DialogTrigger>
          )}
        </div>
        {file.event_id && (
          <p className="text-sm">Uploaded from Event ID: {file.event_id}</p>
        )}
      </Dialog>
    </>
  );
};

export default MediaRenderer;