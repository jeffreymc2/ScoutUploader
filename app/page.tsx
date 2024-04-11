// app/page.tsx

import Background from "@/components/BackgroundImage";
import LandingPage from "@/components/LandingPage";

export default async function Page({ searchParams }: { searchParams: any }) {
  const playerId = searchParams.player_id ?? null;
  return (
    <>
      <div>
        {" "}
        <Background></Background>
      </div>

      <LandingPage />
      <div className="container mx-auto"></div>
    </>
  );
}
