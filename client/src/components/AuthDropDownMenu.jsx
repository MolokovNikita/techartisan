import styles from "../styles/drop.module.css";
import { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CiMail } from "react-icons/ci";
import { MdOutlineSupportAgent } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { RiPagesLine } from "react-icons/ri";
import { IoLogOutOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

export default function AuthDropDownMenu(props) {
  const { isPopUpOpen, onClose } = props;
  const { handleLogOut, userData } = useContext(AuthContext);
  const popUpRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClickLogout = () => {
    handleLogOut();
    handleClose();
    window.location.href = "/";
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      onClose();
    }, 300); // Длительность анимации
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isPopUpOpen) {
        handleClose();
      }
    };

    const handleClickOutside = (e) => {
      if (popUpRef.current && !popUpRef.current.contains(e.target)) {
        handleClose();
      }
    };

    if (isPopUpOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopUpOpen, onClose]);

  if (!isPopUpOpen && !isExiting) return null;

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
  return (
    <>
      {isPopUpOpen || isExiting ? (
        <div
          className={`${styles.dropDownProfile} ${isExiting ? styles.exiting : ""}`}
          ref={popUpRef}
          tabIndex="-1"
        >
          <ul className={styles.dropDown_list}>
            <li>
              <div className={styles.dropDown_block}>
                <div className={styles.logo}>
                  <CiMail size={20} />
                </div>
                <div className={styles.logo_btn}>Почта</div>
              </div>
              <div>{userData.email}</div>
            </li>
            {/* <li>
              <a onClick={() => handleNavigation("/support")}>
                <div className={styles.dropDown_block}>
                  <div className={styles.logo}>
                    <MdOutlineSupportAgent size={20} />{" "}
                  </div>
                  <div className={styles.logo_btn}>Чат с поддержкой</div>
                </div>
              </a>
            </li> */}
            <li>
              <a onClick={() => handleNavigation("/account")}>
                <div className={styles.dropDown_block}>
                  <div className={styles.logo}>
                    <CiSettings size={20} />{" "}
                  </div>
                  <div className={styles.logo_btn}> Настройки аккаунта</div>
                </div>
              </a>
            </li>
            <li>
              <a onClick={() => handleNavigation("/my/services")}>
                <div className={styles.dropDown_block}>
                  <div className={styles.logo}>
                    <RiPagesLine size={20} />
                  </div>
                  <div className={styles.logo_btn}>Мои услуги</div>
                </div>
              </a>
            </li>
            <li>
              <a onClick={handleClickLogout}>
                <div className={styles.dropDown_block}>
                  <div className={styles.logo}>
                    <IoLogOutOutline size={20} />
                  </div>
                  <div className={styles.logo_btn}>Выход</div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </>
  );
}
