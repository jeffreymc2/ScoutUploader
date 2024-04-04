// app/page.tsx

import LandingPage from "@/components/LandingPage";

export default async function Page({ searchParams }: { searchParams: any }) {
  const playerId = searchParams.player_id ?? null;
  return (
    
    <>
   <LandingPage />
   <div className="container mx-auto">
   </div>
    </>
  );
}
