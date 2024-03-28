import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { toast } from 'sonner';

// Importing each UI component from its own path
import {Input} from '@/components/ui/input';
import {Dialog} from '@/components/ui/dialog';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';

type PlayerInfo = {
  BestRankSort: number;
  CityState: string;
  GradYear: string;
  PlayerID: number;
  PlayerName: string;
  ProfilePic: string;
};

export default function PlayerSearchByName() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlayerInfo[]>([]);
  const router = useRouter();

  const fetchDefaultPlayers = async () => {
    try {
      const response = await fetch(`/api/playername?query=carson`);
      const players: PlayerInfo[] = await response.json();
      if (players.length > 0) {
        setSearchResults(players);
      } else {
        setSearchResults([]);
        toast.info('No default players found.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Error fetching default players: ${errorMessage}`);
    }
  };

  useEffect(() => {
    fetchDefaultPlayers();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      toast.info('Please enter a name to search.');
      return;
    }

    try {
      const response = await fetch(`/api/playername?query=${encodeURIComponent(searchQuery)}`);
      const players: PlayerInfo[] = await response.json();
      if (players.length > 0) {
        setSearchResults(players);
      } else {
        setSearchResults([]);
        toast.info('No players found.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Error searching for players: ${errorMessage}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    fetchDefaultPlayers();
  };

  return (
    <div className="mt-5">
      <div className="flex items-center relative">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter player name"
          className="w-full pl-3 pr-10 py-2 border rounded-md"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-20 top-1/2 mr-5 transform -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-gray-600"
          >
            <IoIosCloseCircleOutline className="w-6 h-6" />
          </button>
        )}
        <Button onClick={handleSearch} className="ml-2 flex-shrink-0">
          Search
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        {searchResults.map((player) => (
          <Card key={player.PlayerID} className="flex flex-col items-center p-4 shadow-md bg-color-gray-100">
            {player.ProfilePic ? (
              <div className="w-full items-center justify-center">
              <Image  src={player.ProfilePic} alt={player.PlayerName} width={250} height={250} className="w-full items-center justify-center rounded-lg" />
              </div>
            ) : (
              <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center">
                <span>{player.PlayerName[0]}</span>
              </div>
            )}
            <h3 className="mt-2 text-lg font-semibold">{player.PlayerName}</h3>
            <p className="text-sm text-gray-500">Player ID: {player.PlayerID}</p>
            <p className="text-sm text-gray-500">{player.CityState}</p>
            <Button className="mt-2" onClick={() => router.push(`/players/${player.PlayerID}`)}>
              View Player
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
