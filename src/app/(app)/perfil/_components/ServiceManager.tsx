import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Service } from '@/types/service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ServiceManagerProps = {
  allServices: Service[];
  initialServices: Service[];
  onChange: (services: Service[]) => void;
};

export default function ServiceManager({ allServices, initialServices, onChange }: ServiceManagerProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [addId, setAddId] = useState<string>('');

  const handleRemove = (id: number) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    onChange(updated);
  };

  const handleAdd = () => {
    const toAdd = allServices.find(s => String(s.id) === addId);
    if (toAdd && !services.some(s => s.id === toAdd.id)) {
      const updated = [...services, toAdd];
      setServices(updated);
      onChange(updated);
      setAddId('');
    }
  };

  return (
    <div className="space-y-2">
      <Label>Servicios actuales</Label>
      <ScrollArea className="max-h-40 border rounded p-2">
        {services.length === 0 && <div className="text-muted-foreground italic">Sin servicios</div>}
        {services.map(service => (
          <div key={service.id} className="flex items-center justify-between py-1">
            <span>{service.name}</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleRemove(service.id)}
              aria-label="Eliminar servicio"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </ScrollArea>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Label htmlFor="add-service">Agregar servicio</Label>
          {/* Use Shadcn Select */}
          <Select value={addId} onValueChange={setAddId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un servicio" />
            </SelectTrigger>
            <SelectContent>
              {allServices.filter(s => !services.some(sel => sel.id === s.id)).map(service => (
                <SelectItem key={service.id} value={String(service.id)}>{service.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="secondary" onClick={handleAdd} disabled={!addId}>
          <Plus className="w-4 h-4 mr-1" /> Agregar
        </Button>
      </div>
    </div>
  )
}
