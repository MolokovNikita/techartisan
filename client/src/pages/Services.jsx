import styles from "../styles/services.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import config from "../config.js";

function Services() {
  const [services, setServices] = useState([]);
  const [openQuestions, setOpenQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    axios
      .get(`${config.API_URL}/services`)
      .then((res) => {
        setServices(res.data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const toggleQuestion = (index) => {
    setOpenQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const questionsAndAnswers = [
    // todo вынести логику в бд
    {
      id: 1,
      question: "Сколько времени занимает ремонт?",
      answer:
        "Среднее время ремонта составляет от 1 до 3 дней, в зависимости от сложности работ.",
    },
    {
      id: 2,
      question: "Предоставляете ли вы гарантию?",
      answer:
        "Да, на все наши услуги мы предоставляем гарантию сроком на 6 месяцев.",
    },
    {
      id: 3,
      question: "Вы работаете с юридическими лицами?",
      answer:
        "Да, мы работаем с юридическими лицами и предлагаем гибкие условия сотрудничества.",
    },
    {
      id: 4,
      question: "Можно ли заказать диагностику?",
      answer:
        "Конечно, мы предлагаем услугу диагностики, которая поможет выявить проблемы и определить стоимость ремонта.",
    },
  ];

  return (
    <>
      <div className={styles.services_main_container}>
        <div className={styles.services_title}>Услуги</div>
        {isLoading ? (
          <div className={styles.loader_container}>
            <div className={styles.spinner}></div>
          </div>
        ) : (
          <div className={styles.services_card}>
            <div className={styles.services_container_1}>
              <ol className={styles.services_list}>
                {services.map((item) => (
                  <li key={item.id}> {item.name} </li>
                ))}
              </ol>
            </div>
            <div className={styles.services_container_2}>
              <ol className={styles.services_list}>
                {services.map((item) => (
                  <li key={item.id}> {item.price} </li>
                ))}
              </ol>
            </div>
          </div>
        )}
        <div className={styles.button_container}>
          <button className={styles.services_button}>Записаться онлайн</button>
        </div>
        <div className={styles.question_topic}>
          <p>Вопросы и Ответы о наших услугах</p>
        </div>
        <div className={styles.question_container}>
          <div className={styles.question}>
            <ul className={styles.question_list}>
              {questionsAndAnswers.map((qa, index) => (
                <a key={qa.id} className={styles.question_btn}>
                  <li
                    key={qa.id}
                    className={styles.question_item}
                    onClick={() => toggleQuestion(index)}
                  >
                    <div className={styles.question_text}>
                      {qa.question}
                      <div
                        className={`${styles.arrowIcon} ${openQuestions.includes(index) ? styles.rotate : ""}`}
                      >
                        <IoIosArrowForward />
                      </div>
                    </div>
                    {openQuestions.includes(index) && (
                      <div className={styles.answer}>{qa.answer}</div>
                    )}
                  </li>
                </a>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Services;
