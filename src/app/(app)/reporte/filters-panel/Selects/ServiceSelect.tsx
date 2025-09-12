import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QueryRenderer from "@/components/QueryRenderer";
import { buttonVariants } from "@/components/ui/button";
import useServices from "@/app/(app)/servicios/useServices";
import { useFiltersState } from "../../context/storage";

export default function ServiceSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { getStateSlice } = useFiltersState();

  const query = useServices({ process_id: getStateSlice('process') });

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={buttonVariants({ variant: "outline", class: "justify-between w-full" })}>
        <SelectValue placeholder="Seleccionar Seccional" />
      </SelectTrigger>
      <SelectContent>
        <QueryRenderer query={query} config={{
          pending: () => <SelectItem value="loading" disabled>Cargando...</SelectItem>,
          error: () => <SelectItem value="error" disabled>Error al cargar</SelectItem>,
          empty: () => <SelectItem value="empty" disabled>No hay versiones</SelectItem>,
          success: ({ data }) => <>{data?.map(service => (<SelectItem key={service.id} value={String(service.id)}>{service.name}</SelectItem>))}</>
        }} />
      </SelectContent>
    </Select>
  )
}