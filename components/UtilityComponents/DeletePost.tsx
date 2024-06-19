"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import useUser from "@/app/hook/useUser";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RiDeleteBin6Line } from "react-icons/ri";
import {getUserData} from "@/lib/useUser";

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeletePostProps {
  postId: string;
  post_by: string;
  filePath: string;
}

const DeletePost: React.FC<DeletePostProps> = async ({ postId, post_by, filePath }) => {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const getS3KeyFromCloudFrontURL = (url: string) => {
    const cloudFrontDomain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN; // Example: "https://d123.cloudfront.net/"
    if (cloudFrontDomain && url.startsWith(cloudFrontDomain)) {
      return url.replace(cloudFrontDomain, "");
    }
    throw new Error("Invalid CloudFront URL or Domain");
  };

  const handleDelete = async () => {
    if (!filePath || filePath.includes("undefined")) {
      toast.error("Invalid file path");
      return;
    }

    toast.info("Deleting post...");
    try {
      // Delete the post from the 'posts' table in Supabase
      const { error: deletePostError } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (deletePostError) {
        throw new Error(deletePostError.message);
      }

      // Extract the S3 key from the CloudFront URL
      const s3Key = getS3KeyFromCloudFrontURL(filePath);

      // Delete the corresponding file from S3
      const s3Client = new S3Client({
        region: process.env.NEXT_PUBLIC_AWS_REGION,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
        },
      });

      const deleteFileCommand = new DeleteObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
        Key: s3Key,
      });

      await s3Client.send(deleteFileCommand);

      toast.success("Successfully deleted post");
      router.refresh();
    } catch (error) {
      console.error("Error during delete operation:", error);
      toast.error("An error occurred while deleting the post");
    }
  };


  const userData = await getUserData();
  if (userData?.id === post_by) {
    return (
      <AlertDialog>
        <AlertDialogTrigger>
          <span className="text-sm flex items-center cursor-pointer">
            <RiDeleteBin6Line className="text-xl mr-2" /> Delete Media File
          </span>{" "}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post and file from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  } else {
    return null;
  }
  useRouter();
};

export default DeletePost;
