import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/modal';
import { Button, buttonVariants } from '@/components/ui/button';
import { Ban, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState, ChangeEvent, FormEvent } from 'react';
import { ObservationType } from '@/types/obserations';
import {
  ObservationDescriptionShchema,
  ObservationTypeSchema,
} from '@/Schemas/SurveySchema';
import { safeParse } from 'valibot';
import ErrorText from '@/components/ui/ErrorText';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import useCreateObservation from './useCreateObservation';
import useIgnoreAnswerRequest from './useIgnoreAnswerRequest';

export default function CreateObsrvationDialog({
  willIgnore = false,
}: {
  willIgnore?: boolean;
}) {
  const params = useParams<{ reporteId: string }>();
  const [visible, setVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ObservationType>(
    willIgnore ? 'negative' : 'positive',
  );
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const createMutattion = useCreateObservation({
    answer_id: parseInt(
      Array.isArray(params.reporteId) ? params.reporteId[0] : params.reporteId,
      10,
    ),
    description,
    type,
  });
  const ignoreAnswerMutation = useIgnoreAnswerRequest({
    answer_id: parseInt(
      Array.isArray(params.reporteId) ? params.reporteId[0] : params.reporteId,
      10,
    ),
    description,
    type,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const descriptionResult = safeParse(
      ObservationDescriptionShchema,
      description,
    );
    const typeResult = safeParse(ObservationTypeSchema, type);
    if (descriptionResult.success && typeResult.success) {
      const mutation = willIgnore ? ignoreAnswerMutation : createMutattion;
      toast.promise(mutation.mutateAsync(), {
        loading: 'Guardando observación...',
        success: () => {
          setVisible(false);
          setDescription('');
          return 'Observación guardada exitosamente';
        },
        error: 'Ocurrió un error al guardar la observación',
      });
      return;
    }
    setErrors({
      observation:
        descriptionResult.issues && descriptionResult.issues[0].message,
      type: typeResult.issues && typeResult.issues[0].message,
    });
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setDescription(value);
    const result = safeParse(ObservationDescriptionShchema, value);
    if (result.success) {
      setErrors({
        ...errors,
        observation: undefined,
      });
      return;
    }
    setErrors({
      ...errors,
      observation: result.issues[0].message,
    });
  };

  return (
    <Credenza open={visible} onOpenChange={setVisible}>
      {!willIgnore ? (
        <CredenzaTrigger asChild>
          <Button size="sm" className="gap-2">
            <Plus className="size-4" />
            Nueva Observación
          </Button>
        </CredenzaTrigger>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="gap-2">
              <Ban className="size-4" />
              Ignorar Evaluación
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ignorar Evaluación</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Está seguro que deseas ignorar esta evaluación?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className={buttonVariants({ variant: 'destructive' })}
                onClick={() => setVisible(true)}>
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <CredenzaContent>
        <CredenzaBody>
          <form onSubmit={handleSubmit}>
            <CredenzaHeader>
              <CredenzaTitle>
                {willIgnore ? 'Ignorar Resultado' : 'Crear Nueva Observación'}
              </CredenzaTitle>
              <CredenzaDescription>
                {willIgnore
                  ? 'Debes agregar una observación describiendo la razón por la cual se va a ignorar esta evaluación'
                  : 'Agregue una nueva observación a esta evaluación'}
              </CredenzaDescription>
            </CredenzaHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  name="type"
                  value={type}
                  onValueChange={(e: ObservationType) => setType(e)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="positive">Positiva</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="negative">Negativa</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.type && <ErrorText>{errors.type}</ErrorText>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  name="description"
                  value={description}
                  onChange={handleChangeDescription}
                  rows={4}
                  placeholder="Escriba su observación aquí..."
                />
                {errors.observation && (
                  <ErrorText>{errors.observation}</ErrorText>
                )}
              </div>
            </div>
            <CredenzaFooter>
              <Button type="submit" disabled={createMutattion.isPending || ignoreAnswerMutation.isPending}>Guardar Observación</Button>
            </CredenzaFooter>
          </form>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
