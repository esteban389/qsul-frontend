import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QueryRenderer from "@/components/QueryRenderer";
import { buttonVariants } from "@/components/ui/button";
import useCampuses from "@/app/(app)/seccionales/useCampuses";

export default function CampusSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const query = useCampuses();

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
          success: ({ data }) => <>{data?.map(campus => (<SelectItem key={campus.id} value={String(campus.id)}>{campus.name}</SelectItem>))}</>
        }} />
      </SelectContent>
    </Select>
  )
}