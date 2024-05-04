// components/RosterTable.tsx
"use client";

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
      cell: ({ row }) => (
        <Link href={`/players/${row.original.playerid}`}>
          <div className="flex items-center">
            {row.original.ProfilePic && (
              <Image
                src={row.original.ProfilePic}
                alt={row.original.FirstName}
                width={25}
                height={25}
                className="mr-2"
              />
            )}
            {row.original.FirstName} {row.original.LastName}
          </div>
        </Link>
      ),
    },
    {
      header: "Position",
      accessorKey: "primarypos",
    },
    {
      header: "Jersey #",
      accessorKey: "jerseynumber",
    },
    {
      header: "Grad Year",
      accessorKey: "GradYear",
    },
    {
      header: "Rank",
      cell: ({ row }) =>
        row.original.Rank && (
          <div className="flex items-center">
            <Image
              src="https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/CROSSCHECKET_ICON_1.png"
              alt=""
              width={25}
              height={25}
              className="mr-2"
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
    <table className="w-full">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="text-sm font-semibold p-2">
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="text-sm">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="text-sm p-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RosterTable;