'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PlayerStats = {
  GP: number;
  PA: number;
  AB: number;
  AVG: number;
  B1: number;
  B2: number;
  B3: number;
  HR: number;
  RBI: number;
  BB: number;
  R: number;
  SB: number;
  OBP: number;
  OPS: number;
};

type PitchingStats = {
  WON: number;
  ERA: number;
  IP: number;
  HITS: number;
  K: number;
  BB: number;
  ER: number;
  WHIP: number;
};

function calculatePlayerStatsSummary(gameBattingStats: any[]): PlayerStats {
  const initialStats: PlayerStats = {
    GP: 0,
    PA: 0,
    AB: 0,
    AVG: 0,
    B1: 0,
    B2: 0,
    B3: 0,
    HR: 0,
    RBI: 0,
    BB: 0,
    R: 0,
    SB: 0,
    OBP: 0,
    OPS: 0,
  };

  const totalStats = gameBattingStats.reduce((acc, stats) => {
    acc.GP += stats.GP;
    acc.PA += stats.PA;
    acc.AB += stats.AB;
    acc.B1 += stats.B1;
    acc.B2 += stats.B2;
    acc.B3 += stats.B3;
    acc.HR += stats.HR;
    acc.RBI += stats.RBI;
    acc.BB += stats.BB;
    acc.R += stats.R;
    acc.SB += stats.SB;
    return acc;
  }, initialStats);

  totalStats.AVG = totalStats.AB > 0 ? (totalStats.B1 + totalStats.B2 + totalStats.B3) / totalStats.AB : 0;
  totalStats.OBP = totalStats.PA > 0 ? (totalStats.B1 + totalStats.B2 + totalStats.B3 + totalStats.BB) / totalStats.PA : 0;
  totalStats.OPS = totalStats.OBP + (totalStats.B1 + 2 * totalStats.B2 + 3 * totalStats.B3 + 4 * totalStats.HR) / totalStats.AB;

  return totalStats;
}

function calculatePitchingStatsSummary(gamePitchingStats: any[]): PitchingStats {
  const initialStats: PitchingStats = {
    WON: 0,
    ERA: 0,
    IP: 0,
    HITS: 0,
    K: 0,
    BB: 0,
    ER: 0,
    WHIP: 0,
  };

  const totalStats = gamePitchingStats.reduce((acc, stats) => {
    acc.WON += stats.WON;
    acc.IP += stats.IP;
    acc.HITS += stats.HITS;
    acc.K += stats.K;
    acc.BB += stats.BB;
    acc.ER += stats.ER;
    return acc;
  }, initialStats);

  totalStats.ERA = totalStats.IP > 0 ? (totalStats.ER * 9) / totalStats.IP : 0;
  totalStats.WHIP = totalStats.IP > 0 ? (totalStats.BB + totalStats.HITS) / totalStats.IP : 0;

  return totalStats;
}

function BattingStatsTab({ playerStats }: { playerStats: PlayerStats | null }) {
  if (!playerStats) {
    return <div>No batting stats available.</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium">GP</span>
        <span className="text-lg font-semibold">{playerStats.GP}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">PA</span>
        <span className="text-lg font-semibold">{playerStats.PA}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">At Bats</span>
        <span className="text-lg font-semibold">{playerStats.AB}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">BA</span>
        <span className="text-lg font-semibold">{playerStats.AVG.toFixed(3)}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">Singles</span>
        <span className="text-lg font-semibold">{playerStats.B1}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">Doubles</span>
        <span className="text-lg font-semibold">{playerStats.B2}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">Triples</span>
        <span className="text-lg font-semibold">{playerStats.B3}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">HRs</span>
        <span className="text-lg font-semibold">{playerStats.HR}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">RBIs</span>
        <span className="text-lg font-semibold">{playerStats.RBI}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">Walks</span>
        <span className="text-lg font-semibold">{playerStats.BB}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">Runs Scored</span>
        <span className="text-lg font-semibold">{playerStats.R}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">Stolen Bases</span>
        <span className="text-lg font-semibold">{playerStats.SB}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">OBP</span>
        <span className="text-lg font-semibold">{playerStats.OBP.toFixed(3)}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">OPS</span>
        <span className="text-lg font-semibold">{playerStats.OPS.toFixed(3)}</span>
      </div>
    </div>
  );
}

function PitchingStatsTab({ pitchingStats }: { pitchingStats: PitchingStats | null }) {
  if (!pitchingStats) {
    return <div>No pitching stats available.</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium">Wins</span>
        <span className="text-lg font-semibold">{pitchingStats.WON}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">ERA</span>
        <span className="text-lg font-semibold">{pitchingStats.ERA.toFixed(2)}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">IP</span>
        <span className="text-lg font-semibold">{pitchingStats.IP.toFixed(1)}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">Hits</span>
        <span className="text-lg font-semibold">{pitchingStats.HITS}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">Ks</span>
        <span className="text-lg font-semibold">{pitchingStats.K}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">Walks</span>
        <span className="text-lg font-semibold">{pitchingStats.BB}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">ER</span>
        <span className="text-lg font-semibold">{pitchingStats.ER}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">WHIP</span>
        <span className="text-lg font-semibold">{pitchingStats.WHIP.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default function PlayerStatsSummary({ playerId }: { playerId: string }) {
  const [playerBattingStats, setPlayerBattingStats] = useState<PlayerStats | null>(null);
  const [playerPitchingStats, setPlayerPitchingStats] = useState<PitchingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const response = await fetch(`/api/playerstats?playerID=${encodeURIComponent(playerId)}`);

        if (!response.ok) {
          throw new Error('Failed to fetch player stats');
        }

        const data = await response.json();
        const calculatedBattingStats = calculatePlayerStatsSummary(data.GameBattingStats);
        setPlayerBattingStats(calculatedBattingStats);

        if (data.GamePitchingStats) {
          const calculatedPitchingStats = calculatePitchingStatsSummary(data.GamePitchingStats);
          setPlayerPitchingStats(calculatedPitchingStats);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching player stats:', error);
        setError('Failed to load player stats. Please try again later.');
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, [playerId]);

  if (loading) {
    return <div>Loading player stats...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Card className="w-full max-w-3xl">
      
      <CardContent className='min-h-96'>
        <Tabs defaultValue="batting" className="w-full mt-2">
          <TabsList>
            <TabsTrigger value="batting">Batting</TabsTrigger>
            {playerPitchingStats && <TabsTrigger value="pitching">Pitching</TabsTrigger>}
          </TabsList>
          <TabsContent value="batting" className="p-4">
            <BattingStatsTab playerStats={playerBattingStats} />
          </TabsContent>
          {playerPitchingStats && (
            <TabsContent value="pitching" className="p-4">
              <PitchingStatsTab pitchingStats={playerPitchingStats} />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}