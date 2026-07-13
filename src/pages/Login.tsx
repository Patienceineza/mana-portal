import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const { user, isLoading, login, error } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isLoading && user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(identifier, password);
    } catch {
      // error surfaced via auth context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F4F6F6] dark:bg-zinc-900 text-foreground transition-colors duration-200">
      {/* Left Column: Premium Brand Showcase (Hidden on Mobile) */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-[#094F29] to-[#042A16] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        {/* Abstract Background SVGs */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.08] pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-[#107B43]/20 blur-3xl" />
        <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-[#C8E6C9]/10 blur-3xl" />

        {/* Branding Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md p-1.5">
            <img src="/logo-mark.png" alt="Mana Portal" className="h-full w-full object-contain" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">Mana Portal</span>
        </div>

        {/* Feature Tagline & Showcase */}
        <div className="relative z-10 my-auto max-w-md space-y-8">
          <h2 className="text-4xl font-black leading-tight tracking-tight">
            Operations monitoring for the Mana coordination pilot.
          </h2>

          {/* Floating Glassmorphic Task Card Mockup */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/20 hover:bg-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">Live Health Check</span>
              </div>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300">Active</span>
            </div>
            <h4 className="text-base font-bold text-white leading-snug">
              On-Time Delivery & Quality Coordination Pilot
            </h4>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-semibold text-white/80">
                <span>Target Fulfillment</span>
                <span>82% Delivery Rate</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-400" style={{ width: '82%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-white/60">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Secured by Mana Portal Operations Framework</span>
        </div>
      </div>

      {/* Right Column: Form Panel (Full screen on mobile, split on desktop) */}
      <div className="flex w-full flex-col justify-center bg-white dark:bg-zinc-950 px-6 py-12 lg:w-1/2 lg:px-16 transition-colors duration-200">
        <div className="mx-auto w-full max-w-md space-y-8 text-left">
          {/* Logo visible on Mobile layout */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#107B43]/10 p-1.5">
              <img src="/logo-mark.png" alt="Mana Portal" className="h-full w-full object-contain" />
            </div>
            <span className="text-lg font-extrabold text-foreground">Mana Portal</span>
          </div>

          {/* Heading */}
          <div>
            <h3 className="text-2xl font-black tracking-tight text-foreground dark:text-white lg:text-3xl">Welcome back</h3>
            <p className="mt-1.5 text-sm font-semibold text-muted-foreground/80 dark:text-zinc-400">
              Sign in to your Mana Portal account to continue.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 rounded-2xl bg-red-50 dark:bg-red-950/20 p-4 text-sm font-semibold text-red-700 dark:text-red-400 border border-red-200/50 dark:border-red-900/30">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 stroke-[2.5]" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email or Phone Field */}
            <div className="space-y-1.5">
              <label htmlFor="identifier" className="text-xs font-bold text-muted-foreground/95 dark:text-zinc-400 uppercase tracking-wider pl-1">
                Email or Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-4.5 w-4.5 text-muted-foreground/60 dark:text-zinc-500" />
                </span>
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@company.com or +254712345678"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30 py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition-all duration-200 focus:border-[#107B43] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-[#107B43]/15 dark:focus:ring-emerald-500/15 shadow-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-foreground dark:text-zinc-100"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label htmlFor="password" className="text-xs font-bold text-muted-foreground/95 dark:text-zinc-400 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-4.5 w-4.5 text-muted-foreground/60 dark:text-zinc-500" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30 py-3.5 pl-11 pr-12 text-sm font-medium outline-none transition-all duration-200 focus:border-[#107B43] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-[#107B43]/15 dark:focus:ring-emerald-500/15 shadow-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-foreground dark:text-zinc-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground/80 dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-200"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#042A16] dark:bg-emerald-600 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#094F29] dark:hover:bg-emerald-500 hover:shadow-lg hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            >
              {submitting ? (
                <span>Signing in…</span>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="rounded-2xl bg-[#F4F6F6] dark:bg-zinc-900/40 p-4 text-[11px] font-semibold text-muted-foreground/90 dark:text-zinc-400 leading-relaxed border border-border/40 dark:border-zinc-800/40">
            💡 <strong className="text-foreground dark:text-zinc-200">New admin/finance account?</strong> Activate it first in the Mana mobile app using the activation code emailed to you.
          </div>
        </div>
      </div>
    </div>
  );
}
