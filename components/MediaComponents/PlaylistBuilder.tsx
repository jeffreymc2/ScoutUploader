// //@/components/MediaComponents/PlaylistBuilder.tsx
// "use client";

// import { useState } from "react";
// import {
//   DndContext,
//   DragOverlay,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragStartEvent,
//   DragEndEvent,
//   TouchSensor,
//   closestCenter,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   rectSortingStrategy,
// } from "@dnd-kit/sortable";
// import { SortableHighlightVideoItem } from "./SortableHighlightVideoItem";
// import { HighlightVideoItem } from "@/components/MediaComponents/HighlighVideoItem";
// import { supabaseBrowser } from "@/lib/supabase/browser";
// import useUser from "@/app/hook/useUser";
// import { HighlightVideo, Json } from "@/lib/types/types";
// import { Database } from "@/lib/types/supabase";
// import { Button } from "../ui/button";

// interface PlaylistBuilderProps {
//   initialVideos: HighlightVideo[];
// }

// const supabase = supabaseBrowser();

// export function PlaylistBuilder({ initialVideos }: PlaylistBuilderProps) {
//   const [videos, setVideos] = useState<HighlightVideo[]>(initialVideos);
//   const [playlist, setPlaylist] = useState<HighlightVideo[]>([]);
//   const [activeVideo, setActiveVideo] = useState<HighlightVideo | undefined>();

//   const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

//   const handleDragStart = (event: DragStartEvent) => {
//     const { active } = event;
//     setActiveVideo(videos.find((video) => video.id === active.id));
//   };

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (!over) return;

//     const activeItem = videos.find((video) => video.id === active.id);
//     const overItem = videos.find((video) => video.id === over.id);

//     if (!activeItem || !overItem) {
//       return;
//     }

//     const activeIndex = videos.findIndex((video) => video.id === active.id);
//     const overIndex = videos.findIndex((video) => video.id === over.id);

//     if (activeIndex !== overIndex) {
//       setVideos((prev) =>
//         arrayMove<HighlightVideo>(prev, activeIndex, overIndex)
//       );
//     }
//     setActiveVideo(undefined);
//   };

//   const handleDragCancel = () => {
//     setActiveVideo(undefined)
//   }
  
// const handleButtonClick = async () => {
//     const itemIds = videos.map((video) => video.id);

//     await supabase
//         .from("playlists")
//         .insert({ user_id: "3faf9652-84d8-4b76-8b44-8e1f3b7ff7fd", name: "playlist", playlist: itemIds as Json})
//         .single();
// };

//   return (
//     <DndContext
//       sensors={sensors}
//       collisionDetection={closestCenter}
//       onDragStart={handleDragStart}
//       onDragEnd={handleDragEnd}
//       onDragCancel={handleDragCancel}
//     >
//       <div className="m-4">
//         <div>
//           <SortableContext
//             items={videos}
//             id="videos"
//             strategy={rectSortingStrategy}
//           >
//             <div className="grid grid-cols-4 gap-4">
//               {videos.map((video) => (
//                 <SortableHighlightVideoItem key={video.id} video={video} />
//               ))}
//             </div>
//           </SortableContext>
//         </div>

//         <div>
//           <Button onClick={handleButtonClick}>Save Playlist</Button>
//         </div>
//       </div>
//       <DragOverlay adjustScale style={{ transformOrigin: "50% 50%" }}>
//         {activeVideo && <HighlightVideoItem video={activeVideo} isDragging />}
//       </DragOverlay>
//     </DndContext>
//   );
// }


// @/components/MediaComponents/PlaylistBuilder.tsx
// "use client";

// import { useState, useEffect } from "react";
// import {
//   DndContext,
//   DragOverlay,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragStartEvent,
//   DragEndEvent,
//   TouchSensor,
//   closestCenter,
// } from "@dnd-kit/core";
// import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
// import { SortableHighlightVideoItem } from "./SortableHighlightVideoItem";
// import { HighlightVideoItem } from "@/components/MediaComponents/HighlighVideoItem";
// import { supabaseBrowser } from "@/lib/supabase/browser";
// import useUser from "@/app/hook/useUser";
// import { HighlightVideo, Json } from "@/lib/types/types";
// import { Database } from "@/lib/types/supabase";
// import { Button } from "../ui/button";

// interface PlaylistBuilderProps {
//   initialVideos: HighlightVideo[];
// }

// const supabase = supabaseBrowser();

// export function PlaylistBuilder({ initialVideos }: PlaylistBuilderProps) {
//   const [videos, setVideos] = useState<HighlightVideo[]>(initialVideos);
//   const [playlist, setPlaylist] = useState<HighlightVideo[]>([]);
//   const [activeVideo, setActiveVideo] = useState<HighlightVideo | undefined>();
//   const { data: user } = useUser();

//   useEffect(() => {
//     // Retrieve the playlist from Supabase when the component mounts
//     const fetchPlaylist = async () => {
//       if (user) {
//         const { data: playlistData, error } = await supabase
//           .from("playlists")
//           .select("playlist")
//           .eq("user_id", user.id)
//           .single();

//         if (error) {
//           console.error("Error retrieving playlist:", error);
//         } else {
//           const playlistVideos = playlistData?.playlist as HighlightVideo[];
//           setPlaylist(playlistVideos || []);
//         }
//       }
//     };

//     fetchPlaylist();
//   }, [user]);

//   const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

//   const handleDragStart = (event: DragStartEvent) => {
//     const { active } = event;
//     setActiveVideo(videos.find((video) => video.id === active.id));
//   };

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (!over) return;

//     const activeContainer = findContainer(active.id.toString());
//     const overContainer = findContainer(over.id.toString());

//     if (
//         !activeContainer ||
//         !overContainer ||
//         activeContainer === overContainer
//     ) {
//         return;
//     }

//     const activeIndex = playlist.findIndex((video) => video.id === active.id);
//     const overIndex = playlist.findIndex((video) => video.id === over.id);

//     if (activeIndex !== overIndex) {
//       setPlaylist((items) => arrayMove(items, activeIndex, overIndex));
//     }

//     setActiveVideo(undefined);
//   };

//   const handleDragCancel = () => {
//     setActiveVideo(undefined);
//   };

//   const handleSavePlaylist = async () => {
//     if (user) {
//       const { error } = await supabase
//         .from("playlists")
//         .upsert({ user_id: user.id, name: "My Playlist", playlist: playlist as Json })
//         .single();
  
//       if (error) {
//         console.error("Error saving playlist:", error);
//       } else {
//         console.log("Playlist saved successfully");
//       }
//     }
//   };

//   const findContainer = (id: string) => {
//     if (playlist.some((video) => video.id === id)) {
//       return "playlist";
//     }
//     return null;
//   };

//   return (
//     <DndContext
//       sensors={sensors}
//       collisionDetection={closestCenter}
//       onDragStart={handleDragStart}
//       onDragEnd={handleDragEnd}
//       onDragCancel={handleDragCancel}
//     >
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <h2>Video Highlights</h2>
//           <div className="grid grid-cols-2 gap-4">
//             {videos.map((video) => (
//               <HighlightVideoItem key={video.id} video={video} />
//             ))}
//           </div>
//         </div>
//         <div>
//           <h2>Playlist</h2>
//           <SortableContext
//             items={playlist}
//             id="playlist"
//             strategy={rectSortingStrategy}
//           >
//             <div className="grid grid-cols-4 gap-4">
//               {playlist.map((video) => (
//                 <SortableHighlightVideoItem key={video.id} video={video} />
//               ))}
//             </div>
//           </SortableContext>
//           <Button onClick={handleSavePlaylist}>Save Playlist</Button>
//         </div>
//       </div>
//       <DragOverlay adjustScale style={{ transformOrigin: "50% 50%" }}>
//         {activeVideo && <HighlightVideoItem video={activeVideo} isDragging />}
//       </DragOverlay>
//     </DndContext>
//   );
// }

// @/components/MediaComponents/PlaylistBuilder.tsx
// @/components/MediaComponents/PlaylistBuilder.tsx
// @/components/MediaComponents/PlaylistBuilder.tsx
// @/components/MediaComponents/PlaylistBuilder.tsx
// @/components/MediaComponents/PlaylistBuilder.tsx
// @/components/MediaComponents/PlaylistBuilder.tsx
// @/components/MediaComponents/PlaylistBuilder.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   DndContext,
//   DragOverlay,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragStartEvent,
//   DragEndEvent,
//   TouchSensor,
//   closestCenter,
// } from "@dnd-kit/core";
// import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
// import { HighlightVideo } from "@/lib/types/types";
// import { SortableHighlightVideoItem } from "./SortableHighlightVideoItem";
// import { HighlightVideoItem } from "@/components/MediaComponents/HighlighVideoItem";
// import { supabaseBrowser } from "@/lib/supabase/browser";
// import useUser from "@/app/hook/useUser";
// import { DroppablePlaylist } from "./DroppablePlaylist";
// import { RiDraggable } from "react-icons/ri";


// interface PlaylistBuilderProps {
//   initialVideos: HighlightVideo[];
// }

// export function PlaylistBuilder({ initialVideos }: PlaylistBuilderProps) {
//   const [videos, setVideos] = useState<HighlightVideo[]>(initialVideos);
//   const [playlist, setPlaylist] = useState<HighlightVideo[]>([]);
//   const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
//   const [savedPlaylist, setSavedPlaylist] = useState<HighlightVideo[]>([]);

//   const { data: user } = useUser();

//   const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

//   const handleDragStart = (event: DragStartEvent) => {
//     setActiveVideoId(event.active.id as string);
//   };

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (active.id !== over?.id) {
//       const activeContainer = active.data.current?.sortable.containerId;
//       const overContainer = over?.data.current?.sortable.containerId;

//       if (activeContainer !== overContainer) {
//         const activeIndex = activeContainer === "videos"
//           ? videos.findIndex((video) => video.id === active.id)
//           : playlist.findIndex((video) => video.id === active.id);

//         if (activeIndex !== -1) {
//           const [removed] = activeContainer === "videos"
//             ? videos.splice(activeIndex, 1)
//             : playlist.splice(activeIndex, 1);

//           if (activeContainer === "videos") {
//             setVideos([...videos]);
//             setPlaylist([...playlist, removed]);
//           } else {
//             setPlaylist([...playlist]);
//             setVideos([...videos, removed]);
//           }
//         }
//       } else {
//         const items = activeContainer === "videos" ? videos : playlist;
//         const oldIndex = items.findIndex((video) => video.id === active.id);
//         const newIndex = items.findIndex((video) => video.id === over?.id);

//         if (oldIndex !== -1 && newIndex !== -1) {
//           const reorderedItems = arrayMove(items, oldIndex, newIndex);
//           activeContainer === "videos" ? setVideos(reorderedItems) : setPlaylist(reorderedItems);
//         }
//       }
//     }

//     setActiveVideoId(null);
//   };


//   const user2 = "3faf9652-84d8-4b76-8b44-8e1f3b7ff7fd";
  
//   useEffect(() => {
//     const fetchSavedPlaylist = async () => {
//       if (user) {
//         const { data: playlistData, error } = await supabaseBrowser()
//           .from("playlists")
//           .select("playlist")
//           .eq("user_id", user2)           
//           // .eq("user_id", user.id)

//           .single();

//         if (error) {
//           console.error("Error fetching saved playlist:", error);
//         } else {
//           const fetchedPlaylist = playlistData?.playlist as HighlightVideo[];
//           setSavedPlaylist(fetchedPlaylist || []);
//           setPlaylist(fetchedPlaylist || []);
//         }
//       }
//     };

//     fetchSavedPlaylist();
//   }, [user]);


//   const savePlaylist = async () => {
//     if (user) {
//       const { error } = await supabaseBrowser()
//         .from("playlists")
//         .upsert({ user_id: "3faf9652-84d8-4b76-8b44-8e1f3b7ff7fd", name: "My Playlist", playlist: playlist as any[] })
//         .single();

//       if (error) {
//         console.error("Error saving playlist:", error);
//       } else {
//         console.log("Playlist saved successfully");
//       }
//     }
//   };

//   const activeVideo = activeVideoId ? videos.find((video) => video.id === activeVideoId) || playlist.find((video) => video.id === activeVideoId) : null;

//   return (
//     <DndContext
//       sensors={sensors}
//       collisionDetection={closestCenter}
//       onDragStart={handleDragStart}
//       onDragEnd={handleDragEnd}
//     >
//       <div className="grid grid-cols-2 gap-4">
//       <div className="grid grid-cols-1 ml-4 ">
//       <h2 className="my-4 font-pgFont text-2xl">Video Highlights</h2>
//           <SortableContext items={videos} id="videos" strategy={verticalListSortingStrategy}>
//             {videos.map((video) => (
//               <SortableHighlightVideoItem key={video.id} video={video}/>
//             ))}
//           </SortableContext>
//         </div>
//         <div>
//             <div className="grid grid-cols gap-4">
//         <SortableContext items={playlist} id="playlist" strategy={verticalListSortingStrategy}>
//           <DroppablePlaylist playlist={playlist} setPlaylist={setPlaylist} />
//           {/* <SortableContext items={playlist} id="playlist" strategy={verticalListSortingStrategy}>
//             {playlist.map((video) => (
//               <SortableHighlightVideoItem key={video.id} video={video} />
//             ))} */}
//           <button onClick={savePlaylist}>Save Playlist</button>
//           </SortableContext>
//         </div>
//         </div>
        
//       </div>
//       <DragOverlay>
//         {activeVideo ? <HighlightVideoItem video={activeVideo} /> : null}
//       </DragOverlay>
//     </DndContext>
//   );
// }

// @/components/MediaComponents/PlaylistBuilder.tsx
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

interface PlaylistBuilderProps {
 initialVideos: HighlightVideo[];
}

export function PlaylistBuilder({ initialVideos }: PlaylistBuilderProps) {
 const [videos, setVideos] = useState<HighlightVideo[]>(initialVideos);
 const [playlist, setPlaylist] = useState<HighlightVideo[]>([]);
 const [savedPlaylist, setSavedPlaylist] = useState<HighlightVideo[]>([]);
 const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
 const { data: user } = useUser();

 const user2 = "3faf9652-84d8-4b76-8b44-8e1f3b7ff7fd";

 useEffect(() => {
   const fetchSavedPlaylist = async () => {
     if (user) {
       const { data: playlistData, error } = await supabaseBrowser()
         .from("playlists")
         .select("playlist")
         .eq("user_id", user.id)
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

//  const user3 = "3faf9652-84d8-4b76-8b44-8e1f3b7ff7fd";
 const savePlaylist = async () => {
   if (user) {
     const { error } = await supabaseBrowser()
       .from("playlists")
       .upsert({ user_id: user.id, name: "My Playlist", playlist: playlist as any[] })
       .single();

     if (error) {
       console.error("Error saving playlist:", error);
     } else {
       console.log("Playlist saved successfully");
     }
   }
 };

 const activeVideo =
   activeVideoId && (videos.find((video) => video.id === activeVideoId) ||
   playlist.find((video) => video.id === activeVideoId));

 return (
   <DndContext
     sensors={sensors}
     collisionDetection={closestCenter}
     onDragStart={handleDragStart}
     onDragEnd={handleDragEnd}
   >
     <div className="grid grid-cols-2 gap-4 mb-4">
     <div className="mb-4 w-full">
        <h2 className="my-4 font-pgFont text-2xl">Highlights</h2>
         <SortableContext items={videos} id="videos" strategy={verticalListSortingStrategy}>
           {videos.map((video) => (
             <SortableHighlightVideoItem key={video.id} video={video} />
           ))}
         </SortableContext>
       </div>
       <div>
         {savedPlaylist.length > 0 ? (
           <DroppablePlaylist playlist={playlist} setPlaylist={setPlaylist} />
         ) : (
           <p>No saved playlist found.</p>
         )}
         <button onClick={savePlaylist}>Save Playlist</button>
       </div>
     </div>
     <DragOverlay>
       {activeVideo ? <HighlightVideoItem video={activeVideo} /> : null}
     </DragOverlay>
   </DndContext>
 );
}