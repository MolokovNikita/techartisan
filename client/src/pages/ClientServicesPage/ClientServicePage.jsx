import styles from "../../styles/client.service.module.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import NotFoundPage from "../NotFoundPage.jsx";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import config from "../../config/config.js";
import http from "../../http/instance.js";
import {
  fetchServiceDetails,
  fetchCardDetails,
  fetchClientOrders,
} from "../../utils/FetchServiceCards.js";
import SearchAndSort from "./SearchAndSort.jsx";
import ServiceCard from "./ServiceCard.jsx";
import { TbMoodSadSquint } from "react-icons/tb";
import { FaRegSadCry } from "react-icons/fa";

export default function ClientServicesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [serviceCards, setServiceCards] = useState([]);
  const [serviceCardsFiltered, setServiceCardsFiltered] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const { userData, isAuth } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuth) return;

    const fetchData = async () => {
      try {
        const cards = await fetchClientOrders(userData.id);
        const allCardDetails = await Promise.all(
          cards.map(async (card) => {
            const details = await fetchCardDetails(card.id);
            return { ...card, ...details };
          }),
        );
        setServiceCards(allCardDetails);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuth, userData.id]);

  const handleDelete = (serviceCard) => {
    const isConfirm = confirm("Вы уверены что хотите удалить эту запись ?");
    // тут можно будет реализовать красивый pop-up, пока что так :/
    if (!isConfirm) return;
    const CARD_ID = serviceCard.id;
    const CARD_PRICE = serviceCard.price;
    const CARD_DESC = serviceCard.description;
    const CARD_CREATED = serviceCard.created;
    const CARD_CLIENT_ID = serviceCard.client_id;
    const API_URL = config.API_URL;
    http
      .put(`${API_URL}/status-order/update`, {
        cardoforder_id: CARD_ID,
        statusoforder_id: parseInt(
          serviceCards.find((card) => card.id === CARD_ID).status[0].id,
        ),
        new_statusoforder_id: 6,
      })
      .then((res) => {
        const END_DATE = new Date();
        setServiceCards((prevServices) =>
          prevServices.map((service) =>
            service.id === CARD_ID
              ? {
                  ...service,
                  status: [{ orderstatus: "Отменен" }],
                  ended: END_DATE,
                }
              : service,
          ),
        );
        http
          .put(`${API_URL}/order-card`, {
            id: CARD_ID,
            price: CARD_PRICE,
            created: CARD_CREATED,
            description: CARD_DESC,
            ended: END_DATE,
            client_id: CARD_CLIENT_ID,
          })
          .then((res) => console.log(res))
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  };

  return (
    <>
      {isAuth ? (
        <div className={styles.client_services_page__container}>
          <Header />
          <div className={styles.content__wrap}>
            {serviceCards.length !== 0 || isLoading ? (
              <div className={styles.client_main__container}>
                <h1 className={styles.client_services__title}>Ваши Услуги</h1>
                <SearchAndSort
                  serviceCards={serviceCards}
                  setServiceCards={setServiceCards}
                  setServiceCardsFiltered={setServiceCardsFiltered}
                  setIsSearch={setIsSearch}
                  isLoading={isLoading}
                />
                {!isLoading ? (
                  <>
                    {isSearch ? (
                      serviceCardsFiltered.length !== 0 ? (
                        serviceCardsFiltered.map((service, index) => (
                          <ServiceCard
                            key={index}
                            service={service}
                            onDelete={handleDelete}
                          />
                        ))
                      ) : (
                        <div className={styles.search_error__container}>
                          <TbMoodSadSquint size={40} />
                          Ничего не найдено.
                        </div>
                      )
                    ) : (
                      serviceCards.map((service, index) => (
                        <ServiceCard
                          key={index}
                          service={service}
                          onDelete={handleDelete}
                        />
                      ))
                    )}
                  </>
                ) : (
                  <div className={styles.services_panel_loading__container}>
                    <div className={styles.styles_top_loading__container}></div>
                    <div
                      className={styles.styles_bottom_loading__container}
                    ></div>
                  </div>
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
