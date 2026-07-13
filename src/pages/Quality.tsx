import { useEffect, useState } from 'react';

import { api } from '@/lib/api';
import type { AdminQuality } from '@/lib/types';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function QualityPage() {
  const [quality, setQuality] = useState<AdminQuality | null>(null);

  useEffect(() => {
    api.get<AdminQuality>('/admin/quality').then(setQuality);
  }, []);

  const gradeRows = quality
    ? [
        { label: 'Grade A', value: quality.gradeA, color: '#0ca30c' },
        { label: 'Grade B', value: quality.gradeB, color: '#fab219' },
        { label: 'Grade C', value: quality.gradeC, color: '#ec835a' },
      ]
    : [];

  const maxGrade = Math.max(1, ...gradeRows.map((g) => g.value));

  return (
    <div>
      <PageHeader title="Quality" description="Inspection outcomes and grading across all produce" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total inspections" value={quality ? String(quality.totalInspections) : '—'} />
        <StatCard label="Passed" value={quality ? String(quality.passed) : '—'} tone="good" />
        <StatCard label="Rejected" value={quality ? String(quality.rejected) : '—'} tone="critical" />
        <StatCard label="Pending" value={quality ? String(quality.pending) : '—'} tone="warning" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Grade distribution (passed produce)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {gradeRows.map((g) => (
            <div key={g.label} className="flex items-center gap-3">
              <div className="w-16 shrink-0 text-sm font-medium">{g.label}</div>
              <div className="h-5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(g.value / maxGrade) * 100}%`, backgroundColor: g.color }}
                />
              </div>
              <div className="w-8 shrink-0 text-right text-sm tabular-nums text-muted-foreground">{g.value}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
