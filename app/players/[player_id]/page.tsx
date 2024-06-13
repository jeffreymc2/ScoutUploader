// app/players/%5Bplayer_id%5D/page.tsx
"use server";
import { supabaseServer } from "@/lib/supabase/server";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BackButton from "@/components/UtilityComponents/BackButton";
import { RiVideoUploadLine } from "react-icons/ri";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { Player, Post } from "@/lib/types/types";
import Uploader from "@/components/Uploader";
import { HighlightVideo } from "@/lib/types/types";
import PlayerMediaGallery from "@/components/PlayerComponents/PlayerMediaGallery";
import PlayerStatsSummary from "@/components/PlayerComponents/PlayerStatsSummary";
import { PlaylistBuilder } from "@/components/MediaComponents/PlaylistBuilder";
import { GameStatsTable } from "@/components/PlayerComponents/PlayerStatsTable";
import VideoPlayer from "@/components/MediaComponents/VideoPlaylist";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

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

interface PlayerGalleryProps {
  posts: Post[];
  players: Player[];
  eventId: string;
  teamId: string;
  thumbnail_url: string;
  image: string;
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

  const supabaseMediaFiles: PlayerGalleryProps = {
    posts: posts
      ? posts.map((post) => ({
          ...post,
          profile: null,
          isVideo: post.is_video ?? false,
          file_url: post.file_url ?? "",
          thumbnail_url: post.thumbnail_url ?? "",
          MediaFileURL: "",
          image: "",
        }))
      : [],
    players: [],
    eventId: "",
    teamId: "",
    thumbnail_url: "",
    image: "",
  };

  const typedPosts = posts as Post[];

  // Fetch highlight videos from the PlayerHighlights API
  const highlightsResponse = await fetch(
    process.env.NEXT_PUBLIC_URL + `/api/playerhighlights?playerID=${player_id}`
  );
  const highlightsData = await highlightsResponse.json();

  const highlightVideos: HighlightVideo[] =
    highlightsData.highlights?.map((highlight: any) => ({
      id: highlight.id,
      stream_id: highlight.stream_id,
      title: highlight.title || "",
      description: highlight.description || "",
      start_time: highlight.start_time,
      end_time: highlight.end_time,
      duration: highlight.duration,
      thumbnailUrl: highlight.thumbnailUrl || "",
      url: highlight.url || "",
      created: highlight.created,
      tagged_player_keys: highlight.tagged_player_keys,
      highlight_type: highlight.highlight_type,
      drund_event_id: highlight.drund_event_id,
      game_key: highlight.game_key,
      scoringapp_play_id: highlight.scoringapp_play_id,
      play_type: highlight.play_type,
      highlight_created: highlight.highlight_created,
    })) || [];

  return (
    <div className="container mx-auto p-0">
      <BackButton />
      <Card className="mt-2">
        <CardContent className="p-0 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_2fr] gap-4">
            <div className="flex flex-col items-center">
              <Avatar className="min-w-80 min-h-96 mt-5 md:mt-0 md:w-80 md:h-80 rounded-lg">
                <AvatarImage
                  src={playerData.ProfilePic ?? ""}
                  alt="Player Avatar"
                  className="rounded-sm object-cover items-center w-full h-full"
                />
                <AvatarFallback>
                  {playerData?.PlayerName?.slice(0, 2).toUpperCase() || ""}
                </AvatarFallback>
              </Avatar>
              <div className="flex justify-center mt-4 md:hidden">
                <Dialog>
                  <DialogTrigger className="text-sm font-bold flex items-center space-x-1">
                    <Button className="bg-blue-500 text-white rounded-t-lg py-2 px-4">
                      <RiVideoUploadLine className="h-5 w-5 mr-2" />
                      <span>Upload Media</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="my-2">
                    <Uploader
                      playerid={playerData.PlayerID}
                      FullName={playerData.PlayerName}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-pgFont md:text-6xl font-bold text-center md:text-left">
                {playerData?.PlayerName || "N/A"}
              </h2>
              <p className="text-md text-gray-500 text-center md:text-left">
                Player ID: {playerData?.PlayerID || "N/A"}
              </p>
              <p className="text-md text-gray-500 text-center md:text-left">
                Grad Year: {playerData?.GradYear || "N/A"} | Age:{" "}
                {playerData?.Age || "N/A"}
              </p>
              <div className="hidden md:flex justify-left items-center space-x-4 mt-4">
                <Dialog>
                  <DialogTrigger className="text-sm font-bold flex items-center space-x-1">
                    <Button className="bg-blue-500 text-white rounded-t-lg py-2 px-4">
                      <RiVideoUploadLine className="h-5 w-5 mr-2" />
                      <span>Upload Media</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="my-2">
                    <Uploader
                      playerid={playerData.PlayerID}
                      FullName={playerData.PlayerName}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <CardContent className="flex flex-col justify-center ">
              <CardContent className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 mt-2 items-center md:justify-items-start justify-items-center">
                <div className="md:text-left text-center">
                  <div className="text-sm text-gray-500">Height</div>
                  <div className="font-medium leading-4">
                    {playerData?.Height || "N/A"}&quot;
                  </div>
                </div>
                <div className="md:text-left text-center justify-top">
                  <div className="text-sm text-gray-500">Weight</div>
                  <div className="font-medium leading-4">
                    {playerData?.Weight || "N/A"} lbs
                  </div>
                </div>
                <div className="md:text-left text-center justify-top">
                  <div className="text-sm text-gray-500">Hometown</div>
                  <div className="font-medium leading-4">
                    {playerData?.CityState || "N/A"}
                  </div>
                </div>
                <div className="md:text-left text-center justify-top">
                  <div className="text-sm text-gray-500">College</div>
                  <div className="font-medium leading-4">
                    {playerData?.Commitment || "N/A"}
                  </div>
                </div>
                <div className="md:text-left text-center justify-top">
                  <div className="text-sm text-gray-500">High School</div>
                  <div className="font-medium leading-4">
                    {playerData?.HighSchool || "N/A"}
                  </div>
                </div>
                <div className="md:text-left text-center justify-top">
                  <div className="text-sm text-gray-500">National Rank</div>
                  <div className="font-medium leading-4">
                    {playerData?.NationalRank || "N/A"}
                  </div>
                </div>
                <div className="md:text-left text-center justify-top">
                  <div className="text-sm text-gray-500">State Rank</div>
                  <div className="font-medium leading-4">
                    {playerData?.StateRank || "N/A"}
                  </div>
                </div>
                <div className="md:text-left text-center justify-top">
                  <div className="text-sm text-gray-500">PG Grade</div>
                  <div className="font-medium leading-4">
                    {playerData?.bestPGGrade || "N/A"}
                  </div>
                </div>
                <div className="col-span-2 md:col-span-4 text-left">
                  <div className="text-sm text-gray-500">Notes</div>
                  <div className="font-medium leading-6">
                    {playerData?.Note || "N/A"}
                  </div>
                </div>
              </CardContent>
            </CardContent>
          </div>
          <div className="w-full ">
            <PlayerStatsSummary playerId={player_id.toString()} />
            <div className="m-4">
              <GameStatsTable playerId={player_id.toString()} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Suspense fallback={<div>Loading...</div>}>
        <Card className="mt-8">
          <div className="bg-blue-500 text-white rounded-t-lg py-2 px-4 flex items-center justify-between">
            <CardTitle className="text-sm font-bold">
              DiamondKast Plus Highlights
            </CardTitle>
            <Dialog>
              <DialogTrigger className="text-sm font-bold flex items-center space-x-1 ">
                <RiVideoUploadLine className="h-5 w-5" />
                <span>Upload Media</span>
              </DialogTrigger>
              <DialogContent>
                <Uploader
                  playerid={playerData.PlayerID}
                  FullName={playerData.PlayerName}
                />
              </DialogContent>
            </Dialog>
          </div>
          <VideoPlayer playerId={player_id} />
          <Separator />
          <div className="lg:hidden pb-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="py-2 px-4 mt-4 hover:no-underline bg-gray-100 m-4">
                  Create a Custom Playlist
                </AccordionTrigger>
                <AccordionContent>
                  <PlaylistBuilder
                    initialVideos={highlightVideos}
                    playerId={player_id}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="hidden lg:block">
            <PlaylistBuilder
              initialVideos={highlightVideos}
              playerId={player_id}
            />
          </div>
        </Card>

        <Card className="mt-4">
          <div className="bg-blue-500 text-white rounded-t-lg py-2 px-4 flex items-center justify-between">
            <CardTitle className="text-sm font-bold">Media Gallery</CardTitle>
            <Dialog>
              <DialogTrigger className="text-sm font-bold flex items-center space-x-1 ">
                <RiVideoUploadLine className="h-5 w-5" />
                <span>Upload Media</span>
              </DialogTrigger>
              <DialogContent>
                <Uploader
                  playerid={playerData.PlayerID}
                  FullName={playerData.PlayerName}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="m-2 p-4">
            <PlayerMediaGallery
              posts={typedPosts}
              events={[]}
              playerId={playerData?.PlayerID?.toString() || ""}
            />
          </div>
        </Card>
      </Suspense>
    </div>
  );
}
