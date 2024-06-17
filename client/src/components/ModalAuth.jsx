import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from 'react-dom';
import style from "../styles/style.module.css";

const ModalRootElement = document.querySelector('#ModalAuth');
export default function ModalAuth(props) {
    const { isOpen, onClose } = props;
    const [isLoginSelected, setIsLoginSelected] = useState(true);
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
                <div className={style.close}>
                    <button className={style.closeButton} onClick={handleBackgroundClick}>
                        <img src="/close.png" alt="close" className={style.closeImage} />
                    </button>
                </div>
                <div className={style.LoginRegisterToggle}>
                    <a className={isLoginSelected ? style.selected : ''} onClick={() => setIsLoginSelected(true)}>Логин&nbsp;</a>
                    <p> / </p>
                    <a className={!isLoginSelected ? style.selected : ''} onClick={() => setIsLoginSelected(false)}>&nbsp;Регистрация</a>
                </div>
                {isLoginSelected ? (
                    <div>
                        <div className={style.Login_area_container}>
                            <input className={style.Login_area} type="text" placeholder='Email или телефон' />
                        </div>
                        <div className={style.Password_area_container}>
                            <input className={style.Password_area} type="password" placeholder='Пароль' />
                        </div>
                        <div className={style.FortgotPass_container}>
                            <a>Забыли пароль ?</a>
                        </div>
                        <div className={style.LoginBtn_container}>
                            <button class>Войти</button>
                        </div>
                    </div>
                ) : (
                    <div className={style.Registration_container}>
                        <div className={style.Name_area_container}>
                            <input className={style.Name_area} type="text" placeholder='Ваше имя' />
                        </div>
                        <div className={style.Login_area_container}>
                            <input className={style.Login_area} type="text" placeholder='Email или телефон' />
                        </div>
                        <div className={style.Password_area_container}>
                            <input className={style.Password_area} type="password" placeholder='Пароль' />
                        </div>
                        <div className={style.Password_area_container}>
                            <input className={style.Password_area} type="password" placeholder='Подтвердите пароль' />
                        </div>
                        <div className={style.RegisterBtn_container}>
                            <button>Зарегистрироваться</button>
                        </div>
                        <div className={style.RegisterPoliticy}>Нажимая кнопку «Зарегистрироваться», я даю свое согласие на сбор и обработку моих персональных данных в соответствии с <br /> <a src='#'>Политикой</a> и принимаю условия <a src='#'>Пользовательского соглашения</a></div>
                    </div>
                )}
            </div>
        </div>,
        element
    );
}