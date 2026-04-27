import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect } from 'react';
import QueryRenderer from '@/components/QueryRenderer';
import { buttonVariants } from '@/components/ui/button';
import { Survey } from '@/types/survey';
import { useFiltersState } from '../../context/storage';
import useSurveyVersions from '../../../historial-encuesta/useSurveyVersions';

export default function SurveySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const query = useSurveyVersions();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={buttonVariants({
          variant: 'outline',
          class: 'w-full justify-between',
        })}>
        <SelectValue placeholder="Seleccionar Versión" />
      </SelectTrigger>
      <SelectContent>
        <QueryRenderer
          query={query}
          config={{
            pending: () => (
              <SelectItem value="loading" disabled>
                Cargando...
              </SelectItem>
            ),
            error: () => (
              <SelectItem value="error" disabled>
                Error al cargar
              </SelectItem>
            ),
            empty: () => (
              <SelectItem value="empty" disabled>
                No hay versiones
              </SelectItem>
            ),
            success: Content,
          }}
        />
      </SelectContent>
    </Select>
  );
}

function Content({ data }: { data: Survey[] }) {
  const { setDefaultState, getStateSlice } = useFiltersState();
  const currentSurvey = getStateSlice('survey');

  useEffect(() => {
    const defaultSurvey = data.find(survey => survey.version !== 0) ?? data[0];
    if (!defaultSurvey) return;

    const currentSurveyExists =
      currentSurvey !== 0 && data.some(survey => survey.id === currentSurvey);
    const shouldApplyToCurrentState = !currentSurveyExists;

    setDefaultState(
      oldDef => ({
        ...oldDef,
        survey: defaultSurvey.id,
        start_date: new Date(defaultSurvey.created_at),
      }),
      { applyToCurrentState: shouldApplyToCurrentState },
    );
  }, [currentSurvey, data, setDefaultState]);

  return data
    .filter(survey => survey.version !== 0)
    .map(survey => (
      <SelectItem key={survey.id} value={String(survey.id)}>
        {survey.version}
      </SelectItem>
    ));
}
