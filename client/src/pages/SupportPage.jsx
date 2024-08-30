// TO DO - WEBSOCKET SUPPORT CHAT
import styles from "../styles/support.module.css";
import { useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import NotFoundPage from "./NotFoundPage";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SupportPage() {
  const { userData, isAuth } = useContext(AuthContext);
  //websocket support page
  return (
    <>
      {isAuth ? (
        <div className={styles.support_page__container}>
          <Header />
          <div className={styles.content__wrap}>
            <h1>Support</h1>
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
