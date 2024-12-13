import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/NavBar';
import { Home, Services, Findbook, Contact, Login, Registration, EventMap, CreateEvent } from './pages';
import './index.css';
import axiosInstance from './axios/instanse';
import Matches from './pages/Matches';
import Reservations from './pages/Reservations';
import Profile from './pages/Profile';
import PdfViewer from './components/PdfViewer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import WeatherWidget from './components/weather';

const App = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register'];
  const requireToken = ['/findbook', '/services', '/'];
  const navigate = useNavigate();

  useEffect(() => {
    if (requireToken.includes(location.pathname)) {
      try {
        axiosInstance.post('/auth/refresh-token', { token: localStorage.getItem("refresh") })
          .then((resp) => {
            localStorage.setItem('refresh', resp.data.refreshToken);
            localStorage.setItem('token', resp.data.accessToken);
          })
          .catch(() => {
          });
      } catch (err) {
      }
      try {

      } catch (err) {
      }
    }
  }, [location.pathname]);

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <div style={{paddingTop: '70px'}}></div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/findevent" element={<Findbook />} />
        <Route path="/map" element={<EventMap />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pdf" element={<PdfViewer />} />
        <Route path="/w" element={<WeatherWidget />} />
      </Routes>
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
