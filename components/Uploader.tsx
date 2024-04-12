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
}

const Uploader: React.FC<UploaderProps> = ({ playerid, FullName }) => {
  const { data: user, status } = useUser();
  const supabase = supabaseBrowser();
  const [selectedPlayer, setSelectedPlayer] = useState<UploaderProps | null>(
    null
  );

  useEffect(() => {
    setSelectedPlayer({ playerid, FullName });
  }, [playerid, FullName]);

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const player_id = playerid.toString();
  console.log('Player ID:', player_id);

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

  uppy.on('file-added', (file) => {
    const fileNameWithUUID = `${player_id}_${file.name}`;
    console.log('File added:', fileNameWithUUID);
    file.meta = {
      ...file.meta,
      bucketName: "media",
      objectName: user
        ? `players/${user.id}/${player_id}/${fileNameWithUUID}`
        : `players/${player_id}/${fileNameWithUUID}`,
      contentType: file.type,
      cacheControl: "undefined",
    };
  });

  uppy.on('complete', async (result) => {
    console.log('Upload result:', result);
    toast.success('Upload complete!');

    const { data: { session } } = await supabase.auth.getSession();

    result.successful.forEach(async (file) => {
      if (file.type?.startsWith('video/')) {
        const videoPath = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/players/${user?.id}/${player_id}/${file.name}`;
        try {
          const edgeFunctionUrl = process.env.NEXT_PUBLIC_SUPABASE_EDGE_PROCESS_VIDEO as string;

          if (session && session.access_token) {
            const response = await fetch(edgeFunctionUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ videoPath }),
            });

            console.log('Video processing response:', response);
            if (!response.ok) {
              throw new Error('Failed to process video');
            }
            toast.success('Video processing initiated');
          } else {
            console.error('User is not authenticated');
            toast.error('Failed to initiate video processing');
          }
        } catch (error) {
          console.error(error);
          toast.error('Failed to initiate video processing');
        }
      }
    });

    if (window.location.pathname.includes('/players')) {
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
        <h1 className="font-pgFont text-2xl">Perfect Game Scout Profile Uploader</h1>
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
//   const { data: user, status } = useUser();
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
//     const { data: user, status } = useUser();

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

//   // uppy.on("complete", (result) => {
//   //   console.log('Upload result:', result); // Log upload result
//   //   toast.success("Upload complete!");
//   //   if (window.location.pathname.includes("/players")) {
//   //     window.location.reload();
//   //   }
//   // });


//   uppy.on('complete', async (result) => {
//     console.log('Upload result:', result);
//     toast.success('Upload complete!');
//     result.successful.forEach(async (file) => {
//       if (file.type?.startsWith('video/')) {
//         const videoPath = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/players/${user?.id}/${player_id}/${file.name}`;
//         try {
//           const edgeFunctionUrl = process.env.NEXT_PUBLIC_SUPABASE_EDGE_PROCESS_VIDEO as string;

//           // Check if the user is authenticated and has a session
//             if (user && user.id && user.auth.access_token) {
//             const response = await fetch(edgeFunctionUrl, {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${userData.access_token}`,
//               },
//               body: JSON.stringify({ videoPath }),
//             });

//             console.log('Video processing response:', response);
//             if (!response.ok) {
//               throw new Error('Failed to process video');
//             }
//             toast.success('Video processing initiated');
//           } else {
//             console.error('User is not authenticated');
//             toast.error('Failed to initiate video processing');
//           }
//         } catch (error) {
//           console.error(error);
//           toast.error('Failed to initiate video processing');
//         }
//       }
//     });

//     if (window.location.pathname.includes('/players')) {
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
