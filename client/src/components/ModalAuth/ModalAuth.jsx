import { useEffect, useMemo, useRef, useState, useContext } from "react";
import { createPortal } from "react-dom";
import style from "../../styles/style.module.css";
import { AuthContext } from "../../context/AuthContext";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { useLoginValidation } from "../../hooks/useLoginValidation";
import { useValidation } from "../../hooks/useValidation";
import { useLocation, useNavigate } from "react-router-dom";

const ModalRootElement = document.querySelector("#ModalAuth");

export default function ModalAuth(props) {
  const { isOpen, onClose } = props;
  const { handleSignIn, handleSignUp, erorText, setErrorText } =
    useContext(AuthContext);
  const [isLoginSelected, setIsLoginSelected] = useState(true);
  const element = useMemo(() => document.createElement("div"), []);
  const modalRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

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

  const {
    name,
    email,
    password,
    passwordMatch,
    nameDirty,
    emailDirty,
    passwordDirty,
    passwordMatchDirty,
    nameError,
    emailError,
    passwordError,
    passwordMatchError,
    formValid,
    nameHandler,
    emailHandler,
    passwordHandler,
    passwordMatchHandler,
    blurHandler,
  } = useValidation();

  const {
    loginEmail,
    loginPassword,
    loginEmailDirty,
    loginPasswordDirty,
    loginEmailError,
    loginPasswordError,
    loginFormValid,
    loginEmailHandler,
    loginPasswordHandler,
    blurHandler: loginBlurHandler,
  } = useLoginValidation();

  const [isEyeOpen, setIsEyeOpen] = useState(false);

  useEffect(() => {
    if (ModalRootElement) {
      ModalRootElement.appendChild(element);
      return () => {
        ModalRootElement.removeChild(element);
      };
    }
  }, [element]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Tab" && isOpen) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }

      // Закрытие модального окна при нажатии на Esc
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
      modalRef.current.focus();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRegistration = (event) => {
    event.preventDefault();
    if (nameError || emailError || passwordError || passwordMatchError) {
      return;
    } else {
      const f_name = name;
      const pass = password;
      handleSignUp([{ f_name, email, pass }, onClose]);
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (loginEmailError || loginPasswordError) {
      return;
    } else {
      const email = loginEmail;
      const pass = loginPassword;
      handleSignIn([{ email, pass }, onClose]);
    }
  };

  const handleBackgroundClick = () => {
    onClose();
  };

  const handleCardClick = (event) => {
    event.stopPropagation();
  };

  return createPortal(
    <div className={style.AuthModal_background} onClick={handleBackgroundClick}>
      <div
        className={style.AuthModal_card}
        onClick={handleCardClick}
        ref={modalRef}
        tabIndex="-1"
      >
        <div className={style.close}>
          <button className={style.closeButton} onClick={handleBackgroundClick}>
            <img src="/close.png" alt="close" className={style.closeImage} />
          </button>
        </div>
        <div className={style.LoginRegisterToggle}>
          <a
            className={isLoginSelected ? style.selected : ""}
            onClick={() => {
              setIsLoginSelected(true);
              setErrorText("");
            }}
          >
            Логин&nbsp;
          </a>
          <p> / </p>
          <a
            className={!isLoginSelected ? style.selected : ""}
            onClick={() => {
              setIsLoginSelected(false);
              setErrorText("");
            }}
          >
            &nbsp;Регистрация
          </a>
        </div>
        {isLoginSelected ? (
          <form onSubmit={handleLogin} className={style.login_form__container}>
            <div className={style.Email_area_container}>
              <div className={style.inputWrapper}>
                <input
                  onChange={loginEmailHandler}
                  value={loginEmail}
                  onBlur={loginBlurHandler}
                  name="loginEmail"
                  className={style.Email_area}
                  type="text"
                  placeholder=" "
                  autoComplete="email"
                />
                <label className={style.placeholderLabel}>Email</label>
              </div>
            </div>
            {loginEmailDirty && loginEmailError && (
              <div className={style.Error_area}>{loginEmailError}</div>
            )}

            <div className={style.Password_area_container}>
              <div className={style.inputWrapper}>
                <input
                  onChange={loginPasswordHandler}
                  value={loginPassword}
                  onBlur={loginBlurHandler}
                  name="loginPassword"
                  className={style.Password_area}
                  type="password"
                  placeholder=" "
                  autoComplete="password"
                />
                <label className={style.placeholderLabel}>Пароль</label>
              </div>
            </div>
            {loginPasswordDirty && loginPasswordError && (
              <div className={style.Error_area}>{loginPasswordError}</div>
            )}
            <div className={style.FortgotPass_container}>
              <a>Забыли пароль ?</a>
            </div>
            <div className={style.LoginBtn_container}>
              <button
                disabled={!loginFormValid}
                className={
                  loginFormValid ? style.buttonEnabled : style.buttonDisabled
                }
                type="submit"
              >
                Войти
              </button>
            </div>
            <div className={style.Error_text}>{erorText}</div>
          </form>
        ) : (
          <form
            onSubmit={handleRegistration}
            className={style.Registration_container}
          >
            <div className={style.Name_area_container}>
              <div className={style.inputWrapper}>
                <input
                  onChange={nameHandler}
                  value={name}
                  onBlur={blurHandler}
                  name="name"
                  className={style.Name_area}
                  type="text"
                  placeholder=" "
                  autoComplete="name"
                />
                <label className={style.placeholderLabel}>Ваше имя</label>
              </div>
            </div>
            {nameDirty && nameError && (
              <p className={style.Error_area}>{nameError}</p>
            )}

            <div className={style.Email_area_container}>
              <div className={style.inputWrapper}>
                <input
                  onChange={emailHandler}
                  value={email}
                  onBlur={blurHandler}
                  name="email"
                  className={style.Email_area}
                  type="text"
                  placeholder=" "
                  autoComplete="email"
                />
                <label className={style.placeholderLabel}>Email</label>
              </div>
            </div>
            {emailDirty && emailError && (
              <div className={style.Error_area}>{emailError}</div>
            )}

            <div className={style.Password_area_container}>
              <div className={style.inputWrapper}>
                <input
                  onChange={passwordHandler}
                  value={password}
                  onBlur={blurHandler}
                  name="password"
                  className={style.Password_area}
                  type={isEyeOpen ? "text" : "password"}
                  placeholder=" "
                  autoComplete="password"
                />
                <label className={style.placeholderLabel}>
                  Придумайте пароль
                </label>
                <a
                  type="button"
                  className={style.eyeButton}
                  onClick={() => setIsEyeOpen(!isEyeOpen)}
                >
                  {isEyeOpen ? <PiEye /> : <PiEyeClosed />}
                </a>
              </div>
            </div>
            {passwordDirty && passwordError && (
              <div className={style.Error_area}>{passwordError}</div>
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
            <div className={style.Password_area_container}>
              <div className={style.inputWrapper}>
                <input
                  onChange={passwordMatchHandler}
                  value={passwordMatch}
                  onBlur={blurHandler}
                  name="passwordMatch"
                  className={style.Password_area}
                  type="password"
                  placeholder=" "
                  autoComplete="password-match"
                />
                <label className={style.placeholderLabel}>
                  Подтвердите пароль
                </label>
              </div>
            </div>
            {passwordMatchDirty && passwordMatchError && (
              <div className={style.Error_area}>{passwordMatchError}</div>
            )}
            <div className={style.register_politicy}>
              Нажимая кнопку «Зарегистрироваться», я даю свое согласие на сбор и
              обработку моих персональных данных в соответствии с&nbsp;
              <a href="/confidencity" target="_blank">
                Политикой
              </a>
              &nbsp;и принимаю условия&nbsp;
              <a href="/politicy" target="_blank">
                Пользовательского соглашения
              </a>
            </div>

            <div className={style.RegisterBtn_container}>
              <button
                disabled={!formValid}
                className={
                  formValid ? style.buttonEnabled : style.buttonDisabled
                }
                type="submit"
              >
                Зарегистрироваться
              </button>
            </div>
            <div className={style.Error_text}>{erorText}</div>
          </form>
        )}
      </div>
    </div>,
    element,
  );
}
