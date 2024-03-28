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
    <div className="flex items-center justify-center w-full min-h-screen px-4">
  <div className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg shadow-lg border space-y-6 p-6 sm:p-8 relative bg-white">
    <PerfectGameLogo backgroundColor="#005cb9" />
    <div className="text-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-500">PG Scout | Profile Uploader</h1>
      <p className="text-sm text-gray-600 mt-2">Sign In With Your PG Account</p>
    </div>
    <div className="flex flex-col gap-4">
      <Button
        className="flex items-center justify-center gap-2 py-3 text-sm sm:text-base"
        variant="outline"
        onClick={() => handleLoginWithOAuth("github")}
      >
        <FaGithub className="text-lg" /> Github
      </Button>
      <Button
        className="flex items-center justify-center gap-2 py-3 text-sm sm:text-base"
        variant="outline"
        // Uncomment and adjust as necessary for Microsoft login functionality
        // onClick={() => handleLoginWithOAuth("microsoft")}
      >
        <FaMicrosoft className="text-lg" /> Microsoft
      </Button>
      <Button
        className="flex items-center justify-center gap-2 py-3 text-sm sm:text-base"
        variant="outline"
        onClick={() => handleLoginWithOAuth("google")}
      >
        <FcGoogle className="text-lg" /> Google
      </Button>
    </div>
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