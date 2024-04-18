// AllPlays.tsx
import React from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { TabsContent } from "@/components/ui/tabs";
import { TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/tabs";
import { PlayData, Pitch, AtBat } from "@/lib/types/types";
import { getVariantFromPlayResult } from "@/app/utils/plays";

interface AllPlaysProps {
  data: PlayData[];
}

const AllPlays: React.FC<AllPlaysProps> = ({ data }) => {
  return (
    <>
      <Tabs defaultValue="allplays" className="my-5 ">
        <TabsList className="flex justify-center">
          <TabsTrigger value="allplays">All Plays</TabsTrigger>
          <TabsTrigger value="scoringplays">Scoring Plays</TabsTrigger>
        </TabsList>
        <TabsContent value="allplays">
          <Card className="my-5">
            <CardHeader></CardHeader>
            <CardContent>
              {data.map(
                (
                  { inning, teamAtBat, pitcher, atBats, teamPitching },
                  index
                ) => (
                  <div key={index}>
                    <div className="flex items-center mb-2">
                      <Image
                        src="https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/yankees.png?t=2024-04-18T15%3A48%3A39.662Z"
                        alt={pitcher.playerId}
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      <h3 className="text-sm font-bold">
                        <span>
                          {teamAtBat} - Top {inning}
                        </span>
                      </h3>
                    </div>
                    <div className="flex items-center mb-2 bg-gray-100">
                      <Image
                        src="https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/pitcher.png"
                        alt={pitcher.playerId}
                        width={45}
                        height={45}
                        className="mr-2"
                      />
                      <h3 className="text-sm font-bold">
                        <span>
                          {pitcher.playerId} pitching for {teamPitching}
                        </span>
                      </h3>
                    </div>

                    <Accordion type="single" collapsible>
                      {atBats.map((atBat, atBatIndex) => (
                        <AccordionItem
                          key={`${index}-${atBatIndex}`}
                          value={`item-${index}-${atBatIndex}`}
                        >
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between hover:no-underline">
                              <div className="flex items-center mb-2 ">
                                <Image
                                  src="https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/pitcher.png"
                                  alt={pitcher.playerId}
                                  width={45}
                                  height={45}
                                  className="mr-2"
                                />
                                <h3 className="text-sm font-bold">
                                  <span className="text-sm font-bold no-underline">
                                    {atBat.playResult === "incomplete"
                                      ? `${atBat.batter.playerId}, ${atBat.batter.playerNumber} is currently`
                                      : atBat.playDescription}
                                  </span>
                                  <Badge
                                    className="ml-2"
                                    variant={getVariantFromPlayResult(atBat)}
                                  >
                                    {atBat.playResult !== "incomplete"
                                      ? atBat.playResult
                                      : "At Bat"}
                                  </Badge>
                                </h3>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Pitch</TableHead>
                                  <TableHead>Result</TableHead>
                                  <TableHead>Pitch Type</TableHead>
                                  <TableHead>MPH</TableHead>
                                  <TableHead>NYY</TableHead>
                                  <TableHead>TOR</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {atBat.pitches.map((pitch, pitchIndex) => (
                                  <TableRow key={pitchIndex}>
                                    <TableCell>
                                      <span
                                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full mx-1 ${
                                          pitch.pitchResult === "ball"
                                            ? "bg-green-500 text-white"
                                            : pitch.pitchResult === "strike" ||
                                              pitch.pitchResult === "foul"
                                            ? "bg-red-500 text-white"
                                            : "bg-blue-500 text-white"
                                        }`}
                                      >
                                        {pitchIndex + 1}
                                      </span>
                                    </TableCell>
                                    <TableCell>{pitch.pitchResult}</TableCell>
                                    <TableCell>{pitch.pitchType}</TableCell>
                                    <TableCell>
                                      {pitch.pitchVelocity
                                        ? `${pitch.pitchVelocity} MPH`
                                        : "-"}
                                    </TableCell>
                                    <TableCell>
                                      <p>0</p>
                                    </TableCell>
                                    <TableCell>
                                      <p>0</p>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="scoringplays">Scoring Plays goes here</TabsContent>
      </Tabs>
    </>
  );
};

export default AllPlays;
