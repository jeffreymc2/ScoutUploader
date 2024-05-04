import PerfectGameIcon from "@/components/UtilityComponents/PGIcon";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { LoginForm } from "./login-form";
import BackgroundImage from "@/components/UtilityComponents/BackgroundImage";

export default async function LoginPage() {
  return (

    <>
      <BackgroundImage />

      <div className="flex min-h-screen items-center justify-center bg-transparent">
        <Card className="w-full max-w-lg p-8 shadow-lg rounded-lg bg-gray-100 bg-opacity-90 p-20 m-2">
          <div className="flex justify-center items-center mb-8 ">
            <div className="w-20 h-20 mr-2">
              <PerfectGameIcon backgroundColor="#005cb9" />{" "}
            </div>
          </div>

          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold font-pgFont text-blue-900">
              Perfect Game Media
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Sign In With Your PG Account to Search and Upload Media by
              Players, Events, and More.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex w-full items-center align-middle">
            {/*  */}
            <div className="max-w-md w-full space-y-8">
              {" "}
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
    </>
  );
}
