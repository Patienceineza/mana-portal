import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { api, ApiError } from '@/lib/api';
import type { QcInspection } from '@/lib/types';
import { FilterBar } from '@/components/FilterBar';
import { PageHeader } from '@/components/PageHeader';
import { StatusPill } from '@/components/StatusPill';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const GRADES: Array<'A' | 'B' | 'C'> = ['A', 'B', 'C'];

export default function QualityCheckPage() {
  const [inspections, setInspections] = useState<QcInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [actualWeight, setActualWeight] = useState('');
  const [decision, setDecision] = useState<'accept' | 'reject' | null>(null);
  const [grade, setGrade] = useState<'A' | 'B' | 'C'>('A');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await api.get<QcInspection[]>(`/qc/inspections${query}`);
      setInspections(res);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const openGrading = (q: QcInspection) => {
    setGradingId(q.id);
    setActualWeight(q.actualWeight != null ? String(q.actualWeight) : '');
    setDecision(null);
    setGrade(q.qualityGrade ?? 'A');
    setNotes(q.notes ?? '');
  };

  const submitGrade = async () => {
    if (!gradingId || !decision) return;
    const crop = inspections.find((i) => i.id === gradingId);
    setSubmitting(true);
    try {
      await api.patch(`/qc/inspections/${gradingId}`, {
        actualWeight: actualWeight ? Number(actualWeight) : undefined,
        decision,
        grade: decision === 'accept' ? grade : undefined,
        notes,
      });
      setGradingId(null);
      await load();
      toast.success(decision === 'accept' ? 'Batch accepted' : 'Batch rejected', {
        description: crop ? `${crop.crop} — ${crop.farm}` : undefined,
      });
    } catch (err) {
      toast.error('Could not save grading', {
        description: err instanceof ApiError ? err.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const pending = inspections.filter((i) => i.status === 'pending');
  const decided = inspections.filter((i) => i.status !== 'pending');

  const selectedCrop = inspections.find((i) => i.id === gradingId);

  return (
    <div>
      <PageHeader title="Quality Check" description="Review production batches and assign a grade before they go to buyers" />

      <FilterBar search={{ value: search, onChange: setSearch, placeholder: 'Search farm or crop...' }} />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farm</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Expected</TableHead>
                <TableHead>Actual</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 w-28 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-20 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-6 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-8 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                  </TableRow>
                ))
              ) : (
                pending.map((q) => (
                  <TableRow key={q.id} className="animate-fade-in">
                    <TableCell className="font-medium">{q.farm}</TableCell>
                    <TableCell>{q.crop}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{q.stage}</TableCell>
                    <TableCell>{q.expectedWeight} kg</TableCell>
                    <TableCell>{q.actualWeight != null ? `${q.actualWeight} kg` : '—'}</TableCell>
                    <TableCell>
                      <StatusPill status={q.status} />
                    </TableCell>
                    <TableCell>{q.qualityGrade ? `Grade ${q.qualityGrade}` : '—'}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => openGrading(q)}>
                        Grade
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {!loading && pending.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    No pending inspections — nice and caught up.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={!!gradingId} onClose={() => setGradingId(null)} title={selectedCrop ? `Grade Batch: ${selectedCrop.crop} (${selectedCrop.farm})` : ''}>
        <div className="space-y-4">
          <div className="space-y-1.5 text-left">
            <Label htmlFor="actualWeight">Actual weight (kg)</Label>
            <Input
              id="actualWeight"
              type="number"
              value={actualWeight}
              onChange={(e) => setActualWeight(e.target.value)}
              placeholder="Enter weight in kg"
              required
            />
          </div>
          <div className="space-y-1.5 text-left">
            <Label className="block mb-1.5">Decision</Label>
            <div className="flex gap-2.5">
              <Button
                type="button"
                variant={decision === 'accept' ? 'default' : 'outline'}
                className="rounded-xl px-5 font-bold transition-all"
                onClick={() => setDecision('accept')}
              >
                Accept
              </Button>
              <Button
                type="button"
                variant={decision === 'reject' ? 'destructive' : 'outline'}
                className="rounded-xl px-5 font-bold transition-all"
                onClick={() => setDecision('reject')}
              >
                Reject
              </Button>
            </div>
          </div>
          {decision === 'accept' && (
            <div className="space-y-1.5 text-left">
              <Label className="block mb-1.5">Grade</Label>
              <div className="flex gap-2">
                {GRADES.map((g) => (
                  <Button
                    key={g}
                    type="button"
                    variant={grade === g ? 'default' : 'outline'}
                    className="rounded-xl px-4 w-12 font-bold transition-all"
                    onClick={() => setGrade(g)}
                  >
                    {g}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add details about crop quality, sorting, etc."
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2.5">
            <Button variant="outline" className="rounded-xl px-4" onClick={() => setGradingId(null)}>
              Cancel
            </Button>
            <Button className="rounded-xl px-5" onClick={submitGrade} disabled={!decision || submitting}>
              {submitting ? 'Saving…' : 'Submit grading'}
            </Button>
          </div>
        </div>
      </Modal>

      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="border-b border-border px-4 py-3 text-sm font-medium text-foreground">Recently decided</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farm</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Expected</TableHead>
                <TableHead>Actual</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 w-28 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-20 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-6 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                  </TableRow>
                ))
              ) : (
                decided.map((q) => (
                  <TableRow key={q.id} className="animate-fade-in">
                    <TableCell className="font-medium">{q.farm}</TableCell>
                    <TableCell>{q.crop}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{q.stage}</TableCell>
                    <TableCell>{q.expectedWeight} kg</TableCell>
                    <TableCell>{q.actualWeight != null ? `${q.actualWeight} kg` : '—'}</TableCell>
                    <TableCell>
                      <StatusPill status={q.status} />
                    </TableCell>
                    <TableCell>{q.qualityGrade ? `Grade ${q.qualityGrade}` : '—'}</TableCell>
                  </TableRow>
                ))
              )}
              {!loading && decided.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No recently decided inspections.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
