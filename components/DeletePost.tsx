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
}

const DeletePost: React.FC<DeletePostProps> = ({ post_by, image }) => {
  const { data: user, isFetching } = useUser();
  const router = useRouter();

  const handleDelete = async () => {
    toast.info("Deleting image...");
    try {
      const supabase = supabaseBrowser();
      // Extract the path from the full URL
      const imagePath = image.split('/public/images/').pop() ?? '';
      const { data, error } = await supabase.storage.from('images').remove([imagePath]);
  
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
      <div >
        <Button onClick={handleDelete}>Yes,Delete</Button>
      </div>
    );
  }

  return null;
}

export default DeletePost;
