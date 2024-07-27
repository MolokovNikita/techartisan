import styles from "../../styles/serviceCard.module.css";

export default function ServiceCard({ service }) {
  const getStatusSphere = () => {
    if (!service.status || service.status.length === 0) {
      return <div className={styles.status__sphere_gray}></div>;
    }

    switch (service.status[0].orderstatus) {
      case "Уже у вас":
      case "Готов к выдаче":
        return <div className={styles.status__sphere_green}></div>;
      case "В процессе":
      case "В обработке":
        return <div className={styles.status__sphere_yellow}></div>;
      case "Заказ создан":
        return <div className={styles.status__sphere_yellow}></div>;
      case "Отменен":
        return <div className={styles.status__sphere_red}></div>;
      default:
        return <div className={styles.status__sphere_gray}></div>;
    }
  };

  return (
    <div className={styles.services_panel__container}>
      <div className={styles.styles_top__container}>
        <div className={styles.service__title}>Заказ №{service.id}</div>
        <div>
          {getStatusSphere()}
          {service?.status && service?.status[0]
            ? service.status[0].orderstatus
            : "Статус не найден"}
        </div>
        <div>Дата создания карточки услуги - {service.created}</div>
        <div>
          Дата завершения карточки услуги -{" "}
          {service?.ended ? service.ended : "Не завершена"}
        </div>
        <div>
          Дата посещения -{" "}
          {service?.visit ? service.visit : "Не указана"}
        </div>
        <div>Описание - {service?.description ? service.description : 'Отсутствует'}</div>
      </div>
      <div className={styles.styles_bottom__container}>
        <div>
          Офис обслуживания -{" "}
          {service.office && service.office[0]
            ? service.office[0].adress
            : "Адрес не найден"}
        </div>
        <div className={styles.services_title__text}>Услуги:</div>
        <ul className={styles.service__list}>
          {service.services?.map((serv, idx) => (
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
        <div className={styles.devices_title__text}>Устройства:</div>
        <ul className={styles.device__list}>
          {service.devices?.map((device, idx) => (
            <li key={idx}>
              <div className={styles.devices__text}>{device.name}</div>
            </li>
          ))}
        </ul>
        <div className={styles.services_price}>
          <ul>
            <li>Итого: {service.price}</li>
            <li>
              Мастер:{" "}
              {service.staff && service.staff[0]
                ? service.staff[0].f_name
                : "Не назначен"}
            </li>
          </ul>
        </div>
        <div className={styles.cancel_button__container}>
          <button className={styles.cancel__button}>Отменить запись</button>
        </div>
      </div>
    </div>
  );
}
