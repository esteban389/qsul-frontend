import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import ErrorText from "@/components/ui/ErrorText";
import { Label } from "@/components/ui/label";
import { Credenza, CredenzaBody, CredenzaContent, CredenzaDescription, CredenzaFooter, CredenzaHeader, CredenzaTitle } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { ObservationDescriptionShchema } from "@/Schemas/SurveySchema";
import { Answer } from "@/types/answer";
import { Ban } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";
import { safeParse } from "valibot";
import useSolveAnswer from "./useSolveAnswer";

export default function SolveButton({ answer }: { answer: Answer }) {
    const [visible, setVisible] = useState(false);
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});

    const solveMutation = useSolveAnswer({
        answer_id: answer.id,
        description,
        type: 'neutral',
    })

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = safeParse(ObservationDescriptionShchema, description);
        if (!result.success) {
            setErrors({
                ...errors,
                observation: result.issues[0].message,
            });
            return;
        }
        setErrors({});
        toast.promise(solveMutation.mutateAsync(), {
            loading: 'Guardando observación...',
            success: () => {
                setVisible(false);
                setDescription('');
                return 'Observación guardada exitosamente';
            },
            error: 'Ocurrió un error al guardar la observación',
        });
    }

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
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="default" className="gap-2">
                        <Ban className="size-4" />
                        Cerrar Evaluación
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cerrar Evaluación</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Está seguro que deseas dar por solucionada esta evaluación?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className={buttonVariants({ variant: 'default' })}
                            onClick={() => setVisible(true)}>
                            Continuar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <CredenzaContent>
                <CredenzaBody>
                    <form onSubmit={handleSubmit}>
                        <CredenzaHeader>
                            <CredenzaTitle>
                                Crear Nueva Observación
                            </CredenzaTitle>
                            <CredenzaDescription>
                                Debes agregar una observación describiendo la razón por la cual se va a dar por resuelta esta evaluación
                            </CredenzaDescription>
                        </CredenzaHeader>
                        <div className="grid gap-4 py-4">
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
                            <Button type="submit" disabled={solveMutation.isPending}>Guardar Observación</Button>
                        </CredenzaFooter>
                    </form>
                </CredenzaBody>
            </CredenzaContent>
        </Credenza>
    )
}