import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { FiBarChart2, FiFileText, FiGrid, FiLogOut, FiTag, FiUsers } from 'react-icons/fi';

const links = [
  { to: '/', label: 'Dashboard', icon: FiGrid },
  { to: '/quizzes', label: 'Quizzes', icon: FiFileText },
  { to: '/categories', label: 'Categories', icon: FiTag },
  { to: '/attempts', label: 'Reports', icon: FiBarChart2 },
  { to: '/users', label: 'Users', icon: FiUsers },
];

export default function Layout() {
  const navigate = useNavigate();
  if (!localStorage.getItem('adminToken')) return <Navigate to="/login" replace />;

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen md:flex">
      <aside className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 bg-white p-3 md:fixed md:inset-y-0 md:w-64 md:flex-col md:items-stretch md:border-b-0 md:border-r md:p-5">
        <div className="mr-4 flex items-center gap-2.5 text-xl font-extrabold md:mb-6 md:mr-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white">Q</span>
          <span className="hidden sm:inline">Quizly</span>
        </div>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
        <button
          onClick={logout}
          className="ml-auto flex items-center gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 md:ml-0 md:mt-auto"
        >
          <FiLogOut size={18} /> Log out
        </button>
      </aside>
      <main className="w-full flex-1 p-4 sm:p-8 md:ml-64">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
