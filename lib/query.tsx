//lib/query.tsx
import { supabaseBrowser } from "@/lib/supabase/browser";

export default async function GetPosts() {

    const supabase = supabaseBrowser();

    const { data: posts } = await supabase
        .from("posts")
        .select("*")
        .limit(10)
      .eq("post_type", "image");

    return posts;
}