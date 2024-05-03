// // app/components/MediaComponents/MediaCard.tsx
// "use client";
// import React, { useState } from "react";
// import Image from "next/image";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { MediaFile, HighlightVideo } from "@/lib/types/types";
// import ReactPlayer from "react-player";
// import { Card, CardContent } from "@/components/ui/card";

// interface MediaCardProps {
//   file: MediaFile;
//   highlight?: HighlightVideo;
// }

// const MediaCard: React.FC<MediaCardProps> = ({ file, highlight }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       <Card className="m-0 p-0">
//         <CardContent className="object-cover m-0 p-0">
//           <div
//           className="relative w-full h-48 shadow-sm rounded-lg cursor-pointer"
//           onClick={() => setIsOpen(true)}> 
       
//           {file.isVideo ? (
//             <>
//             <div className="relative w-full h-full rounded-lg">
//               <ReactPlayer
//                 url={file.url}
//                 width="100%"
//                 height="100%"
//                 light={file?.thumbnail || ""}
//                 playing={true}
//                 start={highlight?.start_time}
//                 duration={highlight?.duration}
//                 playIcon={
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <svg
//                       className="w-12 h-12 text-white"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={1.4}
//                         d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={1.4}
//                         d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                   </div>
                  
//                 }
//               />
             
//             </div>
//              <p className="absolute bottom-0 left-0 right-0 p-2 text-xs bg-black bg-opacity-50 text-white">
//              {" "}
//              {file.title}
//            </p>
//            </>
//           ) : (
//             <Image
//               src={file.url || "/placeholder.png"}
//               alt={file.title || "Image"}
//               fill={true}
//               className="rounded-lg object-cover"
//             />
//           )}
//         </div>
//         </CardContent>
         
//       </Card>
//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         {file.isVideo ? (
//           <DialogContent className="sm:max-w-[66vw] flex items-center justify-center bg-transparent border-0 border-transparent">
//             <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
//               <div className="px-4 pb-4 pt-2">
//                 {file.title && (
//                   <p className="text-md mt-2 leading-4 font-bold text-gray-700">
//                     {file.title}
//                   </p>
//                 )}
//                 {file.description && (
//                   <p className="text-xs mt-1">{file.description}</p>
//                 )}
//               </div>
//               <ReactPlayer
//                 className="rounded-lg absolute top-0 left-0 "
//                 url={file.url}
//                 width="100%"
//                 height="100%"
//                 controls={true}
//                 playIcon={
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <svg
//                       className="w-12 h-12 text-white"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={1.4}
//                         d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={1.4}
//                         d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                   </div>
                  
//                 }
//               />
//             </div>
//           </DialogContent>
//         ) : (
//           <DialogContent className="min-h-[50vh] sm:min-h-[66vh] bg-transparent border-0 border-transparent">
//             <Image
//               src={file.url || "/placeholder.png"}
//               alt={file?.title || "Image"}
//               fill={true}
//               className="rounded-lg object-contain"
//             />
//           </DialogContent>
//         )}
//       </Dialog>
//     </>
//   );
// };

// export default MediaCard;
