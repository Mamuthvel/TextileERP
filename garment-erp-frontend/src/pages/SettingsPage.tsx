import { useState } from 'react';
import toast from 'react-hot-toast';
import { useGetUsersQuery, useUpdateUserMutation } from '../api/usersApi';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import { Skeleton } from '../components/Skeleton';
import { useAppSelector } from '../app/hooks';
import UserFormModal from '../components/users/UserFormModal';
import type { UserAccount } from '../types';

const ROLES = ['superAdmin', 'productionManager', 'merchandiser', 'qcInspector', 'accounts', 'viewer'];
const LIMIT = 15;

export default function SettingsPage() {
  const currentUser = useAppSelector((s) => s.auth.user);
  const isSuperAdmin = currentUser?.role === 'superAdmin';
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<UserAccount | null>(null);
  const { data, isLoading } = useGetUsersQuery({ page, limit: LIMIT }, { skip: !isSuperAdmin });
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  if (!isSuperAdmin) {
    return (
      <div>
        <PageHeader title="Settings" subtitle="Account" />
        <div className="panel p-6">
          <p className="label-tag mb-2">Signed in as</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{currentUser?.name}</p>
          <p className="text-sm text-slate-400">{currentUser?.email}</p>
          <p className="mt-2 font-mono text-xs uppercase tracking-wider text-teal-400">{currentUser?.role}</p>
          <p className="mt-4 text-sm text-slate-500">Only Super Admins can manage user accounts and roles.</p>
        </div>
      </div>
    );
  }

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await updateUser({ id, body: { role } }).unwrap();
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role.');
    }
  };

  const handleToggleActive = async () => {
    if (!deactivateTarget) return;
    try {
      await updateUser({ id: deactivateTarget.id, body: { isActive: !deactivateTarget.isActive } }).unwrap();
      toast.success(deactivateTarget.isActive ? 'User deactivated' : 'User activated');
      setDeactivateTarget(null);
    } catch {
      toast.error('Failed to update user status.');
    }
  };

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Roles & Access Control"
        actions={
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + New User
          </button>
        }
      />

      <div className="panel overflow-x-auto">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, c) => (
                    <td key={c}><Skeleton className="h-5 w-full" /></td>
                  ))}
                </tr>
              ))}
              {data?.data.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td className="font-mono text-xs">{u.email}</td>
                  <td>
                    <select
                      className="input-field !py-1 !text-xs"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td>{u.department || '—'}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.isActive
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/30'
                      }`}
                    >
                      {u.isActive ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td>
                    {u.id !== currentUser?.id && (
                      <button
                        className={`!py-1 !px-2 !text-xs ${u.isActive ? 'btn-secondary text-rose-400 hover:border-rose-500/50' : 'btn-secondary text-teal-400'}`}
                        onClick={() => setDeactivateTarget(u)}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data?.pagination && (
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            total={data.pagination.total}
            limit={LIMIT}
            onPageChange={setPage}
          />
        )}
      </div>

      {showModal && <UserFormModal onClose={() => setShowModal(false)} />}

      {deactivateTarget && (
        <ConfirmDialog
          title={deactivateTarget.isActive ? 'Deactivate User' : 'Activate User'}
          message={
            deactivateTarget.isActive
              ? `Deactivate ${deactivateTarget.name}? They will not be able to log in until reactivated.`
              : `Reactivate ${deactivateTarget.name}? They will regain access to the system.`
          }
          confirmLabel={deactivateTarget.isActive ? 'Deactivate' : 'Activate'}
          variant={deactivateTarget.isActive ? 'danger' : 'warning'}
          isLoading={updating}
          onConfirm={handleToggleActive}
          onClose={() => setDeactivateTarget(null)}
        />
      )}
    </div>
  );
}
