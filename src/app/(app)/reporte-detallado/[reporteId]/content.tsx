import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Answer } from '@/types/answer';
import React, { useMemo } from 'react';
import env from '@/lib/env';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, User, AlertCircle, Mail, Trash2 } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';
import { Role } from '@/types/user';
import { AnswerQuestionsList } from '../DetailsDialogContent';
import CreateObsrvationDialog from './CreateObsrvationDialog';
import IgnoreButton from './IgnoreButton';
import ObservationItem from './ObservationItem';
import SolveButton from './SolveButton';

export default function Content({ data }: { data: Required<Answer> }) {
  const { user } = useAuth({ middleware: 'auth' });
  const orderedObservations = useMemo(() => {
    return data.observations.sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [data]);
  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader className="group flex flex-col items-center gap-4 p-8 md:flex-row md:gap-8">
          <Avatar className="size-64 overflow-visible rounded-xl">
            <div className="relative isolate">
              <div className="size-full overflow-hidden rounded-xl">
                <AvatarImage
                  src={env('API_URL') + data.employee_service.employee.avatar}
                  alt={data.employee_service.employee.name}
                  className="rounded-lg transition-transform group-hover:scale-110"
                />
              </div>
              <AvatarImage
                src={env('API_URL') + data.employee_service.employee.avatar}
                alt={data.employee_service.employee.name}
                className="absolute left-0 top-0 -z-10 rounded-xl opacity-0 transition-all group-hover:-left-2 group-hover:-top-2 group-hover:opacity-100 group-hover:blur-lg"
              />
            </div>
            <AvatarFallback className="rounded-xl">
              {data.employee_service.employee.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className=" size-full flex-1 text-center md:text-left flex flex-col md:flex-row items-center gap-2 justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                {data.employee_service.employee.name}
              </CardTitle>
              <h2 className="text-lg font-medium">
                {data.employee_service.employee.email}
              </h2>
              <CardDescription className="text-md text-neutral-600">
                {data.employee_service.service.name}
              </CardDescription>
            </div>
            <div className='flex items-center gap-2'>
              {data.solved_at ? (
                <p className="text-sm text-green-600">Resuelto: {formatDate(data.solved_at)}</p>
              ) : (
                <>
                  <IgnoreButton answer={data} />
                  <SolveButton answer={data} />
                </>
              )}
            </div>
          </div>
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
                <motion.span layoutId={`date-${data.id}`}>
                  {formatDate(data.created_at)}
                </motion.span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Tipo de Encuestado:{' '}
                <motion.span layoutId={`respondent-${data.id}`}>
                  {data.respondent_type.name}
                </motion.span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Calificación Promedio:{' '}
                <motion.span layoutId={`average-${data.id}`}>
                  {data.average.toFixed(1)}
                </motion.span>
              </p>
            </div>
            {user?.role === Role.NATIONAL_COORDINATOR && (
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Correo Electrónico del Encuestado:{' '}
                  <motion.span layoutId={`email-${data.id}`}>
                    {data.email}
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
            <motion.span layoutId={`version-${data.id}`}>
              {data.survey.version}
            </motion.span>
          </p>
          <AnswerQuestionsList data={data} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <CardTitle className="text-lg font-semibold">
                Observaciones
              </CardTitle>
              <CardDescription>
                Observaciones y comentarios sobre la evaluación
              </CardDescription>
            </div>
            {!data.deleted_at && <CreateObsrvationDialog />}
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          {orderedObservations.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No hay observaciones registradas
            </p>
          ) : (
            orderedObservations.map(observation => (
              <ObservationItem key={observation.id} observation={observation} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
