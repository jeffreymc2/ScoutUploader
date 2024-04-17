// app/components/MediaComponents/MediaRenderer.tsx


// app/components/MediaComponents/MediaRenderer.tsx

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
    image: string;
    post_by: string;
    name: string;
    event_id?: string;
    post_type: string;
    title?: string;
    description?: string;
    featured_image?: boolean;
  };
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ file }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [hoverGifUrl, setHoverGifUrl] = useState("");
  const [compressedVideoUrl, setCompressedVideoUrl] = useState("");

  const supabase = supabaseBrowser();

  useEffect(() => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const isVideo = fileExtension === "mp4" || fileExtension === "mov" || fileExtension === "avi";

    if (isVideo) {
      // Construct the thumbnail URL based on the video filename
      const thumbnailFilename = `thumbnail_${file.name.split(".")[0]}.jpg`;
      const thumbnailUrl = `${file.image.split("/").slice(0, -1).join("/")}/${thumbnailFilename}`;
      setThumbnailUrl(supabase.storage.from("media").getPublicUrl(thumbnailUrl).data.publicUrl);

      // Construct the hover GIF URL based on the video filename
      const hoverGifFilename = `hover_${file.name.split(".")[0]}.gif`;
      const hoverGifUrl = `${file.image.split("/").slice(0, -1).join("/")}/${hoverGifFilename}`;
      setHoverGifUrl(supabase.storage.from("media").getPublicUrl(hoverGifUrl).data.publicUrl);

      // Construct the compressed video URL based on the video filename
      const compressedVideoFilename = `compressed_${file.name}`;
      const compressedVideoUrl = `${file.image.split("/").slice(0, -1).join("/")}/${compressedVideoFilename}`;
      setCompressedVideoUrl(supabase.storage.from("media").getPublicUrl(compressedVideoUrl).data.publicUrl);
    } else {
      setThumbnailUrl(file.image);
    }
  }, [file.image, file.name]);

  const handleDownload = () => {
    fetch(file.image)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
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

  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  const isVideo = fileExtension === "mp4" || fileExtension === "mov" || fileExtension === "avi";

  return (
    <>
      <Dialog onOpenChange={setIsOpen}>
        {isVideo ? (
          <DialogContent className="sm:max-w-[66vw] flex items-center justify-center bg-transparent border-0 border-transparent">
            <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
              <Video
                className="rounded-lg absolute top-0 left-0"
                src={compressedVideoUrl}
                style={{ backgroundColor: "var(--media-range-bar-color)" }}
                preload="metadata"
                poster={thumbnailUrl}
              />
            </div>
          </DialogContent>
        ) : (
          <DialogContent className="min-h-[50vh] sm:min-h-[66vh] bg-transparent border-0 border-transparent">
            <Image
              src={file.image}
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
                  src={thumbnailUrl}
                  alt={`Thumbnail posted by ${file.post_by || "Unknown"}`}
                  fill={true}
                  className="object-cover object-top rounded-t-lg"
                />
                {isVideo && (
                  <div className="absolute inset-0">
                    <Image
                      src={hoverGifUrl}
                      alt={`Hover GIF posted by ${file.post_by || "Unknown"}`}
                      fill={true}
                      className="object-cover object-top rounded-t-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                )}
              </div>
            </DialogTrigger>
            {isVideo && (
              <DialogTrigger className="z-10">
                {file.featured_image && (
                  <div className="absolute top-4 left-4">
                    <StarIcon className="text-blue-500 w-6 h-6" />
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

// ... (CameraIcon and StarIcon components remain the same)
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
//     image: string;
//     post_by: string;
//     name: string;
//     event_id?: string;
//     isVideo?: boolean;
//     post_type: string;
//     title?: string;
//     description?: string;
//     featured_image?: boolean;
//   };
// }

// const MediaRenderer: React.FC<MediaRendererProps> = ({ file }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [thumbnailUrl, setThumbnailUrl] = useState("");
//   const [compressedVideoUrl, setCompressedVideoUrl] = useState("");

//   const supabase = supabaseBrowser();

//   // useEffect(() => {
//   //   if (file.isVideo) {
//   //     // Construct the thumbnail URL based on the video filename
//   //     const thumbnailFilename = `thumbnail_${file.name.split(".")[0]}.jpg`;
//   //     const thumbnailUrl = `${file.image.split("/").slice(0, -1).join("/")}/${thumbnailFilename}`;
//   //     setThumbnailUrl(supabase.storage.from("media").getPublicUrl(thumbnailUrl).data.publicUrl);

//   //     // Construct the compressed video URL based on the video filename
//   //     const compressedVideoFilename = `compressed_${file.name}`;
//   //     const compressedVideoUrl = `${file.image.split("/").slice(0, -1).join("/")}/${compressedVideoFilename}`;
//   //     setCompressedVideoUrl(supabase.storage.from("media").getPublicUrl(compressedVideoUrl).data.publicUrl);
//   //   } else {
//   //     setThumbnailUrl(file.image);
//   //   }
//   // }, [file.image, file.isVideo, file.name]);

//   useEffect(() => {
//     if (file.isVideo) {
//       // Construct the thumbnail URL based on the video filename
//       const thumbnailFilename = `thumbnail_${file.name.split(".")[0]}.jpg`;
//       const thumbnailUrl = `${file.image.split("/").slice(0, -1).join("/")}/${thumbnailFilename}`;
//       setThumbnailUrl(supabase.storage.from("media").getPublicUrl(thumbnailUrl).data.publicUrl);
  
//       // Construct the compressed video URL based on the video filename
//       const compressedVideoFilename = `compressed_${file.name}`;
//       const compressedVideoUrl = `${file.image.split("/").slice(0, -1).join("/")}/${compressedVideoFilename}`;
//       setCompressedVideoUrl(supabase.storage.from("media").getPublicUrl(compressedVideoUrl).data.publicUrl);
//     } else {
//       setThumbnailUrl(file.image);
//     }
//   }, [file.image, file.isVideo, file.name]);

//   const handleDownload = () => {
//     fetch(file.image)
//       .then((response) => response.blob())
//       .then((blob) => {
//         const url = window.URL.createObjectURL(new Blob([blob]));
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = file.name;
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

//   return (
//     <>
//       <Dialog onOpenChange={setIsOpen}>
//         {file.isVideo ? (
//           <DialogContent className="sm:max-w-[66vw] flex items-center justify-center bg-transparent border-0 border-transparent">
//             <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
//               <Video
//                 className="rounded-lg absolute top-0 left-0"
//                 src={compressedVideoUrl}
//                 style={{ backgroundColor: "var(--media-range-bar-color)" }}
//                 preload="metadata"
//                 poster={thumbnailUrl}
//               />
//             </div>
//           </DialogContent>
//         ) : (
//           <DialogContent className="min-h-[50vh] sm:min-h-[66vh] bg-transparent border-0 border-transparent">
//             <Image
//               src={file.image}
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
//           {file.isVideo ? (
//             thumbnailUrl ? (
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <DialogTrigger>
//                   <div className="p-0 w-full">
//                     <Image
//                       src={thumbnailUrl}
//                       alt={`Thumbnail posted by ${file.post_by || "Unknown"}`}
//                       fill={true}
//                       className="object-cover object-top rounded-t-lg"
//                     />
//                   </div>
//                 </DialogTrigger>
//                 <DialogTrigger className="z-10">
//                   {file.featured_image && (
//                     <div className="absolute top-4 left-4">
//                       <StarIcon className="text-blue-500 w-6 h-6" />
//                     </div>
//                   )}{" "}
//                   <PlayCircleIcon className="w-12 h-12 text-white z-10" />
//                 </DialogTrigger>
//               </div>
//             ) : (
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <PlayCircleIcon className="w-12 h-12 text-white z-10" />
//               </div>
//             )
//           ) : (
//             <DialogTrigger>
//               <Image
//                 src={thumbnailUrl}
//                 alt={`Thumbnail posted by ${file.post_by || "Unknown"}`}
//                 fill={true}
//                 className="object-cover object-top rounded-t-lg"
//               />
//               {file.featured_image && (
//                 <div className="absolute top-4 left-4">
//                   <StarIcon className="text-blue-500 w-6 h-6" />
//                 </div>
//               )}
//             </DialogTrigger>
//           )}
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
//                 {!file.isVideo ? (
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


// ... (CameraIcon and StarIcon components remain the same)

function CameraIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function StarIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
