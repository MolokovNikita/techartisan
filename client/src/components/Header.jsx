import styles from '../styles/header.module.css';
export default function Header({ setIsOpen }) {
  const handleClick = () => {
    setIsOpen(prev => !prev);
  };
  return (
    <>
      <header>
        <div className={styles.top_header}>
          <ol className={styles.location_nav}>
            <li>
              <img className={styles.geologo} src='/geologo.png' alt="geologo" />
              Москва
            </li>
            <li>ул. Красноказарменая, д.13</li>
          </ol>
          <ol className={styles.social_nav}>
            <li>

              <img className={styles.tellogo} src="/tellogo.png" alt="tellogo" />
              <a href="tel:+79999999999">+7-999-999-99-99</a>
            </li>
            <li>
              <a href="#"><img className={styles.tglogo} src="/tg.png" alt="tglogo" /></a>
            </li>
            <li>
              <a href="#"><img className={styles.vklogo} src="/vk.png" alt="vklogo" /></a>
            </li>
            <li>
              <a href="#"><img className={styles.wapplogo} src="/wapp.png" alt="wapplogo" /></a>
            </li>
          </ol>
        </div>
        <div className={styles.bottom_header}>
          <div className={styles.bottom_header_left}>
            <img className={styles.logo} src="/logo.png" alt="logo" />
            <ol className={styles.main_nav}>
              <li>
                <a href="#">Главная</a>
              </li>
              <li>
                <a href="#">Услуги</a>
              </li>
              <li>
                <a href="#">Контакты</a>
              </li>
              <li>
                <a href="#">О нас</a>
              </li>
            </ol>
          </div>
          <div className={styles.Auth_container}>
            <a onClick={handleClick} href="#">  Войти </a>
          </div>
        </div>
      </header>
    </>
  );
}
