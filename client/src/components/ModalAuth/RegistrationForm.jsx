import style from "../../styles/style.module.css";
import { PiEye, PiEyeClosed } from "react-icons/pi";

export default function RegistrationForm(props) {
  const {
    name,
    email,
    password,
    passwordMatch,
    nameHandler,
    emailHandler,
    passwordHandler,
    passwordMatchHandler,
    blurHandler,
    nameDirty,
    emailDirty,
    passwordDirty,
    passwordMatchDirty,
    nameError,
    emailError,
    passwordError,
    passwordMatchError,
    formValid,
    isEyeOpen,
    setIsEyeOpen,
    erorText,
  } = props;

  return (
    <>
      <div className={style.Name_area_container}>
        <div className={style.inputWrapper}>
          <input
            onChange={nameHandler}
            value={name}
            onBlur={blurHandler}
            name="name"
            className={style.Name_area}
            type="text"
            placeholder=" "
            autoComplete="name" // Добавлен атрибут autocomplete
          />
          <label className={style.placeholderLabel}>Ваше имя</label>
        </div>
      </div>
      {nameDirty && nameError && (
        <p className={style.Error_area}>{nameError}</p>
      )}

      <div className={style.Email_area_container}>
        <div className={style.inputWrapper}>
          <input
            onChange={emailHandler}
            value={email}
            onBlur={blurHandler}
            name="email"
            className={style.Email_area}
            type="email" // Изменен тип на email
            placeholder=" "
            autoComplete="email" // Добавлен атрибут autocomplete
          />
          <label className={style.placeholderLabel}>Email</label>
        </div>
      </div>
      {emailDirty && emailError && (
        <div className={style.Error_area}>{emailError}</div>
      )}

      <div className={style.Password_area_container}>
        <div className={style.inputWrapper}>
          <input
            onChange={passwordHandler}
            value={password}
            onBlur={blurHandler}
            name="password"
            className={style.Password_area}
            type={isEyeOpen ? "text" : "password"}
            placeholder=" "
            autoComplete="new-password" // Добавлен атрибут autocomplete
          />
          <label className={style.placeholderLabel}>Придумайте пароль</label>
          <button
            type="button"
            className={style.eyeButton}
            onClick={() => setIsEyeOpen(!isEyeOpen)}
            aria-label={isEyeOpen ? "Hide password" : "Show password"} // Добавлено описание для доступности
          >
            {isEyeOpen ? <PiEye /> : <PiEyeClosed />}
          </button>
        </div>
      </div>
      {passwordDirty && passwordError && (
        <div className={style.Error_area}>{passwordError}</div>
      )}

      <div style={{ fontSize: "15px" }}>Минимум 6 символов (букв или цифр)</div>

      <div className={style.Password_area_container}>
        <div className={style.inputWrapper}>
          <input
            onChange={passwordMatchHandler}
            value={passwordMatch}
            onBlur={blurHandler}
            name="passwordMatch"
            className={style.Password_area}
            type="password"
            placeholder=" "
            autoComplete="new-password" // Добавлен атрибут autocomplete
          />
          <label className={style.placeholderLabel}>Подтвердите пароль</label>
        </div>
      </div>
      {passwordMatchDirty && passwordMatchError && (
        <div className={style.Error_area}>{passwordMatchError}</div>
      )}

      <div className={style.register_politicy}>
        Нажимая кнопку «Зарегистрироваться», я даю свое согласие на сбор и
        обработку моих персональных данных в соответствии с&nbsp;
        <a href="/confidencity" target="_blank" rel="noopener noreferrer">
          Политикой
        </a>
        &nbsp;и принимаю условия&nbsp;
        <a href="/politicy" target="_blank" rel="noopener noreferrer">
          Пользовательского соглашения
        </a>
      </div>

      <div className={style.RegisterBtn_container}>
        <button
          disabled={!formValid}
          className={formValid ? style.buttonEnabled : style.buttonDisabled}
          type="submit"
        >
          Зарегистрироваться
        </button>
      </div>
      <div className={style.Error_text}>{erorText}</div>
    </>
  );
}
