"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { toast } from "sonner";

// Importing each UI component from its own path
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PlayerSearchByNameSkeleton from "@/components/PlayerSearchByNameSkeleton"; // Adjust the import path as necessary

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

export default function PlayerDefault() {
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlayerInfo[]>([]);
  const router = useRouter();

  const fetchDefaultPlayers = async () => {
    try {
      const response = await fetch(`/api/playername?query=&limit=50&state`);
      const players: PlayerInfo[] = await response.json();
      if (players.length > 0) {
        setSearchResults(players);
        setIsLoading(false); // Set to false once data is fetched
      } else {
        setSearchResults([]);
        toast.info("No default players found.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Error fetching default players: ${errorMessage}`);
    }
  };

  useEffect(() => {
    fetchDefaultPlayers();
  }, []);

  

  return (
    <div className="mt-5">
      <div className="flex items-center relative">
        
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
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-400">
                      {player.PlayerName[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="w-2/3 md:w-1/2 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{player.PlayerName}</h3>
                  <p className="text-sm text-gray-500">
                    Player ID: {player.PlayerID}
                  </p>
                  <p className="text-sm text-gray-500">{player.CityState}</p>
                  <p className="text-sm text-gray-500">
                    Grad Year: {player.GradYear}
                  </p>
                  <p className="text-sm text-gray-500">
                    Best Rank: {player.BestRankSort}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button
                    className="px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-primary/90"
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
