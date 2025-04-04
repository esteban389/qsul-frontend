'use client';

import useSurvey from '@/app/(app)/preguntas/useSurvey';
import LoadingContent from '@/components/LoadingContent';
import QueryRenderer from '@/components/QueryRenderer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Employee } from '@/types/employee';
import { Question } from '@/types/question';
import { Survey } from '@/types/survey';
import { ChevronLeft } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useStorage from '@/hooks/use-storage';
import { toast } from 'sonner';
import {
  SURVEY_EMAIL_KEY,
  SURVEY_USER_TYPE_KEY,
} from '@/app/encuesta/AskForEmailAndUserTypeModal';
import { AxiosError } from 'axios';
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks';
import useSubmitSurvey from './useSubmitSurvey';
import { EMPLOYEE_SERVICE_PARAM, SERVICE_PARAM } from './ServicesList';
import { Textarea } from '@/components/ui/textarea';

function Loading() {
  return (
    <div className="flex size-full items-center justify-center">
      <LoadingContent />
    </div>
  );
}

function Completed() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <span className="text-[5rem]">🥳</span>
      <Fireworks autorun={{ speed: 3, duration: 5000 }} />
      <h1 className="w-full text-center text-[3rem] font-bold">
        ¡Gracias por completar la encuesta!
      </h1>
      <p className="text-center text-xl text-primary lg:text-primary/80">
        Tu opinión es muy importante para nosotros y nos ayuda a mejorar
      </p>
    </div>
  );
}

export default function QuestionsPage({ employee }: { employee: Employee }) {
  const currentSurvey = useSurvey();
  return (
    <div className="relative flex h-full flex-col gap-4 md:items-center">
      <QueryRenderer
        query={currentSurvey}
        config={{
          pending: Loading,
          error: () => <div>Error</div>,
          success: Questions,
        }}
        successProps={{ employee }}
      />
    </div>
  );
}

interface Answer {
  question_id: number;
  answer: number;
}

function Questions({ data: survey }: { data: Survey }) {
  const [selectedEmployeeService, setSelectedEmployeeService] =
    useQueryState<number>(
      EMPLOYEE_SERVICE_PARAM,
      parseAsInteger.withDefault(0),
    );
  const [selectedService, setSelectedService] = useQueryState<number>(
    SERVICE_PARAM,
    parseAsInteger.withDefault(0),
  );
  const [surveyVersion, setSurveyVersion] = useStorage(
    'surveyVersion',
    survey.version,
    'sessionStorage',
  );
  const [currentQuestion, setCurrentQuestion] = useStorage(
    'question',
    0,
    'sessionStorage',
  );
  const [direction, setDirection] = useState(0);
  const [observation, setObservation] = useState('');
  const [answers, setAnswers] = useStorage<Answer[]>(
    'survey',
    [],
    'sessionStorage',
  );
  const [email, setEmail] = useStorage<string>(
    SURVEY_EMAIL_KEY,
    '',
    'sessionStorage',
  );
  const [userType, setUserType] = useStorage<string>(
    SURVEY_USER_TYPE_KEY,
    '',
    'sessionStorage',
  );

  const submitMutation = useSubmitSurvey({
    version: survey.version,
    respondent_type_id: Number(userType),
    email,
    employee_service_id: selectedEmployeeService,
    answers,
    observation,
  });

  const questions = survey.questions.filter(
    q => q.service_id === selectedService || q.service_id === null,
  );

  const submit = () => {
    toast.promise(submitMutation.mutateAsync(), {
      loading: 'Enviando respuestas...',
      success: () => {
        setCurrentQuestion(0);
        setAnswers([]);
        setEmail('');
        setUserType('');
        return 'Respuestas enviadas correctamente';
      },
      error: error => {
        if (error instanceof AxiosError) {
          const body = error.response?.data;
          if (body && 'message' in body) {
            if (
              'respondent_type_id' in (body?.errors ?? {}) ||
              'email' in (body?.errors ?? {})
            ) {
              return 'Por favor, completa tu correo electrónico y tipo de usuario, presiona el botón en la parte superior y vuelve a intentar';
            }
            return body.message;
          }
          return `Ocurrió un error inesperado: ${error.message}`;
        }
        return 'Ocurrió un error al enviar las respuestas';
      },
    });
  };
  const handleNavigation = (isNext: boolean) => {
    if (isNext && currentQuestion < questions.length) {
      setDirection(1);
      setCurrentQuestion(prev => prev + 1);
    } else if (!isNext) {
      setDirection(-1);
      if (currentQuestion > 0) {
        setCurrentQuestion(prev => prev - 1);
      } else {
        setSelectedService(0);
        setSelectedEmployeeService(0);
        setEmail('');
        setUserType('');
        setCurrentQuestion(0);
        setAnswers([]);
      }
    }
  };

  const handleAnswer = (answer: number) => {
    const currentQuestionId = questions[currentQuestion].id;
    setAnswers(prev => {
      // Remove previous answer for this question if it exists
      const filtered = prev.filter(a => a.question_id !== currentQuestionId);
      return [...filtered, { question_id: currentQuestionId, answer }];
    });

    // Only navigate if there are more questions
    if (currentQuestion < questions.length) {
      handleNavigation(true);
      return;
    }
  };

  // Get the current answer if it exists
  const currentAnswer = useMemo(() => {
    if (currentQuestion < questions.length) {
      return answers.find(a => a.question_id === questions[currentQuestion].id)
        ?.answer;
    }
  }, []);

  if (surveyVersion !== survey.version) {
    setAnswers([]);
    setCurrentQuestion(0);
    setSurveyVersion(survey.version);
    return <LoadingContent />;
  }

  if (questions.length === 0) {
    return (
      <div className="flex size-full items-center justify-center">
        <h1 className="text-center text-4xl">
          No hay preguntas disponibles para esta encuesta
        </h1>
      </div>
    );
  }
  return (
    <>
      <Button
        className="absolute left-0 top-0"
        onClick={() => handleNavigation(false)}>
        <ChevronLeft />
      </Button>
      {!submitMutation.isSuccess && (
        <AnimatePresence mode="wait" custom={direction}>
          {currentQuestion < questions.length ? (
            <QuestionItem
              question={questions[currentQuestion]}
              onAnswer={handleAnswer}
              direction={direction}
              currentAnswer={currentAnswer}
              key={currentQuestion}
            />
          ) : (
            <motion.div
              className="flex h-full flex-col items-center justify-center gap-8"
              variants={{
                center: {
                  x: 0,
                  opacity: 1,
                },
                exit: (direction: number) => ({
                  x: direction > 0 ? -70 : 70,
                  opacity: 0,
                }),
              }}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}>
              <h1 className="w-full text-center text-[3rem] font-bold">
                Por favor, déjanos tu opinión
              </h1>
              <Textarea
                className="bg-white"
                value={observation}
                onChange={e => setObservation(e.target.value)}
              />
              <Button disabled={submitMutation.isPending} onClick={()=>submit()}>Enviar</Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      {submitMutation.isSuccess && <Completed />}
    </>
  );
}

function QuestionItem({
  question,
  onAnswer,
  direction,
  currentAnswer,
}: {
  question: Question;
  onAnswer: (value: number) => void;
  direction: number;
  currentAnswer?: number;
}) {
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 70 : -70,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -70 : 70,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center gap-8"
      variants={slideVariants}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}>
      <h1 className="w-full text-center text-[3rem] font-bold">
        {question.text}
      </h1>
      <ScrollArea className="w-full">
        <div className="flex flex-col items-center justify-center gap-4 py-8 md:flex-row">
          {question.type === 'radio' ? (
            Array.from({ length: 5 }).map((_, i) => {
              const value = i + 1;
              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => onAnswer(value)}
                  className={`group relative text-[4rem] transition-transform hover:scale-105 ${
                    currentAnswer === value ? 'scale-110 text-primary' : ''
                  }`}>
                  {OptionsMap[value]}
                  <span className="sr-only">{value}</span>
                  <span className="absolute inset-0 transition-all group-hover:blur-lg">
                    {OptionsMap[value]}
                  </span>
                </button>
              );
            })
          ) : (
            <>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onAnswer(1)}
                className={
                  currentAnswer === 1
                    ? 'bg-primary text-primary-foreground'
                    : ''
                }>
                No
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onAnswer(5)}
                className={
                  currentAnswer === 5
                    ? 'bg-primary text-primary-foreground'
                    : ''
                }>
                Si
              </Button>
            </>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}

const OptionsMap: { [key: number]: string } = {
  1: '😡',
  2: '😞',
  3: '😐',
  4: '😊',
  5: '😍',
};
