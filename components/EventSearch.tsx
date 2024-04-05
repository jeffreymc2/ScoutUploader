//app/components/EventSearch.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Team, Player } from "@/lib/types/types";
import Uploader from "./Uploader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface EventSearchProps {
  teams: Team[];
}

export default function EventSearch({ teams }: EventSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchResults, setSearchResults] = useState<Team[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      toast.info("Please enter an event id to search.");
      return;
    }

    try {
      const res = await fetch(
        `/api/events?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();

      if (data.length > 0) {
        setSearchResults(data);
        setSelectedTeam(data[0]);
      } else {
        setSearchResults([]);
        setSelectedTeam(null);
      }
    } catch (error: any) {
      toast.error("Error searching events:", error.message);
    }
  };

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsDialogOpen(true);
  };

  const handleViewPlayerPage = (playerid: number) => {
    const path = `/players/${playerid.toString()}`;
    router.push(path);
  };

  return (
    <div className="mt-2">
      <div className="flex items-center w-full relative">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Event ID"
          className="w-full text-base "
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // Check if the pressed key is Enter
              handleSearch();
            }
          }}
        />
        <Button
          className="px-4 py-2 ml-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      {searchResults.length > 0 && (
        <Select
          onValueChange={(value) =>
            setSelectedTeam(
              searchResults.find(
                (team) => team.TournamentTeamID === parseInt(value)
              ) || null
            )
          }
          defaultValue={selectedTeam?.TournamentTeamID.toString()}
        >
          {" "}
          <p className="text-xl text-gray-900 my-2 font-pgFont">
            Select a Team
          </p>
          <SelectTrigger className="w-full mb-5 ">
            <SelectValue className="my-5" placeholder="Select a team" />
          </SelectTrigger>
          <SelectContent>
            {searchResults.map((team) => (
              <SelectItem
                key={team.TournamentTeamID}
                value={team.TournamentTeamID.toString()}
              >
                {team.TournamentTeamName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {selectedTeam && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {selectedTeam.Roster.map((player) => (
            <div
              key={player.playerid}
              //   onClick={() => handlePlayerClick(player)}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow "
            >
              <div className="w-1/3 md:w-1/2">
                <Image
                  src={player.ProfilePic ? player.ProfilePic : "https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/default-avatar-photo-placeholder-profile-icon-vector.jpg"}
                  alt={player.PlayerName}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold">{player.FullName}</h3>
              <p className="mt-1 text-sm text-gray-500">
                Player ID: {player.playerid}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Jersey Number: {player.jerseynumber}
              </p>
              <Button
                className="px-4 py-2 m-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
                onClick={() => handleViewPlayerPage(player.playerid)}
              >
                View Player Page
              </Button>
              <Button
                className="px-4 py-2 m-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
                onClick={() => handlePlayerClick(player)}
              >
                Upload Files
              </Button>
            </div>
          ))}

          {isDialogOpen && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  {/* <h1 className="font-pgFont text-2xl">Perfect Game Scout Profile Uploader</h1> */}
                </DialogHeader>
                <DialogDescription>
                  {selectedPlayer && (
                    <div>
                      <Uploader
                        playerid={selectedPlayer.playerid}
                        FullName={selectedPlayer.FullName}
                      />
                    </div>
                  )}
                </DialogDescription>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
}
