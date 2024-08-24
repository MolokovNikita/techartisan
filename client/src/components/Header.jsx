import { useContext, useState, useEffect } from "react";
import styles from "../styles/header.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AuthDropDownMenu from "./AuthDropDownMenu";

export default function Header({ setIsOpen }) {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLogOut, isAuth, userData } = useContext(AuthContext);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const menuBox = document.querySelector(`.${styles.menu__box}`);
      const menuToggle = document.querySelector(`#${styles.menu__toggle}`);

      if (
        isMenuOpen &&
        menuBox &&
        !menuBox.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        setIsMenuOpen(false);
        menuToggle.checked = false;
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("scroll", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("scroll", handleClickOutside);
    };
  }, [isMenuOpen]);

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
    setIsMenuOpen((prev) => !prev);
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
        <div className={styles.hamburger__menu}>
          <input
            id={styles.menu__toggle}
            type="checkbox"
            onChange={handleMenuToggle}
          />
          <label
            className={styles.menu__btn}
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
            }}
            htmlFor={styles.menu__toggle}
          >
            <span></span>
          </label>
          <ul className={styles.menu__box}>
            <li className={styles.burger_Auth_container}>
              <AuthDropDownMenu
                isPopUpOpen={isPopUpOpen}
                onClose={() => setIsPopUpOpen(false)}
              />
              <AuthButton />
            </li>
            <li>
              <a className={styles.menu__item} onClick={() => navigateTo("/")}>
                Главная
              </a>
            </li>
            <li>
              <a
                className={styles.menu__item}
                onClick={() => navigateTo("/services")}
              >
                Услуги
              </a>
            </li>
            <li>
              <a
                className={styles.menu__item}
                onClick={() => navigateTo("/", "contacts_anchor")}
              >
                Контакты
              </a>
            </li>
            <li>
              <a
                className={styles.menu__item}
                onClick={() => navigateTo("/aboutus")}
              >
                О нас
              </a>
            </li>
          </ul>
        </div>
        <ol className={styles.location_nav}>
          <li>
            <img className={styles.geologo} src="/geologo.png" alt="Geo logo" />{" "}
            Москва
          </li>
          <li>ул. Красноказарменая, д.17</li>
          <li className={styles.company_name}>TECHARTISAN</li>
        </ol>
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
          <a onClick={() => navigateTo("/")}>
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
