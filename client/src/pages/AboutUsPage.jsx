import styles from "../styles/aboutus.module.css";
import { useState, useEffect } from "react";

function AboutUs() {
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const images = [
    "/photo_1.png",
    "/photo_2.png",
    "/photo_3.png",
    "/photo_4.png",
    "/photo_5.png",
    "/photo_6.png",
  ];

  useEffect(() => {
    const handleImageLoad = () => {
      setImagesLoaded((prev) => prev + 1);
    };

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = handleImageLoad;
    });
  }, []);

  useEffect(() => {
    if (imagesLoaded === images.length) {
      setLoading(false);
    }
  }, [imagesLoaded]);

  return (
    <>
      <div className={styles.top_text_container}>
        <div className={styles.top_text_card}>
          <ul>
            <li>
              &emsp;Мы гордимся тем, что с <b>2015</b>-го года профессионально
              занимаемся ремонтом, <br />
              модернизацией и сборкой компьютеров для наших клиентов по всей
              России.
            </li>
            <li>
              &emsp;Наши мастера - настоящие артизаны в мире технологий. Мы
              понимаем, <br />
              насколько важна для вас бесперебойная работа вашего оборудования,{" "}
              <br />и стремимся предложить самые передовые решения для любых
              задач. <br />
            </li>
            <li>
              &emsp;Наша команда экспертов всегда готова прийти на помощь,{" "}
              <br />
              будь то устранение неисправностей, улучшение производительности
              или
              <br /> сборка компьютера вашей мечты.
            </li>
          </ul>
        </div>
      </div>

      {loading ? (
        <div className={styles.loader_container}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <div className={styles.slider_grid}>
          {images.map((src, index) => (
            <div className={styles.slide} key={index}>
              <img src={src} alt={`Image ${index + 1}`} />
            </div>
          ))}
        </div>
      )}
      <div className={styles.bottom_text_container}>
        <div className={styles.bottomp_text_card}>
          <ul>
            <li>
              Почему выбирают &nbsp;<b>нас</b>:
            </li>
            <li>
              &emsp;<b>Опыт и профессионализм:</b> <br />
              Наши специалисты имеют многолетний опыт и постоянно повышают свою
              квалификацию.
            </li>
            <li>
              &emsp;<b>Индивидуальный подход:</b> <br />
              Мы учитываем все ваши пожелания и особенности работы, чтобы
              предложить оптимальное решение.
            </li>
            <li>
              &emsp;<b>Качество и надежность:</b> <br />
              Мы используем только проверенные компоненты и даем гарантию на все
              выполненные работы.
            </li>
            <li>
              &emsp;<b>Широкая география обслуживания:</b>
              <br />
              Независимо от вашего местоположения, мы всегда рядом и готовы
              помочь.
            </li>
            <li>
              &emsp;TechArtisan – это не просто ремонт и обслуживание, это
              искусство заботы о вашем компьютере.
              <br />
              Доверяйте профессионалам и наслаждайтесь безупречной работой
              вашего оборудования!
            </li>
            <li>Свяжитесь с нами, и мы найдем лучшее решение для вас.</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
