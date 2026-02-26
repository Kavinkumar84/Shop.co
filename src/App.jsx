import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './pages/Header';
import Home from './pages/Home';
import './css/App.css'
import GlobalLoader from './components/GlobalLoader';
import Footer from './components/Footer';

// ✅ Lazy-load non-critical pages (reduces initial JS bundle by ~200KB+)
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Favorites = lazy(() => import('./pages/Favorites'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        containerStyle={{
          zIndex: 99999,
        }}
        toastOptions={{
          duration: 2000,
          style: {
            background: 'rgba(30, 30, 50, 0.95)',
            color: '#fff',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '16px 20px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)',
            whiteSpace: 'nowrap',
            maxWidth: '500px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
            style: {
              borderColor: 'rgba(34, 197, 94, 0.35)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              borderColor: 'rgba(239, 68, 68, 0.35)',
            },
          },
        }}
      />
      <Router>
        <AppContent />
      </Router>
    </>
  );
};

const AppContent = () => {
  const location = useLocation();
  const [showGlobalLoader, setShowGlobalLoader] = React.useState(true);

  const hideHeaderRoutes = [
    "/login",
    "/signup",
    "/forgetpass",
    "/dashboard"
  ];

  const excludeLoaderRoutes = [
    "/login",
    "/signup",
    "/forgetpass",
    "/otp",
    "/reset-password",
    "/resetpass"
  ];

  React.useEffect(() => {
    const isExcluded = excludeLoaderRoutes.some(route =>
      location.pathname.toLowerCase().startsWith(route)
    );

    if (isExcluded) {
      setShowGlobalLoader(false);
      return;
    }

    // ✅ Reduced from 1000ms to 300ms — stops artificially blocking page content
    const timer = setTimeout(() => {
      setShowGlobalLoader(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const validRoutes = ["/", "/login", "/signup", "/favorites",];
  const isAuthPage = hideHeaderRoutes.includes(location.pathname.toLowerCase());
  const isNotFoundPage = !validRoutes.includes(location.pathname.toLowerCase());

  return (
    <div className='App'>
      {showGlobalLoader && <GlobalLoader />}
      {!isAuthPage && !isNotFoundPage && <Header />}
      {/* ✅ Suspense fallback for lazy pages */}
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
      {!isAuthPage && !isNotFoundPage && <Footer />}
    </div>
  );
};



export default App;
