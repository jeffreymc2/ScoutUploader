import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BoxScoreData, BoxScoreTeam } from '@/lib/types/types';

interface BoxScoreProps {
  boxScoreData: BoxScoreData;
}

const BoxScore: React.FC<BoxScoreProps> = ({ boxScoreData }) => {
  const teams = Object.values(boxScoreData);
  const statsKeys = Object.keys(teams[0]?.stats || {});

  return (
    <Card>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableCaption>Box Score</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              {statsKeys.map((key) => (
                <TableHead key={key}>{key}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team, index) => (
              <TableRow key={index}>
                <TableCell>{team.name}</TableCell>
                {statsKeys.map((key) => (
                  <TableCell key={`${index}-${key}`}>{team.stats[key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BoxScore;