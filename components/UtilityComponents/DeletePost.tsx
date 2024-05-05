// app/components/DeletePost.tsx
"use client";
import React from "react";
import { Button } from "../ui/button";
import useUser from "@/app/hook/useUser";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RiDeleteBin6Line } from "react-icons/ri";

import { MediaFile } from "@/lib/types/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeletePostProps {
  post_by: string;
  image: string;
  event_id?: string;
  team_id?: string;
  player_id?: string;
}

const DeletePost: React.FC<DeletePostProps> = ({
  post_by,
  image,
  event_id,
  team_id,
  player_id
}) => {
  const { data: user, isFetching } = useUser();
  const router = useRouter();

  const handleDelete = async () => {
    toast.info("Deleting image...");
    try {
      const supabase = supabaseBrowser();
      let folderPath = event_id
        ? `events/${post_by}/${event_id}/${team_id}/`
        : `players/${post_by}/${player_id}/`;
  
      // Get the image path relative to the storage bucket
      const imagePath = image.replace(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`, '');
  
      const { data, error } = await supabase.storage
        .from("media")
        .remove([imagePath]);
  
      console.log("data", post_by, event_id, team_id, folderPath, imagePath, data, error);
      if (error) {
        console.error("Failed to delete image:", error);
        toast.error(`Failed to delete image: ${error.message}`);
      } else {
        console.log("Successfully removed image with path:", imagePath, data);
        toast.success("Successfully removed image");
        router.refresh();
      }
    } catch (error) {
      console.error("Error during delete operation:", error);
      toast.error("An error occurred while deleting the image");
    }
  };
  
  if (isFetching) {
    return null;
  }

  if (user?.id === post_by) {
    return (
      <AlertDialog>
        <AlertDialogTrigger>
          <span className="text-sm flex items-center cursor-pointer">
            <RiDeleteBin6Line className="text-xl mr-2" />
            Delete Media File
          </span>{" "}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  } else {
    return (
      <AlertDialog>
        <AlertDialogTrigger>
          <span className="text-sm flex items-center cursor-pointer">
            <RiDeleteBin6Line className="text-xl" />
            Delete Media File
          </span>{" "}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
};

export default DeletePost;

// // app/components/DeletePost.tsx
// "use client";
// import React from "react";
// import { Button } from "../ui/button";
// import useUser from "@/app/hook/useUser";
// import { supabaseBrowser } from "@/lib/supabase/browser";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { RiDeleteBin6Line } from "react-icons/ri";

// import { MediaFile } from "@/lib/types/types";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

// interface DeletePostProps {
//   post_by: string;
//   image: string;
//   event_id?: string;
//   team_id?: string;
//   player_id?: string;
// }

// const DeletePost: React.FC<DeletePostProps> = ({
//   post_by,
//   image,
//   event_id,
//   team_id,
//   player_id
// }) => {
//   const { data: user, isFetching } = useUser();
//   const router = useRouter();

//   const handleDelete = async () => {
//     toast.info("Deleting image...");
//     try {
//       const supabase = supabaseBrowser();
//       let folderPath = event_id
//         ? `events/${post_by}/${event_id}/${team_id}/`
//         : `players/${post_by}/${player_id}/`;
//       let imagePath = image.split(folderPath).pop() ?? "";
//       if (imagePath.startsWith("/")) {
//         imagePath = imagePath.substring(1);
//       }
//       const fullPath = `${folderPath}${imagePath}`;
//       const { data, error } = await supabase.storage
//         .from("media")
//         .remove([fullPath]);

//         console.log("data", post_by, event_id, team_id, folderPath, imagePath, fullPath, data, error);
//       if (error) {
//         console.error("Failed to delete image:", error);
//         toast.error(`Failed to delete image: ${error.message}`);
//       } else {
//         console.log("Successfully removed image with path:", fullPath, data);
//         toast.success("Successfully removed image");
//         router.refresh();
//       }
//     } catch (error) {
//       console.error("Error during delete operation:", error);
//       toast.error("An error occurred while deleting the image");
//     }
//   };
  
//   if (isFetching) {
//     return null;
//   }

//   if (user?.id === post_by) {
//     return (
//       <AlertDialog>
//         <AlertDialogTrigger>
//           <span className="text-sm flex items-center cursor-pointer">
//             <RiDeleteBin6Line className="text-xl mr-2" />
//             Delete Media File
//           </span>{" "}
//         </AlertDialogTrigger>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete your
//               account and remove your data from our servers.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete}>
//               Continue
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     );
//   } else {
//     return (
//       <AlertDialog>
//         <AlertDialogTrigger>
//           <span className="text-sm flex items-center cursor-pointer">
//             <RiDeleteBin6Line className="text-xl" />
//             Delete Media File
//           </span>{" "}
//         </AlertDialogTrigger>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete your
//               account and remove your data from our servers.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete}>
//               Continue
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     );
//   }
// };

// export default DeletePost;
