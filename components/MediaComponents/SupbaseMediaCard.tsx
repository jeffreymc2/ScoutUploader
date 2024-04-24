// app/components/MediaComponents/SupabaseMediaCard.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MediaFile } from "@/lib/types/types";
import ReactPlayer from "react-player";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FaDownload, FaTrash } from "react-icons/fa";
import MediaForm from "@/components/MediaComponents/MediaForm";
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
      <Card className="m-0 p-0">
        <CardContent className="object-cover m-0 p-0">
          <div
            className="relative w-full h-48 shadow-sm rounded-lg cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            {file.isVideo ? (
              <div className="relative w-full h-full rounded-lg">
                <ReactPlayer
                  url={file.url}
                  width="100%"
                  height="100%"
                  light={file?.thumbnail || ""}
                  playing={true}
                  playIcon={
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.4}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.4}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  }
                />
              </div>
            ) : (
              <Image
                src={file.url || "/placeholder.png"}
                alt={file.title || "Image"}
                fill={true}
                className="rounded-lg object-cover"
              />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
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
          <DialogContent className="sm:max-w-[66vw] flex items-center justify-center bg-transparent border-0 border-transparent">
            <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
              <ReactPlayer
                className="rounded-lg absolute top-0 left-0"
                url={file.url}
                width="100%"
                height="100%"
                controls={true}
              />
            </div>
          </DialogContent>
        ) : (
          <DialogContent className="min-h-[50vh] sm:min-h-[66vh] bg-transparent border-0 border-transparent">
            <Image
              src={file.url || "/placeholder.png"}
              alt={file?.title || "Image"}
              fill={true}
              className="rounded-lg object-contain"
            />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
