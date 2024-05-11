
// app/components/Uploader.tsx
"use client";
import React, { useState } from "react";
import Uppy from "@uppy/core";
import Transloadit from "@uppy/transloadit";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import { Button } from "./ui/button";
import useUser from "@/app/hook/useUser";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import path from "path";

export interface PlayerResponse {
  PlayerID: string;
  LastName: string;
  FirstName: string;
  PlayerName: string;
  DOB: string;
}

interface UploaderProps {
  playerid: number;
  FullName: string;
}

const Uploader: React.FC<UploaderProps> = ({ playerid, FullName }) => {
  const { data: user } = useUser();
  const supabase = supabaseBrowser();
  const [selectedPlayer, setSelectedPlayer] = useState<UploaderProps | null>({
    playerid,
    FullName,
  });

  const player_id = playerid.toString();
  const user2 = "3faf9652-84d8-4b76-8b44-8e1f3b7ff7fd";

  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles: 50,
        allowedFileTypes: ["image/*", "video/*"],
        maxFileSize: 5 * 100000 * 10000,
      },
      debug: true,
    }).use(Transloadit, {
      service: "https://api2.transloadit.com",
      params: {
        auth: {
          key: "c8bcc31673614496a3a412b4fda14767",
        },
        steps: {
          thumbnail: {
            robot: "/image/resize",
            use: "thumbnail",
            width: 300,
            height: 200,
            resize_strategy: "fillcrop",
            path: "/thumbnails/${file.name}",
          },
          hls: {
            robot: "/video/encode",
            use: "hls",
            preset: "hls-1080p",
            path: "/hls/${file.name}",
          },
          exported: {
            use: ["thumbnail", "hls", ":original"],
            result: true,
            robot: "/supabase/store",
            credentials: "pgscout",
            path: "players/${user?.id}/${player_id}",
          },
        },
      },
    })
  );

  uppy.on("complete", async (result) => {
    const assembly = (result as any).transloadit[0].assembly;
    const thumbnailUrl = assembly.results.thumbnail[0].ssl_url;
    const hlsUrl = assembly.results.hls[0].ssl_url;

    // Save the thumbnail URL to Supabase
    const thumbnailFilename = `thumbnail_${player_id}.png`;
    const { data: thumbnailData, error: thumbnailError } = await supabase.storage
      .from("media")
      .upload(`players/${user?.id}/${player_id}/thumbnails/${thumbnailFilename}`, thumbnailUrl);

    if (thumbnailError) {
      console.error("Error saving thumbnail URL to Supabase:", thumbnailError);
    } else {
      console.log("Thumbnail URL saved successfully");
    }

    // Save the HLS URL to Supabase
    const hlsFilename = `video_${player_id}.m3u8`;
    const { data: hlsData, error: hlsError } = await supabase.storage
      .from("media")
      .upload(`players/${user?.id}/${player_id}/hls/${hlsFilename}`, hlsUrl);

    if (hlsError) {
      console.error("Error saving HLS URL to Supabase:", hlsError);
    } else {
      console.log("HLS URL saved successfully");
    }

    toast.success("Upload and transcoding complete!");
    if (window.location.pathname.includes("/players")) {
      window.location.reload();
    }
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
        <h1 className="font-pgFont text-2xl">Perfect Game Media Uploader</h1>
        <div>
          <p>Selected Player: {selectedPlayer?.FullName} | Player ID: {selectedPlayer?.playerid}</p>
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

// // app/components/Uploader.tsx
// "use client";
// import React, { useState, useEffect } from "react";
// import Uppy from "@uppy/core";
// import { Dashboard } from "@uppy/react";
// import "@uppy/core/dist/style.css";
// import "@uppy/dashboard/dist/style.css";
// import { Button } from "./ui/button";
// import Tus from "@uppy/tus";
// import useUser from "@/app/hook/useUser";
// import { supabaseBrowser } from "@/lib/supabase/browser";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// export interface PlayerResponse {
//   PlayerID: string;
//   LastName: string;
//   FirstName: string;
//   PlayerName: string;
//   DOB: string;
// }

// interface UploaderProps {
//   playerid: number;
//   FullName: string;
// }

// const Uploader: React.FC<UploaderProps> = ({ playerid, FullName }) => {
//   const { data: user } = useUser();
//   const supabase = supabaseBrowser();
//   const [selectedPlayer, setSelectedPlayer] = useState<UploaderProps | null>(null);

//   useEffect(() => {
//     setSelectedPlayer({ playerid, FullName });
//   }, [playerid, FullName]);

//   const router = useRouter();
//   const player_id = playerid.toString();

//   const [uppy] = useState(() =>
//     new Uppy({
//       restrictions: {
//         maxNumberOfFiles: 50,
//         allowedFileTypes: ["image/*", "video/*"],
//         maxFileSize: 5 * 100000 * 10000,
//       },
//       debug: true,
//     }).use(Tus, {
//       endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
//       onBeforeRequest: async (req: any) => {
//         const { data } = await supabase.auth.getSession();
//         console.log('Supabase session data:', data); // Log session data
//         req.setHeader("Authorization", `Bearer ${data?.session?.access_token}`);
//       },
//       limit: 20,
//       chunkSize: 15 * 1024 * 1024,
//       allowedMetaFields: ["bucketName", "objectName", "contentType", "cacheControl"],
//     })
//   );

//   uppy.on('file-added', (file) => {
//     const fileNameWithUUID = `${player_id}_${file.name}`;
//     file.meta = {
//       ...file.meta,
//       bucketName: "media",
//       objectName: `players/${user?.id}/${player_id}/${fileNameWithUUID}`,
//       contentType: file.type,
//       cacheControl: "undefined",
//     };
//   });

//   uppy.on("complete", async (result) => {

//     const uploadedFile = result.successful[0];
//     const fileExtension = uploadedFile.extension?.toLowerCase();
//     const isVideo = fileExtension === "mp4" || fileExtension === "mov" || fileExtension === "avi";

//     if (isVideo) {
//       const videoUrl = uploadedFile.uploadURL;

//       // Create a video element to load the uploaded video
//       const video = document.createElement("video");
//       video.src = videoUrl;
//       video.crossOrigin = "anonymous";
//       video.preload = "metadata";

//       video.onloadedmetadata = () => {
//         // After metadata loads, seek to a frame
//         video.currentTime = 1;
//       };

//       video.onseeked = async () => {
//         // Capture the thumbnail from the video
//         const canvas = document.createElement("canvas");
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//         const ctx = canvas.getContext("2d");
//         ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

//         // Convert the canvas to a Blob
//         canvas.toBlob(async (blob) => {
//           if (blob) {
//             // Generate a unique filename for the thumbnail
//             const thumbnailFilename = `thumbnail_${uploadedFile.id}.png`;

//             // Upload the thumbnail to Supabase storage
//             const { data, error } = await supabase.storage
//               .from("media")
//               .upload(`players/${user?.id}/${player_id}/thumbnails/${thumbnailFilename}`, blob);

//             if (error) {
//               console.error("Error uploading thumbnail to Supabase:", error);
//             } else {
//               console.log("Thumbnail uploaded successfully");
//             }
//           }
//         }, "image/png");
//       };

//       video.onerror = () => {
//         console.error("Error loading video for thumbnail generation");
//       };
//     }

//     toast.success("Upload complete!");
//     if (window.location.pathname.includes("/players")) {
//       window.location.reload();
//     }
//   });

//   const handleUpload = () => {
//     if (!selectedPlayer) {
//       toast.error("Please select a player.");
//       return;
//     }
//     if (uppy.getFiles().length === 0) {
//       toast.error("Please select a file to upload.");
//       return;
//     }
//     uppy.upload();
//   };

//   return (
//     <div className="space-y-5">
//       <div className="space-y-5">
//         <h1 className="font-pgFont text-2xl">Perfect Game Scout Profile Uploader</h1>
//         <div>
//           <p>Selected Player: {FullName} | Player ID: {playerid}</p>
//         </div>
//       </div>
//       <Dashboard uppy={uppy} className="w-auto" hideUploadButton />
//       <Button
//         id="upload-trigger"
//         className="px-4 py-2 ml-2 w-full font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
//         onClick={handleUpload}
//       >
//         Upload
//       </Button>
//     </div>
//   );
// };

// export default Uploader;

