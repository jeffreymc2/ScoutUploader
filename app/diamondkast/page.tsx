// app/page.tsx
import React from 'react';
import BoxScore from '@/components/DKPlayComponents/BoxScore';
import { BoxScoreData } from '@/lib/types/types';
import AllPlays from '@/components/DKPlayComponents/AllPlays';
import { PlayData, BaseRunner, Pitch } from '@/lib/types/types';

const DKPlayer: React.FC = () => {
    const boxScoreData: BoxScoreData = {
        Team1: {
          name: 'NY Yankees',
          stats: {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0,
            '6': 2,
            '7': 0,
            '8': 1,
            '9': 4,
            'R': 6,
            'H': 1,
            'E': 0,
          },
        },
        Team2: {
          name: 'Toronto Blue Jays',
          stats: {
            '1': 1,
            '2': 2,
            '3': 0,
            '4': 2,
            '5': 0,
            '6': 0,
            '7': 0,
            '8': 0,
            '9': 5,
            'R': 8,
            'H': 0,
            'E': 0,
          },
        },
        // Add more teams here
      };

      const playData: PlayData[] = [
        {
          inning: 1,
          teamAtBat: 'NY Yankees',
          teamPitching: 'Toronto Blue Jays',
          pitcher: {
            playerId: 'Y. Kikuchi',
            team: 'Toronto Blue Jays',
          },
          atBats: [
            {
              batter: {
                playerId: 'Stanton',
                handedness: 'right',
                playerNumber: '27',
              },
              pitches: [
                { pitchNumber: 1, pitchResult: 'foul', pitchType: 'Four-seam FB', pitchVelocity: 95 },
                { pitchNumber: 2, pitchResult: 'strike', pitchType: 'Curve ball', pitchVelocity: 86 },
                { pitchNumber: 3, pitchResult: 'hit', pitchType: 'Four-seam FB', pitchVelocity: 96 },
              ],
              playResult: 'single',
              playDescription: 'Stanton singled to left.',
              baseRunners: [
                {
                  playerId: 'Stanton',
                  basePosition: 'first',
                },
              ],
            },
            {
                batter: {
                  playerId: 'Volpe',
                  handedness: 'right',
                  playerNumber: '10',
                },
                pitches: [
                    { pitchNumber: 1, pitchResult: 'strike', pitchType: 'Four-seam FB', pitchVelocity: 95 },

                  { pitchNumber: 2, pitchResult: 'foul', pitchType: 'Four-seam FB', pitchVelocity: 95 },
                  { pitchNumber: 3, pitchResult: 'strike', pitchType: 'Curve ball', pitchVelocity: 86 },
                ],
                playResult: 'out',
                playDescription: 'Volpe struck out swinging.',
                baseRunners: [
                  {
                    playerId: 'Volpe',
                    basePosition: 'first',
                  },
                ],
              },
            {
              batter: {
                playerId: 'Judge',
                handedness: 'right',
                playerNumber: '99',
              },
              pitches: [],
              playResult: 'incomplete',
              playDescription: '',
              baseRunners: [
                {
                  playerId: 'Stanton',
                  basePosition: 'first',
                },
              ],
            },
            // Add more at-bats here
          ],
        },
        // Add more innings here
      ];

    return (
        <div>
            <BoxScore boxScoreData={boxScoreData} />
            <AllPlays data={playData as PlayData[]} />
        </div>
    );
};

export default DKPlayer;