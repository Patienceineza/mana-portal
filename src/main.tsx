import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';

import App from './App';
import { AuthProvider } from '@/lib/auth';
import { ThemeProvider } from '@/lib/theme';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          closeButton
          style={
            {
              '--normal-bg': 'hsl(var(--card))',
              '--normal-text': 'hsl(var(--card-foreground))',
              '--normal-border': 'hsl(var(--border))',
              '--success-bg': 'hsl(var(--card))',
              '--success-text': 'hsl(var(--card-foreground))',
              '--success-border': '#0ca30c',
              '--error-bg': 'hsl(var(--card))',
              '--error-text': 'hsl(var(--card-foreground))',
              '--error-border': 'hsl(var(--destructive))',
              '--border-radius': 'var(--radius)',
            } as React.CSSProperties
          }
          toastOptions={{
            classNames: {
              toast: 'shadow-lg font-sans border-l-4',
              title: 'text-sm font-medium',
              description: 'text-sm text-muted-foreground',
              actionButton: 'bg-primary text-primary-foreground',
              cancelButton: 'bg-secondary text-secondary-foreground',
              closeButton: 'bg-card border-border text-muted-foreground',
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
