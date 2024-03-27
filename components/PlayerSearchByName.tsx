// // app/components/PlayerSearchByName.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";
// import { IoIosCloseCircleOutline } from "react-icons/io";
// import { toast } from "sonner";
// import { Player } from "@/lib/types/types";
// import Uploader from "./Uploader";
// import { Card } from "@/components/ui/card";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// type PlayerName = {
//   BestRankSort: number;
//   CityState: string;
//   GradYear: string;
//   PlayerID: number;
//   PlayerName: string;
//   ProfilePic: string;
// };


// export default function PlayerSearchByName() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<PlayerName[]>([]);
//   const [selectedPlayer, setSelectedPlayer] = useState<PlayerName | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const router = useRouter();

//   const handleSearch = async () => {
//     if (searchQuery.trim() === "") {
//       setSearchResults([]);
//       return;
//     }

//     try {
//       const response = await fetch(
//         `/api/playername?query=${encodeURIComponent(searchQuery)}`
//       );
//       const data = await response.json();

//       if (data && data.length > 0) {
//         setSearchResults(data);
//         console.log("Search", searchResults);

//       } else {
//         setSearchResults([]);
//         toast.info("No players found.");
//       }
//     } catch (error) {
//       toast.error(
//         `Error searching players: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`
//       );

//     }
//   };

//   const handleViewPlayerPage = (PlayerID: number) => {
//     router.push(`/players/${PlayerID}`);
    
//   };

//   const handlePlayerClick = (player: PlayerName) => {
//     setSelectedPlayer(player);
//     setIsDialogOpen(true);
//   };

//   return (
    
//     <div className="mt-5">
//     <div className="flex items-center w-full relative">
//         <Input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Search player by Player Name"
//           className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
//         />
//         {searchQuery && (
//           <button
//             onClick={() => {
//               setSearchQuery("");
//               setSearchResults([]);
//             }}
//             className="absolute right-20 top-1/2 mr-5 transform -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-gray-600"
//           >
//             <IoIosCloseCircleOutline className="w-6 h-6" />
//           </button>
//         )}
//         <Button onClick={handleSearch} className="ml-2 flex-shrink-0">
//           Search
//         </Button>
//       </div>
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-10">
//         {searchResults.map((player) => (
// <Card className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
// <div className="md:flex">
//   <div className="md:flex-shrink-0">
//     <img
//       alt="Player avatar"
//       className="h-48 w-full object-cover md:w-48"
//       height="200"
//       src="/placeholder.svg"
//       style={{
//         aspectRatio: "200/200",
//         objectFit: "cover",
//       }}
//       width="200"
//     />
//   </div>
//   <div className="p-8">
//     <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Player Name</div>
//     <p className="mt-2 text-gray-500">Player ID: 123456</p>
//     <div className="mt-4 flex items-center space-x-4">
//       <Button className="w-full">View Player Page</Button>
//       <Button className="w-full" variant="outline">
//         Upload Files
//       </Button>
//     </div>
//   </div>
// </div>
// </Card>
//           <div
//             key={player.PlayerID}
//             className="p-4 bg-white border border-gray-200 rounded-lg shadow"
//           >
//             <h3 className="text-lg font-semibold">{player.PlayerName}</h3>
//             <p className="mt-1 text-sm text-gray-500">
//               Player ID: {player.PlayerID}
//             </p>
//             <Button
//               className="mt-2"
//               onClick={() => handleViewPlayerPage(player.PlayerID)}
//             >
//               View Player Page
//             </Button>
//             <Button
//               className="mt-2 ml-2"
//               onClick={() => handlePlayerClick(player)}
//             >
//               Upload Files
//             </Button>
//           </div>
//         ))}
//         {isDialogOpen && (
//           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//             <DialogTrigger asChild>
//               <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
//             </DialogTrigger>

//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle className="font-pgFont">Player Details</DialogTitle>
//               </DialogHeader>
//               <DialogDescription>
//                 {selectedPlayer && (
//                   <div>
//                     <Uploader
//                       playerid={selectedPlayer.PlayerID}
//                       FullName={selectedPlayer.PlayerName}
//                     />
//                   </div>
//                 )}
//               </DialogDescription>
//             </DialogContent>
//           </Dialog>
//         )}
//       </div>
//     </div>
//   );
// }
"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { toast } from 'sonner';

// Import your UI components
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


// Type for player information
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
            onClick={() => {
              setSearchQuery("");
              setSearchResults([]);
            }}
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
          <Card key={player.PlayerID} className="flex flex-col items-center p-4">
            {player.ProfilePic ? (
              <Image src={player.ProfilePic} alt={player.PlayerName} width={100} height={100} className="rounded-full" />
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
