"use client";

import React, { useRef, useState, useEffect } from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import { Button } from "./ui/button";
import Tus from "@uppy/tus";
import useUser from "@/app/hook/useUser";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";

interface UploaderProps {
  playerid: number;
  FullName: string;
}

const Uploader: React.FC<UploaderProps> = ({ playerid, FullName }) => {
  const { data: user } = useUser();
  const supabase = supabaseBrowser();
  const [selectedPlayer, setSelectedPlayer] = useState<UploaderProps | null>(null);

  useEffect(() => {
    setSelectedPlayer({ playerid, FullName });
  }, [playerid, FullName]);

  const onBeforeRequest = async (req: any) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      req.setHeader("Authorization", `Bearer ${data.session.access_token}`);
    }
  };

  const player_id = playerid.toString();

  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles: 50,
        allowedFileTypes: ["image/*", "video/*"],
        maxFileSize: 5 * 10000 * 10000,
      },
      debug: true,
    }).use(Tus, {
      endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
      onBeforeRequest,
      limit: 20,
      chunkSize: 15 * 1024 * 1024,
      allowedMetaFields: [
        "bucketName",
        "objectName",
        "contentType",
        "cacheControl",
      ],
    })
  );

  uppy.on("file-added", (file) => {
    const fileNameWithUUID = `${player_id}_${file.name}`;
    file.meta = {
      ...file.meta,
      bucketName: "media",
      objectName: `players/${user?.id}/${player_id}/${fileNameWithUUID}`,
      contentType: file.type,
      cacheControl: "undefined",
    };
  });

  uppy.on("complete", async (result) => {
    result.successful.forEach(async (file) => {
      const fileNameWithUUID = `${player_id}_${file.name}`;
      if (file.type?.startsWith("video/")) {
        const videoPath = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/players/${user?.id}/${player_id}/${fileNameWithUUID}`;
        const name = file.name;
        if (selectedPlayer) {
          try {
            const response = await fetch("/api/redis", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                videoPath,
                user_id: user?.id,
                player_id: selectedPlayer?.playerid,
                name,
              }),
            });

            if (response.ok) {
              toast.success("Video processing job enqueued");
            } else {
              throw new Error("Failed to enqueue video processing job");
            }
          } catch (error) {
            console.error(error);
            toast.error("Failed to enqueue video processing job");
          }
        } else {
          console.error("User or selected player data is missing or incomplete");
          toast.error("Failed to enqueue video processing job");
        }
      }
    });
  });

  const handleUpload = () => {
    if (!selectedPlayer) {
      toast.error("Please select a player.");
      return;
    }
    if (uppy.getFiles().length === 0) {
      toast.error("Please select a file to upload.");
      return;
    }
    uppy.upload();
  };

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <h1 className="font-pgFont text-2xl">
          Perfect Game Scout Profile Uploader
        </h1>
        <div>
          <p>Selected Player: {FullName} | Player ID: {playerid}</p>
        </div>
      </div>
      <Dashboard uppy={uppy} className="w-auto" hideUploadButton />
      <Button
        id="upload-trigger"
        className="px-4 py-2 ml-2 w-full font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
        onClick={handleUpload}
      >
        Upload
      </Button>
    </div>
  );
};

export default Uploader;