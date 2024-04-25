// app/components/MediaComponents/SupabaseMediaCard.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MediaFile } from "@/lib/types/types";
import Video from "next-video";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FaDownload, FaTrash } from "react-icons/fa";
import MediaForm from "@/components/MediaComponents/MediaForm";
import BackgroundVideo from "next-video/background-video";

import DeletePost from "@/components/UtilityComponents/DeletePost";
import useUser from "@/app/hook/useUser";

interface SupabaseMediaCardProps {
  file: MediaFile;
}

export const SupabaseMediaCard: React.FC<SupabaseMediaCardProps> = ({
  file,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: user } = useUser();
  // const [isReady, setIsReady] = useState(false);

  const handleDialogOpen = () => {
    setIsOpen(true);
  };

  const handleDownload = () => {
    fetch(file.url || "")
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = file.title || "download";
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
      <Card className="m-0 p-0 rounded-lg">
        <CardContent className="object-cover  m-0 p-0 relative rounded-t-lg">
          <div
            className="relative w-full sm:h-36 h-48 shadow-sm rounded-lg cursor-pointer"
            onClick={handleDialogOpen}
          >
            {file.isVideo ? (
              // <div className="relative w-full h-full shadow-sm rounded-lg cursor-pointer ">
              <Video
                src={file.url}
                className="rounded-t-lg  object-cover"
                preload="auto"
                controls={true}
                placeholder={file.url}
                autoPlay={false}
                style={{ objectFit: "fill" }}
              />
            ) : (
              // </div>
              <Image
                src={file.url || ""}
                alt={file.title || "Image"}
                fill={true}
                className="rounded-t-lg  object-cover"
              />
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center mt-5">
          <FaDownload
            className="cursor-pointer text-xl text-gray-700"
            onClick={handleDownload}
          />
          {user?.id === file.post_by && (
            <>
              <DeletePost
                post_by={file.post_by || ""}
                image={file.url || ""}
                event_id={file.event_id}
                team_id={file.team_id}
              />
              <Dialog>
                <DialogTrigger>
                  <FaTrash />
                </DialogTrigger>
                <DialogContent>
                  <MediaForm
                    postId={file.id.toString() || ""}
                    mediaUrl={file.url || ""}
                    isVideo={file.isVideo}
                    thumbnailUrl={file.thumbnail || ""}
                  />
                </DialogContent>
              </Dialog>
            </>
          )}
        </CardFooter>
      </Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {file.isVideo ? (
          <DialogContent className="sm:max-w-[66vw] ">
            <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
              <Video
                src={file.url}
                className="rounded-lg absolute top-0 left-0"
                autoPlay={true}
                preload="auto"
                // playIcon={
                //   <div className="absolute inset-0 flex items-center justify-center">
                //     <svg
                //       className="w-12 h-12 text-white"
                //       fill="none"
                //       viewBox="0 0 24 24"
                //       stroke="currentColor"
                //     >
                //       <path
                //         strokeLinecap="round"
                //         strokeLinejoin="round"
                //         strokeWidth={1.4}
                //         d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                //       />
                //       <path
                //         strokeLinecap="round"
                //         strokeLinejoin="round"
                //         strokeWidth={1.4}
                //         d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                //       />
                //     </svg>
                //   </div>
                // }
              />
            </div>
          </DialogContent>
        ) : (
          <DialogContent className="sm:max-w-[66vw] ">
            <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
              <Image
                src={file.url || "/placeholder.png"}
                alt={file?.title || "Image"}
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
