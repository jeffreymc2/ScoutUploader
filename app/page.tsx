// app/page.tsx

import BackgroundImage from "@/components/BackgroundImage";
import LandingPage from "@/components/LandingPage";

export default async function Page({ searchParams }: { searchParams: any }) {
  const playerId = searchParams.player_id ?? null;
  return (
    <>
      <BackgroundImage />

      <LandingPage />
      <div className="container mx-auto"></div>
    </>
  );
}
