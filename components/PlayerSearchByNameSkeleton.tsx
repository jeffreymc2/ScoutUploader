// PlayerSearchByNameSkeleton.tsx
import React from "react";
import {  Button } from "@/components/ui/button"; // Adjust the import path according to your project structure
import { Input } from "@/components/ui/input"; // Adjust the import path according to your project structure
import { Card } from "@/components/ui/card"; // Adjust the import path according to your project structure



// Skeleton placeholder for the player card
const PlayerCardSkeleton = () => (
  <div className="flex flex-row bg-white shadow-md rounded-lg overflow-hidden">
    <div className="w-1/3 md:w-1/2 bg-gray-300 min-h-[250px] animate-pulse"></div>
    <div className="w-2/3 md:w-1/2 p-4 flex flex-col justify-between space-y-4 animate-pulse">
      <div>
        <div className="h-6 bg-gray-300 rounded-md w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded-md w-1/2 mt-2 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded-md w-1/3 mt-2 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded-md w-1/4 mt-2 animate-pulse"></div>
      </div>
      <div className="mt-4 md:mt-0 h-8 bg-gray-300 rounded-md animate-pulse"></div>
    </div>
  </div>
);

const PlayerSearchByNameSkeleton = () => {
  return (
    <div className="mt-5">
     
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <PlayerCardSkeleton />
        <PlayerCardSkeleton />
        <PlayerCardSkeleton />
        <PlayerCardSkeleton />
        <PlayerCardSkeleton />
        <PlayerCardSkeleton />
        <PlayerCardSkeleton />
        <PlayerCardSkeleton />
        <PlayerCardSkeleton />
        <PlayerCardSkeleton />
        <PlayerCardSkeleton />
        <PlayerCardSkeleton />
      </div>
    </div>
  );
};

export default PlayerSearchByNameSkeleton;
