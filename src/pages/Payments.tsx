import { useEffect, useState } from 'react';

import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import type { AdminPayments } from '@/lib/types';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { StatusPill } from '@/components/StatusPill';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<AdminPayments | null>(null);

  useEffect(() => {
    api.get<AdminPayments>('/admin/payments').then(setPayments);
  }, []);

  return (
    <div>
      <PageHeader title="Payments" description="Buyer invoices, farmer settlements, and outstanding balances" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Unpaid invoices"
          value={payments ? formatCurrency(payments.unpaidInvoicesTotal) : '—'}
          tone={payments && payments.unpaidInvoicesTotal > 0 ? 'warning' : 'default'}
        />
        <StatCard label="Paid invoices" value={payments ? formatCurrency(payments.paidInvoicesTotal) : '—'} tone="good" />
        <StatCard
          label="Pending payouts"
          value={payments ? formatCurrency(payments.pendingPayoutsTotal) : '—'}
          tone={payments && payments.pendingPayoutsTotal > 0 ? 'warning' : 'default'}
        />
        <StatCard label="Paid payouts" value={payments ? formatCurrency(payments.paidPayoutsTotal) : '—'} tone="good" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Recent buyer invoices</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!payments ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-4 w-12 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                      <TableCell><div className="h-4 w-28 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                      <TableCell><div className="h-4 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                      <TableCell><div className="h-6 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                      <TableCell><div className="h-4 w-20 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    </TableRow>
                  ))
                ) : payments.recentInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      No recent invoices.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.recentInvoices.map((inv) => (
                    <TableRow key={inv.orderCode}>
                      <TableCell className="font-medium">{inv.orderCode}</TableCell>
                      <TableCell>{inv.buyerName}</TableCell>
                      <TableCell className="tabular-nums">{formatCurrency(inv.total)}</TableCell>
                      <TableCell>
                        <StatusPill status={inv.paymentStatus} />
                      </TableCell>
                      <TableCell>{formatDate(inv.createdAt)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Recent farmer settlements</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Crop</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!payments ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-4 w-28 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                      <TableCell><div className="h-4 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                      <TableCell><div className="h-4 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                      <TableCell><div className="h-6 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                      <TableCell><div className="h-4 w-20 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    </TableRow>
                  ))
                ) : payments.recentPayouts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      No recent payouts.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.recentPayouts.map((p, idx) => (
                    <TableRow key={`${p.farmerName}-${idx}`}>
                      <TableCell className="font-medium">{p.farmerName}</TableCell>
                      <TableCell>{p.cropLabel}</TableCell>
                      <TableCell className="tabular-nums">{formatCurrency(p.amount)}</TableCell>
                      <TableCell>
                        <StatusPill status={p.status} />
                      </TableCell>
                      <TableCell>{p.paidAt ? formatDate(p.paidAt) : '—'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
