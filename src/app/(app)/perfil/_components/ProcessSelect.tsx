import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QueryRenderer from "@/components/QueryRenderer";
import { buttonVariants } from "@/components/ui/button";
import useProcesses from "@/app/(app)/procesos/useProcesses";

export default function ProcessSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const query = useProcesses();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={buttonVariants({ variant: "outline", class: "justify-between w-full" })}>
        <SelectValue placeholder="Seleccionar Proceso" /> 
      </SelectTrigger>
      <SelectContent>
        <QueryRenderer query={query} config={{
          pending: () => <SelectItem value="loading" disabled>Cargando...</SelectItem>,
          error: () => <SelectItem value="error" disabled>Error al cargar</SelectItem>,
          empty: () => <SelectItem value="empty" disabled>No hay versiones</SelectItem>,
          success: ({ data }) => <>{data?.map(process => (<SelectItem key={process.id} value={String(process.id)}>{process.name}</SelectItem>))}</>
        }} />
      </SelectContent>
    </Select>
  )
}