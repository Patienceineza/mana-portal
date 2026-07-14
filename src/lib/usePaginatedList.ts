import { useCallback, useEffect, useState } from 'react';

import { api } from './api';
import type { PaginatedResponse } from './types';

export function usePaginatedList<T>(
  endpoint: string,
  pageSize = 20,
  params: Record<string, string | undefined> = {}
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Stable key so the effect only re-fires when a filter value actually
  // changes, not on every render (params is a fresh object each render).
  const paramsKey = JSON.stringify(params);

  // A filter change should jump back to page 1 — staying on page 3 of a
  // narrower result set is usually just an empty page.
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      for (const [key, value] of Object.entries(JSON.parse(paramsKey) as Record<string, string | undefined>)) {
        if (value) query.set(key, value);
      }
      const res = await api.get<PaginatedResponse<T>>(`${endpoint}?${query.toString()}`);
      setItems(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, page, pageSize, paramsKey]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, page, setPage, total, totalPages, pageSize, loading, reload: load };
}
