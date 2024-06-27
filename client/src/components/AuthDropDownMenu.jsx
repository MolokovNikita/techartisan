import styles from "../styles/drop.module.css";
import { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AuthDropDownMenu(props) {
  const { isPopUpOpen, onClose } = props;
  const { handleLogOut, userData } = useContext(AuthContext);
  const popUpRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleClickLogout = () => {
    handleLogOut();
    handleClose();
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

  return (
    <>
      {isPopUpOpen || isExiting ? (
        <div
          className={`${styles.dropDownProfile} ${isExiting ? styles.exiting : ""}`}
          ref={popUpRef}
          tabIndex="-1"
        >
          <ul className={styles.dropDown_list}>
            <li>{userData.email}</li>
            <li>
              <a href="">Чат с поддержкой</a>
            </li>
            <li>
              <a href="">Настройки аккаунта</a>
            </li>
            <li>
              <a href="">Мои услуги</a>
            </li>
            <li>
              <a onClick={handleClickLogout} href="">
                Выход
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </>
  );
}
