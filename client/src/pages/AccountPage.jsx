import { useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { TbPasswordFingerprint } from "react-icons/tb";
import NotFoundPage from "./NotFoundPage";
import styles from "../styles/account.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

export default function AccountPage() {
  const { userData, isAuth } = useContext(AuthContext);
  const lNameRef = useRef(0);
  const phoneNumverRef = useRef(0);
  const handleSave = () => {
    console.log("save");
  };
  const handleChangePassword = () => {
    
  };
  return (
    <>
      {isAuth ? (
        <div className={styles.page_container}>
          <Header />
          <div className={styles.content_wrap}>
            <div className={styles.profile_container}>
              <div className={styles.profile}>
                <div className={styles.self_data_text}>Личные Данные</div>
                <div className={styles.self_data_inputs}>
                  <div className={styles.f_name_container}>
                    <label className={styles.f_name__label}>Имя</label>
                    <input
                      className={styles.f_name__input}
                      type="text"
                      defaultValue={userData.f_name}
                    />
                  </div>
                  <div className={styles.l_name_container}>
                    <label className={styles.l_name__label}>Фамилия</label>
                    {userData.l_name ? (
                      <input
                        className={styles.l_name__input}
                        type="text"
                        defaultValue={userData.l_name}
                      />
                    ) : (
                      <input
                        ref={lNameRef}
                        onClick={() => {
                          lNameRef.current.placeholder = "Пример: Петров";
                        }}
                        className={styles.l_name__input}
                        type="text"
                        placeholder={"Не указана"}
                      />
                    )}
                  </div>
                </div>

                <div className={styles.security__text}>Безопасность и вход</div>
                <div className={styles.security__inputs}>
                  <div className={styles.phone_number_container}>
                    <label className={styles.phone_number__label}>
                      Телефон:
                    </label>
                    <div className={styles.phone_number_inpt__container}>
                      <FaPhoneAlt className={styles.phone__img} size={18} />
                      {userData.phone_number ? (
                        <input
                          className={styles.phone_number__input}
                          type="text"
                          defaultValue={userData.phone_number}
                        />
                      ) : (
                        <input
                          ref={phoneNumverRef}
                          onClick={() => {
                            phoneNumverRef.current.placeholder = "79991234567";
                          }}
                          className={styles.phone_number__input}
                          type="text"
                          placeholder={"Не указан"}
                        />
                      )}
                    </div>
                    <label className={styles.phone_desc__area}>
                      {" "}
                      Номер телефона будет использован,
                      <br /> для оперативной связи.{" "}
                    </label>
                  </div>
                  <div className={styles.email_container}>
                    <label className={styles.email__label}>Почта:</label>
                    <div className={styles.email_inpt__container}>
                      <IoMdMail className={styles.email__img} size={22} />
                      <input
                        className={styles.email__input}
                        type="text"
                        defaultValue={userData.email}
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleChangePassword}
                  className={styles.password_area__container}
                >
                  <div className={styles.password_area__pic}>
                    <TbPasswordFingerprint size={30} />
                  </div>
                  <div className={styles.password_area__text}>
                    <p className={styles.password__text}>Пароль</p>
                    <div className={styles.change_password_}>
                      <p className={styles.change_password__text}>
                        Изменить пароль
                      </p>
                    </div>
                  </div>
                </button>
                <div className={styles.save_button__container}>
                  <button onClick={handleSave} className={styles.save__button}>
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
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
