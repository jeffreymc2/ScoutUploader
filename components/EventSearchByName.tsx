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
  
    const fetchTeamsByEventId = async (eventId: number) => {
      try {
        const response = await fetch(`/api/teams?eventId=${eventId}`);
        const teams: Team[] = await response.json();
        setSelectedEvent((prevEvent) => {
          if (prevEvent && prevEvent.EventID === eventId) {
            return { ...prevEvent, Teams: teams };
          }
          return prevEvent;
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        toast.error(`Error fetching teams: ${errorMessage}`);
      }
    };
  
    const handleEventClick = (event: EventInfo) => {
      setSelectedEvent(event);
      fetchTeamsByEventId(event.EventID);
    };
  
    const handleTeamSelect = (value: string) => {
      const team = selectedEvent?.Teams?.find((team) => team.TeamID === parseInt(value)) || null;
      setSelectedTeam(team);
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
            className="flex flex-row bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
            onClick={() => handleEventClick(event)}
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
                <h3 className="text-xl font-semibold">{event.EventName}</h3>
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
                {selectedEvent?.EventID === event.EventID && (
                <Select onValueChange={handleTeamSelect}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Select Team" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedEvent.Teams?.map((team) => (
                      <SelectItem key={team.TeamID} value={team.TeamID.toString()}>
                        {team.TeamName}
                      </SelectItem>
                    )) || (
                      <SelectItem disabled value={""}>No teams available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
              </div>
              <div className="mt-4 md:mt-0">
                <Button
                  className="px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-primary/90"
                  onClick={() => router.push(`/events/${event.EventID}/${selectedTeam?.TeamID}`)}
                >
                  View Event
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}