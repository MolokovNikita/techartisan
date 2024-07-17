import { useEffect, useMemo, useRef, useState, useContext } from "react";
import { createPortal } from "react-dom";
import styles from "../styles/serviceCardModal.module.css";
import { AuthContext } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru"; // Import Russian locale from date-fns
import makeAnimated from "react-select/animated";
import axios from "axios";
import config from "../config";

const animatedComponents = makeAnimated();

const ModalRootElement = document.querySelector("#ServiceCard");

// Register the locale with react-datepicker
registerLocale("ru", ru);

export default function ServiceCardModal(props) {
  const { isOpen, setIsOpen, onClose, isServiceModalOpen } = props;
  const { userData, isAuth } = useContext(AuthContext);
  const [startDate, setStartDate] = useState(new Date());
  const commentRef = useRef(null);
  const element = useMemo(() => document.createElement("div"), []);
  const [offices, setOffices] = useState([]); // offices from bd
  const [services, setServices] = useState([]); // services from bd

  const getMinTime = () => {
    const now = new Date();
    const minTime = new Date(startDate);

    if (
      startDate.toDateString() === now.toDateString() &&
      now.getHours() >= 7
    ) {
      if (now.getMinutes() >= 31) {
        minTime.setHours(now.getHours() + 1, 0, 0, 0); // Round up to the next hour
      } else if (now.getMinutes() === 30) {
        minTime.setHours(now.getHours(), 30, 0, 0); // Set to the next half hour
      } else {
        minTime.setHours(now.getHours(), 30, 0, 0); // Round up to the next half hour
      }
    } else {
      minTime.setHours(7, 0, 0, 0); // If not today, set to 7 AM
    }
    return minTime;
  };

  const getMaxTime = () => {
    const maxTime = new Date(startDate);
    maxTime.setHours(20, 30, 0, 0);
    return maxTime;
  };
  const selectStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      cursor: "pointer",
      fontSize: "1rem",
      fontFamily: '"Inter", sans-serif',
      fontWeight: "lighter",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        fontSize: "1rem",
        fontFamily: '"Inter", sans-serif',
        fontWeight: "lighter",
        backgroundColor: isDisabled
          ? undefined
          : isSelected
            ? data.color
            : isFocused
              ? "rgb(199, 223, 195)"
              : undefined,
        color: isDisabled ? "#ccc" : isSelected ? "green" : data.color,
        cursor: isSelected ? "default" : "pointer",
        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : "rgba(136, 226, 139, 1)"
            : undefined,
        },
      };
    },
    input: (styles) => ({ ...styles }),
    placeholder: (styles) => ({ ...styles }),
  };
  const handleAuth = () => {
    onClose();
    setIsOpen(true);
  };
  const getDateValue = (date) => {
    const now = new Date();
    console.log(date);
    if (date.toDateString() === now.toDateString()) {
      // Если выбрана текущая дата
      const currentMinTime = getMinTime();
      if (date.getTime() < now.getTime()) {
        // Если выбрано прошедшее время на текущий день, установить текущее время
        setStartDate(now);
      } else if (date.getHours() < currentMinTime.getHours()) {
        // Если выбрано время раньше минимального времени на текущий день, установить минимальное время
        setStartDate(currentMinTime);
      } else {
        // В противном случае, установить выбранную дату
        setStartDate(date);
      }
    } else {
      // Если выбрана другая дата, установить минимальное время для этой даты
      const newDate = new Date(date);
      newDate.setHours(7, 0, 0, 0); // Установить на 7 утра выбранного дня
      setStartDate(newDate);
    }
  };

  useEffect(() => {
    if (ModalRootElement) {
      ModalRootElement.appendChild(element);
      return () => {
        ModalRootElement.removeChild(element);
      };
    }
  }, [element]);

  useEffect(() => {
    if (isServiceModalOpen) {
      if (!isAuth) {
        return handleAuth();
      }
      document.body.style.overflow = "hidden";

      const fetchData = async () => {
        try {
          const [servicesResponse, officesResponse] = await Promise.all([
            axios.get(`${config.API_URL}/services`),
            axios.get(`${config.API_URL}/offices`),
          ]);

          setServices(
            servicesResponse.data.map((item) => ({
              value: item.id,
              label: item.name,
            })),
          );

          setOffices(
            officesResponse.data.map((item) => ({
              value: item.id,
              label: item.adress,
            })),
          );
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isServiceModalOpen, onClose]);

  const handleBackgroundClick = () => {
    onClose();
  };
  const handleCardClick = (event) => {
    event.stopPropagation();
  };
  const handleBtnClick = () => {
    commentRef.current.value
      ? console.log(commentRef.current.value)
      : console.log(null);
  };
  if (!isServiceModalOpen) return null;

  return createPortal(
    <div
      className={styles.service_modal__background}
      onClick={handleBackgroundClick}
    >
      <div
        className={styles.modalContainer}
        onClick={handleCardClick}
        tabIndex="-1"
      >
        <div className={styles.sign_online_container}>
          <div className={styles.sign_online__title}>Онлайн запись</div>
          <div className={styles.close}>
            <button
              className={styles.closeButton}
              onClick={handleBackgroundClick}
            >
              <img src="/close.png" alt="close" className={styles.closeImage} />
            </button>
          </div>
        </div>
        <div className={styles.select_date__container}>
          Выберете дату и время помещения нашего офиса
        </div>
        <div className={styles.date_picker__container}>
          <DatePicker
            dateFormat="dd.MM - HH:mm"
            locale="ru"
            showTimeSelect
            timeCaption="Время"
            selected={startDate}
            minDate={new Date()}
            minTime={getMinTime()} // Устанавливаем минимальное время
            maxTime={getMaxTime()} // Устанавливаем максимальное время
            onChange={getDateValue}

            // timeClassName={handleColor}
          />
        </div>
        <div className={styles.select_office__container}>
          Выберете офис обслуживания
        </div>
        <div className={styles.select_office__container}>
          <Select
            className={styles.select__office}
            options={offices}
            placeholder={"Выберете офис"}
            styles={selectStyles}
          />
        </div>
        <div className={styles.select_office__container}>Выберете услуги</div>
        <div className={styles.select_office__container}>
          <Select
            components={animatedComponents}
            closeMenuOnSelect={false}
            className={styles.select__office}
            isMulti
            options={services}
            placeholder={"Выберете услуги"}
            styles={selectStyles}
            noOptionsMessage={() => "Услуги закончились :("}
          />
          <div className={styles.services_label__container}>
            <label className={styles.services__label}>
              Если вам нужно несколько одинаковых услуг, просто добавьте нужную
              услугу, и напишете в комментарии к заказу количество услуг
            </label>
          </div>
          <div className={styles.comment__container}>
            <textarea
              ref={commentRef}
              wrap="off"
              cols="40"
              rows="5"
              placeholder="Комментарий к заказу"
              className={styles.comment__area}
            />
          </div>
        </div>
        <div className={styles.btn__container}>
          <button className={styles.sign__btn} onClick={handleBtnClick}>
            Записаться
          </button>
        </div>
      </div>
    </div>,
    element,
  );
}
