'use client';

import { useState } from 'react';
import type { PaginationState } from '@tanstack/react-table';

const DEFAULT_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
};

export default function usePersistentTablePagination(
  initialState: PaginationState = DEFAULT_PAGINATION,
) {
  const [pagination, setPagination] = useState<PaginationState>(initialState);

  return {
    pagination,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
  };
}
