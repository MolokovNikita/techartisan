import styles from "../styles/services.module.css";
//Запрос к бд, получение всех доступых услуг и добавление в ul li
function Services() {
  return (
    <>
      <div className={styles.Services_card}>
        <div className={styles.Services_contaiener_1}>
          <ol className={styles.Services_list}>
            <li>Сборка компьютера</li>
            <li>Замена дисплея смартфона</li>
            <li>Замена тачскрина смартфона</li>
            <li>Замена термопасты</li>
            <li>Ремонт матрицы ноутбука</li>
            <li>Ремонт тачпада ноутбука</li>
            <li>Ремонт тачпада ноутбука</li>
            <li>Ремонт тачпада ноутбука</li>
            <li>Ремонт тачпада ноутбука</li>
            <li>Ремонт тачпада ноутбука</li>
            <li>Ремонт тачпада ноутбука</li>
            <li>Ремонт тачпада ноутбука</li>
            <li>Ремонт тачпада ноутбука</li>
            <li>Ремонт тачпада ноутбука</li>
            <li>Ремонт тачпада ноутбука</li>
            <li>Ремонт тачпада ноутбука</li>
          </ol>
        </div>
        <div className={styles.Services_contaiener_2}>
          <ol className={styles.Services_list}>
            <li>5% от стоимости комплектующих</li>
            <li>4000р.</li>
            <li>4000р.</li>
            <li>4000р.</li>
            <li>3000р</li>
            <li>500р.</li>
            <li>7000р.</li>
            <li>1500р.</li>
            <li>1500р.</li>
            <li>1500р.</li>
            <li>1500р.</li>
            <li>1500р.</li>
            <li>1500р.</li>
            <li>1500р.</li>
            <li>1500р.</li>
            <li>1500р.</li>
          </ol>
        </div>
      </div>
    </>
  );
}

export default Services;
