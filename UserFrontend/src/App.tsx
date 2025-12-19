import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { useOrderPolling } from './hooks/useOrderPolling';
import Layout from './components/Layout';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
}

function App() {
  const { user } = useAuthStore();
  useOrderPolling();

  if (!user) {
    return (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/soldes" element={<Home view="sales" />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
