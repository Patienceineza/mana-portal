import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';

import { formatRelativeTime } from '@/lib/format';
import { getUnreadCount, listNotifications, markAllNotificationsRead, markNotificationRead, Notification } from '@/lib/notifications';
import { cn } from '@/lib/utils';

const POLL_INTERVAL_MS = 30000;

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const refreshCount = useCallback(() => {
    getUnreadCount()
      .then((res) => setCount(res.unreadCount))
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshCount();
    const interval = setInterval(refreshCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refreshCount]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const toggleOpen = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setLoading(true);
      try {
        const res = await listNotifications(1);
        setItems(res.items);
      } finally {
        setLoading(false);
      }
    }
  };

  const onPressItem = async (n: Notification) => {
    if (n.read) return;
    setItems((prev) => prev.map((it) => (it.id === n.id ? { ...it, read: true } : it)));
    setCount((c) => Math.max(0, c - 1));
    try {
      await markNotificationRead(n.id);
    } catch {
      // best-effort
    }
  };

  const onMarkAllRead = async () => {
    setItems((prev) => prev.map((it) => ({ ...it, read: true })));
    setCount(0);
    try {
      await markAllNotificationsRead();
    } catch {
      // best-effort
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={toggleOpen}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border dark:border-zinc-800 bg-white dark:bg-zinc-950 text-muted-foreground/80 dark:text-zinc-400 transition-colors hover:bg-muted/40 dark:hover:bg-zinc-900/60"
      >
        <Bell className="h-4 w-4 stroke-[2]" />
        {count > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-red-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-border dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl">
          <div className="flex items-center justify-between border-b border-border/60 dark:border-zinc-800/80 px-4 py-3">
            <span className="text-sm font-bold text-foreground dark:text-white">Notifications</span>
            {items.some((i) => !i.read) && (
              <button
                onClick={onMarkAllRead}
                className="text-xs font-semibold text-[#107B43] hover:text-[#0c5c32] dark:text-emerald-400"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && <div className="px-4 py-8 text-center text-xs text-muted-foreground">Loading…</div>}
            {!loading && items.length === 0 && (
              <div className="px-4 py-8 text-center text-xs text-muted-foreground">You're all caught up.</div>
            )}
            {!loading &&
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => onPressItem(n)}
                  className={cn(
                    'flex w-full flex-col gap-0.5 border-b border-border/40 dark:border-zinc-800/60 px-4 py-3 text-left last:border-b-0 transition-colors hover:bg-muted/40 dark:hover:bg-zinc-900/60',
                    !n.read && 'bg-emerald-50/60 dark:bg-emerald-500/5'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#107B43] dark:bg-emerald-400" />}
                    <span className="text-xs font-bold text-foreground dark:text-white">{n.title}</span>
                  </div>
                  {n.body && <span className="text-xs text-muted-foreground/90 dark:text-zinc-400">{n.body}</span>}
                  <span className="text-[10px] text-muted-foreground/70 dark:text-zinc-500">{formatRelativeTime(n.createdAt)}</span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
