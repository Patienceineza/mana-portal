import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  tone?: 'default' | 'good' | 'warning' | 'critical';
  loading?: boolean;
}

const TONE_CLASSES: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'text-foreground',
  good: 'text-[#0ca30c]',
  warning: 'text-[#c98500]',
  critical: 'text-[#d03b3b]',
};

const TONE_ICON_CLASSES: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'bg-accent text-accent-foreground',
  good: 'bg-[#0ca30c]/10 text-[#0ca30c]',
  warning: 'bg-[#c98500]/10 text-[#c98500]',
  critical: 'bg-[#d03b3b]/10 text-[#d03b3b]',
};

export function StatCard({ label, value, icon: Icon, tone = 'default', loading = false }: StatCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
          {loading ? (
            <div className="mt-2 h-7 w-20 animate-pulse rounded bg-muted" />
          ) : (
            <div className={cn('mt-1.5 truncate text-2xl font-bold tabular-nums', TONE_CLASSES[tone])}>{value}</div>
          )}
        </div>
        {Icon && (
          <div className={cn('shrink-0 rounded-lg p-2', TONE_ICON_CLASSES[tone])}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
