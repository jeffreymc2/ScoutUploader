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
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash/debounce";
import { debug } from "console";
import { randomUUID } from "crypto";

export interface PlayerResponse {
  PlayerID: string;
  LastName: string;
  FirstName: string;
  PlayerName: string;
  DOB: string;
}

const Uploader: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: user } = useUser();
  const supabase = supabaseBrowser();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerResponse | null>(
    null
  );
  const router = useRouter();

  const fetchPlayerOptions = async (
    searchQuery: string
  ): Promise<PlayerResponse[]> => {
    if (searchQuery === "") {
      return []; // Return an empty array when searchQuery is empty
    }

    try {
      const response = await fetch(
        `/api/players?query=${encodeURIComponent(searchQuery)}`,
        {
          method: "GET",
        }
      );
      const data: PlayerResponse[] = await response.json();
      console.log("Player options received:", data);
      return data;
    } catch (error) {
      console.error("Error fetching player options:", error);
      return [];
    }
  };

  const debouncedSetSearchQuery = useRef(
    debounce((value: string) => {
      setDebouncedSearchQuery(value);
    }, 1000)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSetSearchQuery.cancel();
      
    };
  }, []);

  const { data: playerOptions, isFetching } = useQuery({
    queryKey: ["playerOptions", debouncedSearchQuery],
    queryFn: () => fetchPlayerOptions(debouncedSearchQuery),
    enabled: debouncedSearchQuery !== "", // Only fetch when debouncedSearchQuery is not empty
  });

  const resetSelection = () => {
    setSearchQuery("");
    setSelectedPlayer(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    debouncedSetSearchQuery(value);

    if (value === "") {
      setSelectedPlayer(null);
    }
  };

  const handleSelectPlayer = (player: PlayerResponse) => {
    setSelectedPlayer(player);
    setSearchQuery(`${player.PlayerName} Player ID: ${player.PlayerID}`);
    if (!handleSelectPlayer) {
      toast.error("Please select a player.");
    } else {
      toast.success(`${player.PlayerName} has been selected!`);
    }
  };

  const onBeforeRequest = async (req: any) => {
    const { data } = await supabase.auth.getSession();
    req.setHeader("Authorization", `Bearer ${data?.session?.access_token}`);
  };

  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles: 50,
        allowedFileTypes: ["image/*"],
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
    file.meta = {
      ...file.meta,
      bucketName: "images",
      objectName:  `${user?.id}`? `${user?.id}/${selectedPlayer?.PlayerID}/${file.name}` : file.name,
      contentType: file.type,
    }
  })


  uppy.on('complete', (result) => {
    console.log('Upload complete! We’ve uploaded these files:', result.successful)
  })



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
        <Input
          placeholder="Search for a player"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {isFetching && <p>Loading...</p>}
        {playerOptions && playerOptions.length > 0 && (
          <ul className="space-y-2">
            {playerOptions.map((player) => (
              <li
                key={player.PlayerID}
                className="cursor-pointer"
                onClick={() => handleSelectPlayer(player)}
              >
                {player.PlayerName} Player Id: {player.PlayerID}
              </li>
            ))}
          </ul>
        )}
        {/* {selectedPlayer && (
          <div>
            <p>Selected Player: {selectedPlayer.PlayerName} | Player ID: {selectedPlayer.PlayerID}</p>
          </div>
        )} */}
      </div>
      <Dashboard uppy={uppy} className="w-auto" hideUploadButton />
      {/* <Input placeholder="Player ID" ref={inputRef} value={searchQuery} /> */}
      <Button id="upload-trigger" className="w-full" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
};

export default Uploader;
