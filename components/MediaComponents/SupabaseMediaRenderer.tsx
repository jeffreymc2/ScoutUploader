// app/components/MediaComponents/SupabaseMediaRenderer.tsx
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PlayCircleIcon } from "lucide-react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import MediaForm from "./MediaForm";
import { Separator } from "@/components/ui/separator";
import { Badge } from "../ui/badge";
import { MediaFile } from "@/lib/types/types";

interface SupabaseMediaRendererProps {
  file: MediaFile;
}

const SupabaseMediaRenderer: React.FC<SupabaseMediaRendererProps> = ({ file }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    setThumbnailUrl(file.thumbnail || "");
    setVideoUrl(file.url || "");
  }, [file]);

  const isVideo = file.isVideo;

  

  return (
    <>
      <div
        className="relative w-full h-48 shadow-sm rounded-lg cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        {!isOpen ? (
          <>
            <Image
              src={file.url || "/placeholder.png"}
              alt={`Thumbnail for ${file.title || "Media"}`}
              fill={true}
              className="object-cover object-top rounded-t-lg"
            />
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircleIcon className="w-12 h-12 text-white z-10" />
              </div>
            )}
          </>
        ) : (
          <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
            {isVideo ? (
              <video
                className="rounded-lg absolute top-0 left-0 w-full h-full object-cover"
                src={videoUrl}
                controls
              />
            ) : (
              <Image
                src={file.url || "/placeholder.png"}
                alt={`Media for ${file.title || "Media"}`}
                fill={true}
                className="rounded-lg object-contain"
              />
            )}
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="min-h-[50vh] sm:min-h-[66vh] bg-transparent border-0 border-transparent">
          {isOpen && (
            <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0 object-cover">
              {isVideo ? (
                <video
                  className="rounded-lg absolute top-0 left-0 w-full h-full object-cover"
                  src={videoUrl}
                  controls
                />
              ) : (
                <Image
                  src={file.url || "/placeholder.png"}
                  alt={`Media for ${file.title || "Media"}`}
                  fill={true}
                  className="rounded-lg object-contain"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupabaseMediaRenderer;