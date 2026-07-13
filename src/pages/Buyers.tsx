import { formatCurrency } from '@/lib/format';
import { usePaginatedList } from '@/lib/usePaginatedList';
import type { AdminBuyer } from '@/lib/types';
import { Avatar } from '@/components/Avatar';
import { PageHeader } from '@/components/PageHeader';
import { Pagination } from '@/components/Pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function BuyersPage() {
  const { items: buyers, page, setPage, total, totalPages, pageSize, loading } = usePaginatedList<AdminBuyer>('/admin/buyers');

  return (
    <div>
      <PageHeader title="Buyers" description="Registered buyers and their order history" />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Total orders</TableHead>
                <TableHead>Total spend</TableHead>
                <TableHead>Unpaid balance</TableHead>
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
                    <TableCell><div className="h-4 w-12 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-20 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-20 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                  </TableRow>
                ))
              ) : (
                buyers.map((b) => (
                  <TableRow key={b.id} className="animate-fade-in">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={b.name} size={28} />
                        {b.name}
                      </div>
                    </TableCell>
                    <TableCell>{b.businessName}</TableCell>
                    <TableCell>{b.totalOrders}</TableCell>
                    <TableCell className="tabular-nums">{formatCurrency(b.totalSpend)}</TableCell>
                    <TableCell className={b.unpaidBalance > 0 ? 'tabular-nums font-medium text-[#c98500]' : 'tabular-nums'}>
                      {formatCurrency(b.unpaidBalance)}
                    </TableCell>
                  </TableRow>
                ))
              )}
              {!loading && buyers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No buyers registered yet.
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
