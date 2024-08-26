import styles from "../styles/body.module.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function Body(props) {
  const { setIsServiceModalOpen, setIsOpen, setIsOrderCallPopUpOpen } = props;
  const { isAuth } = useContext(AuthContext);
  return (
    <>
      <div className={styles.topic_container}>
        <div className={styles.topic}>
          <div className={styles.topic_arrow}>
            <ol className={styles.arrow_list}>
              <li>
                <img src="/arrow.png" alt="" />
              </li>
              <li className={styles.second_arrow}>
                <img src="/arrow.png" alt="" />
              </li>
              <li>
                <img src="/arrow.png" alt="" />
              </li>
            </ol>
          </div>
          <div className={styles.topic_text}>
            <ol className={styles.topic_list}>
              <li>
                <p>Профессионально ремонтируем,</p>
                прокачиваем и собираем компьютеры по всей России с 2015 года !
              </li>
              <li>Занимаемся всей техникой !</li>
              <li>
                <div className={styles.notebook_container}>
                  Предоставляем лучшие цены на рынке !
                  <img src="/notebooklogo.png" alt="" />
                </div>
              </li>
            </ol>
            <div className={styles.SignUp_container}>
              <ol>
                <li>
                  <img src="/monitorlogo.png" alt="" />
                </li>
                <li className={styles.SignUpButton}>
                  <button
                    onClick={() => {
                      if (isAuth) {
                        setIsServiceModalOpen(true);
                      } else {
                        setIsOpen(true);
                      }
                    }}
                  >
                    Записаться онлайн
                  </button>
                </li>
                <li>
                  <img src="/smartphonelogo.png" alt="" />
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div id="services_anchor" className={styles.Services}>
        <div className={styles.Services_container}>
          <p>Услуги</p>
        </div>
        <div className={styles.MostPopularServices}>
          <p>самые популярные услуги</p>
        </div>
        <div className={styles.Services_card}>
          <div className={styles.Services_contaiener_1}>
            <ol className={styles.Services_list}>
              <li>Сборка компьютера</li>
              <li>Замена дисплея смартфона</li>
              <li>Замена тачскрина смартфона</li>
              <li>Замена термопасты</li>
              <li>Ремонт матрицы ноутбука</li>
              <li>Ремонт тачпада ноутбука</li>
            </ol>
          </div>
          <div className={styles.Services_contaiener_2}>
            <ol className={styles.Services_list}>
              <li>5% от стоимости комплектующих</li>
              <li>4000р.</li>
              <li>3000р</li>
              <li>500р.</li>
              <li>7000р.</li>
              <li>1500р.</li>
            </ol>
          </div>
        </div>
        <div className={styles.Services_button_container}>
          <Link to="/services">
            <button>Показать все услуги</button>
          </Link>
        </div>
      </div>
      <hr
        className={styles.Vertical_line}
        style={{ width: "65%", margin: "auto", marginTop: "30px" }}
      ></hr>
      <div className={styles.Contacts}>
        <div className={styles.Contacts_text_container}>
          <div className={styles.Contacts_text}>Контакты</div>
        </div>
        <div className={styles.Contacts_block_container}>
          <div className={styles.Contacts_block}>
            <div className={styles.social_logo_list}>
              <ul>
                <li>
                  <img src="/maillogo.png" />
                </li>
                <li>
                  <img src="/tg.png" />
                </li>
                <li>
                  <img src="/vk.png" />
                </li>
                <li>
                  <img src="/wapp.png" alt="" />
                </li>
              </ul>
            </div>
            <div className={styles.block_info}>
              <div className={styles.telephone_number}>
                <a href="">
                  <img
                    src="/tellogo.png"
                    alt=""
                    className={styles.tellogo_body}
                  />
                  +7-999-999-99-99
                </a>
              </div>
              <ul id="contacts_anchor">
                <li>
                  <a href="#">mail - techartisan@mail.ru</a>
                </li>
                <li>
                  <a href="#">telegram - @TechArtisan</a>
                </li>
                <li>
                  <a href="#">vkontakte - vk.com/techartisan</a>
                </li>
                <li>
                  <a href="">whatsApp - +7-999-999-99-99</a>
                </li>
              </ul>
              <p className={styles.order_call__title}>
                Так же вы можете заказать звонок
              </p>
              <button
                onClick={() => {
                  setIsOrderCallPopUpOpen(true);
                }}
              >
                Заказать звонок
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.find_container}>
        <p className={styles.find_text}>Как нас найти?</p>
        <a
          href="https://yandex.ru/maps/213/moscow/house/krasnokazarmennaya_ulitsa_17/Z04YcQdoSE0CQFtvfXt0dXRkYw==/?ll=37.706910%2C55.755936&z=17.17"
          target="_blank"
          rel="noreferrer"
        >
          <button>Яндекс карты</button>
        </a>
      </div>
    </>
  );
}
