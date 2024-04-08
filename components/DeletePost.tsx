//app/components/DeletePost.tsx
"use client";
import React from "react";
import { Button } from "./ui/button";
import useUser from "@/app/hook/useUser";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeletePostProps {
  post_by: string;
  image: string;
  event_id?: string; // Add event_id to props
}

const DeletePost: React.FC<DeletePostProps> = ({ post_by, image, event_id }) => {
  const { data: user, isFetching } = useUser();
  const router = useRouter();

  const handleDelete = async () => {
    toast.info("Deleting image...");
    try {
      const supabase = supabaseBrowser();
  
      let imagePath;
      let folderPath = image.includes('/events/') ? '/public/media/events/' : '/public/media/players/';
      imagePath = image.split(folderPath).pop() ?? '';
  
      // Ensure no leading slash
      if (imagePath.startsWith('/')) {
        imagePath = imagePath.substring(1);
      }
  
      const { data, error } = await supabase.storage.from('media').remove([`events/${imagePath}`, `players/${imagePath}`]);
  
      if (error) {
        console.error('Failed to delete image:', error);
        toast.error(`Failed to delete image: ${error.message}`);
      } else {
        console.log('Successfully removed image with path:', imagePath, data);
        toast.success('Successfully removed image');
        router.refresh();
      }
    } catch (error) {
      console.error('Error during delete operation:', error);
      toast.error('An error occurred while deleting the image');
    }
  };
  

  if (isFetching) {
    return null;
  }

  // Assuming that 'post_by' is the user ID of the user who posted the image
if (user?.id === post_by) {
  return (
    <div>
      <Button onClick={handleDelete}>Yes, Delete</Button>
    </div>
  );
} else {
  return (
    <div>
      <p className="text-sm text-muted-foreground">Only the user who posted the image can delete it.</p>
    </div>
  );
}

}

export default DeletePost;

