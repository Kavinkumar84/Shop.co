import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './pages/Header';
import Login from './pages/Login';
import SignUp from './pages/SignUp'; 
import ForgetPass from './pages/ForgetPass';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import './css/App.css'

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
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
        <Route path="/forgetpass" element={<ForgetPass />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </div>
  );
};

export default App;
