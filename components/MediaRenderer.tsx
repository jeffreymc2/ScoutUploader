// app/components/MediaRenderer.tsx

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
  };
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ file }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  useEffect(() => {
    const fetchThumbnail = async () => {
      if (file.isVideo) {
        // Check if thumbnail exists in Supabase storage
        const { data: thumbnailData, error: thumbnailError } = await supabase.storage
          .from("thumbnails")
          .download(`${file.id}.png`);

        if (thumbnailData) {
          // Thumbnail exists, set the URL
          const url = URL.createObjectURL(thumbnailData);
          setThumbnailUrl(url);
        } else {
          // Thumbnail doesn't exist, generate and save it
          const video = document.createElement("video");
          video.src = file.image;
          video.crossOrigin = "anonymous";
          video.preload = "metadata";
          video.style.position = "absolute";
          video.style.width = "0";
          video.style.height = "0";
          video.style.top = "0";
          video.style.left = "-10000px";

          document.body.appendChild(video);

          video.onloadedmetadata = () => {
            video.currentTime = 1;
          };

          video.onseeked = async () => {
            setTimeout(async () => {
              if (Math.abs(video.currentTime - 1) > 0.1) {
                console.warn("Video seeked to an unexpected time. Current time:", video.currentTime);
              }
          
              const canvas = document.createElement("canvas");
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext("2d");
              ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          
              // Temporarily add the canvas to the DOM for visual inspection
              document.body.appendChild(canvas);
          
              canvas.toBlob(async (blob) => {
                if (blob) {
                  const { data, error } = await supabase.storage
                    .from("thumbnails")
                    .upload(`${file.id}.png`, blob);
          
                  if (error) {
                    console.error("Error uploading thumbnail:", error);
                  } else {
                    console.log("Thumbnail uploaded successfully");
          
                    const { data: urlData } = supabase.storage
                      .from("thumbnails")
                      .getPublicUrl(`${file.id}.png`);
          
                    if (urlData) {
                      console.log("Public URL:", urlData?.publicUrl);
                      setThumbnailUrl(urlData?.publicUrl || "");
                    }
                  }
                } else {
                  console.warn("Failed to create thumbnail blob");
                }
          
                // Remove the canvas from the DOM after inspection
                document.body.removeChild(canvas);
              }, "image/png");
          
              document.body.removeChild(video);
            }, 1000);
          };
          

          video.onerror = () => {
            console.error("Error loading video for thumbnail generation");
            document.body.removeChild(video);
          };
        }
      } else {
        setThumbnailUrl(file.image);
      }
    };

    fetchThumbnail();
  }, [file.id, file.image, file.isVideo]);

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
            thumbnailUrl ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <DialogTrigger>
                  <Image
                    src={thumbnailUrl}
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
                src={thumbnailUrl}
                alt={`Thumbnail posted by ${file.post_by || "Unknown"}`}
                fill={true}
                className="rounded-sm object-cover object-top"
              />
            </DialogTrigger>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-2">
          <Separator />
        </div>
        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="flex items-center gap-2">
            <IoCloudDownloadOutline
              className="cursor-pointer text-2xl"
              onClick={handleDownload}
            />
          </div>
        </div>
        {file.event_id && (
          <p className="text-sm">Uploaded from Event ID: {file.event_id}</p>
        )}
      </Dialog>
    </>
  );
};

export default MediaRenderer;
