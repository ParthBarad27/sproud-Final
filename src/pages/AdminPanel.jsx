import React, { useMemo, useState } from 'react';
import Header from '../components/ui/Header';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';
import { useAuth } from '../contexts/AuthContext';

const mockUsers = [
  { id: 'u1', email: 'student@example.com', role: 'student', anonId: 'MB25-AB12CD', verified: true },
  { id: 'u2', email: 'consultant@example.com', role: 'consultant', anonId: 'MB25-EF34GH', verified: true },
  { id: 'u3', email: 'faculty@example.com', role: 'faculty', anonId: 'MB25-IJ56KL', verified: false },
  { id: 'u4', email: 'admin@example.com', role: 'admin', anonId: 'MB25-MN78OP', verified: true },
];

const mockAudit = [
  { id: 'a1', ts: '2025-09-25 10:20', actor: 'admin@example.com', action: 'ROLE_CHANGE', details: 'faculty@example.com → faculty' },
  { id: 'a2', ts: '2025-09-25 09:12', actor: 'admin@example.com', action: 'DOC_VERIFY', details: 'student@example.com documents approved' },
  { id: 'a3', ts: '2025-09-24 18:45', actor: 'admin@example.com', action: '2FA_RESET', details: 'consultant@example.com 2FA reset' },
];

const RoleBadge = ({ role }) => (
  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
    role === 'admin' ? 'bg-secondary/15 text-secondary' :
    role === 'faculty' ? 'bg-accent/15 text-accent' :
    role === 'consultant' ? 'bg-warning/15 text-warning' :
    'bg-primary/15 text-primary'
  }`}>{role}</span>
);

const AdminPanel = () => {
  const { role } = useAuth();
  const [users, setUsers] = useState(mockUsers);
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return users;
    return users.filter(u => (filter === 'verified' ? u.verified : !u.verified));
  }, [users, filter]);

  const cycleRole = (u) => {
    const order = ['student','consultant','faculty','admin'];
    const next = order[(order.indexOf(u.role) + 1) % order.length];
    const updated = users.map(x => x.id === u.id ? { ...x, role: next } : x);
    setUsers(updated);
  };

  const toggleVerify = (u) => {
    setUsers(users.map(x => x.id === u.id ? { ...x, verified: !x.verified } : x));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Audit logs, role management, and verifications</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" iconName="RefreshCw">Refresh</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Users and Roles */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Users</h2>
                <div className="flex items-center space-x-2">
                  <Button variant={filter==='all'?'default':'outline'} size="sm" onClick={() => setFilter('all')}>All</Button>
                  <Button variant={filter==='verified'?'default':'outline'} size="sm" onClick={() => setFilter('verified')}>Verified</Button>
                  <Button variant={filter==='unverified'?'default':'outline'} size="sm" onClick={() => setFilter('unverified')}>Unverified</Button>
                </div>
              </div>
              <div className="divide-y divide-border">
                {filtered.map(u => (
                  <div key={u.id} className="py-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-foreground truncate">{u.email}</span>
                        <RoleBadge role={u.role} />
                      </div>
                      <div className="text-xs text-muted-foreground">{u.anonId}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => cycleRole(u)} iconName="Repeat">Role</Button>
                      <Button variant={u.verified?'secondary':'default'} size="sm" onClick={() => toggleVerify(u)} iconName={u.verified?'X':'Check'}>
                        {u.verified?'Unverify':'Verify'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Log */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Audit Trail</h2>
              <div className="space-y-3">
                {mockAudit.map(a => (
                  <div key={a.id} className="p-3 rounded border border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{a.ts}</span>
                      <span className="font-medium">{a.action}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{a.details}</div>
                    <div className="text-xs mt-1 flex items-center space-x-2"><Icon name="User" size={12} /><span>{a.actor}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {role !== 'admin' && (
            <div className="mt-6 text-xs text-warning">Note: You are viewing this as {role || 'guest'}. Actions are mocked.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;


