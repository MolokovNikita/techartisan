import styles from "../styles/clientServices.module.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import NotFoundPage from "./NotFoundPage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

export default function ClientServicesPage() {
  const { userData, isAuth } = useContext(AuthContext);
  // useEffect(() => {
  //     if (!isAuth) {
  //         return null;
  //     }
  //     else {
  //         //axios.get(`http://localhost:5002/clients/${userData.id}`) get clientData
  //        // axios.get(`http://localhost:5002/clients/${userData.id}`)
  //     }

  // },[]) // get All Client Services
  return (
    <>
      {isAuth ? (
        <div className={styles.client_sertvices_page__container}>
          <Header />
          <div className={styles.content__wrap}>
            <h1>My Services</h1>
          </div>
          <Footer />
        </div>
      ) : (
        <div className={styles.error__container}>
          <div className={styles.error__text}>
            Кажется, вы не авторизованы. Попробуйте вернуться на главную
            страницу и авторизоваться.
          </div>
          <NotFoundPage />
        </div>
      )}
    </>
  );
}
