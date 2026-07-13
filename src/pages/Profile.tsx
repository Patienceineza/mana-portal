import { useState } from 'react';
import { toast } from 'sonner';

import { ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { isValidPhone } from '@/lib/validation';
import { Avatar } from '@/components/Avatar';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone && !isValidPhone(phone)) {
      toast.error('Enter a valid phone number', { description: 'Include the country code, e.g. +254712345678.' });
      return;
    }
    setSubmitting(true);
    try {
      await updateProfile({ name, phone });
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Could not save changes', {
        description: err instanceof ApiError ? err.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="My Profile" description="Update your own account details" />
      <Card className="max-w-lg">
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center gap-3">
            <Avatar name={name || '?'} size={48} />
            <div>
              <div className="font-medium text-foreground">{user?.email}</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{user?.role}</div>
            </div>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254712345678" />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
