import { useState } from 'react';

import { formatDate } from '@/lib/format';
import { usePaginatedList } from '@/lib/usePaginatedList';
import type { AdminBuyerRequest } from '@/lib/types';
import { FilterBar } from '@/components/FilterBar';
import { PageHeader } from '@/components/PageHeader';
import { Pagination } from '@/components/Pagination';
import { StatusPill } from '@/components/StatusPill';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function BuyerRequestsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [grade, setGrade] = useState('');
  const { items: requests, page, setPage, total, totalPages, pageSize, loading } = usePaginatedList<AdminBuyerRequest>(
    '/admin/buyer-requests',
    20,
    { search, status, grade }
  );

  return (
    <div>
      <PageHeader title="Buyer requests" description="Demand submitted by buyers, awaiting supply matching" />
      <FilterBar
        search={{ value: search, onChange: setSearch, placeholder: 'Search crop or buyer...' }}
        selects={[
          {
            value: status,
            onChange: setStatus,
            placeholder: 'All statuses',
            options: [
              { value: 'open', label: 'Open' },
              { value: 'matched', label: 'Matched' },
              { value: 'fulfilled', label: 'Fulfilled' },
              { value: 'cancelled', label: 'Cancelled' },
            ],
          },
          {
            value: grade,
            onChange: setGrade,
            placeholder: 'All grades',
            options: [
              { value: 'A', label: 'Grade A' },
              { value: 'B', label: 'Grade B' },
              { value: 'C', label: 'Grade C' },
              { value: 'any', label: 'Any' },
            ],
          },
        ]}
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Needed by</TableHead>
                <TableHead>Preferred grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: pageSize || 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 w-28 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-20 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-12 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-20 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-6 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-24 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                  </TableRow>
                ))
              ) : (
                requests.map((r) => (
                  <TableRow key={r.id} className="animate-fade-in">
                    <TableCell className="font-medium">{r.buyerName}</TableCell>
                    <TableCell>{r.cropName}</TableCell>
                    <TableCell>
                      {r.qty} {r.unit}
                    </TableCell>
                    <TableCell>{r.neededBy}</TableCell>
                    <TableCell>{r.preferredGrade === 'any' ? 'Any' : `Grade ${r.preferredGrade}`}</TableCell>
                    <TableCell>
                      <StatusPill status={r.status} />
                    </TableCell>
                    <TableCell>{formatDate(r.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
              {!loading && requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    {search || status || grade ? 'No buyer requests match your filters.' : 'No buyer requests submitted yet.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>
    </div>
  );
}
