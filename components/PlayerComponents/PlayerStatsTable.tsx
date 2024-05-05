"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

type GameStats = {
  GameID: number;
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
  Opponent: string;
  HideBattingStats: boolean;
};

const columns: ColumnDef<GameStats>[] = [
  {
    accessorKey: "Opponent",
    header: "Opponent",
    size: 100,
  },
  {
    accessorKey: "GP",
    header: "GP",
  },
  {
    accessorKey: "PA",
    header: "PA",
  },
  {
    accessorKey: "AB",
    header: "AB",
  },
  {
    accessorKey: "AVG",
    header: "AVG",
    cell: ({ row }) => row.original.AVG.toFixed(3),
  },
  {
    accessorKey: "B1",
    header: "1B",
  },
  {
    accessorKey: "B2",
    header: "2B",
  },
  {
    accessorKey: "B3",
    header: "3B",
  },
  {
    accessorKey: "HR",
    header: "HR",
  },
  {
    accessorKey: "RBI",
    header: "RBI",
  },
  {
    accessorKey: "BB",
    header: "BB",
  },
  {
    accessorKey: "R",
    header: "R",
  },
  {
    accessorKey: "SB",
    header: "SB",
  },
  {
    accessorKey: "OBP",
    header: "OBP",
    cell: ({ row }) => row.original.OBP.toFixed(3),
  },
  {
    accessorKey: "OPS",
    header: "OPS",
    cell: ({ row }) => row.original.OPS.toFixed(3),
  },
];

export  function GameStatsTable({ playerId }: { playerId: string }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [gameStats, setGameStats] = useState<GameStats[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchGameStats = async () => {
      try {
        const response = await fetch(
          `/api/playerstats?playerID=${encodeURIComponent(playerId)}`
        );
        const data = await response.json();
        setGameStats(data.GameBattingStats);
      } catch (error) {
        console.error("Error fetching game stats:", error);
      }
    };

    fetchGameStats();
  }, [playerId]);

  const table = useReactTable({
    data: gameStats,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
    
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="outline">View Game Stats</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay">
          <div className="inset-0 bg-black bg-opacity-90" >
          <Dialog.Content className="sm:max-w-[1250px] bg-white min-h-[900px]">
            <Table>
              <TableCaption>Game Stats</TableCaption>
              <TableHeader className="bg-blue-500 text-white font-bold">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="text-white sticky top-0">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="h-6 py-2 text-xs">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-12 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Dialog.Content>
          </div>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
    </>

  );
}
