import { useState } from "react";
import styles from "../styles/changepass.module.css";
import { FaArrowRight } from "react-icons/fa";

export default function ChangePass() {
  const [isEmailRecover, setIsEmailRecover] = useState(true);

  const handleEmailClick = () => {
    setIsEmailRecover(true);
  };

  const handlePhoneClick = () => {
    setIsEmailRecover(false);
  };

  return (
    <div className={styles.change_password__container}>
      <div className={styles.content__wrap}>
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
            {isEmailRecover ? "Пример: mail@mail.ru" : " Пример: 71234567890"}
          </label>

          <div className={styles.continue_btn__container}>
            <button className={styles.continue__btn}>
              <FaArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
