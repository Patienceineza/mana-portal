import { useState } from 'react';
import { toast } from 'sonner';

import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/format';
import { usePaginatedList } from '@/lib/usePaginatedList';
import { isValidPhone } from '@/lib/validation';
import type { AdminUser, CreateUserResult, ProvisionableRole, UpdateUserInput } from '@/lib/types';
import { Avatar } from '@/components/Avatar';
import { PageHeader } from '@/components/PageHeader';
import { Pagination } from '@/components/Pagination';
import { StatusPill } from '@/components/StatusPill';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/Modal';

const PROVISIONABLE_ROLES: ProvisionableRole[] = ['farmer', 'coordinator', 'driver', 'finance', 'admin', 'quality_checker'];


function roleLabel(r: string) {
  return r
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function UsersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { items: users, page, setPage, total, totalPages, pageSize, loading, reload } = usePaginatedList<AdminUser>('/admin/users');

  const [showForm, setShowForm] = useState(false);
  const [result, setResult] = useState<CreateUserResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [roleUpdating, setRoleUpdating] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<ProvisionableRole>('coordinator');
  const [farmName, setFarmName] = useState('');
  const [region, setRegion] = useState('');
  const [vehicleLabel, setVehicleLabel] = useState('');

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  const resetForm = () => {
    setEmail('');
    setName('');
    setPhone('');
    setRole('coordinator');
    setFarmName('');
    setRegion('');
    setVehicleLabel('');
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhone(phone)) {
      toast.error('Enter a valid phone number', { description: 'Include the country code, e.g. +254712345678.' });
      return;
    }
    setResult(null);
    setSubmitting(true);
    try {
      const res = await api.post<CreateUserResult>('/admin/users', {
        email,
        name,
        phone,
        role,
        farmName: role === 'farmer' ? farmName : undefined,
        region: role === 'farmer' || role === 'coordinator' ? region : undefined,
        vehicleLabel: role === 'driver' ? vehicleLabel : undefined,
      });
      if (res.emailSent) {
        toast.success('User created', { description: `Activation email sent to ${email}.` });
      } else {
        setResult(res);
        toast(res.activationCode ? 'User created' : 'User created, but the activation email failed', {
          description: res.activationCode ? 'Share the activation code shown below with the user.' : res.emailError,
        });
      }
      resetForm();
      setShowForm(false);
      await reload();
    } catch (err) {
      toast.error('Could not create user', {
        description: err instanceof ApiError ? err.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const changeRole = async (id: string, newRole: string) => {
    setRoleUpdating(id);
    try {
      await api.patch(`/admin/users/${id}/role`, { role: newRole });
      await reload();
      toast.success('Role updated');
    } catch (err) {
      toast.error('Could not update role', {
        description: err instanceof ApiError ? err.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setRoleUpdating(null);
    }
  };

  const resendActivation = async (id: string) => {
    try {
      const res = await api.post<CreateUserResult>(`/admin/users/${id}/resend-activation`);
      if (res.emailSent) {
        toast.success('Activation email resent');
      } else {
        setResult(res);
        toast(res.activationCode ? 'Activation code ready' : 'Could not resend the activation email', {
          description: res.activationCode ? 'Share the activation code shown below with the user.' : res.emailError,
        });
      }
    } catch (err) {
      toast.error('Could not resend activation', {
        description: err instanceof ApiError ? err.message : 'Something went wrong. Please try again.',
      });
    }
  };

  const openEdit = (u: AdminUser) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditPhone(u.phone);
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (editPhone && !isValidPhone(editPhone)) {
      toast.error('Enter a valid phone number', { description: 'Include the country code, e.g. +254712345678.' });
      return;
    }
    setEditSubmitting(true);
    try {
      const body: UpdateUserInput = { name: editName, phone: editPhone };
      await api.patch(`/admin/users/${editingUser.id}`, body);
      setEditingUser(null);
      await reload();
      toast.success('User updated');
    } catch (err) {
      toast.error('Could not save changes', {
        description: err instanceof ApiError ? err.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Users"
        description={
          isAdmin
            ? 'Every buyer signs up as a buyer via Google or email. Promote them, or provision coordinator/driver/finance/quality checker/admin accounts here.'
            : 'Read-only — only admin accounts can create users, edit profiles, or change roles.'
        }
      />

      {isAdmin && (
        <div className="mb-6">
          <Button onClick={() => setShowForm(true)}>
            + New user
          </Button>

          {/* Create User Modal */}
          <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Create New User">
            <form onSubmit={submitCreate} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254712345678" required />
              </div>
              <div className="space-y-1.5 text-left">
                <Label htmlFor="role">Role</Label>
                <Select id="role" value={role} onChange={(e) => setRole(e.target.value as ProvisionableRole)}>
                  {PROVISIONABLE_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {roleLabel(r)}
                    </option>
                  ))}
                </Select>
              </div>

              {role === 'farmer' && (
                <div className="space-y-1.5">
                  <Label htmlFor="farmName">Farm name</Label>
                  <Input id="farmName" value={farmName} onChange={(e) => setFarmName(e.target.value)} />
                </div>
              )}
              {(role === 'farmer' || role === 'coordinator') && (
                <div className="space-y-1.5">
                  <Label htmlFor="region">Region</Label>
                  <Input id="region" value={region} onChange={(e) => setRegion(e.target.value)} />
                </div>
              )}
              {role === 'driver' && (
                <div className="space-y-1.5">
                  <Label htmlFor="vehicleLabel">Vehicle</Label>
                  <Input id="vehicleLabel" value={vehicleLabel} onChange={(e) => setVehicleLabel(e.target.value)} placeholder="e.g. Toyota Hilux — ND 45 GP" />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating…' : 'Create user'}
                </Button>
              </div>
            </form>
          </Modal>

          {/* Edit User Modal */}
          <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title={editingUser ? `Edit User: ${editingUser.name}` : ''}>
            <form onSubmit={submitEdit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="editName">Name</Label>
                <Input id="editName" value={editName} onChange={(e) => setEditName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editPhone">Phone</Label>
                <Input id="editPhone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+254712345678" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={editSubmitting}>
                  {editSubmitting ? 'Saving…' : 'Save changes'}
                </Button>
              </div>
            </form>
          </Modal>

          {result && (
            <Card className="mt-4 border-primary/30 bg-accent/40">
              <CardContent className="flex items-start justify-between gap-4 pt-6 text-sm">
                {result.activationCode ? (
                  <p>
                    Gmail isn't configured on the backend yet — share this activation code with the user directly:{' '}
                    <span className="font-mono font-bold">{result.activationCode}</span>
                  </p>
                ) : (
                  <p className="text-destructive">Could not send the activation email: {result.emailError}</p>
                )}
                <button
                  onClick={() => setResult(null)}
                  className="shrink-0 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Dismiss
                </button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Auth</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                {isAdmin && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: pageSize || 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 animate-pulse rounded-full bg-muted dark:bg-zinc-800" />
                        <div className="h-4 w-28 animate-pulse rounded bg-muted dark:bg-zinc-800" />
                      </div>
                    </TableCell>
                    <TableCell><div className="h-4 w-36 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-6 w-24 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-6 w-20 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    <TableCell><div className="h-4 w-24 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    {isAdmin && (
                      <TableCell><div className="h-8 w-16 animate-pulse rounded bg-muted dark:bg-zinc-800" /></TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                users.map((u) => (
                  <TableRow key={u.id} className="animate-fade-in">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={u.name} size={28} />
                        {u.name}
                      </div>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      {isAdmin ? (
                        <Select
                          className="h-8 py-0.5 rounded-lg text-xs"
                          value={u.role}
                          disabled={roleUpdating === u.id}
                          onChange={(e) => changeRole(u.id, e.target.value)}
                        >
                          {['buyer', ...PROVISIONABLE_ROLES].map((r) => (
                            <option key={r} value={r}>
                              {roleLabel(r)}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <StatusPill status={u.role} />
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{u.authProvider}</TableCell>
                    <TableCell>
                      <Badge variant={u.activated ? 'default' : 'warning'}>{u.activated ? 'Activated' : 'Pending activation'}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(u.createdAt)}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit(u)}>
                            Edit
                          </Button>
                          {!u.activated && (
                            <Button variant="outline" size="sm" onClick={() => resendActivation(u.id)}>
                              Resend code
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
              {!loading && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 7 : 6} className="py-8 text-center text-muted-foreground">
                    No users yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>
    </div>
  );
}
