import { toast } from 'react-toastify';
import { FiTrash2 } from 'react-icons/fi';
import useFetch from '../hooks/useFetch';
import { api } from '../lib/api';
import { ask } from '../lib/ask';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';
import { ui } from '../ui';

export default function Users() {
  const { data, loading, reload } = useFetch('/admin/users');

  const changeRole = async (user, role) => {
    try {
      await api(`/admin/users/${user._id}/role`, { method: 'PATCH', body: { role } });
      toast.success('Role updated');
    } catch (error) {
      toast.error(error.message);
    }
    reload();
  };

  const remove = (user) =>
    ask(`Delete ${user.name}?`, async () => {
      await api(`/admin/users/${user._id}`, { method: 'DELETE' });
      toast.success('User deleted');
      reload();
    });

  return (
    <>
      <PageHeader title="Users" subtitle="Manage learners and admins" />
      {loading || !data ? (
        <Spinner />
      ) : (
        <div className={`${ui.card} overflow-x-auto p-0`}>
          <table className="w-full">
            <thead>
              <tr>
                {['Name', 'Email', 'Role', 'Joined', ''].map((head) => (
                  <th key={head} className={ui.th}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user._id}>
                  <td className={`${ui.td} font-medium`}>{user.name}</td>
                  <td className={ui.td}>{user.email}</td>
                  <td className={ui.td}>
                    <select className="rounded-lg border border-slate-200 px-2 py-1 text-sm" value={user.role} onChange={(e) => changeRole(user, e.target.value)}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className={ui.td}>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className={`${ui.td} text-right`}>
                    <button className={ui.icon} onClick={() => remove(user)}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
