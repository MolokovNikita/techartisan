import style from "../../styles/style.module.css";

export default function LoginForm(props) {
  const {
    loginEmail,
    loginPassword,
    loginEmailHandler,
    loginPasswordHandler,
    loginBlurHandler,
    loginEmailDirty,
    loginPasswordDirty,
    loginEmailError,
    loginPasswordError,
    loginFormValid,
    erorText,
  } = props;

  return (
    <>
      <div className={style.Email_area_container}>
        <div className={style.inputWrapper}>
          <input
            onChange={loginEmailHandler}
            value={loginEmail}
            onBlur={loginBlurHandler}
            name="loginEmail"
            className={style.Email_area}
            type="email" // Изменен тип на email для встроенной проверки
            placeholder=" "
            autoComplete="email" // Добавлен атрибут autocomplete
          />
          <label className={style.placeholderLabel}>Email</label>
        </div>
      </div>
      {loginEmailDirty && loginEmailError && (
        <div className={style.Error_area}>{loginEmailError}</div>
      )}

      <div className={style.Password_area_container}>
        <div className={style.inputWrapper}>
          <input
            onChange={loginPasswordHandler}
            value={loginPassword}
            onBlur={loginBlurHandler}
            name="loginPassword"
            className={style.Password_area}
            type="password"
            placeholder=" "
            autoComplete="current-password" // Добавлен атрибут autocomplete
          />
          <label className={style.placeholderLabel}>Пароль</label>
        </div>
      </div>
      {loginPasswordDirty && loginPasswordError && (
        <div className={style.Error_area}>{loginPasswordError}</div>
      )}

      <div className={style.FortgotPass_container}>
        <a href="/forgot-password" className={style.ForgotPassLink}>
          Забыли пароль?
        </a>
      </div>
      <div className={style.LoginBtn_container}>
        <button
          disabled={!loginFormValid}
          className={
            loginFormValid ? style.buttonEnabled : style.buttonDisabled
          }
          type="submit"
        >
          Войти
        </button>
      </div>
      <div className={style.Error_text}>{erorText}</div>
    </>
  );
}
