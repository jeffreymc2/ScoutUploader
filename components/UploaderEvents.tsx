//app/components/UploaderEvents.tsx
"use client";
import React, { useState } from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import { Button } from "./ui/button";
import Tus from "@uppy/tus";
import useUser from "@/app/hook/useUser";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";


interface UploaderProps {
  EventID: string;
  EventName: string;
  TeamID: string;
}

const UploaderEvents: React.FC<UploaderProps> = ({ EventID, EventName, TeamID }) => {



  const { data: user } = useUser();
  const supabase = supabaseBrowser();

  const [uppy] = useState(
    () =>
      new Uppy({
        restrictions: {
          maxNumberOfFiles: 50,
          allowedFileTypes: ["image/*", "video/*"],
          maxFileSize: 5 * 10000 * 1000,
        },
        debug: true,
      }).use(Tus, {
        endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
        onBeforeRequest: async (req: any) => {
          const { data } = await supabase.auth.getSession();
          req.setHeader("Authorization", `Bearer ${data?.session?.access_token}`);
        },
        limit: 10,
        chunkSize: 6 * 1024 * 1024,
        allowedMetaFields: ['bucketName', 'objectName', 'contentType', 'cacheControl'],
      })
  );

  uppy.on('file-added', (file) => {


    const fileNameWithUUID = `${EventID}_${TeamID}_${file.name}`;

    file.meta = {
      ...file.meta,
      bucketName: "events",
      objectName:  `${user?.id}/${EventID}/${TeamID}/${fileNameWithUUID}`,
      contentType: file.type,
    }
  })


  uppy.on('complete', (result) => {
    toast.success("Upload complete!");
  });

  const handleUpload = () => {
    if (uppy.getFiles().length === 0) {
      toast.error("Please select a file to upload.");
      return;
    }
    uppy.upload();
  };

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <h1 className="font-pgFont text-2xl">
          Upload Files By Event
        </h1>
        <div>
          <p>Selected Event: {EventName} | Event ID: {EventID}</p>
        </div>
      </div>
      <Dashboard uppy={uppy} className="w-auto" hideUploadButton />
      <Button id="upload-trigger" className="px-4 py-2 ml-2 w-full font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
};

export default UploaderEvents;


