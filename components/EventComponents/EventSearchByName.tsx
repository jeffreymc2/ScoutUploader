import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EventInfo = {
  EventID: number;
  EventName: string;
  DivisionID: number;
  Division: string;
  StartDate: string;
  EndDate: string;
  EventLogoURL: string;
  Teams: Team[];
};

type Team = {
  TeamID: number;
  TeamName: string;
};

export default function EventSearch() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [searchResults, setSearchResults] = useState<EventInfo[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventInfo | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [selectedTeams, setSelectedTeams] = useState<{
      [eventId: number]: Team | null;
    }>({});    const [teamsData, setTeamsData] = useState<Record<number, Team[]>>({});


    const router = useRouter();
  
    const fetchEventsByDate = async (date: string) => {
      try {
        const response = await fetch(`/api/liveevents?date=${encodeURIComponent(date)}`);
        const events: EventInfo[] = await response.json();
        console.log(events);
        if (events.length > 0) {
          setSearchResults(events);
        } else {
          setSearchResults([]);
          toast.info("No events found for the selected date.");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        toast.error(`Error fetching events: ${errorMessage}`);
      }
    };
  
    useEffect(() => {
      if (selectedDate) {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        fetchEventsByDate(formattedDate);
      }
    }, [selectedDate]);
  
    const fetchTeamsForEvent = async (eventId: number) => {
        try {
          const response = await fetch(`/api/teams?eventId=${encodeURIComponent(eventId)}`);
          const teams: Team[] = await response.json();
          setTeamsData((prevTeamsData) => ({
            ...prevTeamsData,
            [eventId]: teams,
          }));
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "An unknown error occurred";
          toast.error(`Error fetching teams: ${errorMessage}`);
        }
      };
    
      useEffect(() => {
        searchResults.forEach((event) => {
          if (!teamsData[event.EventID]) {
            fetchTeamsForEvent(event.EventID);
          }
        });
      }, [searchResults, teamsData]);
  
    // const handleEventClick = (event: EventInfo) => {
    //   setSelectedEvent(event);
    //   fetchTeamsByEventId(event.EventID);
    // };
  

    const handleTeamSelect = (eventId: number, teamId: string | null) => {
        setSelectedTeams((prevSelectedTeams) => ({
          ...prevSelectedTeams,
          [eventId]: teamId ? teamsData[eventId]?.find((team) => team.TeamID === parseInt(teamId)) || null : null,
        }));
      };

    return (
    <div className="mt-5">
      <div className="flex items-center relative">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "yyyy-MM-dd") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {searchResults.map((event) => (
          <Card
            key={event.EventID}
            className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="w-1/3 md:w-2/3">
              {event.EventLogoURL ? (
                <Image
                  src={event.EventLogoURL}
                  alt={event.EventName}
                  width={50}
                  height={50}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-400">
                    {event.EventName[0]}
                  </span>
                </div>
              )}
            </div>
            <div className="w-2/3 md:w-2/3 p-4 flex flex-col justify-between">
              <div>
              <h3 className="text-lg font-semibold">{event.EventName}</h3>
                <p className="text-sm text-gray-500">
                  Event ID: {event.EventID}
                </p>
                <p className="text-sm text-gray-500">
                  Division: {event.Division}
                </p>
                <p className="text-sm text-gray-500">
                  Start Date: {new Date(event.StartDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  End Date: {new Date(event.EndDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="p-4">
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
                <SelectTrigger >
                  <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="no_selection" disabled>
                        No team selected
                      </SelectItem>
                  {teamsData[event.EventID]?.map((team) => (
                    <SelectItem key={team.TeamID} value={team.TeamID.toString()}>
                      {team.TeamName}
                    </SelectItem>
                  )) || (
                    <SelectItem disabled value={""}>No teams available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="p-4">
              <Button
                className="w-full font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
                disabled={!selectedTeams[event.EventID]}
                onClick={() => router.push(`/events/${event.EventID}/${selectedTeams[event.EventID]?.TeamID}`)}
              >
                View Event
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}