"use client"
import Distribution from "./distribution";
import Filters from "./filters-panel";
import Perception from "./perception";
import PerceptionGroupQuestion from "./perception-group-question";
import PerceptionGroupTrend from "./perception-group-trend";
import PerceptionTrend from "./perception-trend";
import Ranking from "./ranking";
import RespondentTypeVolume from "./respondent-volume";
import Volume from "./volume";
import VolumeTrend from "./volume-trend";

export default function Reporte() {
  return (
    <main className="mx-4 flex h-full flex-col items-center space-y-6 py-8 w-full">
      <h1 className="w-full text-center text-3xl font-bold">Reporte General</h1>
      <Filters />
      <p className="text-sm text-gray-500 italic mt-2">
        *Percepción general: es el promedio total obtenido a partir de los promedios individuales de cada encuesta respondida.
      </p>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <PerceptionTrend />
        <PerceptionGroupTrend />
        <Perception />
        <Volume />
        <VolumeTrend />
        <RespondentTypeVolume />
        <Distribution />
        <PerceptionGroupQuestion />
        <Ranking />
      </div>
    </main>
  );
}