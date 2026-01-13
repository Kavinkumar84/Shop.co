import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './pages/Header';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import './css/App.css'
import Otp from './pages/Otp';
import ResetPassword from './pages/ResetPassword';
import PageNotFound from './pages/PageNotFound';

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
  const isAuthPage = ['/login', '/signup', '/forgetpass'].includes(
    location.pathname.toLowerCase()
  );

  return (
    <div className='App'>
      {!isAuthPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default App;
