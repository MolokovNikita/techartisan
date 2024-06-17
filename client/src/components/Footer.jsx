import styles from '../styles/footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer_container}>
      <div className={styles.footer_text}>
        <ul>
          <li>
            © 2024 TechArtisan. Все права защищены.
          </li>
          <li>
            <a href="#">Конфиденциальность</a> | <a href="#">Публичная оферта о продаже</a>
          </li>
        </ul>
      </div>
      <ul>
        <li>
          ©2002–2024 Компания TechArtisan. Администрация Сайта не несет ответственности за размещаемые Пользователями материалы (в т.ч. информацию и изображения), их содержание и качество.
        </li>
      </ul>
    </footer>
  );
}
