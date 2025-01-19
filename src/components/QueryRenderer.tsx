import React from 'react';
import { UseQueryResult } from '@tanstack/react-query';

type QueryRendererProps<TData, TError, TSuccessProps extends object> = {
  query: UseQueryResult<TData, TError>;
  config: {
    // Required components/renders
    pending: React.ComponentType;
    success: React.ComponentType<{ data?: TData } & TSuccessProps>;
    error:
      | React.ComponentType<{ error: TError; retry: () => void }>
      | ((error: TError, retry: () => void) => React.ReactNode);

    // Optional components
    loading?: React.ComponentType;
    empty?: React.ComponentType;

    // Optional config
    preferCacheOverFetch?: boolean;
  };
  // Additional props to pass to success component
  successProps?: TSuccessProps;
};

function QueryRenderer<TData, TError, TSuccessProps extends object>({
  query,
  config,
  successProps = {} as TSuccessProps,
}: QueryRendererProps<TData, TError, TSuccessProps>) {
  const { data, error, isLoading, isPending, isError, refetch } = query;

  const {
    pending: PendingComponent,
    loading: LoadingComponent = PendingComponent,
    success: SuccessComponent,
    error: ErrorComponent,
    empty: EmptyComponent,
    preferCacheOverFetch = true,
  } = config;

  // If we prefer cache and have data, show success even during subsequent fetches
  if (preferCacheOverFetch && data) {
    if (Array.isArray(data) && data.length === 0 && EmptyComponent) {
      return <EmptyComponent />;
    }
    return <SuccessComponent data={data} {...successProps} />;
  }

  // First load
  if (isPending) {
    return <PendingComponent />;
  }

  // Subsequent loads
  if (isLoading) {
    return <LoadingComponent />;
  }

  // Error state
  if (isError) {
    // If ErrorComponent is a function, call it with error and retry
    if (typeof ErrorComponent === 'function') {
      return <>{ErrorComponent(error, refetch)}</>;
    }
    // Otherwise render it as a component
    return <ErrorComponent error={error} retry={refetch} />;
  }

  // Success with data
  if (data) {
    if (Array.isArray(data) && data.length === 0 && EmptyComponent) {
      return <EmptyComponent />;
    }
    return <SuccessComponent data={data} {...successProps} />;
  }

  // This should never happen with proper typing, but TypeScript wants it
  return null;
}

export default QueryRenderer;
