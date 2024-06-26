// app/events/event_id/page.tsx

import { supabaseServer } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
// import BackButton from "@/components/BackButton";
import { Team, Post, Player } from "@/lib/types/types";
import EventTeamGallery from "@/components/EventComponents/EventTeamGallery";

interface EventTeamPageProps {
  params: {
    event_id: string;
    team_id: string;
  };
}

export default async function EventTeamPage({ params }: EventTeamPageProps) {
  const { event_id, team_id } = params;
  const supabase = supabaseServer();

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .eq("event_id", event_id)
    .eq("team_id", team_id)
    .order("created_at", { ascending: false });

  if (postsError) {
    console.error("Error fetching images:", postsError);
    return <div>Error fetching images</div>;
  }
  const typedPosts = posts as Post[];
  const playersResponse = await fetch(process.env.NEXT_PUBLIC_URL +`/api/teams?query=${encodeURIComponent(event_id)}`);

  if (!playersResponse.ok) {
    console.error("Error fetching teams:", await playersResponse.text());
    return <div>Error fetching teams</div>;
  }

  const teamsData: Team[] = await playersResponse.json();
const playersData: Player[] = teamsData.find((team) => team.TournamentTeamID === parseInt(team_id))?.Roster || [];

  // const eventName = posts?.[0]?.event_id || "";
  // const teamName = posts?.[0]?.team_id || "";

  return (
    <>
      {/* <BackButton /> */}
      <div className="space-y-4">
      <h1 className="text-2xl font-pgFont font-bold"> Event ID: {params.event_id}</h1>

        <h1 className="text-2xl font-pgFont font-bold"> Tournament Team Name: {teamsData?.[0]?.TournamentTeamName}</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <Card className="mt-5 shadow-lg border border-gray-100 min-h-96">
            <CardHeader>
              <CardTitle className="font-pgFont">Photo Gallery</CardTitle>
            </CardHeader>
            <CardContent>
            <EventTeamGallery posts={typedPosts} players={playersData} eventId={event_id} teamId={team_id} image={""} />
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </>
  );
}