export type Role = 'buyer' | 'farmer' | 'coordinator' | 'driver' | 'admin' | 'finance' | 'quality_checker';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone: string;
  authProvider: 'password' | 'google';
  emailVerified: boolean;
  activated: boolean;
  createdAt: string;
}

export type ProvisionableRole = 'farmer' | 'coordinator' | 'driver' | 'finance' | 'admin' | 'quality_checker';

export interface CreateUserResult {
  id: string;
  emailSent: boolean;
  activationCode?: string;
  emailError?: string;
}

export interface AdminOverview {
  repeatBuyers: number;
  activeBuyers: number;
  activeFarmers: number;
  weeklyOrderValue: number;
  commissionRevenue: number;
  rejectedProduceRate: number;
  onTimeDeliveryRate: number;
  farmerFulfillmentRate: number;
  unpaidBuyerBalance: number;
}

export interface AdminFarmer {
  id: string;
  name: string;
  farmName: string;
  region: string;
  harvestLogs: number;
  collectedLogs: number;
  totalPaidOut: number;
}

export interface AdminBuyer {
  id: string;
  name: string;
  businessName: string;
  totalOrders: number;
  totalSpend: number;
  unpaidBalance: number;
}

export type PaymentStatus = 'unpaid' | 'paid';
export type DeliveryStatus = 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';

export interface AdminOrder {
  id: string;
  orderCode: string;
  buyerName: string;
  total: number;
  paymentStatus: PaymentStatus;
  trackingStage: number;
  deliveryStatus: DeliveryStatus;
  createdAt: string;
}

export interface AdminQuality {
  totalInspections: number;
  passed: number;
  rejected: number;
  pending: number;
  gradeA: number;
  gradeB: number;
  gradeC: number;
}

export interface AdminDelivery {
  id: string;
  orderCode: string;
  status: DeliveryStatus;
  driverName: string | null;
  notes: string;
  createdAt: string;
}

export interface AdminInvoice {
  orderCode: string;
  buyerName: string;
  total: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface AdminPayout {
  farmerName: string;
  cropLabel: string;
  amount: number;
  status: 'pending' | 'paid';
  paidAt: string | null;
}

export interface AdminPayments {
  unpaidInvoicesTotal: number;
  paidInvoicesTotal: number;
  pendingPayoutsTotal: number;
  paidPayoutsTotal: number;
  recentInvoices: AdminInvoice[];
  recentPayouts: AdminPayout[];
}

export interface AdminBuyerRequest {
  id: string;
  buyerName: string;
  cropName: string;
  qty: number;
  unit: string;
  neededBy: string;
  preferredGrade: 'A' | 'B' | 'C' | 'any';
  status: 'open' | 'matched' | 'fulfilled' | 'cancelled';
  createdAt: string;
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
  businessName?: string;
  address?: string;
  farmName?: string;
  region?: string;
  vehicleLabel?: string;
}

export interface QcPhoto {
  stage: string;
  uploaded: boolean;
}

export interface QcInspection {
  id: string;
  farm: string;
  crop: string;
  img: string;
  expectedWeight: number;
  actualWeight: number | null;
  stage: string;
  status: 'pending' | 'passed' | 'rejected';
  qualityGrade: 'A' | 'B' | 'C' | null;
  notes: string;
  photos: QcPhoto[];
}
