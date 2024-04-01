//app/components/Uploader.tsx

"use client";
import React, { useRef, useState, useEffect } from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import { Button } from "./ui/button";
import Tus from "@uppy/tus";
import useUser from "@/app/hook/useUser";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export interface PlayerResponse {
  PlayerID: string;
  LastName: string;
  FirstName: string;
  PlayerName: string;
  DOB: string;
}

interface UploaderProps {
  playerid: number;
  FullName: string;
}

const Uploader: React.FC<UploaderProps> = ({ playerid, FullName }) => {


 
  const { data: user } = useUser();
  const supabase = supabaseBrowser();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<UploaderProps | null>(
    null
  );

  useEffect(() => {
    setSelectedPlayer({ playerid, FullName });
  }, [playerid, FullName]);

  const inputRef = useRef<HTMLInputElement>(null);


  const router = useRouter();

  const onBeforeRequest = async (req: any) => {
    const { data } = await supabase.auth.getSession();
    req.setHeader("Authorization", `Bearer ${data?.session?.access_token}`);
  };
  const player_id = playerid.toString();
  

  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles: 50,
        allowedFileTypes: ["image/*", "video/*"],
        maxFileSize: 5 * 10000 * 1000,
      },
      debug: true,

    }).use(Tus, {
      endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
      onBeforeRequest, limit: 10,
      chunkSize: 6 * 1024 * 1024,
      allowedMetaFields: ['bucketName', 'objectName', 'contentType', 'cacheControl'],
    })
    
  );


  uppy.on('file-added', (file) => {

    const fileNameWithUUID = `${player_id}_${file.name}`;

    file.meta = {
      ...file.meta,
      bucketName: "images",
      objectName:  `${user?.id}/${player_id}/${fileNameWithUUID}`,
      contentType: file.type,
    }
  })


  uppy.on('complete', (result) => {
    toast.success("Upload complete!");
    // Check if the current pathname includes "/players"
    if (window.location.pathname.includes('/players')) {
      window.location.reload();
    }
  });
  



  const handleUpload = () => {
    if (!selectedPlayer) {
      toast.error("Please select a player.");
      return;
    }

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
          Perfect Game Scout Profile Uploader
        </h1>
      
          <div>
            <p>Selected Player: {FullName} | Player ID: {playerid}</p>
          </div>
      </div>
      <Dashboard uppy={uppy} className="w-auto" hideUploadButton />
      <Button id="upload-trigger" className="w-full" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
};

export default Uploader;
