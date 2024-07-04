import { useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import { TbPasswordFingerprint } from "react-icons/tb";

import styles from '../styles/account.module.css';
export default function AccountPage() {
    const { userData } = useContext(AuthContext)

    return (
        <>
            <div className={styles.profile_container}>
                <div className={styles.profile}>
                    <div className={styles.self_data_text}>
                        Личные Данные
                        </div>
                    <div className={styles.self_data_inputs}>

                        <div className={styles.f_name_container}>
                            <label>Имя</label>
                            <input className={styles.f_name__input} type="text" defaultValue={userData.f_name} />
                        </div>
                        <div className={styles.l_name_container}>
                        <label>Фамилия</label>
                            {
                                
                                userData.l_name ? 
                                (<input className={styles.l_name__input} type="text" defaultValue={userData.l_name} />) : ( <input  className={styles.l_name__input} type="text" defaultValue={'Не указано'}/>)
                            }
                        </div>
                    </div>
                        
                        <div className={styles.security__text}>Безопасность и вход</div>
                        <div className={styles.security__inputs}>
                            <div className={styles.phone_number_container}>
                            <label>Телефон:</label>
                            {
                                userData.phone_number ? 
                                (<input className={styles.phone_number__input} type="text" defaultValue={userData.phone_number} />) : 
                                (<input className={styles.phone_number__input} type="text" defaultValue={'Не указан'} placeholder='79991234567' />) 
                            }
                            </div>
                            <div className={styles.email_container}>
                            <label>Почта:</label>
                            <input className={styles.email__input} type="text" defaultValue={userData.email} />
                        </div>
                        </div>
                            <div className={styles.password_area__container}>
                            <div className={styles.password_area__pic}>
                                <TbPasswordFingerprint size={30}/> 
                            </div>
                            <div className={styles.password_area__text}>
                            <p className={styles.password__text}>Пароль</p>
                            <div className={styles.change_password_}>
                            <p className={styles.change_password__text}>Изменить пароль</p>
                            </div>
                            </div>
                           
        
                            </div>
                           
                            
                    <div className={styles.save_button__container}>
                        <button className={styles.save__button}>
                            Сохранить
                        </button>
                    </div>
                    
                </div>
            </div>
        </>
    )
}