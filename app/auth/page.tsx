"use client";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";
import React, { Suspense } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useSearchParams } from "next/navigation";
import { FaMicrosoft } from "react-icons/fa6";
import Image from "next/image";
import PerfectGameLogo from "@/components/PGLogo";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const AuthPageContent = () => {
  const params = useSearchParams();
  const next = params.get("next") || "";

  const handleLoginWithOAuth = (provider: "github" | "google" | "azure") => {
    const supabase = supabaseBrowser();
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: location.origin + "/auth/callback?next=" + next,
      },
    });
  };

  return (
    <Card className="flex flex-col justify-center items-center mt-5 border-none bg-transparent">
      <CardContent className="w-full max-w-md px-4 py-8 mx-auto rounded-lg shadow-lg bg-white">
        <div className="flex flex-col justify-center items-center mt-5 bg-white  border-none w-full">
          <PerfectGameLogo backgroundColor="#005cb9" />
        </div>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-pgFont text-blue-500">
            Perfect Game Media
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Sign In With Your PG Account to Search and Upload Media by Players, Events, and More.
          </CardDescription>
        </CardHeader>
        <div className="flex flex-col gap-4">
          <Button
           className="flex items-center justify-center gap-2 py-3 text-base rounded-lg border border-gray-200 shadow-sm px-4 py-2 ml-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-primary/90 shadow-md"
            onClick={() => handleLoginWithOAuth("github")}
          >
            <FaGithub className="text-xl" /> Github
          </Button>
          <Button
           className="flex items-center justify-center gap-2 py-3 text-base rounded-lg border border-gray-200 shadow-sm px-4 py-2 ml-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-primary/90 shadow-md"
           onClick={() => handleLoginWithOAuth("azure")}
          >
            <FaMicrosoft className="text-xl" /> Microsoft
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-center">
        <p className="text-gray-100 text-xs p-5">
          ©2024 Perfect Game Inc. All rights reserved.
        </p>
      </CardFooter>
    </Card>
  );
};

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
