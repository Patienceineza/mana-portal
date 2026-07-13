

import { Badge } from '@/components/ui/badge';

const VARIANT_MAP: Record<string, 'default' | 'secondary' | 'destructive' | 'warning'> = {
  paid: 'default',
  unpaid: 'warning',
  delivered: 'default',
  in_transit: 'warning',
  picked_up: 'warning',
  assigned: 'warning',
  pending: 'secondary',
  failed: 'destructive',
  passed: 'default',
  rejected: 'destructive',
  open: 'secondary',
  matched: 'warning',
  fulfilled: 'default',
  cancelled: 'destructive',
};

function labelize(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function StatusPill({ status }: { status: string }) {
  return <Badge variant={VARIANT_MAP[status] ?? 'secondary'}>{labelize(status)}</Badge>;
}
