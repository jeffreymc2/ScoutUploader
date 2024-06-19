"use client";

import React, { useState, useEffect } from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import { Button } from "./ui/button";
import Transloadit, { AssemblyOptions } from "@uppy/transloadit";
import { getUserData } from "@/lib/useUser";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";

interface UploaderProps {
  EventID: string;
  EventName: string;
  TeamID: string;
}

interface UploadedFile {
  filePath: string;
  thumbnailPath: string | null;
  isVideo: boolean;
  name?: string;
}

const UploaderEvents: React.FC<UploaderProps> = ({ EventID, EventName, TeamID }) => {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const supabase = supabaseBrowser();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uppy, setUppy] = useState<Uppy | null>(null);

  const fetchUser = async () => {
    try {
      const userData = await getUserData();
      setUser(userData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      const uppyInstance = new Uppy({
        restrictions: {
          maxNumberOfFiles: 50,
          allowedFileTypes: ["image/*", "video/*"],
          maxFileSize: 5 * 100000 * 100000,
        },
        debug: true,
        autoProceed: false,
      }).use(Transloadit, {
        waitForEncoding: true,
        assemblyOptions: (file) => {
          const isVideo = file?.type?.includes("video") ?? false;
          const filePath = `events/${user.id}/${EventID}/${TeamID}/${file?.name}`;
          let thumbnailPath = null;

          if (isVideo) {
            const fileNameWithoutExt = file?.name.substring(0, file.name.lastIndexOf("."));
            thumbnailPath = `events/${user.id}/${EventID}/${TeamID}/thumbnails/${fileNameWithoutExt}_thumbnail.jpg`;
          }

          setUploadedFiles((prevFiles) => [
            ...prevFiles,
            { filePath, thumbnailPath, isVideo, name: file?.name },
          ]);

          const params: AssemblyOptions["params"] = {
            auth: {
              key: process.env.NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY || "",
            },
            steps: {
              ":original": {
                robot: "/upload/handle",
                result: true,
              },
              uploaded: {
                use: ":original",
                robot: "/s3/store",
                credentials: "scoutuploads",
                bucket: "scoutuploads",
                path: filePath,
              },
            },
          };

          if (isVideo) {
            params.steps = {
              ...params.steps,
              thumbnail: {
                use: ":original",
                robot: "/video/thumbs",
                width: 800,
                height: 600,
                resize_strategy: "pad",
                ffmpeg_stack: "v6.0.0",
                count: 1,
                format: "jpg",
                result: true,
              },
              uploadedThumbnail: {
                use: "thumbnail",
                robot: "/s3/store",
                credentials: "scoutuploads",
                bucket: "scoutuploads",
                path: thumbnailPath,
              },
            };
          }

          return {
            params,
            fields: {
              user_id: user.id,
              event_id: EventID,
              team_id: TeamID,
              file_name: file?.name,
            } as { [name: string]: string },
          };
        },
      });

      uppyInstance.on("complete", (result) => {
        if (result.failed.length === 0) {
          uploadedFiles.forEach((file) => {
            handlePostToSupabase(file);
          });
          setUploadCompleted(true);
        } else {
          console.error("Upload error:", result.failed);
          toast.error("An error occurred during upload.");
        }
      });

      setUppy(uppyInstance);

      return () => {
        uppyInstance.close();
      };
    }
  }, [user, EventID, TeamID]);

  const handlePostToSupabase = async (file: UploadedFile) => {
    try {
      const { data: insertedPost, error: insertError } = await supabase
        .from("posts")
        .insert({
          post_by: user?.id,
          event_id: EventID,
          team_id: TeamID,
          file_url: `https://d2x49pf2i7371p.cloudfront.net/${file.filePath}`,
          thumbnail_url: file.isVideo
            ? `https://d2x49pf2i7371p.cloudfront.net/${file.thumbnailPath}`
            : null,
          is_video: file.isVideo,
          name: file.name,
        })
        .single();

      if (insertError) {
        console.error("Error inserting post:", insertError);
      } else {
        console.log("Post inserted successfully");
        toast.success("Upload complete!");

        if (window.location.pathname.includes("/events")) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error processing uploaded file:", error);
      toast.error("An error occurred while processing the uploaded file.");
    }
  };

  const handleUpload = () => {
    if (!user) {
      toast.error("User not authenticated. Please log in and try again.");
      return;
    }

    if (!uppy) {
      toast.error("Uppy instance not initialized.");
      return;
    }

    if (uppy.getFiles().length === 0) {
      toast.error("Please select a file to upload.");
      return;
    }

    uppy.upload();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <h1 className="font-pgFont text-2xl">Upload Files By Event</h1>
        <div>
          <p>Selected Event: {EventName} | Event ID: {EventID}</p>
        </div>
      </div>
      {user && uppy ? (
        <>
          <Dashboard uppy={uppy} className="w-auto" hideUploadButton />
          <Button
            id="upload-trigger"
            className="px-4 py-2 ml-2 w-full font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
            onClick={handleUpload}
          >
            Upload
          </Button>
        </>
      ) : (
        <p>User not authenticated. Please log in and try again.</p>
      )}
    </div>
  );
};

export default UploaderEvents;