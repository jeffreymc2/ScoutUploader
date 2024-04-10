"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ReactPlayer from "react-player";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlayCircleIcon } from "lucide-react";

import { IoCloudDownloadOutline } from "react-icons/io5";
import MediaForm from "./MediaForm";
import { Separator } from "@/components/ui/separator";
import { Badge } from "./ui/badge";

interface MediaRendererProps {
  file: {
    id: string;
    image: string;
    post_by: string;
    name: string;
    event_id?: string;
    isVideo?: boolean;
    post_type: string;
    title?: string;
    description?: string;
    featured_image?: boolean;
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

  // const imageStyle = {
  //   width: "100%",
  //   height: "auto",
  //   position: "relative!important",
  // };

  return (
    <>
      <Dialog onOpenChange={setIsOpen}>
        {file.isVideo ? (
          <DialogContent className="sm:max-w-[66vw]  flex items-center justify-center bg-transparent border-0 border-transparent">
            <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
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
          <DialogContent className="min-h-[50vh]  sm:min-h-[66vh] bg-transparent border-0 border-transparent">
            <Image
              src={file.image}
              alt={`Media posted by ${file.post_by || "Unknown"}`}
              fill={true}
              className="rounded-lg object-contain relative"
            />
          </DialogContent>
        )}
        <div
          className="relative w-full h-48 shadow-sm rounded-lg cursor-pointer "
          onClick={() => setIsOpen(true)}
        >
          {file.isVideo ? (
            thumbnailUrl ? (
              <div className="absolute inset-0 flex items-center justify-center ">
                <DialogTrigger>
                  <div className="p-0 w-full">
                    <Image
                      src={thumbnailUrl}
                      alt={`Thumbnail posted by ${file.post_by || "Unknown"}`}
                      fill={true}
                      className=" object-cover object-top rounded-t-lg"
                    />
                  </div>
                </DialogTrigger>
                <DialogTrigger className="z-10">
                  {file.featured_image && (
                    <div className="absolute top-4 left-4">
                      <StarIcon className="text-yellow-400 w-6 h-6" />
                    </div>
                  )}{" "}
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
                className="object-cover object-top rounded-t-lg"
              />
              {file.featured_image && (
                <div className="absolute top-4 left-4">
                  <StarIcon className="text-yellow-400 w-6 h-6" />
                </div>
              )}
            </DialogTrigger>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-0 ">
          <Separator />
        </div>
        <div className="px-4 pb-4 pt-2">
          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-2">
              <IoCloudDownloadOutline
                className="cursor-pointer text-2xl"
                onClick={handleDownload}
              />
              <Dialog>
                {!file.isVideo ? (
                  <div className="mt-3">
                    <MediaForm
                      postId={file.id}
                      mediaUrl={file.image}
                      isVideo={false}
                      thumbnailUrl={file.image}
                    />
                  </div>
                ) : (
                  <div className="mt-3">
                    <MediaForm
                      postId={file.id}
                      mediaUrl={file.image}
                      isVideo={true}
                      thumbnailUrl={file.image}
                    />
                  </div>
                )}
              </Dialog>
            </div>
            {file.featured_image && (
              <div className="mt-0">
                <Badge className="bg-blue-500 text-white hover:bg-blue-500 text-xs">
                  Featured Image
                </Badge>
              </div>
            )}
          </div>
          {file.title && (
            <p className="text-md mt-2 leading-loose font-bold">{file.title}</p>
          )}
          {file.description && (
            <p className="text-xs mt-1">{file.description}</p>
          )}

          {file.event_id && (
            <p className="text-sm mt-5">
              Uploaded from Event ID: {file.event_id}
            </p>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default MediaRenderer;

function CameraIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function StarIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
