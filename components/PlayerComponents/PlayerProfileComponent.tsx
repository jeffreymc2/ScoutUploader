import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { RiVideoUploadLine } from "react-icons/ri";
import Uploader from "@/components/Uploader";

type PlayerProfileProps = {
  playerData: {
    PlayerName: string;
    PlayerID: number;
    GradYear: string;
    Age: string;
    ProfilePic: string | null;
    Height: string;
    Weight: string;
    HighSchool: string;
    CityState: string;
    Commitment: string | null;
    NationalRank: number | null;
    StateRank: number | null;
    bestPGGrade: number | null;
    Note: string | null;
  };
};

const PlayerProfile = ({ playerData }: PlayerProfileProps) => {
  return (
    <Card className="p-4 max-w-4xl mx-auto my-autp">
      <div className="flex flex-col items-center gap-4 mt-auto">
        <Image
          src={playerData.ProfilePic ?? "/default-profile.png"}
          alt={`${playerData.PlayerName} image`}
          width={200}
          height={200}
          className="rounded-lg object-cover"
        />
        <div className="flex-1 text-center items-center">
          <CardHeader className="mb-4 mt-4">
            <CardTitle className="text-6xl font-bold">{playerData.PlayerName}</CardTitle>
            <CardDescription className="text-xl">
              {`Player ID: ${playerData.PlayerID} | Grad Year: ${playerData.GradYear} | Age: ${playerData.Age}`}
            </CardDescription>
          </CardHeader>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-4">
                <RiVideoUploadLine className="h-5 w-5 mr-2" />
                Upload Media
              </Button>
            </DialogTrigger>
            <DialogContent>
              <Uploader
                playerid={playerData.PlayerID}
                FullName={playerData.PlayerName}
              />
            </DialogContent>
          </Dialog>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-lg">Height</h3>
              <p className="text-lg">{playerData.Height}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Weight</h3>
              <p className="text-lg">{playerData.Weight}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Hometown</h3>
              <p className="text-lg">{playerData.CityState}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg">High School</h3>
              <p className="text-lg">{playerData.HighSchool}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg">College</h3>
              <p className="text-lg">{playerData.Commitment ?? "N/A"}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg">National Rank</h3>
              <p className="text-lg">{playerData.NationalRank ?? "N/A"}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg">State Rank</h3>
              <p className="text-lg">{playerData.StateRank ?? "N/A"}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg">PG Grade</h3>
              <p className="text-lg">{playerData.bestPGGrade ?? "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
      <CardContent>
        <h2 className="font-bold text-2xl mt-4 mb-2">Notes</h2>
        <p className="text-lg">{playerData.Note ?? "N/A"}</p>
      </CardContent>
    </Card>
  );
};

export default PlayerProfile;
