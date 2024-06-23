import { useState, useEffect } from 'react';

export const useLoginValidation = () => {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginEmailDirty, setLoginEmailDirty] = useState(false);
    const [loginPasswordDirty, setLoginPasswordDirty] = useState(false);
    const [loginEmailError, setLoginEmailError] = useState('Email не может быть пустым');
    const [loginPasswordError, setLoginPasswordError] = useState('Пароль не может быть пустым');
    const [loginFormValid, setLoginFormValid] = useState(false);

    useEffect(() => {
        if (loginEmailError || loginPasswordError) {
            setLoginFormValid(false);
        } else {
            setLoginFormValid(true);
        }
    }, [loginEmailError, loginPasswordError]);

    const loginEmailHandler = (e) => {
        setLoginEmail(e.target.value);
        if(!e.target.value){
            setLoginEmailError('*Данное поле не можеть быть пустым');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(e.target.value)) {
            setLoginEmailError('Некорректный email, Пример: mail@example.ru');
        } else {
            setLoginEmailError('');
        }
    };

    const loginPasswordHandler = (e) => {
        setLoginPassword(e.target.value);
        if(!e.target.value){
            setLoginPasswordError('*Данное поле не можеть быть пустым');
            return;
        }
        const passwordRegex = /^[A-Za-z0-9]\w{5,30}$/
        if (!passwordRegex.test(e.target.value)) {
            setLoginPasswordError('*Неккоректный формат пароля');
        } else {
            setLoginPasswordError('');
        }
    };

    const loginBlurHandler = (e) => {
        switch (e.target.name) {
            case 'loginEmail':
                setLoginEmailDirty(true);
                break;
            case 'loginPassword':
                setLoginPasswordDirty(true);
                break;
            default:
                break;
        }
    };

    return {
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
    };
};
