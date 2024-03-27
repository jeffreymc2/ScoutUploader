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
    // Extract the file path within the storage bucket from the image URL
    const filePath = image.replace(process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/", "");
    
    const supabase = supabaseBrowser();
    const { error } = await supabase
      .storage
      .from('images') // make sure this is the correct bucket name
      .remove([filePath]);

    if (error) {
      console.error("Failed to delete image:", error);
      toast.error(`Failed to delete image: ${error.message}`);
    } else {
      console.log(`Successfully removed image: ${image}`);
      toast.success("Successfully removed image");
      router.refresh(); // 'refresh()' is not a function on the Next.js Router. Use 'reload()' instead.
    }
  };

  if (isFetching) {
    return null;
  }

  // Assuming that 'post_by' is the user ID of the user who posted the image
  if (user?.id === post_by) {
    return (
      <div className="absolute top-0 right-5">
        <Button onClick={handleDelete}>Delete</Button>
      </div>
    );
  }

  return null;
}

export default DeletePost;
