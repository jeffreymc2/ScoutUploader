// app/players/%5Bplayer_id%5D/page.tsx
"use server";
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
import { Player, Post } from "@/lib/types/types";
import Uploader from "@/components/Uploader";
import { MediaFile, HighlightVideo } from "@/lib/types/types";
import PlayerMediaGallery from "@/components/PlayerComponents/PlayerMediaGallery";
import { HighlightMediaCard } from "@/components/MediaComponents/HighlightMediaCard";
import PlayerStatsSummary from "@/components/PlayerComponents/PlayerStatsSummary";
import { PlaylistBuilder } from "@/components/MediaComponents/PlaylistBuilder";

import { GameStatsTable } from "@/components/PlayerComponents/PlayerStatsTable";
import {
  FaMedal,
  FaMapMarkerAlt,
  FaBasketballBall,
  FaRulerVertical,
  FaWeight,
} from "react-icons/fa";
import { Video } from "lucide-react";
import VideoPlaylist from "@/components/MediaComponents/VideoPlaylist";
import VideoPlayer from "@/components/MediaComponents/VideoPlaylist";

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
          image: post.event_id
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/events/${post.post_by}/${post.event_id}/${post.team_id}/${post.name}`
            : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/players/${post.post_by}/${post.player_id}/${post.name}`,
          isVideo: isVideoFile(post.name ?? ""),
          MediaFileURL: "", // Add the missing property 'MediaFileURL' with an empty string value
        }))
      : [],
    players: [],
    eventId: "",
    teamId: "",
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
          <div className="grid grid-cols-1 md:grid-cols-[1fr_0.8fr_2fr] gap-4">
            <div className="flex flex-col items-center">
              <Avatar className="w-80 h-96 mt-5 md:mt-0 md:w-80 md:h-80 rounded-sm">
                <AvatarImage
                  src={playerData.ProfilePic ?? ""}
                  alt="Player Avatar"
                  className="rounded-sm object-cover items-center w-full h-full object-top"
                />
                <AvatarFallback>
                  {playerData.PlayerName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col justify-top mt-2">
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
              <div className="flex justify-left items-center space-x-4 mt-4">
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
            <CardContent>
              <div className="w-full my-2">
                <PlayerStatsSummary playerId={player_id.toString()} />
                <GameStatsTable playerId={player_id.toString()} />
              </div>
            </CardContent>
          </div>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Height
              </div>
              <div className="font-medium">{playerData?.Height || "N/A"}&quot;</div>
                          </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Weight
              </div>
              <div className="font-medium">
                {playerData?.Weight || "N/A"} lbs
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Hometown
              </div>
              <div className="font-medium">
                {playerData?.CityState || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                College
              </div>
              <div className="font-medium">
                {playerData?.Commitment || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                High School
              </div>
              <div className="font-medium">
                {playerData?.HighSchool || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                National Rank
              </div>
              <div className="font-medium">
                {playerData?.NationalRank || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                State Rank
              </div>
              <div className="font-medium">
                {playerData?.StateRank || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                PG Grade
              </div>
              <div className="font-medium">
                {playerData?.bestPGGrade || "N/A"}
              </div>
            </div>
            <div className="md:col-span-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Notes
                </div>
                <div className="font-medium">{playerData?.Note || "N/A"}</div>
              </div>
            </div>
          </CardContent>
        </CardContent>
      </Card>
      {/* <div className="mt-4">
        <Card>
          <CardContent>
            <div className="w-full my-4">
              <PlayerStatsSummary playerId={player_id.toString()} />
              <GameStatsTable playerId={player_id.toString()} />
            </div>
          
            <div>
              <Label>Notes</Label>
              <p className="text-md">{playerData?.Note || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
      </div> */}

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
          <VideoPlayer />
          <PlaylistBuilder initialVideos={highlightVideos} />
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
              playerId={playerData.PlayerID.toString()} // Convert PlayerID to string
            />
          </div>
        </Card>

        {/* <Card className="mt-8">
          <div className="bg-blue-500 text-white rounded-t-lg py-2 px-4">
            <CardTitle className="text-sm font-bold">
              DiamondKast Plus Highlights
            </CardTitle>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {highlightVideos.map((highlight) => (
              <HighlightMediaCard key={highlight.id} highlight={highlight} />
            ))}
          </div>
        </Card> */}
      </Suspense>
    </div>
  );
}

function isVideoFile(fileName: string): boolean {
  const fileExtension = fileName?.split(".").pop()?.toLowerCase();
  const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "flv"];
  return videoExtensions.includes(fileExtension || "");
}
