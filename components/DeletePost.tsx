// app/components/DeletePlayerPost.tsx
"use client";
import React from "react";
import { Button } from "./ui/button";
import useUser from "@/app/hook/useUser";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeletePlayerPostProps {
  post_by: string;
  image: string;
  player_id: string;
}

const DeletePost: React.FC<DeletePlayerPostProps> = ({ post_by, image, player_id }) => {
  const { data: user, isFetching } = useUser();
  const router = useRouter();

  const handleDelete = async () => {
    toast.info("Deleting player image...");
    try {
      const supabase = supabaseBrowser();
      const bucket = 'media';
      const imagePath = image.split(`/public/${bucket}/players/`).pop() ?? '';

      const { data, error } = await supabase.storage.from(bucket).remove([`players/${imagePath}`]);

      if (error) {
        console.error('Failed to delete player image:', error);
        toast.error(`Failed to delete player image: ${error.message}`);
      } else {
        console.log('Successfully removed player image with path:', imagePath, data);
        toast.success('Successfully removed player image');
        router.refresh();
      }
    } catch (error) {
      console.error('Error during player image delete operation:', error);
      toast.error('An error occurred while deleting the player image');
    }
  };

  if (isFetching) {
    return null;
  }

  if (user?.id === post_by) {
    return (
      <div>
        <Button onClick={handleDelete}>Yes, Delete</Button>
      </div>
    );
  } else {
    return (
      <div>
        <p className="text-sm text-muted-foreground">Only the user who posted the player image can delete it.</p>
      </div>
    );
  }
};

export default DeletePost;

// //app/components/DeletePost.tsx
// "use client";
// import React from "react";
// import { Button } from "./ui/button";
// import useUser from "@/app/hook/useUser";
// import { supabaseBrowser } from "@/lib/supabase/browser";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// interface DeletePostProps {
//   post_by: string;
//   image: string;
//   event_id?: string; // Add event_id to props
// }

// const DeletePost: React.FC<DeletePostProps> = ({ post_by, image, event_id }) => {
//   const { data: user, isFetching } = useUser();
//   const router = useRouter();

//   const handleDelete = async () => {
//     toast.info("Deleting image...");
//     try {
//       const supabase = supabaseBrowser();

//       // Adjust logic to handle both 'images' and 'events' folders
//       let imagePath = '';
//       let bucket = 'media'; // Default bucket

//       if (event_id) {
//         // If event_id is present, assume the image is in the 'events' folder
//         imagePath = image.split('/public/events/').pop() ?? '';
//         bucket = 'events';
//       } else {
//         // Otherwise, use the 'images' folder
//         imagePath = image.split('/public/media/').pop() ?? '';
//       }

//       const { data, error } = await supabase.storage.from(bucket).remove([imagePath]);
  
//       if (error) {
//         console.error('Failed to delete image:', error);
//         toast.error(`Failed to delete image: ${error.message}`);
//       } else {
//         console.log('Successfully removed image with path:', imagePath, data);
//         toast.success('Successfully removed image');
//         router.refresh();
//       }
//     } catch (error) {
//       console.error('Error during delete operation:', error);
//       toast.error('An error occurred while deleting the image');
//     }
//   };

//   if (isFetching) {
//     return null;
//   }

//   // Assuming that 'post_by' is the user ID of the user who posted the image
// if (user?.id === post_by) {
//   return (
//     <div>
//       <Button onClick={handleDelete}>Yes, Delete</Button>
//     </div>
//   );
// } else {
//   return (
//     <div>
//       <p className="text-sm text-muted-foreground">Only the user who posted the image can delete it.</p>
//     </div>
//   );
// }

// }

// export default DeletePost;

