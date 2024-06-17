import styles from '../styles/header.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header({ setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleNavigation = (path, hash) => {
    if (location.pathname !== path) {
      navigate(path);
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
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
            <li>ул. Красноказарменая, д.17</li>
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
            <a onClick={() => handleNavigation('/main')}>
              <img className={styles.logo} src="/logo.png" alt="logo" />
            </a>

            <ol className={styles.main_nav}>
              <li>
                <a onClick={() => handleNavigation('/main')}>Главная</a>
              </li>
              <li>
                <a onClick={() => handleNavigation('/services')}>Услуги</a>
              </li>
              <li>
                <a onClick={() => handleNavigation('/main', 'contacts_anchor')}>Контакты</a>
              </li>
              <li>
                <a onClick={() => handleNavigation('/aboutus')}>О нас</a>
              </li>
            </ol>
          </div>
          <div className={styles.Auth_container}>
            <a onClick={handleClick} href="#">Войти</a>
          </div>
        </div>
      </header>
    </>
  );
}
