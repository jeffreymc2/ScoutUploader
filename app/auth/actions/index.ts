// @app/auth/actions/index.ts
"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


export async function logout() {
	const supabase = await supabaseServer();
	await supabase.auth.signOut();
	redirect("/");
}