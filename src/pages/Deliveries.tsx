import { formatDate } from '@/lib/format';
import { usePaginatedList } from '@/lib/usePaginatedList';
import type { AdminDelivery } from '@/lib/types';
import { PageHeader } from '@/components/PageHeader';
import { Pagination } from '@/components/Pagination';
import { StatusPill } from '@/components/StatusPill';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function DeliveriesPage() {
  const { items: deliveries, page, setPage, total, totalPages, pageSize, loading } = usePaginatedList<AdminDelivery>('/admin/deliveries');

  return (
    <div>
      <PageHeader title="Deliveries" description="Pickup and delivery status for every order" />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: pageSize || 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 w-12 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-6 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-28 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-36 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-24 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                  </TableRow>
                ))
              ) : (
                deliveries.map((d) => (
                  <TableRow key={d.id} className="animate-fade-in">
                    <TableCell className="font-medium">{d.orderCode}</TableCell>
                    <TableCell>
                      <StatusPill status={d.status} />
                    </TableCell>
                    <TableCell>{d.driverName ?? <span className="text-muted-foreground">Unassigned</span>}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">{d.notes || '—'}</TableCell>
                    <TableCell>{formatDate(d.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
              {!loading && deliveries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No deliveries yet.
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
