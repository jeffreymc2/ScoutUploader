// components/SearchComponent.tsx
"use client";

import EventSearch from "@/components/EventSearch";
import EventSearchRoute from "@/components/EventSearchTermRoute";
import EventSearchByName from "@/components/EventSearchByName";

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Post } from "@/lib/types/types";

const EventSearchComponent = ({ posts }: { posts: Post[] }) => {
  return (
    <Tabs defaultValue="eventsearchbyname" className="w-full">
      <TabsList className="mb-4">
      {/* <TabsTrigger value="eventsearchbyname" className="px-4 py-2">By Event Date</TabsTrigger> */}
        <TabsTrigger value="eventsearch" className="px-4 py-2">By Event Name</TabsTrigger>
        <TabsTrigger value="event" className="px-4 py-2">By Event ID</TabsTrigger>
    
      </TabsList>

      {/* <TabsContent value="eventsearchbyname" className="min-h-[400px]">
        <EventSearchByName />
      </TabsContent>  */}
      <TabsContent value="eventsearch" className="min-h-[400px]">
        <EventSearchRoute events={[]} />
      </TabsContent>
      <TabsContent value="event" className="min-h-[400px]">
        <EventSearch teams={[]} />
      </TabsContent>
     
    </Tabs>
  );
};

export default EventSearchComponent;