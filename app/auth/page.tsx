"use client";
import React, { Suspense } from "react";

import { useSearchParams } from "next/navigation";
import PerfectGameIcon from "@/components/UtilityComponents/PGIcon";
import { LoginForm } from "../login/login-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

const AuthPageContent = () => {
  const params = useSearchParams();
  const next = params.get("next") || "";


  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent">
    <Card className="w-full max-w-lg p-8 shadow-lg rounded-lg bg-gray-100 p-20">
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
        <CardContent className="flex flex-col justify-center w-full items-center align-middle">
          {/*  */}
          <div className="max-w-md w-full space-y-8">

          <LoginForm />
          </div>
          {/* <Link href="/register" className="text-blue-500 text-sm pt-5">
            <p>Don&apos;t yet have account? Register here</p>
          </Link> */}
        </CardContent>
        <CardFooter className="text-center mt-2 text-center items-center justify-center ">
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
