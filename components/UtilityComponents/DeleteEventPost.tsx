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

const DeleteEventPost: React.FC<DeleteEventPostProps> = ({ post_by, image, event_id, team_id }) => {
  const { data: user, isFetching } = useUser();
  const router = useRouter();

  const handleDelete = async () => {
    toast.info("Deleting event image...");
    try {
      const supabase = supabaseBrowser();
      const bucket = 'media';
      const imagePath = image.split(`/public/${bucket}/events/`).pop() ?? '';

      const { data, error } = await supabase.storage.from(bucket).remove([`events/${imagePath}`]);

      if (error) {
        console.error('Failed to delete event image:', error);
        toast.error(`Failed to delete event image: ${error.message}`);
      } else {
        console.log('Successfully removed event image with path:', imagePath, data);
        toast.success('Successfully removed event image');
        router.refresh();
      }
    } catch (error) {
      console.error('Error during event image delete operation:', error);
      toast.error('An error occurred while deleting the event image');
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
        <p className="text-sm text-muted-foreground">Only the user who posted the event image can delete it.</p>
      </div>
    );
  }
};

export default DeleteEventPost;