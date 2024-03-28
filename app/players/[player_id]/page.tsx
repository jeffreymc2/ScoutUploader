import { supabaseServer } from "@/lib/supabase/server";
import Image from "next/image";
import Uploader from "@/components/Uploader";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DeletePost from "@/components/DeletePost";
import { Button } from "@/components/ui/button";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import BackButton from "@/components/BackButton";
import { Car } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

interface Post {
  created_at: string;
  player_id: string | null;
  id: string;
  name: string;
  object_id: string;
  post_by: string;
  profiles: {
    display_name: string | null;
  } | null;
  image: string;
}

interface PlayerSearchProps {
  posts: Post[] | null;
}

export default async function PlayerPage({
  params,
}: {
  params: { player_id: string; post_by: string; image: string };
}) {
  const player_id = params.player_id;

  const supabase = supabaseServer();

  // // Fetch player data - Assuming this API endpoint is correct
  // const response = await fetch(process.env.NEXT_PUBLIC_URL +
  //   `/api/players?playerID=${player_id}`
  // );
  const response = await fetch(
    process.env.NEXT_PUBLIC_URL + `/api/players?playerID=${player_id}`
  );

  const playerData: PlayerData = await response.json();

  // Fetch posts (image references) related to the player from the "posts" table
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .eq("player_id", playerData.PlayerID.toString())
    .order("created_at", { ascending: false });

  if (postsError) {
    console.error("Error fetching images:", postsError);
    return <div>Error fetching images</div>;
  }

  // Construct image URLs directly here assuming 'object_id' stores the path in Supabase Storage
  // const imageUrlHost = process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/images/";
  // const postImages = posts?.map((post) => ({
  //   image: `${imageUrlHost}${post.post_by}/${post.player_id}/${post.name}`,
  //   ...post,
  // }));

  // Assuming 'posts' matches the structure expected by PlayerSearchProps
  const imageUrlHost =
    process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/images/";

  const playerSearchProps: PlayerSearchProps = {
    posts:
      posts.map((post) => ({
        ...post,
        profiles: null,
        image: `${imageUrlHost}${post.post_by}/${post.player_id}/${post.name}`,
      })) || null,
  };

  return (
    <>
      <div className="flex flex-col  ">
      <span><BackButton /></span>

        <div className="w-full  p-5 bg-white rounded-lg shadow-md ">

          <div className="flex items-center space-x-4">
            
            <Avatar className="w-40 h-40">
              <Image
                alt="Player Avatar"
                src={playerData.ProfilePic ?? ""}
                fill={true}
                style={{
                  objectFit: "cover",
                }}
              />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <h2 className="text-5xl font-pgFont font-bold">
                {playerData?.PlayerName || "N/A"}
              </h2>
              <p className="text-md text-gray-500 ">
                Player ID:{playerData?.PlayerID || "N/A"}
              </p>
              <p className="text-md text-gray-500 ">
                Grad Year:{playerData?.GradYear || "N/A"} | Age:{" "}
                {playerData?.Age || "N/A"}
              </p>
              <div className="space-y-4 pt-5">
                <Dialog>
                  <DialogTrigger>
                    <Button>Upload More Files</Button>
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
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-light">Height</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.Height || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">Weight</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.Weight || "N/A"} lbs
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">City</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.CityState || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-light">College Commitment</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.Commitment || "N/A"}{" "}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">Highschool</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData.HighSchool}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">National Pos Rank</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.NationalPosRank || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">State Pos Rank</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.StatePosRank || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">National Rank</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.NationalRank || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">State Rank</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.StateRank || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-light">Bats/Throws</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.BatsThrows || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">Primary Position</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.PrimaryPos || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">Best PG Grade</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.bestPGGrade || "N/A"}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-light">Best Rank Sort</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.BestRankSort || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">Notes</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.Note || "N/A"}
              </p>
            </div>
            </div>
        </div>
      </div>

      <div className="space-y-4">
     
      <Card className="mt-5 shadow-lg border border-gray-100 min-h-96">
  <CardHeader>
    <CardTitle className="font-pgFont">{`Photo and Video Uploads of ${playerData.PlayerName}`}</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {playerSearchProps.posts?.map((post) => (
        <div key={post.id} className="relative aspect-square w-full h-48">
          <Image
            src={post.image}
            alt={`Image posted by ${post.post_by || "Unknown"}`}
            fill // Replaces layout="fill", indicating the image should fill its parent
            className="rounded-lg object-cover" // Ensures the image covers the area, maintaining aspect ratio without stretching
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw" // Adjust sizes based on your layout responsiveness
          />
          <DeletePost post_by={post.post_by} image={post.image} />
        </div>
      ))}
    </div>
  </CardContent>
</Card>


      </div>
    </>
  );
}
