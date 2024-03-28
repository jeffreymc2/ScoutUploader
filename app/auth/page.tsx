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
	<div className="flex items-center justify-center min-h-screen p-4">
	<div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto rounded-lg shadow-lg border bg-white space-y-6 p-6 sm:p-8 md:p-10">
	  <div className="text-center">
		<PerfectGameLogo backgroundColor="#005cb9" />
		<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-500">PG Scout | Profile Uploader</h1>
		<p className="mt-2 text-sm sm:text-base md:text-lg text-gray-600">Sign In With Your PG Account</p>
	  </div>
	  <div className="flex flex-col gap-4">
		<Button
		  className="items-center justify-center gap-2 py-2 sm:py-3 text-sm sm:text-md md:text-lg"
		  variant="outline"
		  onClick={() => handleLoginWithOAuth("github")}
		>
		  <FaGithub className="text-lg md:text-xl" /> Github
		</Button>
		{/* <Button
		  className="items-center justify-center gap-2 py-2 sm:py-3 text-sm sm:text-md md:text-lg"
		  variant="outline"
		  onClick={() => handleLoginWithOAuth("microsoft")}
		>
		  <FaMicrosoft className="text-lg md:text-xl" /> Microsoft
		</Button> */}
		<Button
		  className="items-center justify-center gap-2 py-2 sm:py-3 text-sm sm:text-md md:text-lg"
		  variant="outline"
		  onClick={() => handleLoginWithOAuth("google")}
		>
		  <FcGoogle className="text-lg md:text-xl" /> Google
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