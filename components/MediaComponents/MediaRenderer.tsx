"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Video from "react-player";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlayCircleIcon } from "lucide-react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import MediaForm from "./MediaForm";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Separator } from "@/components/ui/separator";
import { Badge } from "../ui/badge";

interface MediaFile {
  id?: string;
  created_at: string;
  player_id?: string | null;
  name?: string;
  object_id?: string;
  post_by?: string;
  event_id?: string;
  team_id?: string;
  profile: {
    display_name: string | null;
  } | null;
  image: string;
  isVideo: boolean;
  post_type?: string;
  title?: string;
  description?: string;
  featured_image?: boolean;
  thumbnail?: string;
  compressed_video?: string;
  compressed_gif?: string;
  compressed_thumbnail?: string;
  mux_asset_id?: string | null;
  mux_playback_id?: string | null;
}

interface HighlightVideo {
  id: number;
  title: string;
  description: string;
  start_time: number;
  end_time: number;
  duration: number;
  thumbnail: string;
  created: string;
  tagged_player_keys: { Key: number; Position: string }[];
  url: string;
  highlight_type: string;
  drund_event_id: number;
  game_key: string;
  scoringapp_play_id: number;
  play_type: string;
  highlight_created: string;
}

interface MediaRendererProps {
  file: MediaFile | HighlightVideo;
  isHighlight?: boolean;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ file, isHighlight }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const supabase = supabaseBrowser();

  useEffect(() => {
    if ("isVideo" in file) {
      // Regular media file from Supabase
      const mediaFile = file as MediaFile;
      const isVideo = mediaFile.isVideo;
  
      if (isVideo) {
        if (mediaFile.thumbnail) {
          setThumbnailUrl(mediaFile.thumbnail);
        } else {
          // Generate thumbnail for Supabase video files
          const video = document.createElement("video");
          video.src = mediaFile.image;
          video.crossOrigin = "anonymous";
          video.preload = "metadata";
          video.onloadedmetadata = () => {
            video.currentTime = 1;
          };
          video.onseeked = () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnail = canvas.toDataURL("image/png");
            setThumbnailUrl(thumbnail);
          };
        }
  
        setVideoUrl(mediaFile.image);
      } else {
        setThumbnailUrl(mediaFile.image);
      }
    } else {
      // Highlight video from API
      const highlightVideo = file as HighlightVideo;
      setThumbnailUrl(highlightVideo.thumbnail);
      setVideoUrl(highlightVideo.url);
    }
  }, [file]);

  const isVideo = isVideoFile(file.thumbnail || "");

  const handleDownload = () => {
    if (isVideo) {
      const mediaFile = file as MediaFile;
      fetch(mediaFile.image)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.download = mediaFile.name || "download";
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Error downloading file:", error);
        });
    }
  };

  return (
    <>
      <Dialog onOpenChange={setIsOpen}>
        {isVideo && !isHighlight ? (
          <DialogContent className="sm:max-w-[66vw] flex items-center justify-center bg-transparent border-0 border-transparent">
            <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
              <Video
                className="rounded-lg absolute top-0 left-0"
                src={videoUrl}
                style={{ backgroundColor: "var(--media-range-bar-color)" }}
                preload="metadata"
                poster={thumbnailUrl}
                controls
              />
            </div>
          </DialogContent>
        ) : (
          <DialogContent className="min-h-[50vh] sm:min-h-[66vh] bg-transparent border-0 border-transparent">
            <Image
              src={file.thumbnail ?? ""}
              alt={`Media posted by ${("isVideo" in file && file.post_by) || "Unknown"}`}
              width={640}
              height={360}
              className="rounded-lg object-contain"
            />
          </DialogContent>
        )}
        <div
          className="relative w-full h-48 shadow-sm rounded-lg cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <DialogTrigger>
              <div className="p-0 w-full">
                <Video
                  src={videoUrl}
                  width={640}
                  height={360}
                  className="object-cover object-top rounded-t-lg"
                />
              </div>
            </DialogTrigger>
            {isVideo && (
              <DialogTrigger className="z-10">
                <PlayCircleIcon className="w-12 h-12 text-white z-10" />
              </DialogTrigger>
            )}
          </div>
        </div>
        {!isHighlight && isVideo && (
          <>
            <div className="flex items-center justify-between gap-2 mt-0">
              <Separator />
            </div>
            <div className="px-4 pb-4 pt-2">
              <div className="flex items-center justify-between gap-2 mt-2">
                <div className="flex items-center gap-2">
                  <IoCloudDownloadOutline
                    className="cursor-pointer text-2xl text-gray-700"
                    onClick={handleDownload}
                  />
                  <Dialog>
                    {!isVideo ? (
                      <div className="mt-3">
                        
                        <MediaForm
                          postId={(file as MediaFile).id || ""}
                          mediaUrl={(file as MediaFile).image}
                          isVideo={false}
                          thumbnailUrl={(file as MediaFile).image}
                        />
                      </div>
                    ) : (
                      <div className="mt-3">
                        <MediaForm
                          postId={(file as MediaFile).id ?? ""}
                          mediaUrl={videoUrl}
                          isVideo={true}
                          thumbnailUrl={thumbnailUrl}
                        />
                      </div>
                    )}
                  </Dialog>
                </div>
                {(file as MediaFile).featured_image && (
                  <div className="mt-0">
                    <Badge className="bg-blue-500 text-white hover:bg-blue-500 text-xs">
                      Featured Image
                    </Badge>
                  </div>
                )}
              </div>
              {(file as MediaFile).title && (
                <p className="text-md mt-2 leading-3 font-bold text-gray-700">{(file as MediaFile).title}</p>
              )}
              {(file as MediaFile).description && <p className="text-xs mt-1">{(file as MediaFile).description}</p>}
              {(file as MediaFile).event_id && (
                <p className="text-sm mt-5">Uploaded from Event ID: {(file as MediaFile).event_id}</p>
              )}
            </div>
          </>
        )}
        {isHighlight && (
          <>
            <div className="px-4 pb-4 pt-2">
              {(file as HighlightVideo).title && (
                <p className="text-md mt-2 leading-3 font-bold text-gray-700">{(file as HighlightVideo).title}</p>
              )}
              {(file as HighlightVideo).description && (
                <p className="text-xs mt-1">{(file as HighlightVideo).description}</p>
              )}
            </div>
          </>
        )}
      </Dialog>
    </>
  );
};

export default MediaRenderer;


function isVideoFile(fileName: string): boolean {
  const fileExtension = fileName?.split(".").pop()?.toLowerCase();
  const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "flv"];
  return videoExtensions.includes(fileExtension || "");
}

// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import Video from "next-video";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { PlayCircleIcon } from "lucide-react";
// import { IoCloudDownloadOutline } from "react-icons/io5";
// import MediaForm from "./MediaForm";
// import { supabaseBrowser } from "@/lib/supabase/browser";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "../ui/badge";

// interface MediaRendererProps {
//   file: {
//     id: string;
//     created_at: string;
//     player_id?: string | null;
//     name?: string;
//     object_id?: string;
//     post_by?: string;
//     event_id?: string;
//     team_id?: string;
//     profile: {
//       display_name: string | null;
//     } | null;
//     image: string;
//     isVideo: boolean;
//     post_type?: string;
//     title?: string;
//     description?: string;
//     featured_image?: boolean;
//     thumbnail?: string;
//     compressed_video?: string;
//     compressed_gif?: string;
//     compressed_thumbnail?: string;
//     mux_asset_id?: string | null;
//     mux_playback_id?: string | null;
//   };
// }

// const MediaRenderer: React.FC<MediaRendererProps> = ({ file }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [thumbnailUrl, setThumbnailUrl] = useState("");
//   const [hoverGifUrl, setHoverGifUrl] = useState("");
//   const [compressedVideoUrl, setCompressedVideoUrl] = useState("");

//   const supabase = supabaseBrowser();

//   useEffect(() => {
//     const fileExtension = file.name?.split(".").pop()?.toLowerCase();
//     const isVideo = fileExtension === "mp4" || fileExtension === "mov" || fileExtension === "avi";

//     if (isVideo) {
//       if (file.compressed_thumbnail) {
//         setThumbnailUrl(supabase.storage.from("media").getPublicUrl(file.compressed_thumbnail).data.publicUrl);
//       } else {
//         const video = document.createElement("video");
//         video.src = file.image;
//         video.crossOrigin = "anonymous"; // Ensure CORS policies allow this
//         video.preload = "metadata";
//         video.style.position = "absolute";
//         video.style.width = "0";
//         video.style.height = "0";
//         video.style.top = "0";
//         video.style.left = "-10000px"; // Off-screen

//         // Append the video to the body to ensure it's part of the DOM
//         document.body.appendChild(video);

//         video.onloadedmetadata = () => {
//           // After metadata loads, seek to a frame
//           video.currentTime = 1;
//         };

//         video.onseeked = () => {
//           // Introduce a slight delay before capturing the thumbnail
//           setTimeout(() => {
//             const canvas = document.createElement("canvas");
//             canvas.width = video.videoWidth;
//             canvas.height = video.videoHeight;
//             const ctx = canvas.getContext("2d");
//             ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
//             const thumbnail = canvas.toDataURL("image/png");
//             setThumbnailUrl(thumbnail);
//             // Remove the video element after capturing the thumbnail
//             document.body.removeChild(video);
//           }, 1000); // Adjust delay as necessary
//         };

//         video.onerror = () => {
//           console.error("Error loading video for thumbnail generation");
//           // Consider removing the video element in case of error as well
//           document.body.removeChild(video);
//         };
//       }

//       if (file.compressed_gif) {
//         setHoverGifUrl(supabase.storage.from("media").getPublicUrl(file.compressed_gif).data.publicUrl);
//       } else {
//         // Construct the hover GIF URL based on the video filename
//         const hoverGifFilename = `hover_${file.name?.split(".")[0]}.gif`;
//         const hoverGifUrl = `${file.image.split("/").slice(0, -1).join("/")}/${hoverGifFilename}`;
//         setHoverGifUrl(supabase.storage.from("media").getPublicUrl(hoverGifUrl).data.publicUrl);
//       }

//       if (file.compressed_video) {
//         setCompressedVideoUrl(supabase.storage.from("media").getPublicUrl(file.compressed_video).data.publicUrl);
//       }
//     } else {
//       setThumbnailUrl(file.compressed_thumbnail || file.image);
//     }
//   }, [file]);

//   const handleDownload = () => {
//     fetch(file.image)
//       .then((response) => response.blob())
//       .then((blob) => {
//         const url = window.URL.createObjectURL(new Blob([blob]));
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = file.name || "download";
//         link.style.display = "none";
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(url);
//       })
//       .catch((error) => {
//         console.error("Error downloading file:", error);
//       });
//   };

//   const fileExtension = file.name?.split(".").pop()?.toLowerCase();
//   const isVideo = fileExtension === "mp4" || fileExtension === "mov" || fileExtension === "avi";

//   return (
//     <>
//       <Dialog onOpenChange={setIsOpen}>
//         {isVideo ? (
//           <DialogContent className="sm:max-w-[66vw] flex items-center justify-center bg-transparent border-0 border-transparent">
//             <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
//               <Video
//                 className="rounded-lg absolute top-0 left-0"
//                 src={compressedVideoUrl || file.image}
//                 style={{ backgroundColor: "var(--media-range-bar-color)" }}
//                 preload="metadata"
//                 poster={thumbnailUrl}
//               />
//             </div>
//           </DialogContent>
//         ) : (
//           <DialogContent className="min-h-[50vh] sm:min-h-[66vh] bg-transparent border-0 border-transparent">
//             <Image
//               src={file.compressed_thumbnail || file.image}
//               alt={`Media posted by ${file.post_by || "Unknown"}`}
//               fill={true}
//               className="rounded-lg object-contain relative"
//             />
//           </DialogContent>
//         )}
//         <div
//           className="relative w-full h-48 shadow-sm rounded-lg cursor-pointer"
//           onClick={() => setIsOpen(true)}
//         >
//           <div className="absolute inset-0 flex items-center justify-center">
//             <DialogTrigger>
//               <div className="p-0 w-full">
//                 <Image
//                   src={thumbnailUrl || ""}
//                   alt={`Thumbnail posted by ${file.post_by || "Unknown"}`}
//                   fill={true}
//                   className="object-cover object-top rounded-t-lg"
//                 />
//                 {/* {isVideo && (
//                   <div className="absolute inset-0">
//                     <Image
//                       src={hoverGifUrl || ""}
//                       alt={`Hover GIF posted by ${file.post_by || "Unknown"}`}
//                       fill={true}
//                       className="object-cover object-top rounded-t-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
//                     />
//                   </div>
//                 )} */}
//               </div>
//             </DialogTrigger>
//             {isVideo && (
//               <DialogTrigger className="z-10">
//                 {file.featured_image && (
//                   <div className="absolute top-4 left-4">
//                     {/* <StarIcon className="text-blue-500 w-6 h-6" /> */}
//                   </div>
//                 )}{" "}
//                 <PlayCircleIcon className="w-12 h-12 text-white z-10" />
//               </DialogTrigger>
//             )}
//           </div>
//         </div>
//         <div className="flex items-center justify-between gap-2 mt-0">
//           <Separator />
//         </div>
//         <div className="px-4 pb-4 pt-2">
//           <div className="flex items-center justify-between gap-2 mt-2">
//             <div className="flex items-center gap-2">
//               <IoCloudDownloadOutline
//                 className="cursor-pointer text-2xl text-gray-700"
//                 onClick={handleDownload}
//               />
//               <Dialog>
//                 {!isVideo ? (
//                   <div className="mt-3">
//                     <MediaForm
//                       postId={file.id}
//                       mediaUrl={file.image}
//                       isVideo={false}
//                       thumbnailUrl={file.image}
//                     />
//                   </div>
//                 ) : (
//                   <div className="mt-3">
//                     <MediaForm
//                       postId={file.id}
//                       mediaUrl={compressedVideoUrl}
//                       isVideo={true}
//                       thumbnailUrl={thumbnailUrl}
//                     />
//                   </div>
//                 )}
//               </Dialog>
//             </div>
//             {file.featured_image && (
//               <div className="mt-0">
//                 <Badge className="bg-blue-500 text-white hover:bg-blue-500 text-xs">
//                   Featured Image
//                 </Badge>
//               </div>
//             )}
//           </div>
//           {file.title && (
//             <p className="text-md mt-2 leading-loose font-bold text-gray-700">{file.title}</p>
//           )}
//           {file.description && <p className="text-xs mt-1">{file.description}</p>}
//           {file.event_id && (
//             <p className="text-sm mt-5">Uploaded from Event ID: {file.event_id}</p>
//           )}
//         </div>
//       </Dialog>
//     </>
//   );
// };

// export default MediaRenderer;
