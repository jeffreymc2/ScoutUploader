// app/lib/supabase/insertPosts.ts
import { supabaseBrowser } from "@/lib/supabase/browser";

export async function insertPosts(files: any[], player_id: string, user_id: string) {
  const supabase = supabaseBrowser();

  const insertPromises = files.map(async (file) => {
    const { data, error } = await supabase.from("posts").insert({
      player_id: player_id,
      name: file.name,
      object_id: file.id,
      post_by: user_id || "",
    });

    if (error) {
      console.error("Error inserting post:", error);
    } else {
      console.log("Post inserted successfully:", data);
    }
  });

  await Promise.all(insertPromises);
}