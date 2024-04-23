//app/components/DeletePost.tsx
"use client";
import React from "react";
import { Button } from "../ui/button";
import useUser from "@/app/hook/useUser";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeletePostProps {
  post_by: string;
  name: string;
  event_id?: string;
  team_id?: string;
}

const DeletePost: React.FC<DeletePostProps> = ({ post_by, name, event_id, team_id }) => {
  const { data: user, isFetching } = useUser();
  const router = useRouter();

  const handleDelete = async () => {
    toast.info("Deleting image...");
    try {
      const supabase = supabaseBrowser();

      let folderPath = event_id ? `events/${post_by}/${event_id}/${team_id}/` : `players/${post_by}/`;
      let imagePath = name;

      if (imagePath.startsWith('/')) {
        imagePath = imagePath.substring(1);
      }

      const fullPath = `${folderPath}${imagePath}`;

      const { data, error } = await supabase.storage.from("media").remove([fullPath]);

      if (error) {
        console.error("Failed to delete image:", error);
        toast.error(`Failed to delete image: ${error.message}`);
      } else {
        console.log("Successfully removed image with path:", fullPath, data);
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
};

export default DeletePost;
