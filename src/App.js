import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Signup from './components/Signup';
import Login from './components/Login';
import CreatorPage from './components/CreatorPage';
import InvestorPage from './components/InvestorPage';
import LogoutPage from './components/LogoutPage';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/creator" element={<CreatorPage />} />
        <Route path="/investor" element={<InvestorPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
