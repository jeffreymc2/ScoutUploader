"use client";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";
import React, { Suspense } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useSearchParams } from "next/navigation";
import { FaMicrosoft } from "react-icons/fa6";
import Image from "next/image";
import PerfectGameLogo from "@/components/PGLogo"

const AuthPageContent = () => {
  const params = useSearchParams();
  const next = params.get("next") || "";

  const handleLoginWithOAuth = (provider: "github" | "google") => {
    const supabase = supabaseBrowser();
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: location.origin + "/auth/callback?next=" + next,
      },
    });
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen">

      <div className="w-full max-w-md rounded-md border shadow-lg border  space-y-5 p-6 sm:p-8 md:p-10 relative bg-gray-100 border-gray-100">
	<PerfectGameLogo backgroundColor="#005cb9" />
        <div className="flex items-center gap-2">
		
          <h1 className="text-3xl font-pgFont font-bold text-blue-500">PG Scout | Profile Uploader</h1>
        </div>
        <p className="text-sm text-gray-400">Sign In With Your PG Account</p>
        <div className="flex flex-col gap-5">
          <Button
            className="w-full flex items-center gap-2"
            variant="outline"
            onClick={() => handleLoginWithOAuth("github")}
          >
            <FaGithub /> Github
          </Button>
          <Button
            className="w-full flex items-center gap-2"
            variant="outline"
            // onClick={() => handleLoginWithOAuth("azure")}
          >
            <FaMicrosoft /> Microsoft
          </Button>
          <Button
            className="w-full flex items-center gap-2"
            variant="outline"
            onClick={() => handleLoginWithOAuth("google")}
          >
            <FcGoogle /> Google
          </Button>
        </div>
        {/* <div className="glowBox -z-10"></div> */}
      </div>
    </div>
  );
};

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}