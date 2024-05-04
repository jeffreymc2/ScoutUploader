// components/RosterTable.tsx
"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Player } from "@/lib/types/types";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

interface RosterTableProps {
  roster: Player[];
}

const RosterTable: React.FC<RosterTableProps> = ({ roster }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns: ColumnDef<Player>[] = [
    {
      header: "Name",
      accessorKey: "FullName",
      cell: ({ row }) => (
        <Link href={`/players/${row.original.playerid}`}>
          <div className="flex items-center">
            {row.original.ProfilePic && (
              <Image
                src={row.original.ProfilePic}
                alt={row.original.FirstName}
                width={25}
                height={25}
                className="mr-2 rounded-full"
              />
            )}
            {row.original.FirstName} {row.original.LastName}
          </div>
        </Link>
      ),
    },
    {
      header: "Pos.",
      accessorKey: "primarypos",
    },
    {
      header: "#",
      accessorKey: "jerseynumber",
      size: 50,
    },
    {
      header: "G. Yr.",
      accessorKey: "GradYear",
      size: 50
    },
    {
      header: "Rank",
      accessorKey: "Rank",
      cell: ({ row }) =>
        row.original.Rank && (
          <div className="flex items-center">
            <Image
              src="https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/CROSSCHECKET_ICON_1.png"
              alt=""
              width={20}
              height={20}
              className="mr-1"
            />
            <span>{row.original.Rank}</span>
          </div>
        ),
    },
  ];

  const table = useReactTable({
    data: roster,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border overflow-x-auto mt-4">
    <div className="flex w-max space-x-0 p-0 overflow-x-auto">
      <table className="w-full ">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="text-left">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-2 py-2 text-xs font-semibold text-gray-700 uppercase cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' ▲',
                      desc: ' ▼',
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="even:bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-2 py-2 text-xs">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default RosterTable;