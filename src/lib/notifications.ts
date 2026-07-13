import { api } from './api';

export interface Notification {
  id: string;
  kind: string;
  title: string;
  body: string;
  data: Record<string, string>;
  read: boolean;
  createdAt: string;
}

interface PaginatedNotifications {
  items: Notification[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function listNotifications(page = 1): Promise<PaginatedNotifications> {
  return api.get(`/notifications?page=${page}`);
}

export function getUnreadCount(): Promise<{ unreadCount: number }> {
  return api.get('/notifications/unread-count');
}

export function markNotificationRead(id: string): Promise<void> {
  return api.post(`/notifications/${id}/read`);
}

export function markAllNotificationsRead(): Promise<void> {
  return api.post('/notifications/read-all');
}
