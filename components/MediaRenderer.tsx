//app/components/MediaRenderer.tsx

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ReactPlayer from "react-player";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlayCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import { max } from "lodash";
import { MdOutlinePreview } from "react-icons/md";
import { IoCloudDownloadOutline } from "react-icons/io5";

interface MediaRendererProps {
  file: {
    id: string;
    image: string;
    post_by: string;
    name: string;
    event_id?: string;
    isVideo?: boolean;
  };
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ file }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  useEffect(() => {
    if (file.isVideo) {
      const video = document.createElement("video");
      video.src = file.image;
      video.crossOrigin = "anonymous"; // Ensure CORS policies allow this
      video.preload = "metadata";
      video.style.position = "absolute";
      video.style.width = "0";
      video.style.height = "0";
      video.style.top = "0";
      video.style.left = "-10000px"; // Off-screen

      // Append the video to the body to ensure it's part of the DOM
      document.body.appendChild(video);

      video.onloadedmetadata = () => {
        // After metadata loads, seek to a frame
        video.currentTime = 1;
      };

      video.onseeked = () => {
        // Introduce a slight delay before capturing the thumbnail
        setTimeout(() => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnail = canvas.toDataURL("image/png");
          setThumbnailUrl(thumbnail);

          // Remove the video element after capturing the thumbnail
          document.body.removeChild(video);
        }, 1000); // Adjust delay as necessary
      };

      video.onerror = () => {
        console.error("Error loading video for thumbnail generation");
        // Consider removing the video element in case of error as well
        document.body.removeChild(video);
      };
    } else {
      // Directly set the thumbnailUrl for non-video files
      setThumbnailUrl(file.image);
    }
  }, [file.image, file.isVideo]);

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

  const imageStyle = {
    width: "100%",
    height: "auto",
    position: "relative!important",
  };

  return (
    <>
      <Dialog onOpenChange={setIsOpen}>
        {file.isVideo ? (
          <DialogContent className="sm:max-w-[66vw] sm:max-h-[66vh] flex items-center justify-center bg-transparent">
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
        <DialogContent className="min-h-[50vh] sm:min-w-[66vw] sm:min-h-[66vh] bg-transparent">
          <Image
            src={file.image}
            alt={`Media posted by ${file.post_by || "Unknown"}`}
            fill={true}
            className="rounded-lg object-cover relative"
          />
        </DialogContent>
        )}
        <div
          className="relative aspect-square w-full h-48"
          onClick={() => setIsOpen(true)}
        >
          {file.isVideo ? (
            thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={`Thumbnail posted by ${file.post_by || "Unknown"}`}
                fill={true}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircleIcon className="w-12 h-12 text-white" />
              </div>
            )
          ) : (
            <Image
              src={thumbnailUrl}
              alt={`Thumbnail posted by ${file.post_by || "Unknown"}`}
              fill={true}
              className="rounded-lg object-cover"
            />
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-2">
          {file.event_id && (
            <p className="text-sm">Uploaded from Event ID: {file.event_id}</p>
          )}
          <div className="flex items-center gap-2">
            <DialogTrigger>
              <MdOutlinePreview className="cursor-pointer text-2xl" />
            </DialogTrigger>
            <IoCloudDownloadOutline
              className="cursor-pointer text-2xl"
              onClick={handleDownload}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default MediaRenderer;
