import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainPage from './pages/MainPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import Services from './pages/Services.jsx';
import AboutUs from './pages/AboutUsPage.jsx';
import Header from './components/Header';
import Footer from './components/Footer';
import ModalAuth from './components/ModalAuth';
import axios from "axios";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const routesWithHeaderFooter = ['/main', '/services', '/aboutus'];
  useEffect(() => {  
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5002/clients');
        response.data.forEach((cleint)=>console.log(cleint))
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, []);

  
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
