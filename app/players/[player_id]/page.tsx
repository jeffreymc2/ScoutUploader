// app/players/%5Bplayer_id%5D/page.tsx

import { supabaseServer } from "@/lib/supabase/server";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DeletePost from "@/components/UtilityComponents/DeletePost";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BackButton from "@/components/UtilityComponents/BackButton";
import { RiVideoUploadLine } from "react-icons/ri";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Suspense } from "react";
import Uploader from "@/components/Uploader";
import MediaParent from "@/components/MediaComponents/MediaParent";
import { MediaFile, HighlightVideo } from "@/lib/types/types";

interface PlayerData {
  PlayerID: number;
  PlayerName: string;
  GradYear: string;
  CityState: string;
  Height: string;
  Weight: number;
  BatsThrows: string;
  PrimaryPos: string;
  Commitment: string | null;
  BestRankSort: number | null;
  bestPGGrade: number | null;
  NationalRank: number | null;
  NationalPosRank: number | null;
  StateRank: number | null;
  StatePosRank: number | null;
  Note: string | null;
  HighSchool: string;
  LastTeamPlayedFor: string | null;
  Age: string;
  ProfilePic: string | null;
}

export default async function PlayerPage({
  params,
}: {
  params: { player_id: string };
}) {
  const player_id = params.player_id;
  const supabase = supabaseServer();

  // Fetch player data
  const response = await fetch(
    process.env.NEXT_PUBLIC_URL + `/api/players?playerID=${player_id}`
  );
  const playerData: PlayerData = await response.json();

  // Fetch media files from Supabase
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .eq("player_id", playerData.PlayerID)
    .order("created_at", { ascending: false });

  if (postsError) {
    console.error("Error fetching posts:", postsError);
    // Handle the error appropriately (e.g., show an error message)
  }

  const supabaseMediaFiles: MediaFile[] =
    posts?.map((post) => ({
      id: post.id || "",
      title: post.title || "", // Add a default value for title
      description: post.description || "", // Add a default value for description
      thumbnail: post.thumbnail
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/players/${post.post_by}/${post.player_id}/${post.name}`
        : "",
      url: post.name
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/players/${post.post_by}/${post.player_id}/${post.name}`
        : "",
      isVideo: isVideoFile(post?.name ?? ""),
      created_at: "", // Add a default value for created_at
      profile: { display_name: "" }, // Update the type definition of profile
      image: "", // Add a default value for image
    })) || [];

  // Fetch highlight videos from the PlayerHighlights API
  const highlightsResponse = await fetch(
    process.env.NEXT_PUBLIC_URL + `/api/playerhighlights?playerID=${player_id}`
  );
  const highlightsData = await highlightsResponse.json();

  const highlightVideos: HighlightVideo[] = highlightsData.results?.map((result: any) => ({
    id: result.id,
    stream_id: result.stream_id,
    title: result.title || "",
    description: result.description || "",
    start_time: result.start_time,
    end_time: result.end_time,
    duration: result.duration,
    thumbnailUrl: result.thumbnail || "",
    url: result.url || "",    
    created: result.created,
    tagged_player_keys: result.tagged_player_keys,
    highlight_type: result.highlight_type,
    drund_event_id: result.drund_event_id,
    game_key: result.game_key,
    scoringapp_play_id: result.scoringapp_play_id,
    play_type: result.play_type,
    highlight_created: result.highlight_created,
  })) || [];

  return (

    <div className="container mx-auto p-0">
      <BackButton />

      <Card className="mt-2">
        <CardContent className="p-0 bg-gradient-to-b from-gray-100 to-white">
          <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-8 p-0">
            <Avatar className="w-80 h-80 mt-5 md:mt-0 md:w-80 md:h-80 rounded-sm">
              <AvatarImage
                src={playerData.ProfilePic ?? ""}
                alt="Player Avatar"
                className="rounded-sm object-cover object-center w-full h-full"
              />
              <AvatarFallback>
                {playerData.PlayerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl font-pgFont md:text-6xl font-bold">
                {playerData?.PlayerName || "N/A"}
              </h2>
              <p className="text-md text-gray-500">
                Player ID: {playerData?.PlayerID || "N/A"}
              </p>
              <p className="text-md text-gray-500">
                Grad Year: {playerData?.GradYear || "N/A"} | Age:{" "}
                {playerData?.Age || "N/A"}
              </p>
              <div className="mt-4 mb-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800">
                      <RiVideoUploadLine className="h-6 w-6 mr-2" /> Upload
                      Media Content
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <Uploader
                      playerid={playerData.PlayerID}
                      FullName={playerData.PlayerName}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="bg-gradient-to-b from-gray-100 to-white">
            <CardTitle className="font-pgFont text-4xl">
              Player Details
            </CardTitle>
          </CardHeader>
          <CardContent >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Height</Label>
                <p className="text-lg">{playerData?.Height || "N/A"}</p>
              </div>
              <div>
                <Label>Weight</Label>
                <p className="text-lg">{playerData?.Weight || "N/A"} lbs</p>
              </div>
              <div>
                <Label>City</Label>
                <p className="text-lg">{playerData?.CityState || "N/A"}</p>
              </div>
              <div>
                <Label>College Commitment</Label>
                <p className="text-lg">{playerData?.Commitment || "N/A"}</p>
              </div>
              <div>
                <Label>High School</Label>
                <p className="text-lg">{playerData.HighSchool}</p>
              </div>
              <div>
                <Label>National Pos Rank</Label>
                <p className="text-lg">
                  {playerData?.NationalPosRank || "N/A"}
                </p>
              </div>
              <div>
                <Label>State Pos Rank</Label>
                <p className="text-lg">{playerData?.StatePosRank || "N/A"}</p>
              </div>
              <div>
                <Label>National Rank</Label>
                <p className="text-lg">{playerData?.NationalRank || "N/A"}</p>
              </div>
              <div>
                <Label>State Rank</Label>
                <p className="text-lg">{playerData?.StateRank || "N/A"}</p>
              </div>
              <div>
                <Label>Bats/Throws</Label>
                <p className="text-lg">{playerData?.BatsThrows || "N/A"}</p>
              </div>
              <div>
                <Label>Primary Position</Label>
                <p className="text-lg">{playerData?.PrimaryPos || "N/A"}</p>
              </div>
              <div>
                <Label>Best PG Grade</Label>
                <p className="text-lg">{playerData?.bestPGGrade || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-gradient-to-b from-gray-100 to-whit1">
            <CardTitle className="font-pgFont text-4xl">
              Additional Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Notes</Label>
                <p className="text-md">{playerData?.Note || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Card className="mt-4">
          <CardHeader className="bg-gradient-to-b from-gray-100 to-white">
            <CardTitle className="font-pgFont text-4xl">
              {`${playerData.PlayerName}'s`} Media Content
            </CardTitle>
            <div className="mt-4 mb-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800">
                    <RiVideoUploadLine className="h-6 w-6 mr-2" /> Upload Media
                    Content
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <Uploader
                    playerid={playerData.PlayerID}
                    FullName={playerData.PlayerName}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-gradient-to-b from-gray-100 to-white">
            <MediaParent
              supabaseMediaFiles={supabaseMediaFiles}
              highlightVideos={highlightVideos}
            />
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
}

function isVideoFile(fileName: string): boolean {
  const fileExtension = fileName?.split(".").pop()?.toLowerCase();
  const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "flv"];
  return videoExtensions.includes(fileExtension || "");
}