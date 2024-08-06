import { useState } from "react";
import styles from "../styles/changepass.module.css";
import { FaArrowRight } from "react-icons/fa";
import EnterCode from "../components/EnterCode";
export default function ChangePass() {
  const [isEmailRecover, setIsEmailRecover] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const handleCodeSubmit = async (code) => {
    if (isLoading) return;

    try {
      const payload = new FormData();
      payload.append("code", code);
      //   const result = await fetch("/path/to/api/endpoint", {
      // method: "POST",
      // body: payload,
      //   });
      const result = {
        ok: true,
      };
      if (!result.ok) {
        const mess = await result.text();
        throw new Error(mess);
      }
      alert("Code is verified!");
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  const handleEmailClick = () => {
    setIsEmailRecover(true);
  };

  const handlePhoneClick = () => {
    setIsEmailRecover(false);
  };
  const handleContinue = () => {
    setIsSubmit(true);
  };

  return (
    <div className={styles.change_password__container}>
      <div className={styles.content__wrap}>
        {!isSubmit ? (
          <>
            <div className={styles.change_password_title__container}>
              <div className={styles.change_password__title}>
                Восстановление пароля
              </div>
            </div>

            <div className={styles.select_type__recover__container}>
              <ul className={styles.select_type__recover__list}>
                <li>
                  <a onClick={handleEmailClick}>по email</a>
                </li>
                <li className={styles.stick}>|</li>
                <li>
                  <a onClick={handlePhoneClick}>по номеру</a>
                </li>
              </ul>
              <div
                className={`${styles.slider} ${isEmailRecover ? styles.left : styles.right}`}
              ></div>
            </div>

            <div className={styles.change_password_area__container}>
              <div className={styles.input__wrapper}>
                <input
                  name="name"
                  className={styles.name__area}
                  type="text"
                  placeholder=" "
                />
                <label className={styles.placeholder__label}>
                  {isEmailRecover ? "Email" : "Номер телефона"}
                </label>
              </div>

              <label className={styles.example__inpt}>
                {isEmailRecover
                  ? "Пример: mail@mail.ru"
                  : " Пример: 71234567890"}
              </label>

              <div className={styles.continue_btn__container}>
                <button
                  onClick={handleContinue}
                  className={styles.continue__btn}
                >
                  <FaArrowRight size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.enter_code__container}>
            <EnterCode
              isLoading={isLoading}
              callback={handleCodeSubmit}
              back={() => {
                setIsSubmit(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
