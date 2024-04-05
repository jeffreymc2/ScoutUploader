"use client";
import { Button } from "@/components/ui/button";
import React, { Suspense } from "react";
import { FaMicrosoft } from "react-icons/fa6";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useSearchParams } from "next/navigation";
import PerfectGameLogo from "@/components/PGLogo";
import PerfectGameIcon from "@/components/PGIcon";
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
    <div className="min-h-[700px]	 flex items-center justify-center bg-transparent">
      <Card className="w-full max-w-md p-8 shadow-lg rounded-lg bg-gray-100">
        <div className="flex justify-center items-center mb-8 ">
          <div className="w-20 h-20 mr-2">
          <PerfectGameIcon backgroundColor="#005cb9" />{" "}
          </div>
          {/* Ensure the backgroundColor prop is correctly set */}
        </div>

        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold font-pgFont text-blue-900">
            Perfect Game Media
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Sign In With Your PG Account to Search and Upload Media by Players,
            Events, and More.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center align-middle">
          <div className="flex flex-col gap-4 w-full">
            <Button
              className="flex items-center justify-center gap-2 py-3 text-base rounded-lg border border-gray-200 shadow-sm px-4 py-2 ml-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800 shadow-md"
              onClick={() => handleLoginWithOAuth("azure")}
            >
              <FaMicrosoft className="text-xl" /> Microsoft
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-center mt-8 text-center items-center justify-center ">
          <p className="text-gray-500 text-center items-center justofy-center text-xs">
            ©2024 Perfect Game Inc. All rights reserved.
          </p>
        </CardFooter>
      </Card>
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
