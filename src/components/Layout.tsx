import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCog,
  Users,
  Store,
  ClipboardList,
  ShoppingCart,
  BadgeCheck,
  Truck,
  Wallet,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Search,
  ChevronRight,
  Home,
} from 'lucide-react';

import { useAuth } from '@/lib/auth';
import { useThemePreference } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { NotificationBell } from '@/components/NotificationBell';
import type { Role } from '@/lib/types';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  roles: Role[];
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true, roles: ['admin', 'finance'] },
  { to: '/users', label: 'Users', icon: UserCog, roles: ['admin', 'finance'] },
  { to: '/farmers', label: 'Farmers', icon: Users, roles: ['admin', 'finance'] },
  { to: '/buyers', label: 'Buyers', icon: Store, roles: ['admin', 'finance'] },
  { to: '/buyer-requests', label: 'Buyer Requests', icon: ClipboardList, roles: ['admin', 'finance'], badge: '12+' },
  { to: '/orders', label: 'Orders', icon: ShoppingCart, roles: ['admin', 'finance'] },
  { to: '/quality', label: 'Quality Overview', icon: BadgeCheck, roles: ['admin', 'finance'] },
  { to: '/quality-check', label: 'Quality Check', icon: BadgeCheck, roles: ['admin', 'quality_checker'] },
  { to: '/deliveries', label: 'Deliveries', icon: Truck, roles: ['admin', 'finance'] },
  { to: '/payments', label: 'Payments', icon: Wallet, roles: ['admin', 'finance'] },
];

function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getLabel = (path: string) => {
    switch (path) {
      case 'users':
        return 'Users';
      case 'farmers':
        return 'Farmers';
      case 'buyers':
        return 'Buyers';
      case 'buyer-requests':
        return 'Buyer Requests';
      case 'orders':
        return 'Orders';
      case 'quality':
        return 'Quality Overview';
      case 'quality-check':
        return 'Quality Check';
      case 'deliveries':
        return 'Deliveries';
      case 'payments':
        return 'Payments';
      default:
        return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
    }
  };

  return (
    <nav className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground/80 dark:text-zinc-400 mb-6 shrink-0">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-foreground dark:hover:text-zinc-200 transition-colors"
      >
        <Home className="h-3 w-3" />
        <span>Home</span>
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = getLabel(value);

        return (
          <div key={to} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-muted-foreground/40 dark:text-zinc-600" />
            {isLast ? (
              <span className="text-foreground dark:text-white font-bold">{label}</span>
            ) : (
              <Link
                to={to}
                className="hover:text-foreground dark:hover:text-zinc-200 transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export function Layout() {
  const { user, logout } = useAuth();
  const { preference, setPreference } = useThemePreference();

  const visibleItems = NAV_ITEMS.filter((item) => user && item.roles.includes(user.role));

  return (
    <div className="flex min-h-screen w-full bg-[#F4F6F6] dark:bg-zinc-900 text-foreground dark:text-zinc-100 transition-colors duration-200">
      {/* Sidebar - Stacks elements naturally with compact margins to remove excessive empty space */}
      <aside className="relative flex w-64 shrink-0 flex-col bg-[#042A16] dark:bg-zinc-950 border-r border-[#021A0E] dark:border-zinc-800/80 text-white dark:text-zinc-100 px-5 py-6 transition-colors duration-200 gap-y-4">
        {/* Branding Logo */}
        <div className="flex items-center gap-3 px-1 shrink-0 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 dark:bg-emerald-500/10 p-1.5 shrink-0">
            <img src="/logo-mark.png" alt="Mana Portal" className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0">
            <div className="text-base font-extrabold tracking-tight text-white dark:text-white truncate">Mana Portal</div>
          </div>
        </div>

        {/* Navigation - Flat List (Natural stack without flex-1 stretching) */}
        <div className="space-y-1 overflow-y-auto pr-1 shrink-0">
          <nav className="space-y-1">
            {visibleItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'text-white bg-[#107B43] shadow-md dark:text-emerald-400 dark:bg-emerald-500/5 dark:shadow-none'
                      : 'text-zinc-300 hover:bg-white/10 hover:text-white dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-white dark:bg-emerald-50" />
                    )}
                    <item.icon className={cn('h-4 w-4 stroke-[2] shrink-0', isActive ? 'text-white dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-500')} />
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto rounded-md bg-[#107B43] dark:bg-emerald-600 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Area: Theme Preference, Logout & Mobile Ad */}
        <div className="space-y-4 pt-4 border-t border-white/10 dark:border-zinc-800/80 shrink-0 mt-1">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-red-950/40 hover:text-red-300 dark:text-zinc-400 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="h-4 w-4 stroke-[2] text-zinc-400 dark:text-zinc-500" />
            <span>Logout</span>
          </button>

          {/* Theme switcher */}
          <div className="flex items-center gap-1 rounded-xl bg-black/20 dark:bg-zinc-900 p-1">
            {(['light', 'system', 'dark'] as const).map((opt) => {
              const Icon = opt === 'light' ? Sun : opt === 'dark' ? Moon : Monitor;
              return (
                <button
                  key={opt}
                  onClick={() => setPreference(opt)}
                  className={cn(
                    'flex flex-1 items-center justify-center rounded-lg py-1.5 text-xs font-semibold transition-all duration-200',
                    preference === opt
                      ? 'bg-white/10 text-white shadow-inner dark:bg-zinc-800 dark:text-emerald-400 dark:shadow-sm'
                      : 'text-zinc-400 hover:text-white dark:text-zinc-400 dark:hover:text-zinc-200'
                  )}
                  aria-label={opt}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              );
            })}
          </div>

          {/* Download App Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 dark:bg-gradient-to-b dark:from-[#052E17] dark:to-[#021A0E] dark:border-none p-4 text-white shadow-md">
            {/* Wavy Background Mesh */}
            <svg className="absolute inset-0 h-full w-full opacity-10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-20 40C20 60 40 20 80 40C120 60 140 20 180 40C220 60 240 20 280 40" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M-20 60C20 80 40 40 80 60C120 80 140 40 180 60C220 80 240 40 280 60" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <div className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-[#107B43]/30 blur-lg" />

            <div className="relative z-10 flex flex-col">
              {/* App Icon */}
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <circle cx="12" cy="18" r="1" fill="currentColor" />
                </svg>
              </div>
              <h4 className="text-xs font-bold leading-snug">Download our Mobile App</h4>
              <p className="mt-0.5 text-[9px] text-white/70">Get easy in another way.</p>
              <button
                onClick={() => alert('Download requested')}
                className="mt-3.5 w-full rounded-full bg-[#107B43] py-2 text-center text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#158C4F] hover:shadow"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-8 py-8 flex flex-col min-h-screen">
          {/* Top Search & Profile Row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 shrink-0">
            {/* Search bar */}
            <div className="relative w-full max-w-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-muted-foreground/60 dark:text-zinc-500" />
              </span>
              <input
                type="text"
                placeholder="Search task"
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30 py-2 pl-9 pr-12 text-sm font-medium text-foreground dark:text-zinc-100 outline-none transition-all duration-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-primary/80 focus:bg-white dark:focus:bg-zinc-950 focus:ring-4 focus:ring-primary/15"
              />
              <kbd className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="rounded-md border border-border/80 dark:border-zinc-800 bg-muted dark:bg-zinc-900 px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground/80 dark:text-zinc-400">
                  ⌘ F
                </span>
              </kbd>
            </div>

            {/* Messaging, Alerts & Active Profile */}
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <div className="flex items-center gap-2.5">
                <NotificationBell />
              </div>

              <div className="flex items-center gap-2.5 border-l border-border/60 dark:border-zinc-800/80 pl-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-lg font-bold">
                  🧑‍💻
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight text-foreground dark:text-white truncate max-w-[120px]">{user?.name || 'Totok Michael'}</div>
                  <div className="text-[10px] font-medium leading-none text-muted-foreground/80 dark:text-zinc-400 mt-0.5 truncate max-w-[120px]">
                    {user?.email || 'tmichael20@gmail.com'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1">
            <Breadcrumbs />
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
