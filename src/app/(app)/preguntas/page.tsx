'use client';

import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  TouchSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  CheckSquare,
  ToggleLeft,
  Trash2,
  Plus,
  Edit2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuthorize } from '@/lib/authorizations';
import useIsMobile from '@/hooks/use-mobile';
import QueryRenderer from '@/components/QueryRenderer';
import { Question } from '@/types/question';
import type { Service } from '@/types/service';
import LoadingContent from '@/components/LoadingContent';
import { toast } from 'sonner';
import useSurvey from './useSurvey';
import ServiceSelect from '../servicios/ServiceSelect';
import useCreateServiceQuestion from './useCreateServiceQuestion';
import useDeleteServiceQuestion from './useDeleteServiceQuestion';
import useUpdateServiceQuestion from './useUpdateServiceQuestion';
import useCreateNewSurvey from './useCreateNewSurvey';
import RespondentTypesManager from './respondentTypeManager';
import useIsModified from '@/hooks/use-is-modified';

interface QuestionContentProps {
  question: Question;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

interface SortableQuestionItemProps {
  question: Question;
  onDelete: (id: number) => void;
  isDragging?: boolean;
  onEdit?: (id: Question) => void;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const questionVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const QuestionContent: React.FC<QuestionContentProps> = ({
  question,
  onDelete,
  onEdit,
  dragHandleProps,
}) => {
  const can = useAuthorize();

  const handleDeleteQuestion = (id: number) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div className="flex items-start gap-4">
      {can('update', 'survey') && (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        <div {...dragHandleProps} className="mt-1 cursor-grab" tabIndex={0}>
          <div className="flex flex-col gap-1">
            <div className="h-1 w-6 rounded bg-slate-300" />
            <div className="h-1 w-6 rounded bg-slate-300" />
            <div className="h-1 w-6 rounded bg-slate-300" />
          </div>
        </div>
      )}
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            {question.type === 'radio' ? (
              <CheckSquare size={20} className="text-slate-600" />
            ) : (
              <ToggleLeft size={20} className="text-slate-600" />
            )}
          </motion.div>
          <span className="text-sm font-medium text-slate-600">
            {question.type === 'radio' ? 'Opción múltiple' : 'Sí/No'}
          </span>
        </div>
        <p className="font-medium text-slate-800">{question.text}</p>
      </div>
      {can('update', 'survey') && can('delete', 'survey') && (
        <div className="flex flex-col md:flex-row md:gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(question.id)}
              className="text-blue-600 hover:bg-blue-50 hover:text-blue-700">
              <Edit2 size={16} />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={e => {
                e.stopPropagation();
                handleDeleteQuestion(question.id);
              }}
              className="text-red-600 hover:bg-red-50 hover:text-red-700">
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

interface EditQuestionDialogProps {
  open: boolean;
  onClose: () => void;
  question: Question;
  onSave: (updatedQuestion: Question) => void;
}

const EditQuestionDialog: React.FC<EditQuestionDialogProps> = ({
  open,
  onClose,
  question,
  onSave,
}) => {
  const [editedQuestion, setEditedQuestion] = useState<Question>(question);

  const handleSave = () => {
    onSave(editedQuestion);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Pregunta</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-question-text">Contenido</Label>
            <Input
              id="edit-question-text"
              value={editedQuestion.text}
              onChange={e =>
                setEditedQuestion({ ...editedQuestion, text: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-question-type">Tipo de pregunta</Label>
            <Select
              value={editedQuestion.type}
              onValueChange={(value: Question['type']) =>
                setEditedQuestion({
                  ...editedQuestion,
                  type: value,
                })
              }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="radio">Opción múltiple</SelectItem>
                <SelectItem value="yesno">Sí/No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
// Sortable Question Item Component
const SortableQuestionItem: React.FC<SortableQuestionItemProps> = ({
  question,
  onDelete,
  isDragging,
  onEdit,
}) => {
  const { listeners, setNodeRef, transform, transition } = useSortable({
    id: question.id,
  });

  const can = useAuthorize();
  const [isEditing, setIsEditing] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleSave = (updatedQuestion: Question) => {
    // Implement the save logic in the parent component
    if (onEdit) {
      onEdit(updatedQuestion);
    }
    setIsEditing(false);
  };

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        variants={questionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        className={`rounded-lg border bg-white p-4 ${question.service ? 'border-blue-200 bg-blue-50' : 'border-slate-200'
          } ${isDragging ? '!opacity-50' : ''}`}>
        <QuestionContent
          question={question}
          onDelete={onDelete}
          onEdit={handleEdit}
          dragHandleProps={can('create', 'survey') ? listeners : undefined}
        />
      </motion.div>
      <EditQuestionDialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        question={question}
        onSave={handleSave}
      />
    </>
  );
};

// Drag Overlay Component
const DragOverlayContent: React.FC<{ question: Question }> = ({ question }) => (
  <motion.div
    initial={{ scale: 1 }}
    animate={{ scale: 1.05 }}
    className={`rounded-lg border bg-white p-4 shadow-lg ${question.service ? 'border-blue-200 bg-blue-50' : 'border-slate-200'
      } cursor-grabbing`}>
    <QuestionContent question={question} />
  </motion.div>
);

function Loading() {
  return (
    <div className="flex size-full items-center justify-center">
      <LoadingContent />
    </div>
  );
}
function Error() {
  return <div>Error...</div>;
}
function Empty() {
  return <div>Empty...</div>;
}

function Success({
  data,
  questions,
  setQuestions,
}: {
  data: { questions: Question[] };
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}) {
  const isModified = useIsModified(questions, data.questions);
  const [activeId, setActiveId] = useState<number | null>(null);
  const deleteServiceQuestionMutation = useDeleteServiceQuestion();
  const [questionsService, setQuestionsService] = useState<Service | null>(
    null,
  );
  const updateServiceQuestionMutation = useUpdateServiceQuestion();
  const can = useAuthorize();
  const isMobile = useIsMobile();
  const sensors = useSensors(
    useSensor(isMobile ? TouchSensor : PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const serviceQuestions = questions.filter(q =>
    questionsService ? q.service_id === questionsService.id : null,
  );
  const generalQuestions = questions.filter(q => !q.service);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!active || !over || !can('create', 'survey')) return;

    const activeQuestion = questions.find(q => q.id === active.id);
    const overQuestion = questions.find(q => q.id === over.id);

    if (!!activeQuestion?.service !== !!overQuestion?.service) return;

    // Only allow reordering within the same category

    const oldIndex = questions.findIndex(q => q.id === active.id);
    const newIndex = questions.findIndex(q => q.id === over.id);
    if (activeQuestion?.service_id && oldIndex !== newIndex) {
      toast.promise(
        updateServiceQuestionMutation.mutateAsync({
          order: newIndex,
          question_id: activeQuestion.id,
        }),
        {
          loading: 'Actualizando pregunta...',
          success: 'Pregunta actualizada exitosamente',
          error: 'Error al actualizar la pregunta',
        },
      );
    }

    setQuestions(arrayMove(questions, oldIndex, newIndex));
  };
  const handleEditQuestion = (updatedQuestion: Question) => {
    setQuestions(
      questions.map(q => (q.id === updatedQuestion.id ? updatedQuestion : q)),
    );
    if (updatedQuestion.service_id) {
      toast.promise(
        updateServiceQuestionMutation.mutateAsync({
          question_id: updatedQuestion.id,
          text: updatedQuestion.text,
          type: updatedQuestion.type,
        }),
        {
          loading: 'Actualizando pregunta...',
          success: 'Pregunta actualizada exitosamente',
          error: 'Error al actualizar la pregunta',
        },
      );
    }
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
    if (questions.find(q => q.id === id)?.service_id) {
      toast.promise(deleteServiceQuestionMutation.mutateAsync({ id }), {
        loading: 'Eliminando pregunta...',
        success: 'Pregunta eliminada exitosamente',
        error: 'Error al eliminar la pregunta',
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <div className="space-y-8">
        {/* Service-specific questions */}
        <motion.div
          className="rounded-lg border border-blue-200 bg-blue-50 p-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}>
          <div className="mb-4 flex flex-col items-center justify-between md:flex-row">
            <h3 className="text-lg font-semibold text-blue-800">
              Preguntas del Servicio
            </h3>
            <ServiceSelect
              service={questionsService}
              setService={setQuestionsService}
            />
          </div>
          <SortableContext
            items={serviceQuestions.map(q => q.id)}
            strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              <AnimatePresence>
                {serviceQuestions.map(question => (
                  <SortableQuestionItem
                    key={question.id}
                    question={question}
                    isDragging={activeId === question.id}
                    onDelete={handleDeleteQuestion}
                    onEdit={handleEditQuestion}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </motion.div>

        {/* General questions */}
        <motion.div
          className="rounded-lg border border-slate-200 bg-white p-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}>
          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            Preguntas Generales
          </h3>
          <SortableContext
            items={generalQuestions.map(q => q.id)}
            strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              <AnimatePresence>
                {generalQuestions.map(question => (
                  <SortableQuestionItem
                    key={question.id}
                    question={question}
                    isDragging={activeId === question.id}
                    onDelete={id =>
                      setQuestions(questions.filter(q => q.id !== id))
                    }
                    onEdit={handleEditQuestion}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </motion.div>
      </div>

      <DragOverlay>
        {activeId ? (
          <DragOverlayContent
            question={questions.find(q => q.id === activeId)!}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

type RequiredQuestionFields = Pick<Question, 'text' | 'type' | 'order'>;
// Main App Component
function App() {
  const can = useAuthorize();
  const query = useSurvey();
  const [questions, setQuestions] = useState<Partial<Question>[]>([]);
  const [service, setService] = useState<Service | null>(null);

  const [newQuestion, setNewQuestion] = useState<
    Partial<Question> & RequiredQuestionFields
  >({
    text: '',
    type: 'radio',
    order: '0',
  });
  const createServiceQuestionMutation = useCreateServiceQuestion({
    text: newQuestion.text,
    type: newQuestion.type || 'radio',
    service_id: service?.id as number,
  });
  const createNewSurveyMutation = useCreateNewSurvey();

  const addQuestion = () => {
    if (!can('create', 'survey') || !newQuestion.text) return;
    const isServiceQuestion = !!service;
    const order = isServiceQuestion
      ? `A${questions.length}`
      : `B${questions.length}`;

    const question: Partial<Question> = {
      id: Math.random() - 100,
      text: newQuestion.text,
      type: newQuestion.type || 'radio',
      order,
      service,
      service_id: service?.id,
    };
    if (isServiceQuestion) {
      toast.promise(createServiceQuestionMutation.mutateAsync(), {
        loading: 'Creando pregunta...',
        success: 'Pregunta creada exitosamente',
        error: 'Error al crear la pregunta',
      });
      return;
    }
    setQuestions([...questions, question]);
    setNewQuestion({
      text: question.type || '',
      type: question.type || 'radio',
      order: question.order || '0',
      ...question,
    });
  };

  useEffect(() => {
    if (query.data) {
      setQuestions(query.data.questions);
    }
  }, [query.data]);

  const handleCreateNewSurvey = (keep_service_questions: boolean) => {
    const survey = {
      questions: questions
        .filter(q => !q.service_id)
        .map((q, index) => ({
          text: q.text,
          type: q.type,
          order: index + 1,
        })),
      keep_service_questions,
    };
    toast.promise(createNewSurveyMutation.mutateAsync({ request: survey }), {
      loading: 'Creando nueva versión de la encuesta...',
      success: 'Nueva versión de la encuesta creada exitosamente',
      error: 'Error al crear la nueva versión de la encuesta',
    });
  };
  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="rounded-lg bg-white p-6">
      <motion.div
        className="mb-6 flex flex-col items-center justify-between gap-2 md:flex-row"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}>
        <h1 className="text-2xl font-bold text-slate-800">
          Administrar Encuesta
        </h1>
        <div className="flex items-center gap-4">
          {can('create', 'survey') && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 transition-all hover:scale-105 hover:opacity-75">
                  <Save size={16} />
                  Guardar Versión
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nueva Versión</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <DialogDescription>
                    ¿Te gustaría conservar las preguntas asociadas a los
                    servicios
                  </DialogDescription>
                </div>
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => handleCreateNewSurvey(false)}>
                      No
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={() => handleCreateNewSurvey(true)}>
                      Sí
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </motion.div>

      {can('create', 'respondent-type') && <RespondentTypesManager />}
      {can('create', 'survey') && (
        <motion.div
          className="my-8 rounded-lg border border-slate-200 bg-slate-50 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}>
          <h2 className="mb-4 text-lg font-semibold">
            Agregar Una Nueva Pregunta
          </h2>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="question-text">Contenido</Label>
              <Input
                id="question-text"
                value={newQuestion.text}
                className="bg-background"
                onChange={e =>
                  setNewQuestion({ ...newQuestion, text: e.target.value })
                }
                placeholder="Ingrese el contenido de la pregunta"
              />
            </div>
            <div className="flex w-full flex-col gap-4 md:flex-row md:items-end">
              <div className="w-48">
                <Label>Tipo de Pregunta</Label>
                <Select
                  value={newQuestion.type}
                  onValueChange={(value: Question['type']) =>
                    setNewQuestion({ ...newQuestion, type: value })
                  }>
                  <SelectTrigger className="bg-background md:w-fit">
                    <SelectValue placeholder="Seleccion el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="radio">Opción Múltiple</SelectItem>
                    <SelectItem value="yesno">Sí/No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <Label>Servicio asociado</Label>
                <ServiceSelect service={service} setService={setService} />
              </div>
              <Button onClick={addQuestion}>
                <Plus size={16} className="mr-2" />
                Agregar Pregunta
              </Button>
            </div>
          </div>
        </motion.div>
      )}
      <QueryRenderer
        query={query}
        config={{
          pending: Loading,
          error: Error,
          empty: Empty,
          success: Success,
        }}
        successProps={{ questions, setQuestions }}
        key={query.data?.id}
      />
    </motion.main>
  );
}

export default App;
