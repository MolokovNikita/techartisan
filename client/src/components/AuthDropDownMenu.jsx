import styles from "../styles/drop.module.css";
import { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CiMail } from "react-icons/ci";
import { MdOutlineSupportAgent } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { RiPagesLine } from "react-icons/ri";
import { IoLogOutOutline } from "react-icons/io5";

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
            <li>
              <div className={styles.dropDown_block}>
                <CiMail size={20} />
                Почта
              </div>
              <div>{userData.email}</div>
            </li>
            <li>
              <a href="">
                <div className={styles.dropDown_block}>
                  <MdOutlineSupportAgent size={20} />
                  Чат с поддержкой
                </div>
              </a>
            </li>
            <li>
              <a href="">
                <div className={styles.dropDown_block}>
                  <CiSettings size={20} />
                  Настройки аккаунта
                </div>
              </a>
            </li>
            <li>
              <a href="">
                <div className={styles.dropDown_block}>
                  <RiPagesLine size={20} />
                  Мои услуги
                </div>
              </a>
            </li>
            <li>
              <a onClick={handleClickLogout} href="">
                <div className={styles.dropDown_block}>
                  <IoLogOutOutline size={20} />
                  Выход
                </div>
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </>
  );
}
