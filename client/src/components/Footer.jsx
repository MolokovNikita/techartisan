import styles from "../styles/footer.module.css";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path, hash) => {
    if (location.pathname !== path) {
      navigate(path);
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    } else if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className={styles.footer_container}>
      <div className={styles.footer_text}>
        <ul>
          <li>© 2024 TechArtisan. Все права защищены.</li>
          <li>
            <a
              className={styles.confidecity__btn}
              onClick={() => handleNavigation("/confidencity", "top")}
            >
              Конфиденциальность
            </a>
            <a onClick={() => handleNavigation("/politicy", "top")}>
              Публичная оферта о продаже
            </a>
          </li>
        </ul>
      </div>
      <ul className={styles.second_text__list}>
        <li>
          ©2002–2024 Компания TechArtisan. Администрация Сайта не несет
          ответственности за размещаемые Пользователями материалы (в т.ч.
          информацию и изображения), их содержание и качество.
        </li>
      </ul>
    </footer>
  );
}
