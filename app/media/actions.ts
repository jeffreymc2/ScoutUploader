// actions.ts
'use server';

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export const updatePost = async (formData: FormData) => {
  const supabase = supabaseServer();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const featuredImage = formData.get("featured_image") === "on";
  const publishMedia = formData.get("publish_media") === "on";


  const updateData = {
    title,
    description,
    featured_image: featuredImage,
    publish_media: publishMedia,

  };

  try {
    const { error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", formData.get("postId") as string)
      .single();

    if (error) {
      throw error;
    }

    revalidatePath(`/posts/${formData.get("postId")}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating post:", error);
    return { success: false };
  }
};