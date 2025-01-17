import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Explore from './Pages/Explore';
import LoginPage from './Pages/LoginPage';
import Navbar from './Components/Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import TermsPage from './Pages/TermsPage';
import AboutUsPage from './Pages/AboutUsPage';
import Footer from './Components/Footer';
import RefundPolicy from './Pages/RefundPolicy';
import Payment from './Pages/Payment';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import Modal from 'react-modal';
import ProfileModal from './Components/Modal/ProfileModal';
import Test from './Pages/Test';
import ProtectedRoute from './Components/ProtectedRoute';
import Dashboard from './Pages/Dashboard';

Modal.setAppElement('#root');

function App() {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const getUser = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const url = `${apiUrl}/login/success`;
      const { data } = await axios.get(url, { withCredentials: true });
      if (data.user) {
        setUser(data.user);
        setLoggedIn(true);
        console.log('User details:', data.user);
      } else {
        setLoggedIn(false);
      }
    } catch (error) {
      console.log("Login error:", error);
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleLogin = () => {
    console.log("Logged in");
  };

  const handleLogout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.get(`${apiUrl}/logout`, { withCredentials: true });
      setLoggedIn(false);
      setUser(null);
      console.log("Logged out");
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const ToModalOpen = () => {
    setModalOpen(true);
    console.log("opened");
  };

  const ToModalClose = () => {
    setModalOpen(false);
  };

  return (
    <Router>
      <Navbar 
        loggedIn={loggedIn} 
        handleLogout={handleLogout} 
        user={user}
        ToModalOpen={ToModalOpen}
        // currentRoute={location.pathname} // Pass the current route
      />
      <Routes>
        <Route path='/' element={<LandingPage user={user}/>}/>
        <Route path='/login' element={
          <ProtectedRoute loggedIn={loggedIn}>

            <LoginPage handleLogin={handleLogin} />
          </ProtectedRoute>
            }/>
        <Route path='/explore' element={<Explore user={user}/>} />
        <Route path='/terms' element={<TermsPage/>}/>
        <Route path='/aboutus' element={<AboutUsPage/>}/>
        <Route path='/refund-policies' element={<RefundPolicy/>}/>
        <Route path='/privacy' element={<PrivacyPolicy/>}/>
        <Route path='/payment' element={<Payment/>}/>
        <Route path='/test' element={<Test/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
      <Footer/>

      <Modal
        isOpen={modalOpen}
        onRequestClose={ToModalClose}
        contentLabel="Profile"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75"
        className="fixed inset-0 flex items-center justify-center"
      >
        <div className="bg-gray-200 rounded-2xl p-0 w-full max-w-md mx-auto">
          <ProfileModal 
            ToModalClose={ToModalClose} 
            handleLogout={handleLogout} 
            user={user}
          />
        </div>
      </Modal>
    </Router>
  );
}

export default App;
