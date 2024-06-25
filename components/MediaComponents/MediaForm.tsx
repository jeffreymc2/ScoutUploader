// app/components/MediaComponents/MediaForm.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updatePost } from "@/app/media/actions";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { FaEdit } from "react-icons/fa";
import Player from "next-video/player";

interface MediaFormProps {
  postId: string;
  fileUrl: string;
  isVideo: boolean;
  thumbnailUrl: string;
}

export default function MediaForm({
  postId,
  fileUrl,
  thumbnailUrl,
  isVideo,
}: MediaFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState({
    title: "",
    description: "",
    publish_media: false,
    thumbnailUrl: "",
  });

  const supabase = supabaseBrowser();

  const fetchInitialData = useCallback(async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("title, description, publish_media, thumbnail_url")
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Error fetching initial data:", error);
    } else {
      setInitialData({
        title: data?.title || "",
        description: data?.description || "",
        publish_media: data?.publish_media || false,
        thumbnailUrl: data?.thumbnail_url || "",
      });
    }
  }, [postId, supabase]);

  const handleDialogOpen = useCallback(() => {
    fetchInitialData().then(() => setIsDialogOpen(true));
  }, [fetchInitialData]);

  useEffect(() => {
    if (isDialogOpen) {
      fetchInitialData();
    }
  }, [isDialogOpen, fetchInitialData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.append("postId", postId);

    const response = await updatePost(formData);

    setIsSubmitting(false);

    if (response.success) {
      toast.success("Post updated successfully.");
      setIsDialogOpen(false);
    } else {
      toast.error("An error occurred while updating the post.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger onClick={handleDialogOpen}>
        <span className="text-sm flex items-center cursor-pointer">
          <FaEdit className="text-xl mr-2" />
          Edit Content
        </span>
      </DialogTrigger>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          {/* Media Preview */}
          {isVideo ? (
            <div className="video-preview aspect-w-16 aspect-h-9">
              <Player
                src={fileUrl}
                className="rounded-lg object-cover w-full h-full"
                controls={true}
                blurDataURL={initialData.thumbnailUrl}
              />
              <form onSubmit={handleSubmit}>
            <input type="hidden" name="postId" value={postId} />
            <div className="mt-4">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                className="mt-1"
                defaultValue={initialData.title}
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                className="mt-1"
                defaultValue={initialData.description}
              />
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <Switch
                id="publish_media"
                name="publish_media"
                defaultChecked={initialData.publish_media}
              />
              <Label htmlFor="publish_media">Publish to Profile</Label>
            </div>
            <Button className="mt-2" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Save"}
            </Button>
          </form>
            </div>
          ) : (
            <div className="image-preview aspect-w-16 aspect-h-9">
              <Image
                src={fileUrl}
                alt="Media Preview"
                fill
                className="object-cover rounded-lg"
              />
              <form onSubmit={handleSubmit}>
            <input type="hidden" name="postId" value={postId} />
            <div className="mt-4">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                className="mt-1"
                defaultValue={initialData.title}
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                className="mt-1"
                defaultValue={initialData.description}
              />
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <Switch
                id="publish_media"
                name="publish_media"
                defaultChecked={initialData.publish_media}
              />
              <Label htmlFor="publish_media">Publish to Profile</Label>
            </div>
            <Button className="mt-2" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Save"}
            </Button>
          </form>
            </div>
          )}
          
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}