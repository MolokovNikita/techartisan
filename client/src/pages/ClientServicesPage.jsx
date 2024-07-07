import styles from "../styles/clientServices.module.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import NotFoundPage from "./NotFoundPage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import Select from 'react-select'
import { FaRegSadCry } from "react-icons/fa";





export default function ClientServicesPage() {

    const { userData, isAuth } = useContext(AuthContext);
    // useEffect(() => {
    //     if (!isAuth) {
    //         return null;
    //     }
    //     else {
    //         //axios.get(`http://localhost:5002/clients/${userData.id}`) get clientData
    //        // axios.get(`http://localhost:5002/clients/${userData.id}`)
    //     }

    // },[]) // get All Client Services
    const options = [
        { value: 'Сначала новые', label: 'Сначала новые' },
        { value: 'Сначала старые', label: 'Сначала старые' },
        { value: 'Сначала дорогие', label: 'Сначала дорогие' },
        { value: 'Сначала дешевые', label: 'Сначала дешевые' }

    ]
    const services = [1];
    const selectStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '1rem',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 'lighter'
        }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                fontSize: '1rem',
                fontFamily: '"Inter", sans-serif',
                fontWeight: 'lighter',
                backgroundColor: isDisabled
                    ? undefined
                    : isSelected
                        ? data.color
                        : isFocused
                            ? 'rgb(199, 223, 195);'
                            : undefined,
                color: isDisabled
                    ? '#ccc'
                    : isSelected
                        ? 'green'
                        : data.color,
                cursor: isSelected ? 'default' : 'pointer',

                ':active': {
                    ...styles[':active'],
                    backgroundColor: !isDisabled
                        ? isSelected
                            ? data.color
                            : 'rgba(136, 226, 139, 1);'
                        : undefined,
                },
            };
        },
        input: (styles) => ({ ...styles }),
        placeholder: (styles) => ({ ...styles }),
    };
    return (
        <>
            {isAuth ? (
                <div className={styles.client_sertvices_page__container}>
                    <Header />
                    <div className={styles.content__wrap}>
                            {services.length != 0 ? 
                            (
                                <div className={styles.client_main__container}>

                            <h1 className={styles.client_services__title}>Ваши Услуги</h1>

                            <div className={styles.command_line__container}>
                                <ul className={styles.command_line__list}>
                                    <li className={styles.command_search__item}>
                                        <p className={styles.search__text}>Поиск</p>
                                        <div className={styles.search_input__container}>
                                            <CiSearch className={styles.search__icon} size={25} />
                                            <input className={styles.search__input} type="text" placeholder="Введите номер карточки заказа" />
                                        </div>
                                    </li>
                                    <li className={styles.sort__item}>
                                        <label>Сортировать</label>
                                        <div className={styles.sort_item__list}>
                                            <Select
                                                className={styles.select__container}
                                                options={options}
                                                placeholder={'Выберете способ сортировки'}
                                                styles={selectStyles}
                                            />
                                        </div>

                                    </li>
                                </ul>

                            </div>
                            <div className={styles.services_panel__container}>
                                <div className={styles.styles_top__container}>
                                    <div className={styles.service__title}>
                                        Заказ №1
                                    </div>
                                    <div>
                                        <div className={styles.status__sphere}>
                                        </div>
                                        Уже у вас
                                    </div>
                                    <div>
                                        Дата создания карточки услуги - 12.02.2023
                                    </div>
                                    <div>
                                        Дата завершения карточки услуги - 12.02.2023
                                    </div>
                                </div>

                                <div className={styles.styles_bottom__container}>
                                    <ul className={styles.service__list}>
                                        <li>Услуга - 1</li>
                                        <li>
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                        </li>
                                        <li>
                                            1000р
                                        </li>
                                    </ul>
                                    <ul className={styles.service__list}>
                                        <li>Услуга - 1</li>
                                        <li>
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                        </li>
                                        <li>
                                            1000р
                                        </li>
                                    </ul>
                                    <ul className={styles.service__list}>
                                        <li>Услуга - 1</li>
                                        <li>
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                        </li>
                                        <li>
                                            1000р
                                        </li>
                                    </ul>
                                    <ul className={styles.service__list}>
                                        <li>Услуга - 1</li>
                                        <li>
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                            Это примерное описание услуги
                                        </li>
                                        <li>
                                            1000р
                                        </li>
                                    </ul>
                                    <div className={styles.services_price}>
                                        <ul>
                                            <li>
                                                Итого: 3000
                                            </li>
                                            <li>
                                                Мастер: Каюша
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>


                        </div>) : 
                            (

                            <div className={styles.empty_order__container}>
                                 <h1 className={styles.client_services__title_error}>Ваши Услуги</h1>
                                <p>Кажется, вы еще не оформляли себе заказ.</p>
                                <FaRegSadCry size={40}/>
                                <p>Если возникла ошибка, можете обратиться в <a>поддержку</a>.</p>
                            </div>
                            )
                            }
                        
                    </div>
                    <Footer />
                </div>


















            ) : (
                <div className={styles.error__container}>
                    <div className={styles.error__text}>
                        Кажется, вы не авторизованы. Попробуйте вернуться на главную
                        страницу и авторизоваться.
                    </div>
                    <NotFoundPage />
                </div>
            )}
        </>
    );
}
