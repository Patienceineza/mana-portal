import { useState } from 'react';

import { formatCurrency } from '@/lib/format';
import { usePaginatedList } from '@/lib/usePaginatedList';
import type { AdminFarmer } from '@/lib/types';
import { Avatar } from '@/components/Avatar';
import { FilterBar } from '@/components/FilterBar';
import { PageHeader } from '@/components/PageHeader';
import { Pagination } from '@/components/Pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function FarmersPage() {
  const [search, setSearch] = useState('');
  const { items: farmers, page, setPage, total, totalPages, pageSize, loading } = usePaginatedList<AdminFarmer>(
    '/admin/farmers',
    20,
    { search }
  );

  return (
    <div>
      <PageHeader title="Farmers" description="Registered farmers and their reliability record" />
      <FilterBar search={{ value: search, onChange: setSearch, placeholder: 'Search name, farm, or region...' }} />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Farm</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Harvest logs</TableHead>
                <TableHead>Collected</TableHead>
                <TableHead>Total paid out</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: pageSize || 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 animate-pulse rounded-full bg-muted dark:bg-zinc-800" />
                        <div className="h-4 w-28 animate-pulse rounded bg-muted dark:bg-zinc-800" />
                      </div>
                    </TableCell>
                    <TableCell><div className="h-4 w-32 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-24 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-12 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-12 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-20 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                  </TableRow>
                ))
              ) : (
                farmers.map((f) => (
                  <TableRow key={f.id} className="animate-fade-in">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={f.name} size={28} />
                        {f.name}
                      </div>
                    </TableCell>
                    <TableCell>{f.farmName}</TableCell>
                    <TableCell>{f.region}</TableCell>
                    <TableCell>{f.harvestLogs}</TableCell>
                    <TableCell>{f.collectedLogs}</TableCell>
                    <TableCell className="tabular-nums">{formatCurrency(f.totalPaidOut)}</TableCell>
                  </TableRow>
                ))
              )}
              {!loading && farmers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    {search ? 'No farmers match your search.' : 'No farmers registered yet.'}
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
