// components/SearchComponent.tsx
"use client";
import EventSearch from "@/components/EventSearch";
import PlayerSearch from "@/components/PlayerSearch";
import PlayerSearchByName from "@/components/PlayerSearchByName";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Post } from "@/lib/types/types";

const SearchComponent = ({ posts }: { posts: Post[] }) => {
  return (
    <Tabs defaultValue="playerName" className="w-full">
      <TabsList className="mb-4"> {/* Margin-bottom for spacing */}
        <TabsTrigger value="playerName" className="px-4 py-2">By Name</TabsTrigger>
        <TabsTrigger value="event" className="px-4 py-2">By Event ID</TabsTrigger>
        <TabsTrigger value="player" className="px-4 py-2">By Player ID</TabsTrigger>
      </TabsList>
      
      <TabsContent value="playerName" className="min-h-[400px]"> {/* Minimum height */}
        <PlayerSearchByName />
      </TabsContent>
      <TabsContent value="event" className="min-h-[400px]">
        <EventSearch teams={[]} />
      </TabsContent>
      <TabsContent value="player" className="min-h-[400px]">
        <PlayerSearch posts={posts} />
      </TabsContent>
    </Tabs>
  );
};

export default SearchComponent;
