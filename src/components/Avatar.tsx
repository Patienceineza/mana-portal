import { cn } from '@/lib/utils';

// Simple generated avatar: initials on a color picked deterministically from
// the name, so every user gets a distinct but stable look with no photo
// upload required. Mirrors the same scheme used in the mobile app.
const PALETTE = ['#2E7D32', '#1565C0', '#8E24AA', '#D84315', '#00838F', '#6D4C41', '#AD1457', '#37474F', '#F9A825', '#5E35B1'];

function hashColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export function Avatar({ name, size = 36, className }: AvatarProps) {
  const bg = hashColor(name || '?');
  return (
    <div
      className={cn('flex shrink-0 items-center justify-center rounded-full font-bold text-white', className)}
      style={{ width: size, height: size, backgroundColor: bg, fontSize: size * 0.4 }}
    >
      {initials(name)}
    </div>
  );
}
