// app/components/MediaComponents/SupabaseMediaCard.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MediaFile } from "@/lib/types/types";
import Video from "next-video";
import ReactPlayer from "react-player";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FaDownload } from "react-icons/fa";
import MediaForm from "@/components/MediaComponents/MediaForm";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DeletePost from "@/components/UtilityComponents/DeletePost";
import useUser from "@/app/hook/useUser";
import { BsThreeDots } from "react-icons/bs";

interface SupabaseMediaCardProps {
  file: MediaFile;
}

export const SupabaseMediaCard: React.FC<SupabaseMediaCardProps> = ({
  file,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const { data: user } = useUser();
  console.log("User:", user?.id);

  const handleDialogOpen = () => {
    setIsOpen(true);
  };

  const handlePopoverOpen = () => {
    setIsClosed(true);
  };

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
      <Card className="m-0 p-0 rounded-lg">
        <CardContent className="object-cover  m-0 p-0 relative rounded-t-lg">
          <div
            className="relative w-full sm:h-36 h-48 shadow-sm rounded-lg cursor-pointer"
            onClick={handleDialogOpen}
          >
            {file.isVideo ? (
             <ReactPlayer
             url={file.url}
             className="rounded-t-lg object-cover"
             width="100%"
             height="100%"
             controls={true}
             light={file.thumbnail}
           />
            ) : (
              <Image
                src={file.url || ""}
                alt={file.title || "Image"}
                fill={true}
                className="rounded-t-lg  object-cover"
              />
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end items-center mt-4">
          <Popover>
            <PopoverTrigger>
              <div className="flex justify-end">
                <BsThreeDots className="cursor-pointer text-xl text-gray-700" />
              </div>
            </PopoverTrigger>
            <PopoverContent>
  <>
    {user && (
      <div
        className="flex items-center mb-4"
        onClick={handlePopoverOpen}
      >
        <MediaForm
          postId={file.id?.toString() || ""}
          mediaUrl={file.url || ""}
          isVideo={file.isVideo}
          thumbnailUrl={file.thumbnail || ""}
        />
      </div>
    )}
    <div className="flex items-center mb-4" onClick={handleDownload}>
      <span className="text-sm flex items-center cursor-pointer">
        <FaDownload
          className="cursor-pointer text-xl text-gray-700 mr-2"
        />{" "}
        Download
      </span>
    </div>
    {user === file.name && (
      <div
        className="flex items-center mb-4"
        onClick={handlePopoverOpen}
      >
        <DeletePost
          post_by={file.post_by || ""}
          image={file.name || ""}
          event_id={file.event_id}
          team_id={file.team_id}
          id={user || ""}
        />
      </div>
    )}
  </>
</PopoverContent>
          </Popover>
        </CardFooter>
      </Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {file.isVideo ? (
          <DialogContent className="sm:max-w-[66vw] ">
            <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
            <ReactPlayer
                url={file.url}
                className="rounded-lg absolute top-0 left-0"
                width="100%"
                height="100%"
                controls={true}
              />
            </div>
          </DialogContent>
        ) : (
          <DialogContent className="sm:max-w-[66vw] ">
            <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
              <Image
                src={file.url || "/placeholder.png"}
                alt={file?.title || "Image"}
                fill={true}
                className="rounded-lg object-cover"
              />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

// // app/components/MediaComponents/SupabaseMediaCard.tsx
// "use client";
// import React, { useState } from "react";
// import Image from "next/image";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { MediaFile } from "@/lib/types/types";
// import Video from "next-video";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { FaDownload, FaTrash } from "react-icons/fa";
// import MediaForm from "@/components/MediaComponents/MediaForm";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import DeletePost from "@/components/UtilityComponents/DeletePost";
// import useUser from "@/app/hook/useUser";
// import { BsThreeDots } from "react-icons/bs";

// interface SupabaseMediaCardProps {
//   file: MediaFile;
// }

// interface DeletePostProps {
//   post_by: string;
//   image: string;
//   event_id?: string;
//   team_id?: string;
// }

// export const SupabaseMediaCard: React.FC<SupabaseMediaCardProps> = ({
//   file,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { data: user } = useUser();
//   // const [isReady, setIsReady] = useState(false);

//   const handleDialogOpen = () => {
//     setIsOpen(true);
//   };

//   const handleDownload = () => {
//     fetch(file.url || "")
//       .then((response) => response.blob())
//       .then((blob) => {
//         const url = window.URL.createObjectURL(new Blob([blob]));
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = file.title || "download";
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
//       <Card className="m-0 p-0 rounded-lg">
//         <CardContent className="object-cover  m-0 p-0 relative rounded-t-lg">
//           <div
//             className="relative w-full sm:h-36 h-48 shadow-sm rounded-lg cursor-pointer"
//             onClick={handleDialogOpen}
//           >
//             {file.isVideo ? (
//               // <div className="relative w-full h-full shadow-sm rounded-lg cursor-pointer ">
//               <Video
//                 src={file.url}
//                 className="rounded-t-lg  object-cover"
//                 preload="auto"
//                 controls={true}
//                 placeholder={file.url}
//                 autoPlay={false}
//                 style={{ objectFit: "fill" }}
//               />
//             ) : (
//               <Image
//                 src={file.url || ""}
//                 alt={file.title || "Image"}
//                 fill={true}
//                 className="rounded-t-lg  object-cover"
//               />
//             )}
//           </div>
//         </CardContent>

//         <CardFooter className="flex justify-end items-center mt-4">
//           <Popover>
//             <PopoverTrigger>
//               {" "}
//               <div className="flex justify-end">
//                 <BsThreeDots className="cursor-pointer text-xl text-gray-700" />
//               </div>
//             </PopoverTrigger>
//             <PopoverContent>
//               <>
//                 <div className="flex items-center mb-4">
//                   <MediaForm
//                     postId={file.id.toString() || ""}
//                     mediaUrl={file.url || ""}
//                     isVideo={file.isVideo}
//                     thumbnailUrl={file.thumbnail || ""}
//                   />
//                 </div>
//                 <div className="flex items-center mb-4">
//                   {" "}
//                   <span className="text-sm flex items-center cursor-pointer">
//                     <FaDownload
//                       className="cursor-pointer text-xl text-gray-700 mr-2"
//                       onClick={handleDownload}
//                     />{" "}
//                     Download
//                   </span>
//                 </div>
//               </>
//               <div className="flex items-center mb-4">
//                 <DeletePost
//                   post_by={file.post_by || ""} // Provide a default value for post_by
//                   image={file.url || ""}
//                   event_id={file.event_id || ""}
//                   team_id={file.team_id || ""}
//                 />
//               </div>
//             </PopoverContent>
//           </Popover>
//         </CardFooter>
//       </Card>
//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         {file.isVideo ? (
//           <DialogContent className="sm:max-w-[66vw] ">
//             <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
//               <Video
//                 src={file.url}
//                 className="rounded-lg absolute top-0 left-0"
//                 autoPlay={false}
//                 preload="auto"
//               />
//             </div>
//           </DialogContent>
//         ) : (
//           <DialogContent className="sm:max-w-[66vw] ">
//             <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
//               <Image
//                 src={file.url || "/placeholder.png"}
//                 alt={file?.title || "Image"}
//                 fill={true}
//                 className="rounded-lg object-cover"
//               />
//             </div>
//           </DialogContent>
//         )}
//       </Dialog>
//     </>
//   );
// };
