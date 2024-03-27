// // components/SearchComponent.tsx
"use client";
import EventSearch from "@/components/EventSearch";
import PlayerSearch from "@/components/PlayerSearch";
import { Post } from "@/lib/types/types";
import PlayerSearchByName from "@/components/PlayerSearchByName";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // adjust the import path accordingly

const SearchComponent = ({ posts }: { posts: Post[] }) => {
  return (
    <Tabs defaultValue="playerName" className="w-full">
      <TabsList>
        <TabsTrigger value="playerName">By Name</TabsTrigger>
        <TabsTrigger value="event">By Event ID</TabsTrigger>
        <TabsTrigger value="player">By Player ID</TabsTrigger>
      </TabsList>
      
      <TabsContent value="playerName">
        <PlayerSearchByName />
      </TabsContent>
      <TabsContent value="event">
        <EventSearch teams={[]} />
      </TabsContent>
      <TabsContent value="player">
        <PlayerSearch posts={posts} />
      </TabsContent>
    </Tabs>
  );
};

export default SearchComponent;

// import { useState } from "react";
// import EventSearch from "@/components/EventSearch";
// import PlayerSearch from "@/components/PlayerSearch";
// import PlayerSearchByName from "@/components/PlayerSearchByName";
// import { Post } from "@/lib/types/types";

// const SearchComponent = ({ posts }: { posts: Post[] }) => {
//   const [activeSearch, setActiveSearch] = useState('playerName');

//   const getActiveSearchComponent = () => {
//     switch (activeSearch) {
//       case 'playerName':
//         return <PlayerSearchByName />;
//       case 'event':
//         return <EventSearch teams={[]} />;
//       case 'player':
//         return <PlayerSearch posts={posts} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div>
//       <div className="flex gap-4 mb-4">
//         <button className="btn" onClick={() => setActiveSearch('playerName')}>
//           Search by Name
//         </button>
//         <button className="btn" onClick={() => setActiveSearch('event')}>
//           Search by Event ID
//         </button>
//         <button className="btn" onClick={() => setActiveSearch('player')}>
//           Search by Player ID
//         </button>
//       </div>
//       {getActiveSearchComponent()}
//     </div>
//   );
// };

// export default SearchComponent;
