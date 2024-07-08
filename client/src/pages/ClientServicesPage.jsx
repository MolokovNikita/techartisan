import styles from "../styles/clientServices.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import NotFoundPage from "./NotFoundPage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import Select from "react-select";
import config from "../config.js";

import { FaRegSadCry } from "react-icons/fa";

export default function ClientServicesPage() {
  const [services, setServices] = useState([]); // services Cards from backend
  const { userData, isAuth } = useContext(AuthContext);
  useEffect(() => {
    if (!isAuth) {
      return null;
    } else {
      console.log(userData.id);
      console.log(
        `Axios request to - ${config.API_URL}/order-card/client/${userData.id}`,
      );
      //Получение всех карточкек закаказов клиента
      axios
        .get(`${config.API_URL}/order-card/client/${userData.id}`)
        .then((res) => {
          console.log(res.data);
          console.log(
            `Axios request to - ${config.API_URL}/services-order/getOne/${res.data[0].id}`,
          );
          //Получение всех услуг из карточки заказа (запрос к отношению карточка заказа к услугам)
          axios
            .get(`${config.API_URL}/services-order/getOne/${res.data[0].id}`)
            .then((res) => {
              console.log("Services");
              console.log(res.data);
              //Получение деталей услуг по их id (нужно будеь циклом пройтись по всем услугам)
              axios
                .get(`${config.API_URL}/services/${res.data[0].services_id}`)
                .then((res) => {
                  console.log(res.data);
                })
                .catch((e) => console.log(e));
            });
          console.log(
            "axios req - ",
            `${config.API_URL}/staff-order/getOne/${res.data[0].id}`,
          );
          //Получние всех сотрдуников из карточки заказа
          axios
            .get(`${config.API_URL}/staff-order/getOne/${res.data[0].id}`)
            .then((res) => {
              console.log("Staff");
              console.log(res.data);
              //Получение деталей сотрудников по их id (нужно будет циклом пройтись)
              axios
                .get(`${config.API_URL}/staff/${res.data[0].staff_id}`)
                .then((res) => {
                  console.log(res.data);
                })
                .catch((e) => console.log(e));
            });
          console.log(
            "axios req - ",
            `${config.API_URL}/devices-order/getOne/${res.data[0].id}`,
          );
          //Получение всех устройств из карточки заказа
          axios
            .get(`${config.API_URL}/devices-order/getOne/${res.data[0].id}`)
            .then((res) => {
              console.log("devices");
              console.log(res.data);
              //Получение деталей устройств по их id (нужно будет циклом пройтись)
              axios
                .get(`${config.API_URL}/devices/${res.data[0].devices_id}`)
                .then((res) => {
                  console.log(res.data);
                })
                .catch((e) => console.log(e));
            });
          console.log(
            "axios req - ",
            `${config.API_URL}/status-order/getOne/${res.data[0].id}`,
          );
          //Получение статуса заказа из карточки заказов
          axios
            .get(`${config.API_URL}/status-order/getOne/${res.data[0].id}`)
            .then((res) => {
              console.log("status");
              console.log(res.data);
              axios
                .get(
                  `${config.API_URL}/statuses/${res.data[0].statusoforder_id}`,
                )
                .then((res) => {
                  console.log(res.data);
                })
                .catch((e) => console.log(e));
            });
          //Получение офисов из карточки заказов
          console.log(
            "axios req - ",
            `${config.API_URL}/offices-order/getOne/${res.data[0].id}`,
          );
          axios
            .get(`${config.API_URL}/offices-order/getOne/${res.data[0].id}`)
            .then((res) => {
              console.log("offices");
              console.log(res.data);
              axios
                .get(`${config.API_URL}/offices/${res.data[0].offices_id}`)
                .then((res) => {
                  console.log(res.data);
                })
                .catch((e) => console.log(e));
            })
            .catch((e) => console.log(e));
        })

        .catch((e) => {
          console.log(e);
        });
    }
  }, []); // get All Client Services
  const options = [
    { value: "newAtFirst", label: "Сначала новые" },
    { value: "oldAtFirst", label: "Сначала старые" },
    { value: "expensiveAtFirst", label: "Сначала дорогие" },
    { value: "cheapAtFirst", label: "Сначала дешевые" },
  ];
  const sortValue = useRef("");
  const searchFilter = useRef(0);
  const setSortType = () => {
    //console.log(sortValue.current);
    switch (sortValue.current) {
      case "newAtFirst":
        return;
      case "oldAtFirst":
        return;
      case "expensiveAtFirst":
        return;
      case "cheapAtFirst":
        return;
      default:
        return;
    }
  };
  const setSearchFilter = () => {
    console.log(services);
    //console.log(searchFilter.current.value);
  };
  const selectStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      cursor: "pointer",
      fontSize: "1rem",
      fontFamily: '"Inter", sans-serif',
      fontWeight: "lighter",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        fontSize: "1rem",
        fontFamily: '"Inter", sans-serif',
        fontWeight: "lighter",
        backgroundColor: isDisabled
          ? undefined
          : isSelected
            ? data.color
            : isFocused
              ? "rgb(199, 223, 195);"
              : undefined,
        color: isDisabled ? "#ccc" : isSelected ? "green" : data.color,
        cursor: isSelected ? "default" : "pointer",

        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : "rgba(136, 226, 139, 1);"
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
            {services.length != 0 ? (
              <div className={styles.client_main__container}>
                <h1 className={styles.client_services__title}>Ваши Услуги</h1>

                <div className={styles.command_line__container}>
                  <ul className={styles.command_line__list}>
                    <li className={styles.command_search__item}>
                      <p className={styles.search__text}>Поиск</p>
                      <div className={styles.search_input__container}>
                        <CiSearch className={styles.search__icon} size={25} />
                        <input
                          className={styles.search__input}
                          type="text"
                          placeholder="Введите номер карточки заказа"
                          ref={searchFilter}
                          onChange={() => {
                            setSearchFilter();
                          }}
                        />
                      </div>
                    </li>
                    <li className={styles.sort__item}>
                      <label>Сортировать</label>
                      <div className={styles.sort_item__list}>
                        <Select
                          className={styles.select__container}
                          options={options}
                          placeholder={"Выберете способ сортировки"}
                          styles={selectStyles}
                          onChange={(e) => {
                            sortValue.current = e.value;
                            setSortType();
                          }}
                        />
                      </div>
                    </li>
                  </ul>
                </div>
                {/*  */}

                {
                  <div className={styles.services_panel__container}>
                    <div className={styles.styles_top__container}>
                      <div className={styles.service__title}>
                        Заказ №{services[0].id}
                      </div>
                      <div>
                        <div className={styles.status__sphere}></div>
                        Уже у вас
                      </div>
                      <div>
                        Дата создания карточки услуги - {services[0].created}
                      </div>
                      <div>
                        Дата завершения карточки услуги - {services[0].ended}
                      </div>
                      <div>Примечание - {services[0].description}</div>
                    </div>
                    <div className={styles.styles_bottom__container}>
                      <ul className={styles.service__list}>
                        <li>Услуга - 1</li>
                        <li>
                          Это примерное описание услуги Это примерное описание
                          услуги Это примерное описание услуги Это примерное
                          описание услуги Это примерное описание услуги Это
                          примерное описание услуги Это примерное описание
                          услуги Это примерное описание услуги Это примерное
                          описание услуги
                        </li>
                        <li>1000р</li>
                      </ul>

                      <div className={styles.services_price}>
                        <ul>
                          <li>Итого: {services[0].price}</li>
                          <li>Мастер: Каюша</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                }
                {/*  */}
              </div>
            ) : (
              <div className={styles.empty_order__container}>
                <h1 className={styles.client_services__title_error}>
                  Ваши Услуги
                </h1>
                <p>Кажется, вы еще не оформляли себе заказ.</p>
                <FaRegSadCry size={40} />
                <p>
                  Если возникла ошибка, можете обратиться в <a>поддержку</a>.
                </p>
              </div>
            )}
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
