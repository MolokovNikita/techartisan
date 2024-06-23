import { useState, useEffect } from 'react';

export const useValidation = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState('');
    const [nameDirty, setNameDirty] = useState(false);
    const [emailDirty, setEmailDirty] = useState(false);
    const [passwordDirty, setPasswordDirty] = useState(false);
    const [passwordMatchDirty, setPasswordMatchDirty] = useState(false);
    const [nameError, setNameError] = useState('Имя не может быть пустым');
    const [emailError, setEmailError] = useState('Email не может быть пустым');
    const [passwordError, setPasswordError] = useState('Пароль не может быть пустым');
    const [passwordMatchError, setPasswordMatchError] = useState('Пароль не может быть пустым');
    const [formValid, setFormValid] = useState(false);

    useEffect(() => {
        if (nameError || emailError || passwordError || passwordMatchError) {
            setFormValid(false);
        } else {
            setFormValid(true);
        }
    }, [nameError, emailError, passwordError, passwordMatchError]);

    const nameHandler = (e) => {
        const value = e.target.value;
        setName(value);
        if (!value) {
            setNameError('*Данное поле не можеть быть пустым');
        } else if (!/^[а-яА-Я ]+$/.test(value.toLowerCase())) {
            setNameError('*Неккоректное имя (Пример : Иван)');
        } else if(value.length < 3){ 
            setNameError('*Минимальная длина имени 3 символа');
        }
        else {
            setNameError('');
        }
    };

    const emailHandler = (e) => {
        const value = e.target.value
        setEmail(value);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setEmailError('Некорректный email, Пример: mail@example.ru');
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

    const passwordMatchHandler = (e) => {
        setPasswordMatch(e.target.value);
        const value = e.target.value;
        if(!value){
            setPasswordMatchError('*Данное поле не можеть быть пустым');
        }
        if (value !== password) {
            setPasswordMatchError('Пароли не совпадают');
        } else {
            setPasswordMatchError('');
        }
    };

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
            default:
                break;
        }
    };

    return {
        name,
        email,
        password,
        passwordMatch,
        nameDirty,
        emailDirty,
        passwordDirty,
        passwordMatchDirty,
        nameError,
        emailError,
        passwordError,
        passwordMatchError,
        formValid,
        nameHandler,
        emailHandler,
        passwordHandler,
        passwordMatchHandler,
        blurHandler,
    };
};
