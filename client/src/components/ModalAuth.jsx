import { useEffect, useMemo, useRef } from "react";
import { createPortal } from 'react-dom';
import style from "../style.module.css";

const ModalRootElement = document.querySelector('#ModalAuth');

export default function ModalAuth(props) {
  const { isOpen, onClose } = props;
  const element = useMemo(() => document.createElement("div"), []);
  const modalRef = useRef(null);

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
        const focusableElements = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else { // Tab
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
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current.focus(); // Установить фокус на модальное окно при открытии
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackgroundClick = () => {
    onClose();
  };

  const handleCardClick = (event) => {
    event.stopPropagation();
  };

  return createPortal(
    <div className={style.AuthModal_background} onClick={handleBackgroundClick}>
      <div className={style.AuthModal_card} onClick={handleCardClick} ref={modalRef} tabIndex="-1">
        {props.children}
        <div className={style.close}>
          <button className={style.closeButton} onClick={handleBackgroundClick}>
            <img src="/close.png" alt="kk" className={style.closeImage} />
          </button>
        </div>
        <div className={style.Login}>
          Вход / Регистрация
        </div>
        <div className={style.Login_area_container}>
          <input className={style.Login_area} type="text" placeholder='Email или телефон' />
        </div> 
        <div className={style.Password_area_container}>
          <input className={style.Password_area} type="password" placeholder='Пароль' />
        </div>
        <div className={style.FortgotPass_container}>
            <a>Забыли пароль?</a>
        </div>
        <div className={style.auth_container}>
          <button>Войти</button>
        </div>
      </div>
    </div>,
    element
  );
}
