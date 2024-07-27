import styles from "../styles/admin.panel.module.css";
import { useState } from "react";
export default function () {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <>
      {isLogin ? (
        <div>Hello</div>
      ) : (
        <div className={styles.sign__cointainer}>
          <div className={styles.sign__title}>Пожалуйста, авторизируйтесь</div>
          <div className={styles.login__container}>
            <input
              className={styles.login__inpt}
              type="text"
              placeholder="Логин"
            />
          </div>
          <div className={styles.password__container}>
            <input
              className={styles.password__inpt}
              type="password"
              placeholder="Пароль"
            />
          </div>
          <div className={styles.sign_btn__container}>
            <button className={styles.sign__btn}>Войти</button>
          </div>
        </div>
      )}
    </>
  );
}
