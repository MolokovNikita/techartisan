import styles from '../styles/changepass.module.css'
import { FaArrowRight } from "react-icons/fa";

export default function ChangePass(){
    return(
        <div className={styles.change_password__container}>
          <div className={styles.content__wrap}>
            <div className={styles.change_password__title}>
            <div>Изменить пароль</div>
            </div>
            <div className={styles.change_password_phone_inpt__container}>
                <input type="text" />
                <label>Введите ваш email</label>
            <div className={styles.continue_btn__container}>
                <button className={styles.continue__btn}>
                <FaArrowRight />
                </button>
            </div>
            </div>
            
            </div>
        </div>
    )
}