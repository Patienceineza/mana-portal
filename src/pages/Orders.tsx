import { useState } from 'react';

import { formatCurrency, formatDate } from '@/lib/format';
import { usePaginatedList } from '@/lib/usePaginatedList';
import type { AdminOrder } from '@/lib/types';
import { FilterBar } from '@/components/FilterBar';
import { PageHeader } from '@/components/PageHeader';
import { Pagination } from '@/components/Pagination';
import { StatusPill } from '@/components/StatusPill';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const STAGE_LABELS = ['Order Confirmed', 'Picked at Farm', 'In Transit', 'Delivered'];

const DELIVERY_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'failed', label: 'Failed' },
];

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const { items: orders, page, setPage, total, totalPages, pageSize, loading } = usePaginatedList<AdminOrder>(
    '/admin/orders',
    20,
    { search, paymentStatus, deliveryStatus }
  );

  return (
    <div>
      <PageHeader title="Orders" description="All confirmed buyer orders, from creation to settlement" />
      <FilterBar
        search={{ value: search, onChange: setSearch, placeholder: 'Search order code or buyer...' }}
        selects={[
          {
            value: paymentStatus,
            onChange: setPaymentStatus,
            placeholder: 'All payment statuses',
            options: [
              { value: 'paid', label: 'Paid' },
              { value: 'unpaid', label: 'Unpaid' },
            ],
          },
          {
            value: deliveryStatus,
            onChange: setDeliveryStatus,
            placeholder: 'All delivery statuses',
            options: DELIVERY_STATUS_OPTIONS,
          },
        ]}
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: pageSize || 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 w-12 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-28 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-6 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-24 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-6 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-24 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                  </TableRow>
                ))
              ) : (
                orders.map((o) => (
                  <TableRow key={o.id} className="animate-fade-in">
                    <TableCell className="font-medium">{o.orderCode}</TableCell>
                    <TableCell>{o.buyerName}</TableCell>
                    <TableCell className="tabular-nums">{formatCurrency(o.total)}</TableCell>
                    <TableCell>
                      <StatusPill status={o.paymentStatus} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {STAGE_LABELS[o.trackingStage] ?? `Stage ${o.trackingStage}`}
                    </TableCell>
                    <TableCell>
                      <StatusPill status={o.deliveryStatus} />
                    </TableCell>
                    <TableCell>{formatDate(o.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
              {!loading && orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    {search || paymentStatus || deliveryStatus ? 'No orders match your filters.' : 'No orders placed yet.'}
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
