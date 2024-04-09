'use server';

import { supabaseServer } from '@/lib/supabase/server';

export default async function getUserSession() {
    const supabase = await supabaseServer();
    return supabase.auth.getSession();
}