import QueryRenderer from "@/components/QueryRenderer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFiltersState } from "../context/storage";
import { formatDate } from "@/lib/utils";
import LoadingContent from "@/components/LoadingContent";
import useRanking from "./useRanking";
import { columns, RankingItem } from "./TableDefinition";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";

export default function Ranking() {
  const { getRequest, getStateSlice } = useFiltersState();
  const query = useRanking(getRequest());
  const [sorting, setSorting] = useState<SortingState>([]);

  return (
    <Card className="col-span-full">
      <CardHeader className="relative">
        <CardTitle>Ranking</CardTitle>
        <CardDescription>
          {formatDate(getStateSlice("start_date"), { year: "numeric", month: "long" })} -{" "}
          {formatDate(getStateSlice("end_date"), { year: "numeric", month: "long" })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <QueryRenderer
          query={query}
          config={{
            pending: () => (
              <div className="size-full flex justify-center items-center">
                <LoadingContent />
              </div>
            ),
            error: () => <div className="text-red-500">Error al cargar los datos</div>,
            success: ({ data }) => {
              const table = useReactTable({
                data,
                columns,
                getCoreRowModel: getCoreRowModel(),
                getSortedRowModel: getSortedRowModel(),
                state: {
                  sorting,
                },
                onSortingChange: setSorting,
              });

              return (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id} className="text-center">
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          ))}
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
                              <TableCell key={cell.id}>
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
                            className="h-24 text-center"
                          >
                            No hay datos disponibles
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              );
            },
            empty: () => <div className="text-gray-500">No hay datos disponibles</div>,
          }}
        />
      </CardContent>
    </Card>
  );
}