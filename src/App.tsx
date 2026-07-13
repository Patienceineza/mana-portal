import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from '@/lib/auth';
import { Layout } from '@/components/Layout';
import LoginPage from '@/pages/Login';
import DashboardPage from '@/pages/Dashboard';
import UsersPage from '@/pages/Users';
import FarmersPage from '@/pages/Farmers';
import BuyersPage from '@/pages/Buyers';
import BuyerRequestsPage from '@/pages/BuyerRequests';
import OrdersPage from '@/pages/Orders';
import QualityPage from '@/pages/Quality';
import QualityCheckPage from '@/pages/QualityCheck';
import DeliveriesPage from '@/pages/Deliveries';
import PaymentsPage from '@/pages/Payments';
import ProfilePage from '@/pages/Profile';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function HomeRoute() {
  const { user } = useAuth();
  // quality_checker has no access to /admin/* endpoints the Dashboard needs,
  // so its home is the page it can actually use.
  if (user?.role === 'quality_checker') return <Navigate to="/quality-check" replace />;
  return <DashboardPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<HomeRoute />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/farmers" element={<FarmersPage />} />
          <Route path="/buyers" element={<BuyersPage />} />
          <Route path="/buyer-requests" element={<BuyerRequestsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/quality" element={<QualityPage />} />
          <Route path="/quality-check" element={<QualityCheckPage />} />
          <Route path="/deliveries" element={<DeliveriesPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
