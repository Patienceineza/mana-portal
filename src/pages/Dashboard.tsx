import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  Plus,
  ArrowUpRight,
  Video,
  Clock,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@/lib/api';
import { formatPercent } from '@/lib/format';
import type { AdminOverview, AdminQuality, AdminUser, AdminBuyerRequest, AdminDelivery, PaginatedResponse } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

// Custom tooltip styling matching mockup with dark mode support
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-lg">
        <p className="text-xs font-bold text-foreground dark:text-white">{payload[0].name}</p>
        <p className="mt-1 text-xs font-extrabold text-[#107B43] dark:text-emerald-400">
          {payload[0].value} {payload[0].value === 1 ? 'Inspection' : 'Inspections'}
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [quality, setQuality] = useState<AdminQuality | null>(null);
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [requestsList, setRequestsList] = useState<AdminBuyerRequest[]>([]);
  const [latestDelivery, setLatestDelivery] = useState<AdminDelivery | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Time Tracker state - initialized to 0 for tracking the current session duration
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isTicking, setIsTicking] = useState(true);

  // Fetch metrics & dynamic list records from backend
  useEffect(() => {
    setIsLoading(true);
    Promise.allSettled([
      api.get<AdminOverview>('/admin/overview').then(setOverview),
      api.get<AdminQuality>('/admin/quality').then(setQuality),
      api.get<PaginatedResponse<AdminUser>>('/admin/users?page=1&pageSize=4').then((res) => setUsersList(res.items)),
      api.get<PaginatedResponse<AdminBuyerRequest>>('/admin/buyer-requests?page=1&pageSize=5').then((res) => setRequestsList(res.items)),
      api.get<PaginatedResponse<AdminDelivery>>('/admin/deliveries?page=1&pageSize=1').then((res) => {
        if (res.items && res.items.length > 0) {
          setLatestDelivery(res.items[0]);
        }
      })
    ]).then((results) => {
      setIsLoading(false);
      const errors = results.filter((r) => r.status === 'rejected');
      if (errors.length > 0) {
        toast.error('Some dashboard components failed to load');
      }
    });
  }, []);

  // Time Tracker Clock Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTicking) {
      timer = setInterval(() => {
        setTime((prev) => {
          let s = prev.seconds + 1;
          let m = prev.minutes;
          let h = prev.hours;
          if (s >= 60) {
            s = 0;
            m += 1;
          }
          if (m >= 60) {
            m = 0;
            h += 1;
          }
          return { hours: h, minutes: m, seconds: s };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTicking]);

  const formatTimePart = (num: number) => String(num).padStart(2, '0');

  // Map inspection data to vertical bars
  const qualityData = quality
    ? [
        { name: 'Grade A', value: quality.gradeA, fillType: 'solid-green' },
        { name: 'Grade B', value: quality.gradeB, fillType: 'striped-green' },
        { name: 'Grade C', value: quality.gradeC, fillType: 'solid-dark' },
        { name: 'Rejected', value: quality.rejected, fillType: 'striped-neutral' },
        { name: 'Pending', value: quality.pending, fillType: 'striped-green' },
      ]
    : [];

  // Helper to color cells based on mockup mockup styles
  const getCellFill = (fillType: string) => {
    switch (fillType) {
      case 'solid-green':
        return '#107B43';
      case 'solid-dark':
        return '#042A16';
      case 'striped-green':
        return 'url(#greenStripes)';
      case 'striped-neutral':
        return 'url(#neutralStripes)';
      default:
        return '#107B43';
    }
  };

  const deliveryRate = overview?.onTimeDeliveryRate || 0;
  const pendingInspections = quality?.pending || 0;

  return (
    <div className="space-y-6">
      {/* Title & Quick Actions Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pt-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground/70 dark:text-zinc-400">
            Plan, prioritize, and accomplish your tasks with ease.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#042A16] dark:bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#094F29] dark:hover:bg-emerald-500 hover:shadow-md hover:scale-105 active:scale-95">
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" /> Add Project
          </button>
          <button className="inline-flex items-center justify-center rounded-full border border-border dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-2.5 text-xs font-semibold text-[#042A16] dark:text-emerald-400 shadow-sm transition-all hover:bg-muted/30 dark:hover:bg-zinc-900/60">
            Import Data
          </button>
        </div>
      </div>

      {/* Row 1: KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Active Farmers (Dark Green Theme) */}
        <Card className="overflow-hidden bg-gradient-to-b from-[#094F29] to-[#042A16] dark:from-[#052E17] dark:to-[#021A0E] text-white border-none transition-all hover:-translate-y-0.5 hover:shadow-md">
          <CardContent className="flex flex-col justify-between p-5 h-full min-h-[140px]">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-white/80">Active Farmers</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                <ArrowUpRight className="h-4 w-4 stroke-[2]" />
              </div>
            </div>
            <div className="mt-2.5">
              {isLoading ? (
                <div className="h-9 w-20 animate-pulse rounded bg-white/10" />
              ) : (
                <div className="text-3xl font-bold tracking-tight">
                  {overview ? overview.activeFarmers : '0'}
                </div>
              )}
              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-[#C8E6C9]">
                <TrendingUp className="h-3 w-3 stroke-[2]" />
                <span>Increased from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Active Buyers */}
        <Card className="bg-white dark:bg-zinc-950 text-foreground dark:text-zinc-100 border border-border dark:border-zinc-800/80 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <CardContent className="flex flex-col justify-between p-5 h-full min-h-[140px]">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-muted-foreground dark:text-zinc-400">Active Buyers</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/60 dark:bg-zinc-900">
                <ArrowUpRight className="h-4 w-4 stroke-[2] text-foreground dark:text-zinc-200" />
              </div>
            </div>
            <div className="mt-2.5">
              {isLoading ? (
                <div className="h-9 w-20 animate-pulse rounded bg-zinc-100 dark:bg-zinc-850" />
              ) : (
                <div className="text-3xl font-bold tracking-tight">
                  {overview ? overview.activeBuyers : '0'}
                </div>
              )}
              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-[#107B43] dark:text-emerald-400">
                <TrendingUp className="h-3 w-3 stroke-[2]" />
                <span>Increased from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Repeat Buyers */}
        <Card className="bg-white dark:bg-zinc-950 text-foreground dark:text-zinc-100 border border-border dark:border-zinc-800/80 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <CardContent className="flex flex-col justify-between p-5 h-full min-h-[140px]">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-muted-foreground dark:text-zinc-400">Repeat Buyers</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/60 dark:bg-zinc-900">
                <ArrowUpRight className="h-4 w-4 stroke-[2] text-foreground dark:text-zinc-200" />
              </div>
            </div>
            <div className="mt-2.5">
              {isLoading ? (
                <div className="h-9 w-20 animate-pulse rounded bg-zinc-100 dark:bg-zinc-850" />
              ) : (
                <div className="text-3xl font-bold tracking-tight">
                  {overview ? overview.repeatBuyers : '0'}
                </div>
              )}
              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-[#107B43] dark:text-emerald-400">
                <TrendingUp className="h-3 w-3 stroke-[2]" />
                <span>Increased from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Pending Inspections */}
        <Card className="bg-white dark:bg-zinc-950 text-foreground dark:text-zinc-100 border border-border dark:border-zinc-800/80 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <CardContent className="flex flex-col justify-between p-5 h-full min-h-[140px]">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-muted-foreground dark:text-zinc-400">Pending Inspections</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/60 dark:bg-zinc-900">
                <ArrowUpRight className="h-4 w-4 stroke-[2] text-foreground dark:text-zinc-200" />
              </div>
            </div>
            <div className="mt-2.5">
              {isLoading ? (
                <div className="h-9 w-20 animate-pulse rounded bg-zinc-100 dark:bg-zinc-850" />
              ) : (
                <div className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                  {quality ? quality.pending : '0'}
                </div>
              )}
              <div className="mt-2 text-[10px] font-semibold text-amber-600 dark:text-amber-400">On Discuss</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Grid (Bar Chart, Reminders, Project Tasks) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Project Analytics Card */}
        <Card className="bg-white dark:bg-zinc-950 border border-border dark:border-zinc-800/80 lg:col-span-2">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground dark:text-white">Project Analytics</h3>
                <p className="text-[11px] text-muted-foreground dark:text-zinc-400">Quality inspection grading breakdown</p>
              </div>
              {quality && quality.totalInspections > 0 && (
                <div className="flex h-6 items-center rounded-md bg-[#107B43]/15 dark:bg-emerald-500/15 px-2 py-0.5 text-[9px] font-semibold text-[#107B43] dark:text-emerald-400">
                  {quality.totalInspections} total
                </div>
              )}
            </div>

            {quality ? (
              quality.totalInspections > 0 ? (
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={qualityData} margin={{ top: 20, right: 10, bottom: 5, left: -20 }}>
                      <defs>
                        <pattern id="greenStripes" width="12" height="12" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                          <line x1="0" y1="0" x2="0" y2="12" stroke="#107B43" strokeWidth="3" strokeOpacity="0.3" />
                        </pattern>
                        <pattern id="neutralStripes" width="12" height="12" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                          <line x1="0" y1="0" x2="0" y2="12" stroke="#9a988f" strokeWidth="3" strokeOpacity="0.3" />
                        </pattern>
                      </defs>
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16, 123, 67, 0.04)' }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={28}>
                        {qualityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getCellFill(entry.fillType)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-[220px] items-center justify-center">
                  <p className="text-sm text-muted-foreground">No inspections recorded yet.</p>
                </div>
              )
            ) : (
              <div className="flex h-[220px] items-center justify-center">
                <div className="h-4 w-32 animate-pulse rounded bg-muted dark:bg-zinc-800" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alerts & Reminders Card (Dynamic Delivery/Inspection actions) */}
        <Card className="bg-white dark:bg-zinc-950 border border-border dark:border-zinc-800/80 lg:col-span-1">
          <CardContent className="flex flex-col justify-between p-6 h-full min-h-[290px]">
            <div>
              <h3 className="text-sm font-semibold text-foreground dark:text-white mb-4">Reminders</h3>
              {isLoading ? (
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 p-4 space-y-2 text-left">
                  <div className="h-3 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4.5 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-3 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              ) : pendingInspections > 0 ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-red-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Action Required</span>
                  </div>
                  <h4 className="mt-2.5 text-sm font-bold leading-tight text-red-950 dark:text-red-300">
                    {pendingInspections} Quality Inspections Pending
                  </h4>
                  <p className="mt-1 text-[10px] font-medium text-red-700 dark:text-red-400">
                    Check the Quality Check tab.
                  </p>
                </div>
              ) : latestDelivery ? (
                <div className="rounded-2xl border border-[#107B43]/20 bg-[#107B43]/5 p-4 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#107B43] dark:text-emerald-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Latest Dispatch</span>
                  </div>
                  <h4 className="mt-2.5 text-sm font-bold leading-tight text-[#042A16] dark:text-emerald-300">
                    Order {latestDelivery.orderCode}
                  </h4>
                  <p className="mt-1 text-[10px] font-medium text-muted-foreground/80 dark:text-zinc-400 leading-tight">
                    Driver: {latestDelivery.driverName || 'Unassigned'} <br />
                    Status: <span className="uppercase text-[9px] font-semibold text-[#107B43] dark:text-emerald-400">{latestDelivery.status.replace('_', ' ')}</span>
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Operations Status</span>
                  </div>
                  <h4 className="mt-2.5 text-sm font-bold leading-tight text-zinc-700 dark:text-zinc-300">
                    All Systems Healthy
                  </h4>
                  <p className="mt-1 text-[10px] font-medium text-zinc-500">
                    No urgent dispatches or inspections.
                  </p>
                </div>
              )}
            </div>

            {pendingInspections > 0 ? (
              <NavLink to="/quality-check" className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-red-600 hover:bg-red-700 py-2.5 text-center text-xs font-semibold text-white shadow-sm transition-all active:scale-95">
                <Video className="h-3.5 w-3.5" />
                <span>Inspect Quality</span>
              </NavLink>
            ) : latestDelivery ? (
              <NavLink to="/deliveries" className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#107B43] hover:bg-[#158C4F] py-2.5 text-center text-xs font-semibold text-white shadow-sm transition-all active:scale-95">
                <Video className="h-3.5 w-3.5" />
                <span>Track Delivery</span>
              </NavLink>
            ) : (
              <button className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-zinc-200 dark:bg-zinc-800 py-2.5 text-center text-xs font-semibold text-muted-foreground dark:text-zinc-400 shadow-sm" disabled>
                <Video className="h-3.5 w-3.5" />
                <span>Stable</span>
              </button>
            )}
          </CardContent>
        </Card>

        {/* Project Tasks Card (Real Buyer Requests) */}
        <Card className="bg-white dark:bg-zinc-950 border border-border dark:border-zinc-800/80 lg:col-span-1">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground dark:text-white">Recent Demands</h3>
              <button className="inline-flex items-center justify-center gap-1 rounded-md border border-border bg-white dark:bg-zinc-950 px-2 py-0.5 text-[10px] font-semibold text-foreground dark:text-zinc-300 hover:bg-muted/30 dark:hover:bg-zinc-900">
                <Plus className="h-2.5 w-2.5" /> New
              </button>
            </div>

            <div className="space-y-3.5">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 h-3.5 w-3.5 shrink-0 animate-pulse rounded bg-zinc-100 dark:bg-zinc-850" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-850" />
                      <div className="h-2.5 w-1/2 animate-pulse rounded bg-zinc-100 dark:bg-zinc-850" />
                    </div>
                  </div>
                ))
              ) : requestsList.length > 0 ? (
                requestsList.map((req) => {
                  let badgeColor = 'bg-blue-500';
                  if (req.status === 'matched') badgeColor = 'bg-amber-500';
                  if (req.status === 'fulfilled') badgeColor = 'bg-emerald-500';
                  if (req.status === 'cancelled') badgeColor = 'bg-zinc-400';

                  return (
                    <div key={req.id} className="flex items-start gap-3 text-left">
                      <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-muted/40 dark:bg-zinc-850">
                        <div className={`h-2 w-2 rounded-full ${badgeColor}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-semibold leading-tight text-foreground dark:text-zinc-200 hover:text-[#107B43] dark:hover:text-emerald-400 cursor-pointer">
                          {req.cropName} for {req.buyerName}
                        </div>
                        <div className="text-[9px] font-normal text-muted-foreground/80 dark:text-zinc-400 mt-0.5">
                          Need {req.qty} {req.unit} by {req.neededBy}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="py-8 text-center text-xs text-muted-foreground">No recent requests recorded.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Grid (Team Collaboration, Project Progress, Time Tracker) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
        {/* Team Collaboration Card (Real registered user accounts from backend) */}
        <Card className="bg-white dark:bg-zinc-950 border border-border dark:border-zinc-800/80 lg:col-span-4">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground dark:text-white">Active Accounts</h3>
              <button className="inline-flex items-center justify-center gap-1 rounded-md border border-[#107B43] dark:border-emerald-500 bg-white dark:bg-zinc-950 px-2.5 py-0.5 text-[10px] font-semibold text-[#107B43] dark:text-emerald-400 hover:bg-[#107B43]/5 dark:hover:bg-emerald-500/5">
                <Plus className="h-2.5 w-2.5" /> Add Member
              </button>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-850" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-100 dark:bg-zinc-850" />
                        <div className="h-2.5 w-1/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-850" />
                      </div>
                    </div>
                    <div className="h-4 w-12 animate-pulse rounded bg-zinc-100 dark:bg-zinc-850" />
                  </div>
                ))
              ) : usersList.length > 0 ? (
                usersList.map((usr) => (
                  <div key={usr.id} className="flex items-center justify-between gap-2 text-left">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-900 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        {usr.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-semibold text-foreground dark:text-zinc-200">{usr.name}</div>
                        <div className="truncate text-[9px] font-medium text-muted-foreground/80 dark:text-zinc-400 mt-0.5 uppercase tracking-wide">
                          {usr.role.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-md px-2 py-0.5 text-[9px] font-semibold bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                      Active
                    </span>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-xs text-muted-foreground">No accounts registered.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Project Progress Gauge Card (30% width) */}
        <Card className="bg-white dark:bg-zinc-950 border border-border dark:border-zinc-800/80 lg:col-span-3">
          <CardContent className="flex flex-col justify-between p-6 h-full min-h-[290px]">
            <h3 className="text-sm font-semibold text-foreground dark:text-white mb-2 text-left">Project Progress</h3>

            {/* Custom Semicircle SVG Gauge */}
            <div className="relative flex items-center justify-center h-28 my-2">
              <svg viewBox="0 0 100 50" className="w-full max-w-[150px]">
                {/* Background arc */}
                <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" stroke="currentColor" className="text-[#F1F3F3] dark:text-zinc-800" strokeWidth="12" strokeLinecap="round" />
                {/* Stripe pending arc placeholder (full width background detail) */}
                <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" stroke="url(#greenStripes)" strokeWidth="12" strokeLinecap="round" />
                {/* Progress arc */}
                <path
                  d="M 10,50 A 40,40 0 0 1 90,50"
                  fill="none"
                  stroke="#107B43"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray="125"
                  strokeDashoffset={125 - (125 * deliveryRate)}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Text indicator inside gauge */}
              <div className="absolute bottom-2 flex flex-col items-center">
                <span className="text-2xl font-bold tracking-tight text-[#042A16] dark:text-emerald-300">
                  {formatPercent(deliveryRate)}
                </span>
                <span className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground dark:text-zinc-400 mt-0.5">
                  On-Time Delivery
                </span>
              </div>
            </div>

            {/* Legend indicators */}
            <div className="flex items-center justify-between gap-1 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[#107B43]" />
                <span className="text-[9px] font-semibold text-muted-foreground dark:text-zinc-400">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[#107B43]/50" />
                <span className="text-[9px] font-semibold text-muted-foreground dark:text-zinc-400">In Progress</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded bg-stripes" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(16,123,67,0.4) 2px, rgba(16,123,67,0.4) 4px)' }} />
                <span className="text-[9px] font-semibold text-muted-foreground dark:text-zinc-400 ml-1">Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Tracker Card (30% width) */}
        <Card className="relative overflow-hidden bg-gradient-to-b from-[#094F29] to-[#042A16] dark:from-[#052E17] dark:to-[#021A0E] text-white border-none lg:col-span-3 transition-all hover:shadow-lg">
          {/* Abstract wavy mesh background */}
          <svg className="absolute inset-0 h-full w-full opacity-5 pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-50 20C0 40 50 0 100 20C150 40 200 0 250 20C300 40 350 0 400 20" stroke="white" strokeWidth="2.5" />
            <path d="M-50 40C0 60 50 20 100 40C150 60 200 20 250 40C300 60 350 20 400 40" stroke="white" strokeWidth="2.5" />
          </svg>
          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#107B43]/20 blur-xl pointer-events-none" />

          <CardContent className="flex flex-col justify-between p-6 h-full min-h-[290px] relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/80">Time Tracker</span>
              <Clock className="h-4 w-4 stroke-[2]" />
            </div>

            {/* Live Clock Display */}
            <div className="my-4 text-center">
              <div className="text-3xl font-bold tracking-widest font-mono tabular-nums leading-none">
                {formatTimePart(time.hours)}:{formatTimePart(time.minutes)}:{formatTimePart(time.seconds)}
              </div>
              <span className="mt-1.5 inline-block rounded bg-white/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-white/80">
                {isTicking ? 'Tracker Active' : 'Tracker Paused'}
              </span>
            </div>

            {/* Play/Pause & Reset controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsTicking(!isTicking)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#042A16] shadow transition-all hover:scale-105 hover:bg-slate-50 active:scale-95"
                title={isTicking ? 'Pause Tracker' : 'Start Tracker'}
              >
                {isTicking ? <Pause className="h-4.5 w-4.5 fill-current" /> : <Play className="h-4.5 w-4.5 fill-current ml-0.5" />}
              </button>
              <button
                onClick={() => {
                  setIsTicking(false);
                  setTime({ hours: 0, minutes: 0, seconds: 0 });
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
                title="Reset Tracker"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
