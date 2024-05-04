// app/page.tsx

import BackgroundImage from "@/components/UtilityComponents/BackgroundImage";
import LandingPage from "@/components/UtilityComponents/LandingPage";
import BackgroundVideo from "next-video/background-video";
const bgVideo = "https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/15afdd15-e0a3-4488-804f-0c551cd3bacc.mp4?t=2024-05-04T00%3A51%3A46.638Z"

export default async function Page({ searchParams }: { searchParams: any }) {
  const playerId = searchParams.player_id ?? null;
  return (
    <>
        <BackgroundVideo  src={bgVideo} >

      <LandingPage />
      <div className="container mx-auto"></div>
      </BackgroundVideo>
    </>
  );
}
