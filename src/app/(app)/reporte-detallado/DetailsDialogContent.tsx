import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate } from '@/lib/utils';
import { Answer, AnswerQuestions } from '@/types/answer';
import { Role } from '@/types/user';
import { DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Clock,
  User,
  AlertCircle,
  Mail,
  ChevronRight,
  BriefcaseBusiness,
  Package,
} from 'lucide-react';
import React from 'react';
import useAuth from '@/hooks/useAuth';
import env from '@/lib/env';
import QueryRenderer from '@/components/QueryRenderer';
import LoadingContent from '@/components/LoadingContent';
import useAnswerDetails from './useAnswerDetails';

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 text-black">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

export default function DetailsDialogContent({
  active,
  setActive,
}: {
  active: Answer;
  setActive: (a: Answer | null) => void;
}) {
  const { user } = useAuth({ middleware: 'auth' });
  const detailsQuery = useAnswerDetails(active.id);
  return (
    <motion.div
      layout
      layoutId={`row-${active.id}`}
      className="grid overflow-hidden">
      <motion.button
        key={`button-${active.id}`}
        layout
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
          transition: {
            duration: 0.05,
          },
        }}
        className="absolute right-2 top-2 z-[60] flex size-6 items-center justify-center rounded-full bg-white lg:hidden"
        onClick={() => setActive(null)}>
        <CloseIcon />
      </motion.button>
      <motion.div layoutId={`avatar-${active.id}`}>
        <img
          width={200}
          height={200}
          src={env('API_URL') + active.employee_service.employee.avatar}
          alt={active.employee_service.employee.name}
          className="h-80 w-full object-cover object-top sm:rounded-t-lg lg:h-80"
        />
      </motion.div>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-2 p-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <DialogTitle asChild>
                  <div className="flex items-center gap-2">
                    <BriefcaseBusiness />
                    <p>Nombre del empleado: </p>
                    <motion.h3 layoutId={`name-${active.id}`}>
                      {active.employee_service.employee.name}
                    </motion.h3>
                  </div>
                </DialogTitle>
              </CardTitle>
              <CardDescription>
                <DialogDescription className="sr-only">
                  Detalles del reporte de calificación del empleado{' '}
                  {active.employee_service.employee.name}
                </DialogDescription>
                <div className="flex items-center gap-2">
                  <Package />
                  <p>Servicio:</p>
                  <motion.p layoutId={`service-${active.id}`}>
                    {active.employee_service.service.name}
                  </motion.p>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Información Básica de la Respuesta
              </CardTitle>
              <CardDescription>
                Información generales sobre la evaluación
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Fecha:{' '}
                    <motion.span layoutId={`date-${active.id}`}>
                      {formatDate(active.created_at)}
                    </motion.span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Tipo de Encuestado:{' '}
                    <motion.span layoutId={`respondent-${active.id}`}>
                      {active.respondent_type.name}
                    </motion.span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Calificación Promedio:{' '}
                    <motion.span layoutId={`average-${active.id}`}>
                      {active.average.toFixed(1)}
                    </motion.span>
                  </p>
                </div>
                {user?.role === Role.NATIONAL_COORDINATOR && (
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Correo electrónico:{' '}
                      <motion.span layoutId={`email-${active.id}`}>
                        {active.email}
                      </motion.span>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Información de las Respuesta
              </CardTitle>
              <CardDescription>
                Información detallada de las respuestas de la evaluación
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p>
                Versión de la Encuesta:{' '}
                <motion.span layoutId={`version-${active.id}`}>
                  {active.survey.version}
                </motion.span>
              </p>
              <QueryRenderer
                query={detailsQuery}
                config={{
                  pending: LoadingContent,
                  error: () => <p>Error al cargar la información</p>,
                  success: AnswerQuestionsList,
                }}
              />
            </CardContent>
          </Card>
        </div>
        <DialogFooter className="sticky bottom-0 flex h-fit items-center justify-end gap-4 rounded-xl border bg-card p-4 text-card-foreground shadow">
          <Link
            href={`/reporte-detallado/${active.id}`}
            className={buttonVariants({ class: 'group' })}>
            <p className="group-hover:underline">Ver más detalles</p>
            <ChevronRight className="transition-transform group-hover:translate-x-2" />
          </Link>
        </DialogFooter>
      </ScrollArea>
    </motion.div>
  );
}

type GroupedQuestions = {
  [key in 'Sí/No' | 'Selección Múltiple']?: AnswerQuestions[];
};

export function AnswerQuestionsList({ data }: { data: Required<Answer> }) {
  const groupedQuestions = data.answer_questions.reduce<GroupedQuestions>(
    (acc, aq) => {
      const category =
        aq.question.type === 'yesno' ? 'Sí/No' : 'Selección Múltiple';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category]!.push(aq);
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-6">
      {(
        Object.entries(groupedQuestions) as [
          keyof GroupedQuestions,
          AnswerQuestions[],
        ][]
      ).map(([category, questions]) => (
        <CategorySection
          key={category}
          category={category}
          questions={questions}
        />
      ))}
    </div>
  );
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

const CategorySection: React.FC<{
  category: string;
  questions: AnswerQuestions[];
}> = ({ category, questions }) => (
  <motion.section
    {...fadeInUp}
    className="space-y-2 rounded-xl bg-white p-4 shadow-sm">
    <h4 className="mb-3 text-sm font-bold text-muted-foreground">{category}</h4>
    <div className="space-y-1">
      {questions.map(aq => (
        <QuestionRow
          key={aq.id}
          question={aq.question.text}
          answer={aq.answer}
          type={aq.question.type}
        />
      ))}
    </div>
  </motion.section>
);

const QuestionRow: React.FC<{
  question: string;
  answer: number;
  type: 'yesno' | 'radio';
}> = ({ question, answer, type }) => (
  <div className="flex flex-row items-center justify-between gap-2 rounded-lg p-2 hover:bg-gray-50">
    <p className="flex-1 text-sm text-muted-foreground">{question}</p>
    {type === 'yesno' ? (
      <p className="min-w-16 text-right text-sm font-medium">
        {answer === 5 ? 'Sí' : 'No'}
      </p>
    ) : (
      <p className="min-w-16 text-right text-sm font-medium">
        {answer.toFixed(1)}
      </p>
    )}
  </div>
);
