"use client";
import { Button } from "@/components/ui/button";

export default function UploadButton() {
  const handleClick = () => {
    document.getElementById("upload-trigger")?.click();
  };

  return <Button onClick={handleClick}>Upload</Button>;
}