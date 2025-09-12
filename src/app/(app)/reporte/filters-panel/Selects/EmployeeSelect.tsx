import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QueryRenderer from "@/components/QueryRenderer";
import { buttonVariants } from "@/components/ui/button";
import { useFiltersState } from "../../context/storage";
import useEmployees from "@/app/(app)/empleados/useEmployees";

export default function EmployeeSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { getStateSlice } = useFiltersState();

  const query = useEmployees({ campus_id: getStateSlice('campus') });

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
          success: ({ data }) => <>{data?.map(employee => (<SelectItem key={employee.id} value={String(employee.id)}>{employee.name}</SelectItem>))}</>
        }} />
      </SelectContent>
    </Select>
  )
}