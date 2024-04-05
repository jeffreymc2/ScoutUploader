// components/SearchComponent.tsx
"use client";
import EventSearch from "@/components/EventComponents/EventSearch";
import EventSearchTerm from "@/components/EventComponents/EventSearchTerm";
import PlayerSearch from "@/components/PlayerSearch";
import PlayerSearchByName from "@/components/PlayerSearchByName";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Post } from "@/lib/types/types";

const SearchComponent = ({ posts }: { posts: Post[] }) => {
  return (
    <Tabs defaultValue="playerName" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="playerName" className="px-4 py-2">By Player Name</TabsTrigger>
        <TabsTrigger value="player" className="px-4 py-2">By Player ID</TabsTrigger>
        <TabsTrigger value="event" className="px-4 py-2">By Event ID</TabsTrigger>
        <TabsTrigger value="eventsearch" className="px-4 py-2">By Event Name</TabsTrigger>
      </TabsList>

      <TabsContent value="playerName" className="min-h-[50px]">
        <PlayerSearchByName />
      </TabsContent>
      <TabsContent value="player" className="min-h-[50px]">
        <PlayerSearch posts={posts} />
      </TabsContent>
      <TabsContent value="event" className="min-h-[50px]">
        <EventSearch teams={[]} />
      </TabsContent>
      <TabsContent value="eventsearch" className="min-h-[50px]">
        <EventSearchTerm events={[]} /> {/* Pass an empty array or the actual events data */}
      </TabsContent>
    </Tabs>
  );
};

export default SearchComponent;