import { useContext, useState, useEffect, useRef } from "react";
import styles from "../styles/header.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AuthDropDownMenu from "./AuthDropDownMenu";

export default function Header({ setIsOpen }) {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLogOut, isAuth, userData } = useContext(AuthContext);

  const menuToggleRef = useRef(null);
  const menuBoxRef = useRef(null);

  const togglePopUp = (e) => {
    e.stopPropagation();
    setIsPopUpOpen((prev) => !prev);
  };

  const navigateTo = (path, hash) => {
    if (location.pathname !== path) {
      navigate(path);
      if (hash) {
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMenuToggle = () => {
    if (isMenuOpen) {
      setIsExiting(true);
      setIsMenuOpen(false);
      setTimeout(() => {
        setIsExiting(false);
      }, 300);
    } else {
      setIsMenuOpen(true);
    }
  };

  const AuthButton = () =>
    !isAuth ? (
      <a onClick={() => setIsOpen(true)}>
        <div className={styles.Image_wrapper}>
          <img
            className={styles.Avatar}
            src="/defaultAvatar.png"
            alt="Avatar"
          />
        </div>
        <p>Войти</p>
      </a>
    ) : (
      <a onClick={togglePopUp}>
        <div className={styles.Image_wrapper}>
          <img
            className={styles.Avatar}
            src="/defaultAvatar.png"
            alt="Avatar"
          />
        </div>
        <p>{userData.f_name}</p>
      </a>
    );

  return (
    <header>
      <div className={styles.top_header}>
        {isMenuOpen || isExiting ? (
          <div
            className={`${styles.hamburger__menu} ${isExiting ? styles.exiting : ""}`}
          >
            <ul
              ref={menuBoxRef}
              className={`${styles.menu__box} ${isExiting ? styles.exiting : ""}`}
            >
              <li className={styles.burger_Auth_container}>
                <AuthDropDownMenu
                  isPopUpOpen={isPopUpOpen}
                  onClose={() => setIsPopUpOpen(false)}
                />
                <AuthButton />
              </li>
              <li>
                <a
                  className={styles.menu__item}
                  onClick={() => {
                    handleMenuToggle();
                    navigateTo("/");
                  }}
                >
                  Главная
                </a>
              </li>
              <li>
                <a
                  className={styles.menu__item}
                  onClick={() => {
                    handleMenuToggle();
                    navigateTo("/services");
                  }}
                >
                  Услуги
                </a>
              </li>
              <li>
                <a
                  className={styles.menu__item}
                  onClick={() => {
                    handleMenuToggle();
                    navigateTo("/", "contacts_anchor");
                  }}
                >
                  Контакты
                </a>
              </li>
              <li>
                <a
                  className={styles.menu__item}
                  onClick={() => {
                    handleMenuToggle();
                    navigateTo("/aboutus");
                  }}
                >
                  О нас
                </a>
              </li>
            </ul>
          </div>
        ) : null}

        <div
          className={
            isMenuOpen || isExiting
              ? styles.header_first_item__disabled
              : styles.header_first__item
          }
        ></div>

        <ol className={styles.location_nav}>
          <li>
            <img className={styles.geologo} src="/geologo.png" alt="Geo logo" />{" "}
            Москва
          </li>
          <li>ул. Красноказарменая, д.17</li>
        </ol>
        <div
          onClick={() => {
            navigateTo("/");
          }}
          className={styles.company_name}
        >
          TECHARTISAN
        </div>
        <div className={styles.menu__container}>
          <label
            className={styles.menu__btn}
            opened={isMenuOpen ? "1" : "0"}
            onClick={() => {
              handleMenuToggle();
            }}
          >
            <span></span>
          </label>
        </div>
        <ol className={styles.social_nav}>
          <li>
            <img
              className={styles.tellogo}
              src="/tellogo.png"
              alt="Phone logo"
            />
            <a href="tel:+79999999999">+7-999-999-99-99</a>
          </li>
          <li>
            <a href="#">
              <img
                className={styles.tglogo}
                src="/tg.png"
                alt="Telegram logo"
              />
            </a>
          </li>
          <li>
            <a href="#">
              <img className={styles.vklogo} src="/vk.png" alt="VK logo" />
            </a>
          </li>
          <li>
            <a href="#">
              <img
                className={styles.wapplogo}
                src="/wapp.png"
                alt="WhatsApp logo"
              />
            </a>
          </li>
        </ol>
      </div>
      <div className={styles.bottom_header}>
        <div className={styles.bottom_header_left}>
          <a
            onClick={() => {
              navigateTo("/");
            }}
          >
            <img className={styles.logo} src="/logo.png" alt="Logo" />
          </a>
          <ol className={styles.main_nav}>
            <li>
              <a onClick={() => navigateTo("/")}>Главная</a>
            </li>
            <li>
              <a onClick={() => navigateTo("/services")}>Услуги</a>
            </li>
            <li>
              <a onClick={() => navigateTo("/", "contacts_anchor")}>Контакты</a>
            </li>
            <li>
              <a onClick={() => navigateTo("/aboutus")}>О нас</a>
            </li>
          </ol>
        </div>
        <div className={styles.Auth_container}>
          <AuthDropDownMenu
            isPopUpOpen={isPopUpOpen}
            onClose={() => setIsPopUpOpen(false)}
          />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
