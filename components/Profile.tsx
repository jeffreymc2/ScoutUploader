"use client";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import useUser from "@/app/hook/useUser";
import { useRouter } from 'next/navigation'
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { protectedPaths } from "@/lib/constant";


export default function Profile() {
  const { isFetching, data } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  const pathname = usePathname();

  if (isFetching) {
    return <></>;
  }

  const handleLogout = async () => {
    const supabase = supabaseBrowser();
    queryClient.clear();
    await supabase.auth.signOut();
    router.refresh();
    if ((protectedPaths as string[]).includes(pathname as string)) {
      router.push("/auth");
    }
    
  };

  return (
    <div className="relative -mt-2">
    {!data?.id ? (
      
      <Button onClick={() => router.push('/auth')} className="px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
      >
        Log In
        </Button>
    ) : (
      <Button onClick={handleLogout} className="px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
      >
        Log Out
      </Button>
    )}
  </div>
  );
}
