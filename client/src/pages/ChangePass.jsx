import { useState, useEffect, useRef } from "react";
import styles from "../styles/changepass.module.css";
import { FaArrowRight } from "react-icons/fa";
import EnterCode from "../components/EnterCode";
import config from "../config";
import axios from "axios";
import { PiEye, PiEyeClosed } from "react-icons/pi";

export default function ChangePass() {
  const targetRecover = useRef("");

  const [isEmailRecover, setIsEmailRecover] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [email, setEmail] = useState("");
  const [emailDirty, setEmailDirty] = useState(false);
  const [emailError, setEmailError] = useState("обязательное поле");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberDirty, setPhoneNumberDirty] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState("обязательное поле");

  const [formValid, setFormValid] = useState(false);

  //password validation
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState("");
  const [passwordDirty, setPasswordDirty] = useState(false);
  const [passwordMatchDirty, setPasswordMatchDirty] = useState(false);
  const [passwordError, setPasswordError] = useState(
    "Пароль не может быть пустым",
  );
  const [passwordMatchError, setPasswordMatchError] = useState(
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

  const handlePasswordContinue = () => {
    console.log("continue");
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
      case "passwordMatch":
        setPasswordMatchDirty(true);
        break;
      default:
        break;
    }
  };

  const handleCodeSubmit = async (code) => {
    setIsLoading(true);
    axios
      .post(`${config.API_URL}/email-verification/verify`, {
        email: email,
        code: code,
      })
      .then((res) => {
        console.log(res);
        alert("Код подтвержден!");
        setIsVerified(true);
      })
      .catch((e) => {
        console.error(e);
        alert("Неверный код!");
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
        setIsSubmit(true);
        axios
          .post(`${config.API_URL}/email-verification/send`, {
            email: email,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((e) => console.error(e));
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
