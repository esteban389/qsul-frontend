'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate } from '@/lib/utils';
import QueryRenderer from '@/components/QueryRenderer';
import { Survey } from '@/types/survey';
import LoadingContent from '@/components/LoadingContent';
import { Service } from '@/types/service';
import ServiceSelect from '../servicios/ServiceSelect';
import UseSurveyVersions from './useSurveyVersions';

const SurveyVersion = ({
  version,
  isFirst,
}: {
  version: Survey;
  isFirst: boolean;
}) => {
  const [service, setService] = useState<Service | null>(null);
  const questions = version.questions.filter(
    q => q.service_id === service?.id || q.service_id === null,
  );
  return (
    <AccordionItem value={`version-${version.id}`}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium">Versión {version.version}</span>
          {isFirst && <Badge className="bg-green-500">Versión actual</Badge>}
          <span className="text-sm text-gray-500">
            Creada el:{' '}
            {formatDate(version.created_at, {
              dateStyle: 'medium',
              timeStyle: 'medium',
            })}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-6 pt-4">
          <div className="flex justify-end gap-2">
            <ServiceSelect service={service} setService={setService} />
          </div>
          <AnimatePresence>
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.1 }}>
                <Card className="mb-4">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="mb-2 font-medium">{question.text}</p>
                        <div className="flex gap-2">
                          <Badge variant="outline">
                            {question.type === 'radio'
                              ? 'Opción Múltiple'
                              : 'Sí/No'}
                          </Badge>
                          {question.service_id && (
                            <Badge variant="secondary">
                              Servicio específico
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">
                          Pregunta {index + 1}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
const SurveyVersions = ({ data }: { data: Survey[] }) => {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <Accordion type="single" collapsible>
        {data.map((version, index) => (
          <motion.div
            key={version.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}>
            <SurveyVersion version={version} isFirst={index === 0} />
          </motion.div>
        ))}
      </Accordion>
    </ScrollArea>
  );
};

const Loading = () => {
  return (
    <div className="flex h-[600px] w-full items-center justify-center">
      <LoadingContent />
    </div>
  );
};
const SurveyVersionManager = () => {
  // Sample data - in real app would come from props or API
  const surveyVersions = UseSurveyVersions();

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>Versiones de la encuesta</CardTitle>
            <CardDescription>
              Visualiza las versiones anteriores de la encuesta y las preguntas
              asociadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QueryRenderer
              query={surveyVersions}
              config={{
                pending: Loading,
                error: () => <div>Error</div>,
                success: SurveyVersions,
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SurveyVersionManager;
