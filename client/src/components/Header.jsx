import { useContext, useState, useEffect, useRef } from "react";
import styles from "../styles/header.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AuthDropDownMenu from "./AuthDropDownMenu";
import axios from "axios";
import config from "../config/config.js";
import { IoIosArrowDown } from "react-icons/io";

export default function Header({ setIsOpen }) {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [offices, setOffices] = useState([]);
  const [isOfficeListOpen, setIsOfficeListOpen] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const { handleLogOut, isAuth, userData } = useContext(AuthContext);
  const menuToggleRef = useRef(null);
  const menuBoxRef = useRef(null);
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${config.API_URL}/offices`)
      .then((res) => {
        setOffices(res.data);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        handleMenuToggle();
      }
    };
    const handleClickOutside = (e) => {
      if (
        menuBoxRef.current &&
        !menuBoxRef.current.contains(e.target) &&
        isMenuOpen
      ) {
        handleMenuToggle();
      }
    };
    const handleScroll = () => {
      if (isMenuOpen) {
        handleMenuToggle();
      }
    };
    if (isMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", handleScroll);
    } else if (isExiting) {
      const timeoutId = setTimeout(() => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("scroll", handleScroll);
        setIsExiting(false);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen, isExiting]);
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
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsExiting(false);
      }, 100);
    } else {
      setIsMenuOpen(true);
    }
  };

  const AuthButton = () =>
    !isAuth ? (
      <a
        onClick={() => {
          if (isMenuOpen) {
            setIsMenuOpen(false);
          }
          setIsOpen(true);
        }}
      >
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
          <li className={styles.location__item}>
            {isLoading ? (
              <div className={styles.loader_container}>
                <div className={styles.spinner}></div>
                <p className={styles.loading__title}>
                  Загрузка актуальных офисов
                </p>
              </div>
            ) : (
              <div
                className={styles.offices_list}
                onClick={() => {
                  setIsOfficeListOpen((prev) => !prev);
                }}
              >
                <img
                  className={styles.geologo}
                  src="/geologo.png"
                  alt="Geo logo"
                />
                {selectedOffice ? selectedOffice : offices[0]?.adress}
                <div
                  className={
                    isOfficeListOpen
                      ? styles.arrow__icon__rotated
                      : styles.arrow__icon
                  }
                >
                  <IoIosArrowDown size={20} />
                </div>
              </div>
            )}
          </li>
          <li>
            {isOfficeListOpen && offices.length > 0 ? (
              <div className={styles.offices_list__dropdown}>
                {offices.map((item, index) => {
                  return (
                    <div key={index} className={styles.office__item}>
                      <a>{item.adress}</a>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </li>
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
