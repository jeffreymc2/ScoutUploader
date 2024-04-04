// components/SearchComponent.tsx
"use client";

import PlayerSearch from "@/components/PlayerSearch";
import PlayerSearchByName from "@/components/PlayerSearchByName";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Post } from "@/lib/types/types";

const PlayerSearchComponent = ({ posts }: { posts: Post[] }) => {
  return (
    <Tabs defaultValue="playerName" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="playerName" className="px-4 py-2">By Player Name</TabsTrigger>
        <TabsTrigger value="player" className="px-4 py-2">By Player ID</TabsTrigger>
    
      </TabsList>

      <TabsContent value="playerName" className="min-h-[50px]">
        <PlayerSearchByName />
      </TabsContent>
      <TabsContent value="player" className="min-h-[50px]">
        <PlayerSearch posts={posts} />
      </TabsContent>
     
    </Tabs>
  );
};

export default PlayerSearchComponent;