'use client';

import React from 'react';
import { motion } from 'framer-motion';
import QueryRenderer from '@/components/QueryRenderer';
import LoadingContent from '@/components/LoadingContent';
import { Button } from '@/components/ui/button';
import useAnswerDetails from '../useAnswerDetails';
import Content from './content';

function Loading() {
  return (
    <div className="flex size-full items-center justify-center">
      <LoadingContent />
    </div>
  );
}

export default function Page({ params }: { params: { reporteId: string } }) {
  const detailsQuery = useAnswerDetails(parseInt(params.reporteId, 10));
  return (
    <main className="size-full">
      <motion.h1
        className="w-full text-center text-3xl font-bold"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}>
        Reporte Detallado
      </motion.h1>
      <QueryRenderer
        query={detailsQuery}
        config={{
          pending: Loading,
          error: ({ retry }) => (
            <div className="text-center">
              <p>Error</p>
              <Button
                onClick={retry}
                className="transition-transform hover:scale-105">
                Reintentar
              </Button>
            </div>
          ),
          success: Content,
        }}
      />
    </main>
  );
}
