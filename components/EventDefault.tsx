"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Team, LiveEventSearch } from "@/lib/types/types";
import PlayerSearchByNameSkeleton from "@/components/PlayerSearchByNameSkeleton"; // Adjust the import path as necessary

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import UploaderEvents from "./UploaderEvents";

interface EventSearch {
  TournamentTeamName: string;
  TournamentTeamID: number;
  EventID: number;
  EventName: string;
  StartDate: string;
  EndDate: string;
  DivisionID: number;
  Division: string;
  City: string;
  State: string;
  EventLogoURL: string;
  TeamCount: number;
  team: Team[];
}

export default function EventDefault() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<EventSearch[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<{ [eventId: number]: Team | null }>({});
  const [teamsMap, setTeamsMap] = useState<{ [eventId: number]: Team[] }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventSearch | null>(null);
  const router = useRouter();

  const today = new Date();
  const formattedDate = format(today, "yyyy-MM-dd");

  useEffect(() => {
    const fetchDefaultEvents = async () => {
      try {
        const response = await fetch(
          `/api/liveevents?query=${formattedDate}&state`
        );
        const events: EventSearch[] = await response.json();

        if (events.length > 0) {
          setSearchResults(events);
          setIsLoading(false);
        } else {
          setSearchResults([]);
          toast.info("No default events found.");
        }
      } catch (error) {
        toast.error("Error fetching default events.");
      }
    };

    fetchDefaultEvents();
  }, []);

  useEffect(() => {
    const fetchTournamentTeams = async () => {
      const teamsMapData: { [eventId: number]: Team[] } = {};

      for (const event of searchResults) {
        try {
          const response = await fetch(`/api/events?query=${event.EventID}`);
          const data = await response.json();
          teamsMapData[event.EventID] = data;
        } catch (error) {
          console.error(`Error fetching tournament teams for event ${event.EventID}:`, error);
        }
      }

      setTeamsMap(teamsMapData);
    };

    fetchTournamentTeams();
  }, [searchResults]);

  const handleViewTeamGallery = (eventId: number) => {
    const selectedTeam = selectedTeams[eventId];
    if (selectedTeam) {
      router.push(`/events/${eventId}/${selectedTeam.TournamentTeamID}`);
    } else {
      toast.info("Please select a team.");
    }
  };

  const handleUploadMedia = (event: EventSearch) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  return (
    <div className="mt-2">
      {isLoading ? (
        <PlayerSearchByNameSkeleton />
        ) : (
          
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-5 mb-5">
          {searchResults.map((event) => (
            <div
              key={event.EventID}
              className="flex flex-col-2 bg-white shadow-md rounded-lg overflow-hidden"
            >
              <div className="w-1/3 ">
                {event.EventLogoURL ? (
                  <Image
                    src={event.EventLogoURL}
                    alt={event.EventName}
                    width={100}
                    height={100}
                    quality={100}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-48 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-400"></span>
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-md font-semibold leading-4">
                    {event.EventName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Start Date:{" "}
                    {format(new Date(event.StartDate), "MMMM dd, yyyy")}
                  </p>
                  <p className="text-sm text-gray-500">
                    End Date: {format(new Date(event.EndDate), "MMMM dd, yyyy")}
                  </p>
                </div>
                <div className="mt-4">
                  <Select
                    onValueChange={(value) => {
                      const selectedTeam = teamsMap[event.EventID]?.find(
                        (team) => team.TournamentTeamID === parseInt(value)
                      ) || null;
                      setSelectedTeams((prevState) => ({
                        ...prevState,
                        [event.EventID]: selectedTeam,
                      }));
                    }}
                    value={selectedTeams[event.EventID]?.TournamentTeamID.toString() || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamsMap[event.EventID]?.map((team) => (
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
                  {selectedTeams[event.EventID] && (
                    <>
                    <div className="mt-4 flex flex-col-2">
                      <Button
                        className="mt-4 px-2 py-2 text-xs tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
                        onClick={() => handleViewTeamGallery(event.EventID)}
                      >
                        View Team Gallery
                      </Button>
                      <Button
                        className="mt-4 px-2 py-2 ml-2 text-xs tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
                        onClick={() => handleUploadMedia(event)}
                      >
                        Upload Media
                      </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isDialogOpen && selectedEvent && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="px-4 py-2 ml-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <h1 className="font-pgFont text-2xl">Upload Media</h1>
            </DialogHeader>
            <DialogDescription>
              <UploaderEvents
                EventName={selectedEvent.EventName}
                EventID={selectedEvent.EventID.toString()}
                TeamID={selectedTeams[selectedEvent.EventID]?.TournamentTeamID.toString() || ""}
              />
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}