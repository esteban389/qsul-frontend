import { useState } from "react";
import { Calendar, CalendarProps } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useControllableState } from "@/hooks/use-controllable-state";
import { es } from "date-fns/locale"

type DatePickerProps = {
  value?: Date | undefined;
  onValueChange?: (date: Date) => void;
};

export default function DatePicker({ value, onValueChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useControllableState({
    prop: value,
    defaultProp: new Date(),
    onChange: (date) => {
      setOpen(false);
      if (onValueChange) {
        onValueChange(date);
      }
    },
  })

  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button
        variant={"outline"}
        className={cn(
          "w-full font-normal",
          date && "text-muted-foreground"
        )}
      >
        {date ? (
          `${format(date, "PPP", { locale: es })}`
        ) : (
          <span>Elige una fecha</span>
        )}
        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        captionLayout="dropdown"
        selected={date}
        onSelect={(date) => {
          setDate(date);
        }}
        locale={es}
        onDayClick={() => setOpen(false)}
        startMonth={new Date(2025, 0)}
        endMonth={new Date()}
      />
    </PopoverContent>
  </Popover>
}