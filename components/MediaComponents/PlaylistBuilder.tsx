
"use client";

import React, { useState, useEffect } from "react";
import {
 DndContext,
 DragOverlay,
 PointerSensor,
 useSensor,
 useSensors,
 DragStartEvent,
 DragEndEvent,
 TouchSensor,
 closestCenter,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { HighlightVideo } from "@/lib/types/types";
import { SortableHighlightVideoItem } from "./SortableHighlightVideoItem";
import { HighlightVideoItem } from "@/components/MediaComponents/HighlighVideoItem";
import { supabaseBrowser } from "@/lib/supabase/browser";
import useUser from "@/app/hook/useUser";
import { DroppablePlaylist } from "./DroppablePlaylist";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from 'next/navigation'; // Import useRouter
import { Card } from "../ui/card";


interface PlaylistBuilderProps {
 initialVideos: HighlightVideo[];
}

export function PlaylistBuilder({ initialVideos }: PlaylistBuilderProps) {
 const [videos, setVideos] = useState<HighlightVideo[]>(initialVideos);
 const [playlist, setPlaylist] = useState<HighlightVideo[]>([]);
 const [savedPlaylist, setSavedPlaylist] = useState<HighlightVideo[]>([]);
 const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
 const { data: user } = useUser();
 const router = useRouter(); // Get the router instance


 const user2 = "3faf9652-84d8-4b76-8b44-8e1f3b7ff7fd";

 useEffect(() => {
   const fetchSavedPlaylist = async () => {
     if (user) {
       const { data: playlistData, error } = await supabaseBrowser()
         .from("playlists")
         .select("playlist")
         .eq("user_id", user.id)
        //  .eq("user_id", user2)
         .single();

       if (error) {
         console.error("Error fetching saved playlist:", error);
       } else {
         const fetchedPlaylist = playlistData?.playlist as HighlightVideo[];
         setSavedPlaylist(fetchedPlaylist || []);
         setPlaylist(fetchedPlaylist || []);
         setVideos(initialVideos.filter((video) => !fetchedPlaylist?.some((savedVideo) => savedVideo.id === video.id)));
       }
     }
   };

   fetchSavedPlaylist();
 }, [user, initialVideos]);

 const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

 const handleDragStart = (event: DragStartEvent) => {
   setActiveVideoId(event.active.id as string);
 };

 const handleDragEnd = (event: DragEndEvent) => {
   const { active, over } = event;

   if (active.id !== over?.id) {
     const activeContainer = active.data.current?.sortable.containerId;
     const overContainer = over?.data.current?.sortable.containerId;

     if (activeContainer !== overContainer) {
       const activeIndex =
         activeContainer === "videos"
           ? videos.findIndex((video) => video.id === active.id)
           : playlist.findIndex((video) => video.id === active.id);

       if (activeIndex !== -1) {
         const [removed] =
           activeContainer === "videos"
             ? videos.splice(activeIndex, 1)
             : playlist.splice(activeIndex, 1);

         if (activeContainer === "videos") {
           setVideos([...videos]);
           setPlaylist([...playlist, removed]);
           setSavedPlaylist([...savedPlaylist, removed]);
         } else {
           setPlaylist([...playlist]);
           setVideos([...videos, removed]);
           setSavedPlaylist(savedPlaylist.filter((video) => video.id !== active.id));

         }
       }
     } else {
       const items = activeContainer === "videos" ? videos : playlist;
       const oldIndex = items.findIndex((video) => video.id === active.id);
       const newIndex = items.findIndex((video) => video.id === over?.id);

       if (oldIndex !== -1 && newIndex !== -1) {
         const reorderedItems = arrayMove(items, oldIndex, newIndex);
         activeContainer === "videos"
           ? setVideos(reorderedItems)
           : setPlaylist(reorderedItems);
         activeContainer === "playlist" && setSavedPlaylist(reorderedItems);
       }
     }
   }

   setActiveVideoId(null);
   
 };

 const user3 = "3faf9652-84d8-4b76-8b44-8e1f3b7ff7fd";
 const savePlaylist = async () => {
   if (user) {
     const { error } = await supabaseBrowser()
       .from("playlists")
       .upsert({ 
        // user_id: user3, 
        user_id: user.id, 
        name: "My Playlist", 
        playlist: playlist as any[] })
       .single();

     if (error) {
       console.error("Error saving playlist:", error);
     } else {
       console.log("Playlist saved successfully");
     }
   }
   toast.success("Playlist saved successfully");
   router.refresh(); // Refresh the page after successful update

 };

 const activeVideo =
   activeVideoId && (videos.find((video) => video.id === activeVideoId) ||
   playlist.find((video) => video.id === activeVideoId));

 return (

<>
   <DndContext
     sensors={sensors}
     collisionDetection={closestCenter}
     onDragStart={handleDragStart}
     onDragEnd={handleDragEnd}
   >
    <Card>
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 ml-4 mr-4">
     <div className="mb-4 w-full">
        <h2 className="my-4 font-pgFont text-2xl">Highlights</h2>
         <SortableContext items={videos} id="videos" strategy={verticalListSortingStrategy}>
           {videos.map((video) => (
             <SortableHighlightVideoItem key={video.id} video={video} />
           ))}
         </SortableContext>
       </div>
       <div>
           <DroppablePlaylist playlist={playlist} setPlaylist={setPlaylist} />
        
         <Button onClick={savePlaylist}>Save Playlist</Button>
       </div>
     </div>
     </Card>
     <DragOverlay>
       {activeVideo ? <HighlightVideoItem video={activeVideo} /> : null}
     </DragOverlay>
   </DndContext>
   </>
  );
}