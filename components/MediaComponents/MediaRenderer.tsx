// // app/components/MediaComponents/MediaRenderer.tsx

// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import ReactPlayer from "react-player";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { PlayCircleIcon } from "lucide-react";
// import { IoCloudDownloadOutline } from "react-icons/io5";
// import MediaForm from "./MediaForm";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "../ui/badge";
// import { MediaFile, HighlightVideo } from "@/lib/types/types";

// interface MediaRendererProps {
//   file?: MediaFile;
//   highlight?: HighlightVideo;
// }

// const MediaRenderer: React.FC<MediaRendererProps> = ({ file, highlight }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [thumbnailUrl, setThumbnailUrl] = useState("");
//   const [videoUrl, setVideoUrl] = useState("");

//   useEffect(() => {
//     if (file) {
//       setThumbnailUrl(file.thumbnail || "");
//       setVideoUrl(file.url || "");
//     } else if (highlight) {
//       setThumbnailUrl(highlight.thumbnail);
//       setVideoUrl(highlight.url);
//     }
//   }, [file, highlight]);

//   const isVideo = file ? file.isVideo : true;

//   const handleDownload = () => {
//     if (file && isVideo) {
//       fetch(file.url || "")
//         .then((response) => response.blob())
//         .then((blob) => {
//           const url = window.URL.createObjectURL(new Blob([blob]));
//           const link = document.createElement("a");
//           link.href = url;
//           link.download = file.title || "download";
//           link.style.display = "none";
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);
//           window.URL.revokeObjectURL(url);
//         })
//         .catch((error) => {
//           console.error("Error downloading file:", error);
//         });
//     }
//   };

//   return (
//     <>
//       <div
//         className="relative w-full h-48 shadow-sm rounded-lg cursor-pointer"
//         onClick={() => setIsOpen(true)}
//       >
//         {!isOpen ? (
//           <>
//             {highlight ? (
//               <ReactPlayer
//                 url={highlight.url}
//                 width="100%"
//                 height="100%"
//                 light={highlight.thumbnailUrl}
//                 playIcon={<PlayCircleIcon className="w-12 h-12 text-white z-10" />}
//               />
//             ) : (
//               <Image
//                 src={thumbnailUrl || "/placeholder.png"}
//                 alt={`Thumbnail for ${file?.title || "Media"}`}
//                 fill
//                 className="object-cover object-top rounded-t-lg"
//               />
//             )}
//           </>
//         ) : (
//           <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
//             <ReactPlayer
//               className="rounded-lg absolute top-0 left-0"
//               url={highlight ? highlight.url : videoUrl}
//               width="100%"
//               height="100%"
//               controls={true}
//               playing={isOpen}
//               start={highlight?.start_time}
//               duration={highlight?.duration}
//             />
//           </div>
//         )}
//       </div>
//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogContent className="min-h-[50vh] sm:min-h-[66vh] bg-transparent border-0 border-transparent">
//           {isOpen && (
//             <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
//               <ReactPlayer
//                 className="rounded-lg absolute top-0 left-0"
//                 url={videoUrl}
//                 width="100%"
//                 height="100%"
//                 controls={true}
//                 config={{
//                   file: {
//                     attributes: {
//                       crossOrigin: "anonymous",
//                     },
//                   },
//                 }}
//                 playing={isOpen}
//                 start={highlight?.start_time}
//                 duration={highlight?.duration}
//               />
//             </div>
//           )}

//           {file && (
//             <>
//               <div className="flex items-center justify-between gap-2 mt-0">
//                 <Separator />
//               </div>
//               <div className="px-4 pb-4 pt-2">
//                 <div className="flex items-center justify-between gap-2 mt-2">
//                   <div className="flex items-center gap-2">
//                     <IoCloudDownloadOutline
//                       className="cursor-pointer text-2xl text-gray-700"
//                       onClick={handleDownload}
//                     />
//                     <Dialog>
//                       <div className="mt-3">
//                         <MediaForm
//                           postId={file.id.toString() || ""}
//                           mediaUrl={file.url || ""}
//                           isVideo={isVideo || false}
//                           thumbnailUrl={thumbnailUrl}
//                         />
//                       </div>
//                     </Dialog>
//                   </div>
//                   {file.featured_image && (
//                     <div className="mt-0">
//                       <Badge className="bg-blue-500 text-white hover:bg-blue-500 text-xs">
//                         Featured Image
//                       </Badge>
//                     </div>
//                   )}
//                 </div>
//                 {file.title && (
//                   <p className="text-md mt-2 leading-3 font-bold text-gray-700">{file.title}</p>
//                 )}
//                 {file.description && <p className="text-xs mt-1">{file.description}</p>}
//               </div>
//             </>
//           )}
//           {highlight && (
//             <>
//               <div className="px-4 pb-4 pt-2">
//                 {highlight.title && (
//                   <p className="text-md mt-2 leading-3 font-bold text-gray-700">{highlight.title}</p>
//                 )}
//                 {highlight.description && (
//                   <p className="text-xs mt-1">{highlight.description}</p>
//                 )}
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default MediaRenderer;


"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Video from "next-video";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlayCircleIcon } from "lucide-react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import MediaForm from "./MediaForm";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Separator } from "@/components/ui/separator";
import { Badge } from "../ui/badge";

interface MediaRendererProps {
  file: {
    id: string;
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
  };
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ file }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [hoverGifUrl, setHoverGifUrl] = useState("");
  const [compressedVideoUrl, setCompressedVideoUrl] = useState("");

  const supabase = supabaseBrowser();

  useEffect(() => {
    const fileExtension = file.name?.split(".").pop()?.toLowerCase();
    const isVideo = fileExtension === "mp4" || fileExtension === "mov" || fileExtension === "avi";

    if (isVideo) {
      if (file.compressed_thumbnail) {
        setThumbnailUrl(supabase.storage.from("media").getPublicUrl(file.compressed_thumbnail).data.publicUrl);
      } else {
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
      }

      if (file.compressed_gif) {
        setHoverGifUrl(supabase.storage.from("media").getPublicUrl(file.compressed_gif).data.publicUrl);
      } else {
        // Construct the hover GIF URL based on the video filename
        const hoverGifFilename = `hover_${file.name?.split(".")[0]}.gif`;
        const hoverGifUrl = `${file.image.split("/").slice(0, -1).join("/")}/${hoverGifFilename}`;
        setHoverGifUrl(supabase.storage.from("media").getPublicUrl(hoverGifUrl).data.publicUrl);
      }

      if (file.compressed_video) {
        setCompressedVideoUrl(supabase.storage.from("media").getPublicUrl(file.compressed_video).data.publicUrl);
      }
    } else {
      setThumbnailUrl(file.compressed_thumbnail || file.image);
    }
  }, [file]);

  const handleDownload = () => {
    fetch(file.image)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name || "download";
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

  const fileExtension = file.name?.split(".").pop()?.toLowerCase();
  const isVideo = fileExtension === "mp4" || fileExtension === "mov" || fileExtension === "avi";

  return (
    <>
      <Dialog onOpenChange={setIsOpen}>
        {isVideo ? (
          <DialogContent className="sm:max-w-[66vw] flex items-center justify-center bg-transparent border-0 border-transparent">
            <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
              <Video
                className="rounded-lg absolute top-0 left-0"
                src={compressedVideoUrl || file.image}
                style={{ backgroundColor: "var(--media-range-bar-color)" }}
                preload="metadata"
                poster={thumbnailUrl}
              />
            </div>
          </DialogContent>
        ) : (
          <DialogContent className="min-h-[50vh] sm:min-h-[66vh] bg-transparent border-0 border-transparent">
            <Image
              src={file.compressed_thumbnail || file.image}
              alt={`Media posted by ${file.post_by || "Unknown"}`}
              fill={true}
              className="rounded-lg object-contain relative"
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
                <Image
                  src={thumbnailUrl || ""}
                  alt={`Thumbnail posted by ${file.post_by || "Unknown"}`}
                  fill={true}
                  className="object-cover object-top rounded-t-lg"
                />
                {/* {isVideo && (
                  <div className="absolute inset-0">
                    <Image
                      src={hoverGifUrl || ""}
                      alt={`Hover GIF posted by ${file.post_by || "Unknown"}`}
                      fill={true}
                      className="object-cover object-top rounded-t-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                )} */}
              </div>
            </DialogTrigger>
            {isVideo && (
              <DialogTrigger className="z-10">
                {file.featured_image && (
                  <div className="absolute top-4 left-4">
                    {/* <StarIcon className="text-blue-500 w-6 h-6" /> */}
                  </div>
                )}{" "}
                <PlayCircleIcon className="w-12 h-12 text-white z-10" />
              </DialogTrigger>
            )}
          </div>
        </div>
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
                      mediaUrl={compressedVideoUrl}
                      isVideo={true}
                      thumbnailUrl={thumbnailUrl}
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
            <p className="text-md mt-2 leading-loose font-bold text-gray-700">{file.title}</p>
          )}
          {file.description && <p className="text-xs mt-1">{file.description}</p>}
          {file.event_id && (
            <p className="text-sm mt-5">Uploaded from Event ID: {file.event_id}</p>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default MediaRenderer;
