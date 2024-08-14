import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { TbPasswordFingerprint } from "react-icons/tb";
import NotFoundPage from "./NotFoundPage";
import styles from "../styles/account.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

import axios from "axios";

export default function AccountPage() {
  const { userData, isAuth, handleLogOut } = useContext(AuthContext);
  const [userName, setUserName] = useState(userData.f_name || "");
  const [userSurname, setUserSurname] = useState(userData.l_name || "");
  const [userPhone, setUserPhone] = useState(userData.phone_number || "");
  const [userEmail, setUserEmail] = useState(userData.email || "");
  const navigate = useNavigate();

  // Изначально ошибка только если поле пустое
  const [userNameDirty, setUserNameDirty] = useState(false);
  const [userNameError, setUserNameError] = useState(
    userData.f_name ? "" : "*Данное поле не можеть быть пустым",
  );

  const [userSurnameDirty, setUserSurnameDirty] = useState(false);
  const [userSurnameError, setUserSurnameError] = useState("");

  const [userPhoneDirty, setUserPhoneDirty] = useState(false);
  const [userPhoneError, setUserPhoneError] = useState("");

  const [userEmailDirty, setUserEmailDirty] = useState(false);
  const [userEmailError, setUserEmailError] = useState(
    userData.email ? "" : "*Данное поле не можеть быть пустым",
  );

  const userPhoneRef = useRef();
  const userSurnameRef = useRef();
  const [formValid, setFormValid] = useState(false);

  // password form
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [isEyeOpenOldPass, setIsEyeOpenOldPass] = useState(false);
  const [isEyeOpenNewPass, setIsEyeOpenNewPass] = useState(false);
  //
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [oldPasswordDirty, setOldPasswordDirty] = useState(false);
  const [newPasswordDirty, setNewPasswordDirty] = useState(false);

  const [oldPasswordError, setOldPasswordError] = useState(
    "*Данное поле не можеть быть пустым",
  );
  const [newPasswordError, setNewPasswordError] = useState(
    "*Данное поле не можеть быть пустым",
  );
  const [isChangePassFormValid, setIsChangePassFormValid] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);

  useEffect(() => {
    if (oldPassword || newPassword) {
      if (oldPassword === newPassword) {
        setPasswordMatch(true);
      } else {
        setPasswordMatch(false);
      }
    }
  }, [oldPassword, newPassword]);

  useEffect(() => {
    if (oldPasswordError || newPasswordError || passwordMatch) {
      setIsChangePassFormValid(false);
    } else {
      setIsChangePassFormValid(true);
    }
  });

  const oldPasswordHandler = (e) => {
    setOldPassword(e.target.value);
    if (!e.target.value) {
      setOldPasswordError("*Данное поле не можеть быть пустым");
      return;
    } else {
      setOldPasswordError("");
    }
  };
  const changePasswordBlurHandler = (e) => {
    switch (e.target.name) {
      case "oldPassword":
        setOldPasswordDirty(true);
        break;
      case "newPassword":
        setNewPasswordDirty(true);
        break;
      default:
        break;
    }
  };

  const newPasswordHandler = (e) => {
    setNewPassword(e.target.value);
    if (!e.target.value) {
      setNewPasswordError("*Данное поле не можеть быть пустым");
      return;
    }
    const passwordRegex = /^[A-Za-z0-9]\w{5,30}$/;
    if (!passwordRegex.test(e.target.value)) {
      setNewPasswordError("*Неккоректный формат пароля");
    } else {
      setNewPasswordError("");
    }
  };

  useEffect(() => {
    if (userNameError || userEmailError || userSurnameError || userPhoneError) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [userNameError, userEmailError, userSurnameError, userPhoneError]);

  const blurHandler = (e) => {
    switch (e.target.name) {
      case "userName":
        setUserNameDirty(true);
        break;
      case "userSurname":
        setUserSurnameDirty(true);
        break;
      case "userPhone":
        setUserPhoneDirty(true);
        break;
      case "userEmail":
        setUserEmailDirty(true);
        break;
      default:
        break;
    }
  };

  const nameHandler = (e) => {
    const value = e.target.value;
    setUserName(value);
    if (!value) {
      setUserNameError("*Данное поле не можеть быть пустым");
    } else if (!/^[а-яА-Я ]+$/.test(value)) {
      setUserNameError("*Неккоректное имя (Пример : Иван)");
    } else if (value.length < 2) {
      setUserNameError("*Минимальная длина имени 2 символа");
    } else {
      setUserNameError("");
    }
  };

  const surnameHandler = (e) => {
    const value = e.target.value;
    setUserSurname(value);
    if (value && !/^[а-яА-Я ]+$/.test(value)) {
      setUserSurnameError("*Фамилия должна содержать только русские буквы");
    } else if (value && value.length < 2) {
      setUserSurnameError("*Минимальная длина фамилии 2 символа");
    } else {
      setUserSurnameError("");
    }
  };

  const phoneHandler = (e) => {
    const value = e.target.value;
    setUserPhone(value);
    if (value && !/^7\d{10}$/.test(value)) {
      setUserPhoneError("*Некорректный номер телефона. Пример: 79994567890");
    } else {
      setUserPhoneError("");
    }
  };

  const emailHandler = (e) => {
    const value = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setUserEmail(value);
    if (!value) {
      setUserEmailError("*Данное поле не можеть быть пустым");
    } else if (!emailRegex.test(value)) {
      setUserEmailError("*Некорректный email. Пример: mail@example.ru");
    } else {
      setUserEmailError("");
    }
  };

  const handleSave = () => {
    // Проверка изменений
    if (
      userName === userData.f_name &&
      userSurname === userData.l_name &&
      userPhone === userData.phone_number &&
      userEmail === userData.email
    ) {
      console.log("Никаких изменений не было внесено");
      return;
    }

    // Валидация обязательных полей
    if (!formValid) {
      enqueueSnackbar(`"Заполните обязательные поля корректно."`, {
        variant: "error",
        autoHideDuration: 1500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      return;
    }

    axios
      .put("http://localhost:5002/clients", {
        f_name: userName,
        l_name: userSurname,
        email: userEmail,
        phone_number: userPhone ? userPhone : null,
        id: userData.id,
      })
      .then(() => {
        if (userEmail !== userData.email) {
          handleLogOut();
          enqueueSnackbar(
            `Вы успешно изменили email, пожалуйста авторизируйтесь заново!`,
            {
              variant: "success",
              autoHideDuration: 3000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            },
          );
          navigate("/");
        } else {
          enqueueSnackbar(`Данные успешно сохранены!`, {
            variant: "success",
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          });
        }
      })
      .catch((e) => {
        enqueueSnackbar(`${e.response.data}`, {
          variant: "error",
          autoHideDuration: 1500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
      });
  };

  const handleChangePassword = () => {
    setIsPasswordChangeOpen((prev) => !prev);
  };
  const handleConfirmChangePassword = () => {
    console.log("Fetching....");
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
                      name="userName"
                      className={styles.f_name__input}
                      type="text"
                      value={userName}
                      onChange={nameHandler}
                      onBlur={blurHandler}
                      placeholder="Иван"
                    />
                    {userNameDirty && userNameError && (
                      <div className={styles.error__area}>{userNameError}</div>
                    )}
                  </div>
                  <div className={styles.l_name_container}>
                    <label className={styles.l_name__label}>Фамилия</label>
                    <input
                      ref={userSurnameRef}
                      onClick={() => {
                        userSurnameRef.current.placeholder = "Петров";
                      }}
                      name="userSurname"
                      className={styles.l_name__input}
                      type="text"
                      value={userSurname}
                      onChange={surnameHandler}
                      onBlur={blurHandler}
                      placeholder={userSurname ? userSurname : "Не указана"}
                    />
                    {userSurnameDirty && userSurnameError && (
                      <div className={styles.error__area}>
                        {userSurnameError}
                      </div>
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
                      <input
                        ref={userPhoneRef}
                        onClick={() => {
                          userPhoneRef.current.placeholder = "79991234567";
                        }}
                        name="userPhone"
                        className={styles.phone_number__input}
                        type="text"
                        value={userPhone}
                        onChange={phoneHandler}
                        onBlur={blurHandler}
                        placeholder={userPhone ? userPhone : "Не указан"}
                      />
                    </div>
                    {userPhoneDirty && userPhoneError && (
                      <div className={styles.phone_error__area}>
                        {userPhoneError}
                      </div>
                    )}
                    <label className={styles.phone_desc__area}>
                      Номер телефона будет использован,
                      <br /> для оперативной связи или <br />
                      восстановления доступа.
                    </label>
                  </div>
                  <div className={styles.email_container}>
                    <label className={styles.email__label}>Почта:</label>
                    <div className={styles.email_inpt__container}>
                      <IoMdMail className={styles.email__img} size={22} />
                      <input
                        name="userEmail"
                        className={styles.email__input}
                        type="text"
                        value={userEmail}
                        onChange={emailHandler}
                        onBlur={blurHandler}
                        placeholder="mail@mail.ru"
                      />
                    </div>
                    {userEmailDirty && userEmailError && (
                      <div className={styles.email_error__area}>
                        {userEmailError}
                      </div>
                    )}
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

                <div
                  className={`${styles.change_pass__container} ${!isPasswordChangeOpen ? styles.hidden : ""}`}
                >
                  <div className={styles.old_pass__container}>
                    <label>Старый пароль</label>
                    <div className={styles.old_pass_inpt__container}>
                      <input
                        name="oldPassword"
                        value={oldPassword}
                        onChange={oldPasswordHandler}
                        onBlur={changePasswordBlurHandler}
                        className={styles.old_pass__inpt}
                        type={isEyeOpenOldPass ? "text" : "password"}
                      />
                      <a
                        type="button"
                        className={styles.eye__btn}
                        onClick={() => setIsEyeOpenOldPass(!isEyeOpenOldPass)}
                      >
                        {isEyeOpenOldPass ? (
                          <PiEye size={20} />
                        ) : (
                          <PiEyeClosed size={20} />
                        )}
                      </a>
                    </div>
                    {oldPasswordDirty && oldPasswordError && (
                      <div className={styles.error_password__area}>
                        {oldPasswordError}
                      </div>
                    )}
                  </div>
                  <div className={styles.new_pass__container}>
                    <label>Новый пароль</label>
                    <div className={styles.new_pass_inpt__container}>
                      <input
                        name="newPassword"
                        value={newPassword}
                        onChange={newPasswordHandler}
                        onBlur={changePasswordBlurHandler}
                        className={styles.new_pass__inpt}
                        type={isEyeOpenNewPass ? "text" : "password"}
                      />
                      <a
                        type="button"
                        className={styles.eye__btn}
                        onClick={() => setIsEyeOpenNewPass(!isEyeOpenNewPass)}
                      >
                        {isEyeOpenNewPass ? (
                          <PiEye size={20} />
                        ) : (
                          <PiEyeClosed size={20} />
                        )}
                      </a>
                    </div>
                    {newPasswordDirty && newPasswordError && (
                      <div className={styles.error_password__area}>
                        {newPasswordError}
                      </div>
                    )}
                  </div>
                  {passwordMatch ? (
                    <div className={styles.password_match__container}>
                      Новый пароль не должен совпадать со старым
                    </div>
                  ) : null}
                  <div className={styles.confirm_pass__container}>
                    <button
                      className={styles.confirm_pass__btn}
                      onClick={handleConfirmChangePassword}
                      disabled={!isChangePassFormValid}
                    >
                      Подтвердить изменение пароля
                    </button>
                  </div>
                </div>
                <div className={styles.save_button__container}>
                  <button
                    onClick={handleSave}
                    className={styles.save__button}
                    disabled={!formValid}
                  >
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
