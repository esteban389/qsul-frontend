/* eslint-disable no-param-reassign */
import { UseQueryResult } from '@tanstack/react-query';
import { JSX } from 'react';

type RefetchOptions = {
  throwOnError: boolean;
  cancelRefetch: boolean;
};

type RefetchFunction<T> = (
  options: RefetchOptions,
) => Promise<UseQueryResult<T>>; // Replace `any` with your actual type if needed

interface ControlledStatusProps<T, P> {
  query: UseQueryResult<T>;
  options: {
    loading: JSX.Element | (() => JSX.Element);
    error:
      | JSX.Element
      | ((error: Error, refetch: RefetchFunction<T>) => JSX.Element);
    success: (data: UseQueryResult<T>, props?: P) => JSX.Element;
    empty?: JSX.Element | ((data: UseQueryResult<T>) => JSX.Element);
    fetching?: JSX.Element | (() => JSX.Element);
    checkDataFirst?: boolean;
  };
  props?: P;
}
const QueryStateHandler = <T, P>({
  query,
  options,
  props,
}: ControlledStatusProps<T, P>): JSX.Element => {
  if (!query) {
    throw new Error('query is required');
  }

  const { isPending, isError, error, isFetching, failureCount, isFetched } =
    query;
  const { checkDataFirst = true } = options;
  if (options.empty === undefined) {
    options.empty = options.success;
  }
  if (options.fetching === undefined && !options.checkDataFirst) {
    options.fetching = options.loading;
  }

  // If checkDataFirst is true and there is data, render the success state immediately
  if (checkDataFirst && !isPending) {
    const isInitialFetchError = isError && failureCount === 1 && !isFetched;
    if (isInitialFetchError) {
      return typeof options.error === 'function'
        ? options.error(error, query.refetch)
        : options.error;
    }
    return showData(query, options.empty, options.success, props);
  }

  // If the query is loading (There is no data in cache and thus it's first fetch), render the pending state
  if (options.loading && isPending) {
    return typeof options.loading === 'function'
      ? options.loading()
      : options.loading;
  }

  // If loading is provided and the query is fetching (either by a background refetching or initial fetch), render the loading state
  if (options.fetching && isFetching) {
    return typeof options.fetching === 'function'
      ? options.fetching()
      : options.fetching;
  }

  // If the query has an error, render the error state
  if (isError) {
    return typeof options.error === 'function'
      ? options.error(error, query.refetch)
      : options.error;
  }

  // If the data is empty, render the empty state (This is useful when you want to show a message when there is no data)
  return showData(query, options.empty, options.success, props);
};

const showData = <T, P>(
  query: UseQueryResult<T>,
  empty: JSX.Element | ((data: UseQueryResult<T>) => JSX.Element),
  success: (data: UseQueryResult<T>, props?: P) => JSX.Element,
  props?: P,
): JSX.Element => {
  if (isEmpty(query.data)) {
    return typeof empty === 'function' ? empty(query) : empty;
  }
  return success(query, props);
};

const isEmpty = (data: unknown) => {
  return (
    data === undefined ||
    data === null ||
    (Array.isArray(data) && data.length === 0) ||
    (typeof data === 'object' && Object.keys(data).length === 0) ||
    data === '' ||
    (typeof data === 'string' && data.trim() === '')
  );
};

export default QueryStateHandler;
