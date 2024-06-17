import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import MainPage from './pages/MainPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import Services from './pages/Services.jsx';
import AboutUs from './pages/AboutUsPage.jsx';
import Header from './components/Header';
import Footer from './components/Footer';
import ModalAuth from './components/ModalAuth';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const routesWithHeaderFooter = ['/main', '/services', '/aboutus'];

  return (
    <>
      <ModalAuth isOpen={isOpen} onClose={handleModalClose} />
      {routesWithHeaderFooter.includes(location.pathname) && <Header setIsOpen={setIsOpen} />}
      <Routes>
        <Route path='/main' element={<MainPage />} />
        <Route path='/services' element={<Services />} />
        <Route path='/aboutus' element={<AboutUs />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      {routesWithHeaderFooter.includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;
