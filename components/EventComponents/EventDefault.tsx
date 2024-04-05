"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Team, LiveEventSearch } from "@/lib/types/types";
import PlayerSearchByNameSkeleton from "@/components/PlayerSearchByNameSkeleton";
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
import UploaderEvents from "../UploaderEvents";

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
  const [filteredResults, setFilteredResults] = useState<EventSearch[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<{
    [eventId: number]: Team | null;
  }>({});
  const [teamsMap, setTeamsMap] = useState<{ [eventId: number]: Team[] }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
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
        console;
        if (events.length > 0) {
          setSearchResults(events);
          setFilteredResults(events);
          setIsLoading(false);
        } else {
          setSearchResults([]);
          setFilteredResults([]);
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
          console.log(data);
          teamsMapData[event.EventID] = data;
        } catch (error) {
          console.error(
            `Error fetching tournament teams for event ${event.EventID}:`,
            error
          );
        }
      }

      setTeamsMap(teamsMapData);
    };

    fetchTournamentTeams();
  }, [searchResults]);

  useEffect(() => {
    if (selectedDivision) {
      const filtered = searchResults.filter(
        (event) => event.Division === selectedDivision
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults(searchResults);
    }
  }, [selectedDivision, searchResults]);

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
    <div className="mt-5">
      <div className="mb-4">
        <Select
          value={selectedDivision || "all"}
          onValueChange={(value) => setSelectedDivision(value === "all" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Division" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Divisions</SelectItem>
            {[...new Set(searchResults.map((event) => event.Division))].map(
              (division) => (
                <SelectItem key={division} value={division}>
                  {division}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <PlayerSearchByNameSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-5 mb-5">
          {filteredResults.map((event) => (
            <div
              key={event.EventID}
              className="flex flex-col md:flex-row bg-white shadow-md rounded-lg min-h-[240px]"
            >
              <div className="flex justify-center items-center">
                {event.EventLogoURL ? (
                  <div className="flex justify-center items-center md:w-46 md:h-46 h-36 w-36">
                    <Image
                      src={event.EventLogoURL}
                      alt={event.EventName}
                      width={120}
                      height={120}
                      quality={100}
                      className="flex justify-center items-center"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-200 w-full h-48 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-400"></span>
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col justify-start">
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
                      const selectedTeam =
                        teamsMap[event.EventID]?.find(
                          (team) => team.TournamentTeamID === parseInt(value)
                        ) || null;
                      setSelectedTeams((prevState) => ({
                        ...prevState,
                        [event.EventID]: selectedTeam,
                      }));
                    }}
                    value={
                      selectedTeams[event.EventID]?.TournamentTeamID.toString() || "no_selection"
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent className="p-0 flex items-center justify-center">
                      <SelectItem value="no_selection" disabled>
                        No team selected
                      </SelectItem>
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
                </div>
                {selectedTeams[event.EventID] && (
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
                )}
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
                TeamID={
                  selectedTeams[
                    selectedEvent.EventID
                  ]?.TournamentTeamID.toString() || ""
                }
              />
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
