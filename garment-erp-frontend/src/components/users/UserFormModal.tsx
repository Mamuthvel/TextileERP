import { useState } from 'react';
import Modal from '../Modal';
import { useCreateUserMutation } from '../../api/usersApi';

const ROLES = ['superAdmin', 'productionManager', 'merchandiser', 'qcInspector', 'accounts', 'viewer'];

export default function UserFormModal({ onClose }: { onClose: () => void }) {
  const [create, { isLoading, error }] = useCreateUserMutation();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'viewer', department: '' });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create(form as any).unwrap();
      onClose();
    } catch {
      //
    }
  };

  return (
    <Modal title="New User" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="field-label">Name *</label>
          <input className="input-field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="field-label">Email *</label>
          <input type="email" className="input-field" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="field-label">Password *</label>
          <input type="password" className="input-field" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div>
          <label className="field-label">Role</label>
          <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Department</label>
          <input className="input-field" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        </div>

        {error && <p className="text-sm text-rose-400">Failed to create user (email may already exist).</p>}

        <div className="flex justify-end gap-2 border-t border-ink-700 pt-4">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Saving…' : 'Create User'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
