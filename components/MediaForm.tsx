// app/components/MediaForm.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updatePost } from "@/app/media/actions";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { supabaseBrowser } from "@/lib/supabase/browser";
import ReactPlayer from "react-player";
import { FaEdit } from "react-icons/fa";

import Image from "next/image";

interface MediaFormProps {
  postId: string;
  mediaUrl: string;
  isVideo: boolean;
}
export default function MediaForm({
  postId,
  mediaUrl,
  isVideo,
}: MediaFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState({
    title: "",
    description: "",
    featured_image: false,
  });

  const supabase = supabaseBrowser();

  const fetchInitialData = useCallback(async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("title, description, featured_image")
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Error fetching initial data:", error);
    } else {
      setInitialData({
        title: data?.title || "",
        description: data?.description || "",
        featured_image: data?.featured_image || false,
      });
    }
  }, [postId, supabase]);

  const handleDialogOpen = () => {
    fetchInitialData().then(() => setIsDialogOpen(true));
  };

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
    <>
      <DialogTrigger asChild>
        <FaEdit className="text-2xl absolute -mt-[98px] ml-[73px]" onClick={handleDialogOpen} />
      </DialogTrigger>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          {/* Media Preview */}
          {isVideo ? (
            <div className="video-preview">
              <ReactPlayer url={mediaUrl} width="100%" height="100%" controls />
            </div>
          ) : (
            <div className="image-preview">
              <Image
                src={mediaUrl}
                alt="Media Preview"
                width={500}
                height={280}
                layout="responsive"
              />
            </div>
          )}
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
                id="featured_image"
                name="featured_image"
                defaultChecked={initialData.featured_image}
              />
              <Label htmlFor="featured_image">Featured Image</Label>
            </div>
            <Button className="mt-2" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Save"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
