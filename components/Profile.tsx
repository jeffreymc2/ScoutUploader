"use client";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import useUser from "@/app/hook/useUser";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
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
    if (protectedPaths.includes(pathname)) {
      router.replace("/auth?next=" + pathname);
    }
  };

  return (
    <div className="relative">
      {!data?.id ? (
        <Link href="/auth" className=" ">
           <p className="text-sm font-semibold leading-6 text-gray-700">
            Log in <span aria-hidden="true">&rarr;</span>
          </p>
        </Link>
      ) : (
        <Link onClick={handleLogout} href="/" className=" ">
        <p className="text-sm font-semibold leading-6 text-gray-700">
         Log Out <span aria-hidden="true">&rarr;</span>
       </p>
     </Link>
      )}
    </div>
  );
}
