
// // app/components/Uploader.tsx

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
import { useRouter } from "next/navigation";

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
  thumbnailUrl: string;
}

const Uploader: React.FC<UploaderProps> = ({ playerid, FullName }) => {
  const { data: user } = useUser();
  const supabase = supabaseBrowser();
  const [selectedPlayer, setSelectedPlayer] = useState<UploaderProps | null>(
    null
  );
  console.log("User data:", user); // Log user data

  useEffect(() => {
    setSelectedPlayer({ playerid, FullName, thumbnailUrl: "" });
  }, [playerid, FullName]);

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const onBeforeRequest = async (req: any) => {
    const { data } = await supabase.auth.getSession();
    console.log("Supabase session data:", data); // Log session data
    req.setHeader("Authorization", `Bearer ${data?.session?.access_token}`);
  };

  const player_id = playerid.toString();
  console.log("Player ID:", player_id); // Log player ID

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

  const generateThumbnail = async (file: any) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file.data);
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
          resolve(thumbnail);

          // Remove the video element after capturing the thumbnail
          document.body.removeChild(video);
        }, 1000); // Adjust delay as necessary
      };

      video.onerror = () => {
        console.error("Error loading video for thumbnail generation");
        reject("Error loading video for thumbnail generation");
        // Consider removing the video element in case of error as well
        document.body.removeChild(video);
      };
    });
  };

  const uploadThumbnailToSupabase = async (thumbnailUrl: string, thumbnailPath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("media")
        .upload(thumbnailPath, thumbnailUrl, {
          contentType: "image/png",
          cacheControl: "max-age=31536000",
        });

      if (error) {
        throw error;
      }

      console.log("Thumbnail uploaded:", data);
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
    }
  };

  uppy.on("file-added", async (file) => {
    const fileNameWithUUID = `${player_id}_${file.name}`;
    console.log("File added:", fileNameWithUUID);

    if (file.type?.startsWith("video/")) {
      const thumbnailUrl = await generateThumbnail(file);
      // Ensure thumbnailUrl is of type string
      const thumbnailUrlString = thumbnailUrl as string;
      // Upload the thumbnail to Supabase storage
      const thumbnailPath = `players/${user?.id}/${player_id}/${fileNameWithUUID}.png`;
      // Ensure thumbnailPath is of type string
      const thumbnailPathString = thumbnailPath as string;
      await uploadThumbnailToSupabase(thumbnailUrlString, thumbnailPathString);
    }

    file.meta = {
      ...file.meta,
      bucketName: "media",
      objectName: `players/${user?.id}/${player_id}/${fileNameWithUUID}`,
      contentType: file.type,
      cacheControl: "undefined",
    };
  });

  uppy.on("complete", async (result) => {
    console.log("Upload result:", result);
    toast.success("Upload complete!");
    result.successful.forEach(async (file) => {
      if (file.type?.startsWith("video/")) {
        const videoPath = `players/${user?.id}/${player_id}/${file.name}`;
        try {
          const edgeFunctionUrl = process.env.NEXT_PUBLIC_SUPABASE_EDGE_PROCESS_VIDEO as string;
          const { data, error } = await supabase.auth.getSession();

          if (error) {
            console.error("Error retrieving session:", error);
            toast.error("Failed to initiate video processing");
            return;
          }

          const accessToken = data.session?.access_token;

          const response = await fetch(edgeFunctionUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ videoPath }),
          });

          console.log("Video processing response:", response);
          if (!response.ok) {
            throw new Error("Failed to process video");
          }
          toast.success("Video processing initiated");
        } catch (error) {
          console.error(error);
          toast.error("Failed to initiate video processing");
        }
      }
    });

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
        <h1 className="font-pgFont text-2xl">
          Perfect Game Scout Profile Uploader
        </h1>
        <div>
          <p>
            Selected Player: {FullName} | Player ID: {playerid}
          </p>
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
// "use client";

// import React, { useRef, useState, useEffect } from "react"; 
// import Uppy from "@uppy/core"; 
// import { Dashboard } from "@uppy/react"; 
// import "@uppy/core/dist/style.css"; import "@uppy/dashboard/dist/style.css"; 
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


// interface UploaderProps { playerid: number; FullName: string; } 

// const Uploader: React.FC<UploaderProps> = ({ playerid, FullName }) => {
//   const { data: user } = useUser();
//   const supabase = supabaseBrowser();
//   const [selectedPlayer, setSelectedPlayer] = useState<UploaderProps | null>(
//     null
//   );
//   console.log('User data:', user); // Log user data

//   useEffect(() => {
//     setSelectedPlayer({ playerid, FullName });
//   }, [playerid, FullName]);

//   const inputRef = useRef<HTMLInputElement>(null);
//   const router = useRouter();
  
//   const onBeforeRequest = async (req: any) => {
//     const { data } = await supabase.auth.getSession();
//     console.log('Supabase session data:', data); // Log session data
//     req.setHeader("Authorization", `Bearer ${data?.session?.access_token}`);
//   };
  
//   const player_id = playerid.toString();
//   console.log('Player ID:', player_id); // Log player ID

//   const [uppy] = useState(() =>
//     new Uppy({
//       restrictions: {
//         maxNumberOfFiles: 50,
//         allowedFileTypes: ["image/*", "video/*"],
//         maxFileSize: 5 * 10000 * 10000,
//       },
//       debug: true,
//     })
//     .use(Tus, {
//       endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
//       onBeforeRequest,
//       limit: 20,
//       chunkSize: 15 * 1024 * 1024,
//       allowedMetaFields: [
//         "bucketName",
//         "objectName",
//         "contentType",
//         "cacheControl",
//       ],
//     })
//   );

//   uppy.on('file-added', (file) => {
//     const fileNameWithUUID = `${player_id}_${file.name}`;
//     console.log('File added:', fileNameWithUUID);
//     file.meta = {
//       ...file.meta,
//       bucketName: "media",
//       objectName: `players/${user?.id}/${player_id}/${fileNameWithUUID}`,
//       contentType: file.type,
//       cacheControl: "undefined",
//     };
//   });

//   uppy.on("complete", async (result) => {
//     console.log("Upload result:", result);
//     toast.success("Upload complete!");
//     result.successful.forEach(async (file) => {
//       if (file.type?.startsWith("video/")) {
//         const videoPath = `players/${user?.id}/${player_id}/${file.name}`;
//         try {
//           const edgeFunctionUrl = process.env.NEXT_PUBLIC_SUPABASE_EDGE_PROCESS_VIDEO as string;
//           const { data, error } = await supabase.auth.getSession();
  
//           if (error) {
//             console.error("Error retrieving session:", error);
//             toast.error("Failed to initiate video processing");
//             return;
//           }
  
//           const accessToken = data.session?.access_token;
  
//           const response = await fetch(edgeFunctionUrl, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${accessToken}`,
//             },
//             body: JSON.stringify({ videoPath }),
//           });
  
//           console.log("Video processing response:", response);
//           if (!response.ok) {
//             throw new Error("Failed to process video");
//           }
//           toast.success("Video processing initiated");
//         } catch (error) {
//           console.error(error);
//           toast.error("Failed to initiate video processing");
//         }
//       }
//     });
  
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
//       {" "}
//       <div className="space-y-5">
//         {" "}
//         <h1 className="font-pgFont text-2xl">
//           {" "}
//           Perfect Game Scout Profile Uploader{" "}
//         </h1>{" "}
//         <div>
//           {" "}
//           <p>
//             Selected Player: {FullName} | Player ID: {playerid}
//           </p>{" "}
//         </div>{" "}
//       </div>{" "}
//       <Dashboard uppy={uppy} className="w-auto" hideUploadButton />{" "}
//       <Button
//         id="upload-trigger"
//         className="px-4 py-2 ml-2 w-full font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
//         onClick={handleUpload}
//       >
//         {" "}
//         Upload{" "}
//       </Button>{" "}
//     </div>
//   );
// };
// export default Uploader;






// // app/components/Uploader.tsx


// "use client";

// import React, { useRef, useState, useEffect } from "react"; 
// import Uppy from "@uppy/core"; 
// import { Dashboard } from "@uppy/react"; 
// import "@uppy/core/dist/style.css"; import "@uppy/dashboard/dist/style.css"; 
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


// interface UploaderProps { playerid: number; FullName: string; } 

// const Uploader: React.FC<UploaderProps> = ({ playerid, FullName }) => {
//   const { data: user } = useUser();
//   const supabase = supabaseBrowser();
//   const [selectedPlayer, setSelectedPlayer] = useState<UploaderProps | null>(
//     null
//   );
//   console.log('User data:', user); // Log user data

//   useEffect(() => {
//     setSelectedPlayer({ playerid, FullName });
//   }, [playerid, FullName]);

//   const inputRef = useRef<HTMLInputElement>(null);
//   const router = useRouter();
  
//   const onBeforeRequest = async (req: any) => {
//     const { data } = await supabase.auth.getSession();
//     console.log('Supabase session data:', data); // Log session data
//     req.setHeader("Authorization", `Bearer ${data?.session?.access_token}`);
//   };
  
//   const player_id = playerid.toString();
//   console.log('Player ID:', player_id); // Log player ID

//   const [uppy] = useState(() =>
//     new Uppy({
//       restrictions: {
//         maxNumberOfFiles: 50,
//         allowedFileTypes: ["image/*", "video/*"],
//         maxFileSize: 5 * 10000 * 10000,
//       },
//       debug: true,
//     })
//     .use(Tus, {
//       endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
//       onBeforeRequest,
//       limit: 20,
//       chunkSize: 15 * 1024 * 1024,
//       allowedMetaFields: [
//         "bucketName",
//         "objectName",
//         "contentType",
//         "cacheControl",
//       ],
//     })
//   );

//   uppy.on('file-added', (file) => {
//     const fileNameWithUUID = `${player_id}_${file.name}`;
//     console.log('File added:', fileNameWithUUID);
//     file.meta = {
//       ...file.meta,
//       bucketName: "media",
//       objectName: `players/${user?.id}/${player_id}/${fileNameWithUUID}`,
//       contentType: file.type,
//       cacheControl: "undefined",
//     };
//   });

//   uppy.on("complete", (result) => {
//     console.log('Upload result:', result); // Log upload result
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
//       {" "}
//       <div className="space-y-5">
//         {" "}
//         <h1 className="font-pgFont text-2xl">
//           {" "}
//           Perfect Game Scout Profile Uploader{" "}
//         </h1>{" "}
//         <div>
//           {" "}
//           <p>
//             Selected Player: {FullName} | Player ID: {playerid}
//           </p>{" "}
//         </div>{" "}
//       </div>{" "}
//       <Dashboard uppy={uppy} className="w-auto" hideUploadButton />{" "}
//       <Button
//         id="upload-trigger"
//         className="px-4 py-2 ml-2 w-full font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
//         onClick={handleUpload}
//       >
//         {" "}
//         Upload{" "}
//       </Button>{" "}
//     </div>
//   );
// };
// export default Uploader;
