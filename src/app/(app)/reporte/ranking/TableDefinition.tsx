import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export type RankingItem = {
  id: number;
  name: string;
  image: string | null;
  average_perception: number;
  answer_count: number;
};

export const columns: ColumnDef<RankingItem>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={row.original.image || undefined} />
          <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
        </Avatar>
        <span>{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "average_perception",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Promedio
          <ArrowDown
            className={cn(
              "ml-2 h-4 w-4 transition-transform",
              column.getIsSorted() === "desc" && "rotate-180"
            )}
          />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.original.average_perception.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "answer_count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Respuestas
          <ArrowDown
            className={cn(
              "ml-2 h-4 w-4 transition-transform",
              column.getIsSorted() === "desc" && "rotate-180"
            )}
          />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.original.answer_count}
      </div>
    ),
  },
]; 