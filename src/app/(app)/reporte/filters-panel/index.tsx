import DatePicker from "@/components/ui/date-picker";
import "./styles.css"
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Info, FunnelX } from "lucide-react";
import SurveySelect from "./Selects/SurveySelect";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useFiltersState } from "../context/storage";
import { categories } from "../context/category";
import CampusSelect from "./Selects/CampusSelect";
import { Button, buttonVariants } from "@/components/ui/button";
import ProcessSelect from "./Selects/ProcessSelect";
import ServiceSelect from "./Selects/ServiceSelect";
import EmployeeSelect from "./Selects/EmployeeSelect";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function Filters() {
  const actions = useFiltersState();
  const state = actions.getState();
  const filterStep = state.step;
  return (
    <Tooltip>
      <div className="bg-background rounded-lg shadow-md flex flex-col md:flex-row w-full">
        <div className="bg-sidebar flex-[25%] p-6 border-r">
          <div className="space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Rango de fechas
              </h3>
              <div className="space-y-2">
                <div>
                  <Label>Fecha de incio</Label>
                  <DatePicker value={state.start_date} onValueChange={(value: Date) => actions.applyFilter('start_date', value)} />
                </div>
                <div>
                  <Label>Fecha final</Label>
                  <DatePicker value={state.end_date} onValueChange={(value: Date) => actions.applyFilter('end_date', value)} />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-medium text-gray-900 mb-3">Periodo de tiempo</h3>
              <Select value={state.time_frame} onValueChange={(value: string) => actions.applyFilter('time_frame', value as 'year' | 'month')}>
                <SelectTrigger className={buttonVariants({ variant: "outline", class: "justify-between w-full" })}>
                  <SelectValue placeholder="Seleccionar periodo de tiempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Mensual</SelectItem>
                  <SelectItem value="year">Anual</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="font-medium text-gray-900 mb-3">Version de la Encuesta</h3>
              <SurveySelect value={String(state.survey)} onChange={(value: string) => actions.applyFilter('survey', Number(value))} />
            </motion.div>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <div
                  className="bg-blue-50 p-4 rounded-lg cursor-help"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Categoría Actual</span>
                    <Info className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-lg font-semibold text-blue-700 capitalize mt-1">
                    {categories[state.category]}
                  </p>
                </div>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent className="bg-blue-600 text-white font-bold">
              La categoría actual representa cómo se agrupan los resultados del gráfico, de acuerdo con los filtros aplicados.
            </TooltipContent>
          </div>
        </div>
        <motion.div className="bg-background flex-[75%] p-6 space-y-6">
          <motion.div
            className="relative flex items-start group gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className={`${filterStep > 1 && "step-line"} flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 bg-blue-50 after:w-1 after:bg-blue-500 after:absolute after:top-7`}>
              <span className="text-blue-600 text-sm font-medium">1</span>
            </div>
            <div className="flex-1">
              <Label className="block text-sm font-medium mb-2">Seccional</Label>
              <CampusSelect value={String(state.campus)} onChange={(value: string) => actions.selectCampus(Number(value))} />
            </div>
          </motion.div>
          <AnimatePresence>
            {filterStep > 1 && (
              <motion.div
                className="relative flex items-start group gap-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className={`${filterStep > 2 && "step-line"} flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 bg-blue-50 after:w-1 after:bg-blue-500 after:absolute after:top-7`}>
                  <span className="text-blue-600 text-sm font-medium">2</span>
                </div>
                <div className="flex-1">
                  <Label className="block text-sm font-medium mb-2">Proceso</Label>
                  <ProcessSelect value={String(state.process)} onChange={newProcess => actions.selectProcess(Number(newProcess))} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {filterStep > 2 && (
              <motion.div
                className="relative flex items-start group gap-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className={`${filterStep > 3 && "step-line"} flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 bg-blue-50 after:w-1 after:bg-blue-500 after:absolute after:top-7`}>
                  <span className="text-blue-600 text-sm font-medium">3</span>
                </div>
                <div className="flex-1">
                  <Label className="block text-sm font-medium mb-2">Servicio</Label>
                  <ServiceSelect value={String(state.service)} onChange={newService => actions.selectService(Number(newService))} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {filterStep > 3 && (
              <motion.div
                className="relative flex items-start group gap-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 bg-blue-50 after:w-1 after:bg-blue-500 after:absolute after:top-7">
                  <span className="text-blue-600 text-sm font-medium">4</span>
                </div>
                <div className="flex-1">
                  <Label className="block text-sm font-medium mb-2">Empleado</Label>
                  <EmployeeSelect value={String(state.employee)} onChange={newEmployee => actions.selectEmployee(Number(newEmployee))} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <Button size="sm" variant="outline" className="absolute right-4 top-4 flex items-center gap-2 z-50" onClick={() => actions.clearFilters()}>
        <FunnelX />
      </Button>
    </Tooltip>
  );
}