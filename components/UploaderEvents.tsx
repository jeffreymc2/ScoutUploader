"use client";

import React, { useState, useEffect } from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import { Button } from "./ui/button";
import Transloadit, { AssemblyOptions } from "@uppy/transloadit";
import useUser from "@/app/hook/useUser";
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

// const user3 = "3faf9652-84d8-4b76-8b44-8e1f3b7ff7fd";

const UploaderEvents: React.FC<UploaderProps> = ({ EventID, EventName, TeamID }) => {
  const { data: user } = useUser();
  const supabase = supabaseBrowser();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadCompleted, setUploadCompleted] = useState(false);

  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles: 50,
        allowedFileTypes: ["image/*", "video/*"],
        maxFileSize: 5 * 10000 * 1000,
      },
      debug: true,
    }).use(Transloadit, {
      waitForEncoding: true,
      assemblyOptions: (file) => {
        const isVideo = file?.type?.includes("video") ?? false;
        const filePath = `events/${user?.id}/${EventID}/${TeamID}/${file?.name}`;
        let thumbnailPath = null;

        if (isVideo) {
          thumbnailPath = `events/${user?.id}/${EventID}/${TeamID}/thumbnails/${file?.name}_thumbnail.jpg`;
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
            user_id: user?.id ?? "",
            event_id: EventID,
            team_id: TeamID,
            file_name: file?.name,
          } as { [name: string]: string },
        };
      },
    })
  );

  const handlePostToSupabase = async (file: UploadedFile) => {
    try {
      const { data: insertedPost, error: insertError } = await supabase
        .from("posts")
        .insert({
          post_by: user?.id,
          event_id: EventID,
          team_id: TeamID,
          file_url: `https://d3v9c4w2c7wrqu.cloudfront.net/${file.filePath}`,
          thumbnail_url: file.isVideo ? `https://d3v9c4w2c7wrqu.cloudfront.net/${file.thumbnailPath}` : null,
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
    if (uppy.getFiles().length === 0) {
      toast.error("Please select a file to upload.");
      return;
    }
    uppy.upload();
  };

  useEffect(() => {
    const onComplete = (result: any) => {
      if (!uploadCompleted) {
        uploadedFiles.forEach((file) => {
          handlePostToSupabase(file);
        });
        setUploadCompleted(true);
      }
    };

    const onError = (error: any) => {
      console.error("Upload error:", error);

      if (error.message.includes("AuthorizationHeaderMalformed")) {
        toast.error(
          "Invalid AWS credentials. Please check your access key ID and secret access key."
        );
      } else {
        toast.error("An error occurred during upload.");
      }
    };

    uppy.on("complete", onComplete);
    uppy.on("error", onError);

    return () => {
      uppy.off("complete", onComplete);
      uppy.off("error", onError);
    };
  }, [uploadCompleted, uploadedFiles]);

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <h1 className="font-pgFont text-2xl">
          Upload Files By Event
        </h1>
        <div>
          <p>Selected Event: {EventName} | Event ID: {EventID}</p>
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

export default UploaderEvents;