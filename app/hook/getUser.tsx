"use client";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useQuery } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";

interface UserProfile {
  created_at: string;
  display_name: string | null;
  email: string;
  id: string;
  image_url: string | null;
}

export default function useUser() {
  return useQuery<{ user: UserProfile | null; session: Session | null }>({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = supabaseBrowser();
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        // fetch user information profile
        const { data: user } = await supabase
          .from("profile")
          .select("*")
          .eq("id", data.session.user.id)
          .single();
        return { user, session: data.session };
      }
      return { user: null, session: null };
    },
  });
}