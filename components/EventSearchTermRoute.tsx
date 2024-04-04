// app/components/EventSearchTerm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EventSearch } from "@/lib/types/types";
import { toast } from "sonner";
import UploaderEvents from "./UploaderEvents";
import { Team } from "@/lib/types/types";

import { IoIosCloseCircleOutline } from "react-icons/io";
import { useRouter } from "next/navigation";

interface EventSearchProps {
  events: EventSearch[];
}

export default function EventSearchRoute({ events }: EventSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventSearch | null>(null);
  const [searchResults, setSearchResults] = useState<EventSearch[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      toast.info("Please enter an event name to search.");
      return;
    }

    try {
      const res = await fetch(
        `/api/eventsearch?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      console.log(data);
      if (data.length > 0) {
        setSearchResults(data);
        setSelectedEvent(data[0]);
      } else {
        setSearchResults([]);
        setSelectedEvent(null);
      }
    } catch (error: any) {
      toast.error("Error searching events:", error.message);
    }
  };

  const handleEventSelect = async (event: EventSearch | null) => {
    setSelectedEvent(event);
    setSelectedTeam(null);

    if (event) {
      try {
        const res = await fetch(`/api/events?query=${event.EventID}`);
        const data = await res.json();
        if (data.length > 0) {
          setTeams(data);
        } else {
          setTeams([]);
        }
      } catch (error: any) {
        toast.error("Error fetching teams:", error.message);
      }
    } else {
      setTeams([]);
    }
  };

  const handleTeamSelect = async (value: string) => {
    const team =
      teams.find((team) => team.TournamentTeamID === parseInt(value)) || null;
    setSelectedTeam(team);

    if (team && selectedEvent) {
      // Here's where you navigate to the desired page when both an event and a team are selected
      toast.success(
        `Selected ${selectedEvent.EventID}/${team.TournamentTeamID}`
      );
    }
  };

  return (
    <div className="mt-2">
      <div className="flex items-center w-full relative">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by event name"
          className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-base"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // Check if the pressed key is Enter
              handleSearch();
            }
          }}
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery(""); // Clear the input
              // handleSearch(); // Uncomment if you decide to trigger search immediately
            }}
            className="absolute right-20 top-1/2 mr-5 transform -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-gray-600"
          >
            <IoIosCloseCircleOutline className="w-6 h-6" />
          </button>
        )}
        <Button onClick={handleSearch} className="px-4 py-2 ml-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800">
          Search
        </Button>
      </div>

      {searchResults.length > 0 && (
        <Select
          onValueChange={(value) =>
            handleEventSelect(
              searchResults.find(
                (event) => event.EventID === parseInt(value)
              ) || null
            )
          }
          defaultValue={selectedEvent?.EventID.toString()}
        >
          <p className="text-xl text-gray-900 my-2 font-pgFont">
            Select an Event
          </p>
          <SelectTrigger className="w-full mb-5">
            <SelectValue className="my-5" placeholder="Select an event" />
          </SelectTrigger>
          <SelectContent>
            {searchResults.map((event) => (
              <SelectItem key={event.EventID} value={event.EventID.toString()}>
                {event.EventName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {selectedEvent && teams.length > 0 && (
        <Select
          onValueChange={handleTeamSelect}
          value={selectedTeam?.TournamentTeamID.toString() || ""}
        >
          <p className="text-xl text-gray-900 my-2 font-pgFont">
            Select a Team
          </p>
          <SelectTrigger className="w-full mb-5">
            <SelectValue placeholder="Select a team" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem
                key={team.TournamentTeamID}
                value={team.TournamentTeamID.toString()}
              >
                Team Name: {team.TournamentTeamName} | Team ID:{" "}
                {team.TournamentTeamID}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {selectedTeam && selectedEvent && (
        <>
        <Button className="px-4 py-2 mr-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
          onClick={() =>
            router.push(
              `/events/${selectedEvent.EventID}/${selectedTeam.TournamentTeamID}`
            )
          }
        >
          View Team Gallery
        </Button>
        <Button className="px-4 py-2 ml-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800" onClick={() => setIsDialogOpen(true)}>Upload Media</Button>
        </>
      )}
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="px-4 py-2 ml-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800" onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              {/* <h1 className="font-pgFont text-2xl">Perfect Game Scout Profile Uploader</h1> */}
            </DialogHeader>
            <DialogDescription>
              {selectedTeam && selectedEvent && (
                <div>
                  <UploaderEvents
                    EventName={selectedEvent.EventName}
                    EventID={selectedEvent.EventID.toString()}
                    TeamID={selectedTeam.TournamentTeamID.toString()}
                  />
                </div>
              )}
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
