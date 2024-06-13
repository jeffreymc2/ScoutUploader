"use client";
import React from "react";
import { useState, useEffect } from "react";
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

export function GameStatsTable({ playerId }: { playerId: string }) {
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
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="max-h-screen overflow-auto">
              <Dialog.Content className="bg-white p-6 rounded-lg shadow-lg max-w-7xl mx-auto my-8 sm:my-16">
                <div className="flex justify-end">
                  <Dialog.Close asChild>
                    <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                      <span className="sr-only">Close</span>
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </Dialog.Close>
                </div>
                <Table>
                  <TableCaption>Game Stats</TableCaption>
                  <TableHeader className="bg-blue-500 text-white font-bold hover:bg-blue-500">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead
                              key={header.id}
                              className="text-white sticky top-0 hover:bg-blue-500"
                            >
                              {header.isPlaceholder ? null : (
                                <div
                                  className="cursor-pointer select-none flex items-center hover:bg-blue-500 p-2"
                                  onClick={header.column.getToggleSortingHandler()}
                                >
                                  <span>
                                    {flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                  </span>
                                  <span className="ml-1">
                                    {{
                                      asc: "▲",
                                      desc: "▼",
                                    }[header.column.getIsSorted() as string] ??
                                      null}
                                  </span>
                                </div>
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
                            <TableCell
                              key={cell.id}
                              className="h-6 py-2 text-xs"
                            >
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
