//app/components/EventSearch.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
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
        toast.info('Please enter an event id to search.');
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
    <div className="mt-5">
    <div className="flex items-center w-full relative">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search players by event and team"
          className="w-full text-base"
        />
        <Button className="ml-2 flex-shrink-0" onClick={handleSearch}>Search</Button>
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
        >            <p className="text-xl text-gray-900 my-2 font-pgFont">Select a Team</p>

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
              <h3 className="text-lg font-semibold">{player.FullName}</h3>
              <p className="mt-1 text-sm text-gray-500">
                Player ID: {player.playerid}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Jersey Number: {player.jerseynumber}
              </p>
              <Button
               className="ml-2 flex-shrink-0"
                onClick={() => handleViewPlayerPage(player.playerid)}
              >
                View Player Page
              </Button>
              <Button
                className="m-2 w-1/3"
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
