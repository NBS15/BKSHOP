import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useTheme } from '../hooks/useTheme';
import { useOrderStore } from '../store/orders';

interface Tab {
  path: string;
  label: string;
  id: string;
}

const TABS: Tab[] = [
  { id: 'home', label: 'Accueil', path: '/' },
  { id: 'soldes', label: 'Soldes', path: '/soldes' },
  { id: 'contact', label: 'Contact', path: '/contact' },
];

function MidNav() {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40 hidden sm:block">
      <nav className="flex items-center gap-4 glass-effect rounded-full px-4 py-2 shadow-xl hover:shadow-2xl transition-all duration-300">
        <Link to="/" className="flex items-center gap-3 px-2 hover:opacity-80 transition group">
          <img src={`${import.meta.env.BASE_URL}bk_shop.webp`} alt="BK Shop" className="h-10 w-10 rounded-full object-cover shadow-md group-hover:scale-105 transition-transform" />
          <span className="font-bold text-lg hidden sm:inline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">BK Shop</span>
        </Link>
        <div className="h-6 w-px bg-base-content/10 mx-2" />
        <ul className="flex gap-1">
          {TABS.map((t) => (
            <li key={t.id}>
              <NavLink
                to={t.path}
                className={({ isActive }) =>
                  `btn btn-sm rounded-full px-4 transition-all ${isActive ? 'btn-primary shadow-lg scale-105' : 'btn-ghost hover:bg-base-content/10'}`
                }
              >
                {t.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-effect border-t border-base-content/5 pb-4 sm:hidden">
      <div className="flex justify-around items-center h-16">
        {TABS.map((t) => (
          <NavLink
            key={t.id}
            to={t.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 relative ${
                isActive ? 'text-primary scale-110' : 'text-base-content/60 hover:text-base-content'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute -top-1 w-1 h-1 bg-primary rounded-full" />
                )}
                {t.id === 'home' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )}
                {t.id === 'soldes' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                )}
                {t.id === 'contact' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
                <span className="text-[10px] font-medium uppercase tracking-wide">{t.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'en_attente':
      return '⏳ En attente';
    case 'en_preparation':
      return '👨‍🍳 En préparation';
    case 'en_cours':
      return '⏳ En cours';
    case 'pret':
      return '✅ Prêt';
    case 'livre':
      return '📦 Livré';
    case 'annule':
      return '❌ Annulé';
    default:
      return status;
  }
};

export default function Layout() {
  const { toggleTheme } = useTheme();
  const { logout } = useAuthStore();
  const { notifications, orders } = useOrderStore();
  const navigate = useNavigate();

  // Calculate total cart items (active orders)
  const cartItemCount = orders.filter(o => ['en_attente', 'en_preparation', 'en_cours'].includes(o.status)).length;

  return (
    <div className="min-h-screen bg-base-200 text-base-content relative overflow-hidden font-sans selection:bg-primary/20">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-base-100/50 to-secondary/5" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <MidNav />
      <BottomNav />

      {/* Top Right Actions */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <button 
          onClick={() => navigate('/cart')} 
          className="btn btn-circle btn-ghost glass-effect hover:bg-base-content/10 transition-transform hover:scale-105"
        >
          <div className="indicator">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartItemCount > 0 && (
              <span className="badge badge-sm badge-primary indicator-item animate-bounce">{cartItemCount}</span>
            )}
          </div>
        </button>
        
        <button 
          onClick={toggleTheme} 
          className="btn btn-circle btn-ghost glass-effect hover:bg-base-content/10 transition-transform hover:rotate-12"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <button 
          onClick={() => logout()} 
          className="btn btn-circle btn-ghost glass-effect hover:bg-error/20 hover:text-error transition-all"
          title="Se déconnecter"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      {/* Notifications Toast */}
      {notifications.length > 0 && (
        <div className="toast toast-bottom toast-end z-[100]">
          {notifications.map((n) => (
            <div key={n.id} className="alert alert-info glass-effect shadow-lg animate-fade-in border-l-4 border-info">
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <span className={`badge ${n.type === 'livre' ? 'badge-success' : n.type === 'pret' ? 'badge-info' : n.type === 'annule' ? 'badge-error' : 'badge-warning'}`}>
                    {getStatusLabel(n.type)}
                  </span>
                  {n.productName}
                </h3>
                <div className="text-xs opacity-90">{n.message}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="pb-24 sm:pb-0 min-h-[calc(100vh-theme(spacing.24))] sm:pt-24 px-4 sm:px-8 max-w-7xl mx-auto w-full animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}
