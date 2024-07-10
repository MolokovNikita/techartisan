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
import { TbMoodSadSquint } from "react-icons/tb";

export default function ClientServicesPage() {
    const { isLoading, setIsLoading } = useContext(AuthContext);
  const [serviceCards, setServiceCards] = useState([]); // services Cards from backend
  const [serviceCardsFiltered, setServiceCardsFiltered] = useState([]); // services Cards filtered
  const [isSearch, setIsSearch] = useState(false);
  const { userData, isAuth } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuth) {
      return;
    }

    const fetchServiceDetails = async (serviceId) => {
      try {
        const res = await axios.get(`${config.API_URL}/services/${serviceId}`);
        return res.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    const fetchCardDetails = async (cardId) => {
      try {
        const [
          serviceOrders,
          staffOrders,
          deviceOrders,
          statusOrders,
          officeOrders,
        ] = await Promise.all([
          axios.get(`${config.API_URL}/services-order/getOne/${cardId}`),
          axios.get(`${config.API_URL}/staff-order/getOne/${cardId}`),
          axios.get(`${config.API_URL}/devices-order/getOne/${cardId}`),
          axios.get(`${config.API_URL}/status-order/getOne/${cardId}`),
          axios.get(`${config.API_URL}/offices-order/getOne/${cardId}`),
        ]);

        const servicesDetails = await Promise.all(
          serviceOrders.data.map(async (service) => {
            const serviceDetails = await fetchServiceDetails(
              service.services_id,
            );
            return { ...service, serviceDetails };
          }),
        );

        const staffDetails = await Promise.all(
          staffOrders.data.map(async (staff) => {
            const res = await axios.get(
              `${config.API_URL}/staff/${staff.staff_id}`,
            );
            return res.data;
          }),
        );

        const deviceDetails = await Promise.all(
          deviceOrders.data.map(async (device) => {
            const res = await axios.get(
              `${config.API_URL}/devices/${device.devices_id}`,
            );
            return res.data;
          }),
        );

        const statusDetails = await Promise.all(
          statusOrders.data.map(async (status) => {
            const res = await axios.get(
              `${config.API_URL}/statuses/${status.statusoforder_id}`,
            );
            return res.data;
          }),
        );

        const officeDetails = await Promise.all(
          officeOrders.data.map(async (office) => {
            const res = await axios.get(
              `${config.API_URL}/offices/${office.offices_id}`,
            );
            return res.data;
          }),
        );

        return {
          services: servicesDetails,
          staff: staffDetails,
          devices: deviceDetails,
          status: statusDetails,
          office: officeDetails,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${config.API_URL}/order-card/client/${userData.id}`,
        );
        const cards = res.data;

        const allCardDetails = await Promise.all(
          cards.map(async (card) => {
            const details = await fetchCardDetails(card.id);
            return { ...card, ...details };
          }),
        );

        setServiceCards(allCardDetails);
      } catch (error) {
        console.error(error);
      }
      
    };

    fetchData();
  }, [isAuth, userData.id]);

  const options = [
    { value: "newAtFirst", label: "Сначала новые" },
    { value: "oldAtFirst", label: "Сначала старые" },
    { value: "expensiveAtFirst", label: "Сначала дорогие" },
    { value: "cheapAtFirst", label: "Сначала дешевые" },
  ];

  const sortValue = useRef("");
  const searchFilter = useRef(0);

  const setSortType = () => {
    // Implement sorting logic here
    switch (sortValue.current) {
      case "newAtFirst":
        // Sort services by newest first
        break;
      case "oldAtFirst":
        // Sort services by oldest first
        break;
      case "expensiveAtFirst":
        // Sort services by most expensive first
        break;
      case "cheapAtFirst":
        // Sort services by least expensive first
        break;
      default:
        break;
    }
  };

  const setSearchFilter = () => {
    console.log(serviceCards); // Просто проверка, что лежит в serviceCards
    if (!searchFilter.current.value) {
      setIsSearch(false);
      return;
    }
    setIsSearch(true);
    const resultArray = [];
    serviceCards.forEach((card) => {
      if (card.id === searchFilter.current.value) resultArray.push(card);
    });
    setServiceCardsFiltered(resultArray);
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
              ? "rgb(199, 223, 195)"
              : undefined,
        color: isDisabled ? "#ccc" : isSelected ? "green" : data.color,
        cursor: isSelected ? "default" : "pointer",

        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : "rgba(136, 226, 139, 1)"
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
            {serviceCards.length != 0 ? (
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
                {/* Render services here */}
                {isSearch ? (
                  serviceCardsFiltered.length != 0 ? (
                    serviceCardsFiltered.map((service, index) => (
                      <div
                        key={index}
                        className={styles.services_panel__container}
                      >
                        <div className={styles.styles_top__container}>
                          <div className={styles.service__title}>
                            Заказ №{service.id}
                          </div>
                          <div>
                            <div className={styles.status__sphere}></div>
                            {service.status
                              ? service.status[0].orderstatus
                              : "Статус не найден"}
                          </div>
                          <div>
                            Дата создания карточки услуги - {service.created}
                          </div>
                          <div>
                            Дата завершения карточки услуги -{" "}
                            {service.ended ? service.ended : "Не завершена"}
                          </div>
                          <div>Описание - {service.description}</div>
                        </div>
                        <div className={styles.styles_bottom__container}>
                          <div>
                            Офис обслуживания - {service.office[0].adress}
                          </div>
                          <div className={styles.services_title__text}>
                            Услуги:
                          </div>
                          <ul className={styles.service__list}>
                            {service.services.map((serv, idx) => (
                              <li key={idx}>
                                <div className={styles.services__text}>
                                  {serv.serviceDetails.name}
                                </div>
                                <div className={styles.services__price}>
                                  {serv.serviceDetails.price}р
                                </div>
                              </li>
                            ))}
                          </ul>
                          <div className={styles.devices_title__text}>
                            Устройства:
                          </div>
                          <ul className={styles.device__list}>
                            {service.devices.map((serv, idx) => (
                              <li key={idx}>
                                <div className={styles.devices__text}>
                                  {serv.name}
                                </div>
                              </li>
                            ))}
                          </ul>
                          <div className={styles.services_price}>
                            <ul>
                              <li>Итого: {service.price}</li>
                              <li>
                                Мастер:{" "}
                                {service.staff
                                  ? service.staff[0].f_name
                                  : "Не назначен"}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.search_error__container}>
                      <TbMoodSadSquint size={40} />
                      Ничего не найдено.
                    </div>
                  )
                ) : (
                  //end of is Search condition
                  serviceCards.map((service, index) => (
                    <div
                      key={index}
                      className={styles.services_panel__container}
                    >
                      <div className={styles.styles_top__container}>
                        <div className={styles.service__title}>
                          Заказ №{service.id}
                        </div>
                        <div>
                          <div className={styles.status__sphere}></div>
                          {service.status
                            ? service.status[0].orderstatus
                            : "Статус не найден"}
                        </div>
                        <div>
                          Дата создания карточки услуги - {service.created}
                        </div>
                        <div>
                          Дата завершения карточки услуги -{" "}
                          {service.ended ? service.ended : "Не завершена"}
                        </div>
                        <div>Описание - {service.description}</div>
                      </div>
                      <div className={styles.styles_bottom__container}>
                        <div>
                          Офис обслуживания - {service.office[0].adress}
                        </div>
                        <div className={styles.services_title__text}>
                          Услуги:
                        </div>
                        <ul className={styles.service__list}>
                          {service.services.map((serv, idx) => (
                            <li key={idx}>
                              <div className={styles.services__text}>
                                {serv.serviceDetails.name}
                              </div>
                              <div className={styles.services__price}>
                                {serv.serviceDetails.price}р
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className={styles.devices_title__text}>
                          Устройства:
                        </div>
                        <ul className={styles.device__list}>
                          {service.devices.map((serv, idx) => (
                            <li key={idx}>
                              <div className={styles.devices__text}>
                                {serv.name}
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className={styles.services_price}>
                          <ul>
                            <li>Итого: {service.price}</li>
                            <li>
                              Мастер:{" "}
                              {service.staff
                                ? service.staff[0].f_name
                                : "Не назначен"}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
