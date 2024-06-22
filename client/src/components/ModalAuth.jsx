import { useEffect, useMemo, useRef, useState, useContext } from "react";
import { createPortal } from 'react-dom';
import style from "../styles/style.module.css";
import { AuthContext } from '../context/AuthContext';
import axios from "axios";

const ModalRootElement = document.querySelector('#ModalAuth');

export default function ModalAuth(props) {
    const { isOpen, onClose } = props;
    const { isAuth, setisAuth, handleSignIn, handleSignUp } = useContext(AuthContext);
    const [isLoginSelected, setIsLoginSelected] = useState(true);
    const element = useMemo(() => document.createElement("div"), []);
    const modalRef = useRef(null);

    //Validation
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nameDirty, setNameDirty] = useState(false);
    const [emailDirty, setEmailDirty] = useState(false);
    const [passwordDirty, setPasswordDirty] = useState(false);
    const [passwordMatchDirty, setPasswordMatchDirty] = useState(false);
    const [nameError, setNameError] = useState('*Данное поле не можеть быть пустым');
    const [emailError, setEmailError] = useState('*Данное поле не можеть быть пустым');
    const [passwordError, setPasswordError] = useState('*Данное поле не можеть быть пустым');
    const [passwordMatch, setPasswordMatch] = useState('');
    const [passwordMatchEror, setPasswordMatchEror] = useState('*Данное поле не можеть быть пустым')
    const [formValid, setFormValid] = useState(false)

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

    useEffect(() => {
        if (emailError || nameError || passwordError || passwordMatchEror) {
            setFormValid(false);
        } else {
            setFormValid(true);
        }
    }, [emailError, nameError, passwordError, passwordMatchEror]);

    const handleBackgroundClick = () => {
        onClose();
    };

    const handleCardClick = (event) => {
        event.stopPropagation();
    };

    const nameHandler = (e) => {
        const value = e.target.value;
        setName(value);
        if (!value) {
            setNameError('*Данное поле не можеть быть пустым');
        } else if (!/^[а-яА-Я ]+$/.test(value.toLowerCase())) {
            setNameError('*Неккоректное имя (Пример : Иван)');
        } else {
            setNameError('');
        }
    };

    const emailHandler = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (!value) {
            setEmailError('*Данное поле не можеть быть пустым');
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value.toLowerCase())) {
            setEmailError('*Неккоректный email, Пример: mail@example.ru');
        } else {
            setEmailError('');
        }
    };

    const passwordHandler = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (!value) {
            setPasswordError('*Данное поле не можеть быть пустым');
        } else if (!/^[A-Za-z0-9]\w{5,30}$/.test(value)) {
            setPasswordError('*Неккоректный формат пароля');
        } else {
            setPasswordError('');
        }
    };
    const passwordMatchHandler = (e)=>{
        const value = e.target.value;
        setPasswordMatch(value);
        if (!value) {
            setPasswordMatchEror('*Данное поле не можеть быть пустым');
        }
        else if (value !== password) {
            setPasswordMatchEror('*Пароль не совпадает');
        }
        else {
            setPasswordMatchEror('');
        }
    }
    const blurHandler = (e) => {
        switch (e.target.name) {
            case 'name':
                setNameDirty(true);
                break;
            case 'email':
                setEmailDirty(true);
                break;
            case 'password':
                setPasswordDirty(true);
                break;
            case 'passwordMatch':
             setPasswordMatchDirty(true);
             break;
        }
    };

    if (!isOpen) return null;

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
                            <button> Войти</button>
                        </div>
                    </div>
                ) : (
                    <div className={style.Registration_container}>
                        <div className={style.Name_area_container}>
                            <input onChange={nameHandler} value={name} onBlur={blurHandler} name='name' className={style.Name_area} type="text" placeholder='Ваше имя' />

                        </div>
                        {(nameDirty && nameError) && <p className ={style.Error_area}>{nameError}</p>}
                        <div className={style.Login_area_container}>
                            <input onChange={emailHandler} value={email} onBlur={blurHandler} name='email' className={style.Login_area} type="text" placeholder='Email или телефон' />
                        </div>
                        {(emailDirty && emailError) && <div className ={style.Error_area} >{emailError}</div>}
                        <div className={style.Password_area_container}>
                            <input onChange={passwordHandler} value={password} onBlur={blurHandler} name='password' className={style.Password_area} type="password" placeholder='Пароль' />
                        </div>
                        {(passwordDirty && passwordError) && <div className ={style.Error_area}>{passwordError}</div>}
                        <div style={{display:'flex',flexDirection: 'column', maxWidth: '300px'}}>
                        <div style={{fontSize: '15px'}}>Минимум 6 символов (букв, цифр и спец. знаков)</div>

                        </div>
                        <div className={style.Password_area_container}>
                            <input onChange ={passwordMatchHandler} value={passwordMatch} onBlur={blurHandler} name ='passwordMatch' className={style.Password_area} type="password" placeholder='Подтвердите пароль' />
                        </div>
                        {(passwordMatchDirty && passwordMatchEror) && <div className ={style.Error_area}>{passwordMatchEror}</div>}
                        <div className={style.RegisterBtn_container}>
                            <button
                                   disabled={!formValid}
                                   className={formValid ? style.buttonEnabled : style.buttonDisabled}
                            >
                                Зарегистрироваться
                            </button>
                        </div>
                        <div className={style.RegisterPoliticy}>Нажимая кнопку «Зарегистрироваться», я даю свое согласие на сбор и обработку моих персональных данных в соответствии с <br /> <a href="#">Политикой</a> и принимаю условия <a href="#">Пользовательского соглашения</a></div>
                    </div>
                )}
            </div>
        </div>,
        element
    );
}
