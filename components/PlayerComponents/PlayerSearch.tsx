"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { toast } from "sonner";

// Importing each UI component from its own path
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PlayerSearchByNameSkeleton from "@/components/PlayerComponents/PlayerSearchByNameSkeleton"; // Adjust the import path as necessary

type PlayerInfo = {
  BestRankSort: number;
  CityState: string;
  GradYear: string;
  PlayerID: number;
  PlayerName: string;
  ProfilePic: string;
  State: string;
  TeamName: string;
};

export default function PlayerSearchByName() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlayerInfo[]>([]);
  const router = useRouter();

  const fetchDefaultPlayers = async () => {
    try {
      const response = await fetch(`/api/playername?query=&limit=30&state`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const players: PlayerInfo[] = await response.json();
      setSearchResults(players);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Error fetching default players: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDefaultPlayers();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      toast.info("Please enter a name to search.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/playername?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const players: PlayerInfo[] = await response.json();
      setSearchResults(players);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Error searching for players: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    fetchDefaultPlayers();
  };

  return (
    <div className="">
      <div className="flex items-center relative">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by player name"
          className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-base"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
            }}
            className="absolute right-20 top-1/2 mr-5 transform -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-gray-600"
          >
            <IoIosCloseCircleOutline className="w-6 h-6" />
          </button>
        )}
        <Button
          onClick={handleSearch}
          className="px-4 py-2 ml-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
        >
          Search
        </Button>
      </div>
      {isLoading ? (
        <PlayerSearchByNameSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {searchResults.map((player) => (
            <Card
              key={player.PlayerID}
              className="flex flex-row bg-white shadow-md rounded-lg overflow-hidden"
            >
              <div className="w-1/3 md:w-1/2">
                {player.ProfilePic ? (
                  <Image
                    src={player.ProfilePic}
                    alt={player.PlayerName}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center ">
                    <span className="text-4xl font-bold text-gray-400 ">
                      {player.PlayerName[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="w-2/3 md:w-1/2 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-semibold font-pgFont">{player.PlayerName}</h3>
                  <p className="text-sm text-gray-500">Player ID: {player.PlayerID}</p>
                  <p className="text-sm text-gray-500">{player.CityState}</p>
                  <p className="text-sm text-gray-500">Grad Year: {player.GradYear}</p>
                  <p className="text-sm text-gray-500">Best Rank: {player.BestRankSort}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button
                    className="px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
                    onClick={() => router.push(`/players/${player.PlayerID}`)}
                  >
                    View Player
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
