import styles from "../../styles/serviceCard.module.css";
export default function ServiceCard({ service }) {
  return (
    <div className={styles.services_panel__container}>
      <div className={styles.styles_top__container}>
        <div className={styles.service__title}>Заказ №{service.id}</div>
        <div>
          {service.status[0].orderstatus === "Уже у вас" ||
          service.status[0].orderstatus === "Готов к выдаче" ? (
            <div className={styles.status__sphere_green}></div>
          ) : service.status[0].orderstatus === "В процессе" ||
            service.status[0].orderstatus === "В обработке" ? (
            <div className={styles.status__sphere_yellow}></div>
          ) : service.status[0].orderstatus === "Заказ создан" ? (
            <div className={styles.status__sphere_gray}></div>
          ) : service.status[0].orderstatus === "Отменен" ? (
            <div className={styles.status__sphere_red}></div>
          ) : (
            <div className={styles.status__sphere_gray}></div>
          )}
          {service.status ? service.status[0].orderstatus : "Статус не найден"}
        </div>
        <div>Дата создания карточки услуги - {service.created}</div>
        <div>
          Дата завершения карточки услуги -{" "}
          {service.ended ? service.ended : "Не завершена"}
        </div>
        <div>Описание - {service.description}</div>
      </div>
      <div className={styles.styles_bottom__container}>
        <div>Офис обслуживания - {service.office[0].adress}</div>
        <div className={styles.services_title__text}>Услуги:</div>
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
        <div className={styles.devices_title__text}>Устройства:</div>
        <ul className={styles.device__list}>
          {service.devices.map((serv, idx) => (
            <li key={idx}>
              <div className={styles.devices__text}>{serv.name}</div>
            </li>
          ))}
        </ul>
        <div className={styles.services_price}>
          <ul>
            <li>Итого: {service.price}</li>
            <li>
              Мастер: {service.staff ? service.staff[0].f_name : "Не назначен"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
