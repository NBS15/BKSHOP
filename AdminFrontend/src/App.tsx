import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Promotions from './pages/Promotions';
import Messages from './pages/Messages';

type Tab = 'dashboard' | 'products' | 'promotions' | 'messages';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [theme, setTheme] = useState('corporate');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'corporate' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
      <div className="navbar bg-base-200 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl font-bold">
            👑 BK Shop Admin
          </a>
        </div>
        <div className="flex-none gap-2">
          <button
            className="btn btn-ghost btn-circle"
            onClick={toggleTheme}
            title="Changer de thème"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m6.08 0l4.24-4.24M1 12h6m6 0h6m-16.78 7.78l4.24-4.24m6.08 0l4.24 4.24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="drawer lg:drawer-open">
        <input
          id="my-drawer-2"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content flex flex-col">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'products' && <Products />}
          {activeTab === 'promotions' && <Promotions />}
          {activeTab === 'messages' && <Messages />}

          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden m-4"
          >
            Ouvrir Menu
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          />
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content space-y-2">
            <li className="menu-title">
              <span>Menu</span>
            </li>
            <li>
              <a
                onClick={() => setActiveTab('dashboard')}
                className={activeTab === 'dashboard' ? 'active' : ''}
              >
                📊 Tableau de Bord
              </a>
            </li>
            <li>
              <a
                onClick={() => setActiveTab('products')}
                className={activeTab === 'products' ? 'active' : ''}
              >
                📦 Produits
              </a>
            </li>
            <li>
              <a
                onClick={() => setActiveTab('promotions')}
                className={activeTab === 'promotions' ? 'active' : ''}
              >
                🏷️ Promotions
              </a>
            </li>
            <li>
              <a
                onClick={() => setActiveTab('messages')}
                className={activeTab === 'messages' ? 'active' : ''}
              >
                💬 Messages
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
