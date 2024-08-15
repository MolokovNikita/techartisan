import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import MainPage from "./pages/MainPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ChangePass from "./pages/ChangePass.jsx";
import Services from "./pages/Services.jsx";
import AboutUs from "./pages/AboutUsPage.jsx";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ModalAuth from "./components/ModalAuth/ModalAuth.jsx";
import { AuthContext } from "./context/AuthContext";
import style from "./styles/app.module.css";
import Confidencity from "./pages/Confidencity.jsx";
import Politicy from "./pages/Politicy.jsx";
import { SnackbarProvider } from "notistack";
import AccountPage from "./pages/AccountPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";
import ClientServicePage from "./pages/ClientServicesPage/ClientServicePage.jsx";
import ServiceCardModal from "./components/ServiceCardModal.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
function App() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading } = useContext(AuthContext);
  const location = useLocation();
  const handleModalClose = () => {
    setIsOpen(false);
  };
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const handleServiceModalClose = () => {
    setIsServiceModalOpen(false);
  };
  const routesWithHeaderFooter = [
    "/",
    "/services",
    "/aboutus",
    "/confidencity",
    "/politicy",
    "/account/password",
  ];
  return (
    <>
      <SnackbarProvider />
      {isLoading ? (
        <div className={style.loader_container}>
          <div className={style.spinner}></div>
        </div>
      ) : (
        <>
          <ModalAuth isOpen={isOpen} onClose={handleModalClose} />
          <ServiceCardModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onClose={handleServiceModalClose}
            isServiceModalOpen={isServiceModalOpen}
          />

          {routesWithHeaderFooter.includes(location.pathname) && (
            <Header setIsOpen={setIsOpen} />
          )}
          <Routes>
            <Route
              path="/"
              element={
                <MainPage
                  setIsServiceModalOpen={setIsServiceModalOpen}
                  setIsOpen={setIsOpen}
                />
              }
            />
            <Route
              path="/services"
              element={
                <Services
                  setIsServiceModalOpen={setIsServiceModalOpen}
                  setIsOpen={setIsOpen}
                />
              }
            />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/confidencity" element={<Confidencity />} />
            <Route path="/politicy" element={<Politicy />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/password" element={<ChangePass />} />
            <Route path="/my/services" element={<ClientServicePage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          {routesWithHeaderFooter.includes(location.pathname) && <Footer />}
        </>
      )}
    </>
  );
}

export default App;
