// app/page.tsx

import BackgroundImage from "@/components/BackgroundImage";
import LandingPage from "@/components/LandingPage";
import Image from "next/image";

export default async function Page({ searchParams }: { searchParams: any }) {
  const playerId = searchParams.player_id ?? null;
  const imageSrc = "https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/pg-bg.jpg"
  return (
    <>
      <BackgroundImage
      image={
        <Image
          src={imageSrc}
          alt="Image Alt Text"
          className="object-cover object-center"
          fill
        />
      }
    >
   <LandingPage />
   <div className="container mx-auto">
   </div>
   </BackgroundImage>
    </>
  );
}
