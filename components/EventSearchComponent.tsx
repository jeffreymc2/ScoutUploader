// components/SearchComponent.tsx
"use client";

import EventSearch from "@/components/EventSearch";
import EventSearchTerm from "@/components/EventSearchTerm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Post } from "@/lib/types/types";

const EventSearchComponent = ({ posts }: { posts: Post[] }) => {
  return (
    <Tabs defaultValue="event" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="event" className="px-4 py-2">By Event Name</TabsTrigger>
        <TabsTrigger value="eventsearch" className="px-4 py-2">By Event ID</TabsTrigger>
    
      </TabsList>

      <TabsContent value="event" className="min-h-[400px]">
        <EventSearch teams={[]} />
      </TabsContent>
      <TabsContent value="eventsearch" className="min-h-[400px]">
        <EventSearchTerm events={[]} />
      </TabsContent>
     
    </Tabs>
  );
};

export default EventSearchComponent;