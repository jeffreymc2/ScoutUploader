'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
    return <div className="text-center">No batting stats available.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 ">
          <tr>
            <th scope="col" className="px-4 py-2">GP</th>
            <th scope="col" className="px-4 py-2">PA</th>
            <th scope="col" className="px-4 py-2">AB</th>
            <th scope="col" className="px-4 py-2">BA</th>
            <th scope="col" className="px-4 py-2">H</th>
            <th scope="col" className="px-4 py-2">1B</th>
            <th scope="col" className="px-4 py-2">2B</th>
            <th scope="col" className="px-4 py-2">3B</th>
            <th scope="col" className="px-4 py-2">HR</th>
            <th scope="col" className="px-4 py-2">RBI</th>
            <th scope="col" className="px-4 py-2">BB</th>
            <th scope="col" className="px-4 py-2">R</th>
            <th scope="col" className="px-4 py-2">SB</th>
            <th scope="col" className="px-4 py-2">OBP</th>
            <th scope="col" className="px-4 py-2">OPS</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white border-b ">
            <td className="px-4 py-2">{playerStats.GP}</td>
            <td className="px-4 py-2">{playerStats.PA}</td>
            <td className="px-4 py-2">{playerStats.AB}</td>
            <td className="px-4 py-2">{playerStats.AVG.toFixed(3)}</td>
            <td className="px-4 py-2">{playerStats.B1 + playerStats.B2 + playerStats.B3 + playerStats.HR}</td>
            <td className="px-4 py-2">{playerStats.B1}</td>
            <td className="px-4 py-2">{playerStats.B2}</td>
            <td className="px-4 py-2">{playerStats.B3}</td>
            <td className="px-4 py-2">{playerStats.HR}</td>
            <td className="px-4 py-2">{playerStats.RBI}</td>
            <td className="px-4 py-2">{playerStats.BB}</td>
            <td className="px-4 py-2">{playerStats.R}</td>
            <td className="px-4 py-2">{playerStats.SB}</td>
            <td className="px-4 py-2">{playerStats.OBP.toFixed(3)}</td>
            <td className="px-4 py-2">{playerStats.OPS.toFixed(3)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PitchingStatsTab({ pitchingStats }: { pitchingStats: PitchingStats | null }) {
  if (!pitchingStats) {
    return <div className="text-center">No pitching stats available.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 ">
          <tr>
            <th scope="col" className="px-4 py-2">W</th>
            <th scope="col" className="px-4 py-2">ERA</th>
            <th scope="col" className="px-4 py-2">IP</th>
            <th scope="col" className="px-4 py-2">H</th>
            <th scope="col" className="px-4 py-2">K</th>
            <th scope="col" className="px-4 py-2">BB</th>
            <th scope="col" className="px-4 py-2">ER</th>
            <th scope="col" className="px-4 py-2">WHIP</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white border-b ">
            <td className="px-4 py-2">{pitchingStats.WON}</td>
            <td className="px-4 py-2">{pitchingStats.ERA.toFixed(2)}</td>
            <td className="px-4 py-2">{pitchingStats.IP.toFixed(1)}</td>
            <td className="px-4 py-2">{pitchingStats.HITS}</td>
            <td className="px-4 py-2">{pitchingStats.K}</td>
            <td className="px-4 py-2">{pitchingStats.BB}</td>
            <td className="px-4 py-2">{pitchingStats.ER}</td>
            <td className="px-4 py-2">{pitchingStats.WHIP.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
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
    return <div className="text-center">Loading player stats...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-auto m-4">
    <Card className="w-auto">
      <CardContent className='p-0'>
        <Tabs defaultValue="batting" className="w-auto p-0">
          <TabsList className="flex justify-center">
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
    </div>
  );
}