// app/components/DeleteEventPost.tsx
"use client";
import React from "react";
import { Button } from "../ui/button";
import useUser from "@/app/hook/useUser";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteEventPostProps {
  post_by: string;
  image: string;
  event_id: string;
  team_id: string;
}

const DeleteEventPost: React.FC<DeleteEventPostProps> = ({
  post_by,
  image,
  event_id,
  team_id,
}) => {
  const { data: user, isFetching } = useUser();
  const router = useRouter();

  const handleDelete = async () => {
    toast.info("Deleting image...");
    try {
      const supabase = supabaseBrowser();
      
      // Extract the storage path from the image URL
      const storagePath = image.replace(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`, '');
      
      // Delete the image from storage
      const { data, error } = await supabase.storage
        .from('media')
        .remove([storagePath]);
      
      if (error) {
        console.error("Failed to delete image:", error);
        toast.error(`Failed to delete image: ${error.message}`);
      } else {
        console.log("Successfully removed image");
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
      <div>
        <Button onClick={handleDelete}>Yes, Delete</Button>
      </div>
    );
  } else {
    return (
      <div>
        <p className="text-sm text-muted-foreground">
          Only the user who posted the event image can delete it.
        </p>
      </div>
    );
  }
};

export default DeleteEventPost;