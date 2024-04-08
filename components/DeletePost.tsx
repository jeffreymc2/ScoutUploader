// app/components/DeletePost.tsx
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
  player_id?: string;
  event_id?: string;
  team_id?: string;
}

const DeletePost: React.FC<DeletePostProps> = ({ post_by, image, player_id, event_id, team_id }) => {
  const { data: user, isFetching } = useUser();
  const router = useRouter();

  const handleDelete = async () => {
    toast.info("Deleting image...");
    try {
      const supabase = supabaseBrowser();
      const bucket = 'media';
      let imagePath = '';

      if (event_id && team_id) {
        // Image is in the 'events' subfolder
        imagePath = `events/${post_by}/${event_id}/${team_id}/${image.split('/').pop()}`;
      } else if (player_id) {
        // Image is in the 'players' subfolder
        imagePath = `players/${post_by}/${player_id}/${image.split('/').pop()}`;
      }

      const { data, error } = await supabase.storage.from(bucket).remove([imagePath]);

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

