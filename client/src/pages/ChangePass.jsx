import { useState, useEffect, useRef } from "react";
import styles from "../styles/changepass.module.css";
import { FaArrowRight } from "react-icons/fa";
import EnterCode from "../components/EnterCode";
import config from "../config";
import axios from "axios";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { enqueueSnackbar } from "notistack";
import { useLocation, useNavigate } from "react-router-dom";

export default function ChangePass() {
  const location = useLocation();
  const navigate = useNavigate();

  const targetRecover = useRef(""); //почта или телефон
  const [submitCode, setSubmitCode] = useState(""); //код подтверждения введеный пользователем

  const [isEmailRecover, setIsEmailRecover] = useState(true); // переключатель, по чему будет восстановление
  const [isLoading, setIsLoading] = useState(false); // лоадер
  const [isSubmit, setIsSubmit] = useState(false); // отправлен ли код
  const [isVerified, setIsVerified] = useState(false); // подтвержден ли код
  //валидация формы для ввода почты и номера телефона
  const [email, setEmail] = useState("");
  const [emailDirty, setEmailDirty] = useState(false);
  const [emailError, setEmailError] = useState("обязательное поле");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberDirty, setPhoneNumberDirty] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState("обязательное поле");

  const [formValid, setFormValid] = useState(false);

  //валидация формы для пароля
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState("");
  const [passwordDirty, setPasswordDirty] = useState(false);
  const [passwordError, setPasswordError] = useState(
    "Пароль не может быть пустым",
  );

  const [passwordFormValid, setPasswordFormValid] = useState(false);

  useEffect(() => {
    if (isEmailRecover) {
      if (emailError) {
        setFormValid(false);
      } else {
        setFormValid(true);
      }
    } else {
      if (phoneNumberError) {
        setFormValid(false);
      } else {
        setFormValid(true);
      }
    }
  }, [emailError, phoneNumberError]);
  useEffect(() => {
    if (passwordError) {
      setPasswordFormValid(false);
    } else {
      setPasswordFormValid(true);
    }
  }, [passwordError]);
  const emailHandler = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Некорректный email, Пример: mail@example.ru");
    } else {
      setEmailError("");
    }
  };
  const phoneNumberHandler = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    const phoneNumberRegex = /^7\d{10}$/;
    if (!phoneNumberRegex.test(value)) {
      setPhoneNumberError("Некорректный номер телефона Пример: 79994567890");
    } else {
      setPhoneNumberError("");
    }
  };
  const passwordHandler = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!value) {
      setPasswordError("*Данное поле не можеть быть пустым");
    } else if (!/^[A-Za-z0-9]\w{5,30}$/.test(value)) {
      setPasswordError("*Неккоректный формат пароля");
    } else {
      setPasswordError("");
    }
  };

  const blurHandler = (e) => {
    switch (e.target.name) {
      case "email":
        setEmailDirty(true);
        break;
      case "phoneNumber":
        setPhoneNumberDirty(true);
        break;
      case "password":
        setPasswordDirty(true);
        break;
      default:
        break;
    }
  };
  const handlePasswordContinue = () => {
    if (password === passwordMatch) {
      if (email) {
        axios
          .put(`${config.API_URL}/clients/password/recover`, {
            email: email,
            pass: password,
            code: submitCode,
          })
          .then((res) => {
            enqueueSnackbar(`Ваш пароль был успешно изменен!`, {
              variant: "success",
              autoHideDuration: 3000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            });
          })
          .catch((e) => {
            enqueueSnackbar(`Упс, что-то пошло не так -${e}!`, {
              variant: "error",
              autoHideDuration: 3000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            });
          })
          .finally(() => {
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          });
      } else {
        enqueueSnackbar(
          `Упc, что-то пошло не так, попробуйте перезагрузить страницу!`,
          {
            variant: "error",
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          },
        );
        return;
      }
    } else {
      enqueueSnackbar(`Кажется, вы допустили ошибку в одном из полей!`, {
        variant: "warning",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      return;
    }
  };
  const handleCodeSubmit = async (code) => {
    const VERIFICATION_CODE = code;
    setIsLoading(true);
    axios
      .post(`${config.API_URL}/email-verification/verify`, {
        email: email,
        code: VERIFICATION_CODE,
      })
      .then((res) => {
        enqueueSnackbar(`Код подтвержден!`, {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
        setIsVerified(true);
        setSubmitCode(VERIFICATION_CODE);
      })
      .catch((e) => {
        enqueueSnackbar(`Неверный код!`, {
          variant: "error",
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleEmailClick = () => {
    setPhoneNumber("");
    setPhoneNumberError("обязательное поле");
    setPhoneNumberDirty(false);
    targetRecover.current = "";
    setIsEmailRecover(true);
  };
  const handleNavigation = (path, hash) => {
    if (location.pathname !== path) {
      navigate(path);
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    } else if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
  const handlePhoneClick = () => {
    setEmail("");
    setEmailError("обязательное поле");
    setEmailDirty(false);
    targetRecover.current = "";
    setIsEmailRecover(false);
  };
  const handleContinue = () => {
    if (isEmailRecover) {
      if (!emailError) {
        targetRecover.current = email;
        setIsLoading(true);
        axios
          .post(`${config.API_URL}/email-verification/send`, {
            email: email,
          })
          .then((res) => {
            enqueueSnackbar(`Код успешно выслан!`, {
              variant: "success",
              autoHideDuration: 3000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            });
            setIsSubmit(true);
          })
          .catch((e) => {
            console.log(e);
            enqueueSnackbar(
              `Упс, кажется что-то пошло не так - Не удалось найти пользователя с таким email!`,
              {
                variant: "error",
                autoHideDuration: 3000,
                anchorOrigin: {
                  vertical: "top",
                  horizontal: "right",
                },
              },
            );
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else return;
    } else {
      if (!phoneNumberError) {
        targetRecover.current = phoneNumber;
        setIsSubmit(true);
      } else return;
    }
  };

  return (
    <div className={styles.change_password__container}>
      <div className={styles.content__wrap}>
        {!isVerified ? (
          <>
            {!isSubmit ? (
              <>
                <div className={styles.change_password_title__container}>
                  <div className={styles.change_password__title}>
                    Восстановление пароля
                  </div>
                </div>
                {!isLoading ? (
                  <div className={styles.recover_password__container}>
                    <div className={styles.select_type__recover__container}>
                      <ul className={styles.select_type__recover__list}>
                        <li>
                          <a onClick={handleEmailClick}>по email</a>
                        </li>
                        <li className={styles.stick}>|</li>
                        <li>
                          <a onClick={handlePhoneClick}>по номеру</a>
                        </li>
                      </ul>
                      <div
                        className={`${styles.slider} ${isEmailRecover ? styles.left : styles.right}`}
                      ></div>
                    </div>

                    <div className={styles.change_password_area__container}>
                      <div className={styles.input__wrapper}>
                        {isEmailRecover ? (
                          <input
                            name="email"
                            className={styles.email__area}
                            type="text"
                            placeholder=" "
                            onChange={emailHandler}
                            value={email}
                            onBlur={blurHandler}
                          />
                        ) : (
                          <input
                            name="phoneNumber"
                            className={styles.phone__area}
                            type="text"
                            placeholder=" "
                            onChange={phoneNumberHandler}
                            value={phoneNumber}
                            onBlur={blurHandler}
                          />
                        )}
                        <label className={styles.placeholder__label}>
                          {isEmailRecover ? "Email" : "Номер телефона"}
                        </label>
                      </div>
                      {emailDirty && emailError && (
                        <div className={styles.error__area}>{emailError}</div>
                      )}

                      {phoneNumberDirty && phoneNumberError && (
                        <div className={styles.error__area}>
                          {phoneNumberError}
                        </div>
                      )}

                      <div className={styles.continue_btn__container}>
                        <button
                          disabled={!formValid}
                          onClick={handleContinue}
                          className={
                            formValid
                              ? styles.continue__btn
                              : styles.continue_disabled__btn
                          }
                        >
                          <FaArrowRight size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.loader_container}>
                    <div className={styles.spinner}></div>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.enter_code__container}>
                <EnterCode
                  isLoading={isLoading}
                  callback={handleCodeSubmit}
                  back={() => {
                    setIsSubmit(false);
                  }}
                  targetRecover={targetRecover.current}
                />
              </div>
            )}
          </>
        ) : (
          <div className={styles.password_change__container}>
            <div className={styles.Password_area_container}>
              <div className={styles.inputWrapper}>
                <input
                  onChange={passwordHandler}
                  value={password}
                  onBlur={blurHandler}
                  name="password"
                  className={styles.Password_area}
                  type={isEyeOpen ? "text" : "password"}
                  placeholder=" "
                  autoComplete="password"
                />
                <label className={styles.placeholderLabel}>
                  Придумайте пароль
                </label>
                <a
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setIsEyeOpen(!isEyeOpen)}
                >
                  {isEyeOpen ? <PiEye /> : <PiEyeClosed />}
                </a>
              </div>
            </div>
            {passwordDirty && passwordError && (
              <div className={styles.Error_area}>{passwordError}</div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "300px",
              }}
            >
              <div style={{ fontSize: "15px" }}>
                Минимум 6 символов (букв или цифр)
              </div>
            </div>
            <div className={styles.Password_area_container}>
              <div className={styles.inputWrapper}>
                <input
                  onChange={(e) => setPasswordMatch(e.target.value)}
                  value={passwordMatch}
                  name="passwordMatch"
                  className={styles.Password_area}
                  type="password"
                  placeholder=" "
                  autoComplete="password-match"
                />
                <label className={styles.placeholderLabel}>
                  Подтвердите пароль
                </label>
              </div>
            </div>
            {passwordMatch === password ? null : (
              <div className={styles.Error_area}>*Пароль не совпадает</div>
            )}
            <div className={styles.continue_btn__container}>
              <button
                disabled={
                  !passwordFormValid ||
                  !(password === passwordMatch) ||
                  !password ||
                  !passwordMatch
                }
                onClick={handlePasswordContinue}
                className={
                  !passwordFormValid ||
                  !(password === passwordMatch) ||
                  !password ||
                  !passwordMatch
                    ? styles.continue_disabled__btn
                    : styles.continue__btn
                }
              >
                <FaArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
