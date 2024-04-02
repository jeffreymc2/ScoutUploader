//app/components/MediaRenderer.tsx

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ReactPlayer from "react-player";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlayCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import { max } from "lodash";

interface MediaRendererProps {
  file: {
    id: string;
    image: string;
    post_by: string;
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

  const imageStyle = {
    width: "100%",
    height: "425px"
  }
  return (
    <>
      <Dialog onOpenChange={setIsOpen}>
       
        {file.isVideo ? (
          <DialogContent className="sm:max-w-[425px]">
            <ReactPlayer url={file.image} controls width="100%" height="auto" />
          </DialogContent>
        ) : (
          <DialogContent className="sm:max-w-[425px]">
            <Image
              src={file.image}
              alt={`Media posted by ${file.post_by || "Unknown"}`}
              width={425}
              height={425}
              className="rounded-lg object-cover sm:max-w-[425px]"
              style={imageStyle}
            />
          </DialogContent>
        
        )}

        <div
            className="relative aspect-square w-full h-48 "
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
          <DialogTrigger >
              <p className="text-sm text-blue-500 cursor-pointer">Preview Media</p>
          </DialogTrigger>
      </Dialog>
      {file.event_id && (
        <p className="text-sm mt-2">Uploaded from Event ID: {file.event_id}</p>
      )}
    </>
  );
};

export default MediaRenderer;

