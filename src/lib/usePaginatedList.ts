import { useCallback, useEffect, useState } from 'react';

import { api } from './api';
import type { PaginatedResponse } from './types';

export function usePaginatedList<T>(endpoint: string, pageSize = 20) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResponse<T>>(`${endpoint}?page=${page}&pageSize=${pageSize}`);
      setItems(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, page, setPage, total, totalPages, pageSize, loading, reload: load };
}
