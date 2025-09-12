import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useSurveyVersions from "../../../historial-encuesta/useSurveyVersions";
import QueryRenderer from "@/components/QueryRenderer";
import { buttonVariants } from "@/components/ui/button";
import { Survey } from "@/types/survey";
import { useFiltersState } from "../../context/storage";
import { useEffect } from "react";

export default function SurveySelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const query = useSurveyVersions();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={buttonVariants({ variant: "outline", class: "justify-between w-full" })}>
        <SelectValue placeholder="Seleccionar Versión" />
      </SelectTrigger>
      <SelectContent>
        <QueryRenderer query={query} config={{
          pending: () => <SelectItem value="loading" disabled>Cargando...</SelectItem>,
          error: () => <SelectItem value="error" disabled>Error al cargar</SelectItem>,
          empty: () => <SelectItem value="empty" disabled>No hay versiones</SelectItem>,
          success: Content,
        }} />
      </SelectContent>
    </Select>
  )
}

function Content({ data }: { data: Survey[] }) {
  const { setDefaultState, getStateSlice } = useFiltersState();
  useEffect(() => {
    if (getStateSlice("survey") === data[0].id) return;
    setDefaultState(oldDef => ({ ...oldDef, survey: data[0].id, start_date: new Date(data[0].created_at) }))
  }, [])
  return (
    <>
      {data?.filter(survey => survey.version !== 0)
        .map(survey => (
          <SelectItem key={survey.id} value={String(survey.id)}>
            {survey.version}
          </SelectItem>
        ))}
    </>
  )
}