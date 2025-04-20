import QueryRenderer from "@/components/QueryRenderer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFiltersState } from "../context/storage";
import { formatDate, getInitials } from "@/lib/utils";
import LoadingContent from "@/components/LoadingContent";
import useRanking from "./useRanking";
import { RankingResponse } from "@/types/chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function Ranking() {
  const { getRequest, getStateSlice } = useFiltersState();
  const query = useRanking(getRequest());

  return (
    <Card className="col-span-full">
      <CardHeader className="relative">
        <CardTitle>Ranking</CardTitle>
        <CardDescription>{formatDate(getStateSlice("start_date"), { year: "numeric", month: "long" })} - {formatDate(getStateSlice("end_date"), { year: "numeric", month: "long" })}</CardDescription>
      </CardHeader>
      <CardContent>
        <QueryRenderer query={query} config={{
          pending: () => <div className="size-full flex justify-center items-center"><LoadingContent /></div>,
          error: () => <div className="text-red-500">Error al cargar los datos</div>,
          success: RankingList,
          empty: () => <div className="text-gray-500">No hay datos disponibles</div>
        }} />
      </CardContent>
    </Card>
  );
}

function RankingList({ data }: { data: RankingResponse[] }) {
  return (
    <div className="flex flex-col divide-y divide-gray-200 rounded-md shadow-md overflow-hidden bg-white">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition"
        >
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 font-semibold w-6 text-center">
              {index + 1}.
            </span>
            <Avatar>
              <AvatarImage src={item.image} alt={item.name} />
              <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-gray-800">{item.name}</span>
          </div>
          <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
            {item.average_perception.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}