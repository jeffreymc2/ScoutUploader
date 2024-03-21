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
import debounce from 'lodash/debounce';

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
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerResponse | null>(null);
  const router = useRouter();

  const fetchPlayerOptions = async (searchQuery: string): Promise<PlayerResponse[]> => {
    if (searchQuery === "") {
      return []; // Return an empty array when searchQuery is empty
    }

    try {
      const response = await fetch(`/api/players?query=${encodeURIComponent(searchQuery)}`, {
        method: "GET",
      });
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
      }
	  else {
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
        maxNumberOfFiles: 1,
        allowedFileTypes: ["image/*"],
        maxFileSize: 5 * 1000 * 1000,
      },
    }).use(Tus, {
      endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
      onBeforeRequest,
    })
  );

  uppy.on("file-added", (file) => {
    file.meta = {
      ...file.meta,
      bucketName: "images",
      contentType: file.type,
    };
  });

  uppy.on("upload-success", async () => {
    uppy.cancelAll();
    if (inputRef.current) {
      inputRef.current.value = "";
      resetSelection();
    }
    document.getElementById("trigger-close")?.click();

    // Refetch the posts data after a successful upload
    const { data } = await supabase
      .from("posts")
      .select("*,profiles(display_name)")
      .order("created_at", { ascending: false });

    // Update the posts data in the parent component or perform any necessary actions
    // For example, you can use a global state management solution like Redux or Zustand
    // to update the posts data in the parent component
  });

  const handleUpload = async () => {
    if (uppy.getFiles().length > 0 && selectedPlayer) {
      const randomUUID = crypto.randomUUID();

      uppy.setFileMeta(uppy.getFiles()[0].id, {
        objectName: `${user?.id}/${randomUUID}/${selectedPlayer.PlayerID}/${uppy.getFiles()[0].name}`,
      });

      await uppy.upload();
      const { error } = await supabase
        .from("posts")
        .update({ player_id: selectedPlayer.PlayerID })
        .eq("id", randomUUID);

      if (!selectedPlayer) {
        toast.warning("Please select a player.");
      }
      if (error) {
        toast.error("Failed to update descriptions.");
      } else {
        toast.success("Upload successful!");
      }
    } else {
      toast.warning("Please select an image and a player.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <h1 className="font-pgFont text-2xl">Perfect Game Scout Profile Uploader</h1>
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
