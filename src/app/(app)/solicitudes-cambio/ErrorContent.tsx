import ErrorText from '@/components/ui/ErrorText';

export default function ErrorContent({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <div className="py-8 text-center">
      <ErrorText>Error al cargar solicitudes de cambio.</ErrorText>
      <button className="mt-2 text-blue-600 underline" onClick={retry}>
        Reintentar
      </button>
    </div>
  );
}
