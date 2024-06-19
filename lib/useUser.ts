// lib/server/useUser.ts
"use server"
import { supabaseServer } from "@/lib/supabase/server"; // Adjust the import as needed

export const getUserData = async () => {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getSession();
  
  if (data.session?.user) {
    const { data: user, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", data.session.user.id)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    return user;
  }

  return null;
};
