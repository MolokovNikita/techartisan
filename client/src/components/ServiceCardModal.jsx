import { useEffect, useMemo, useRef, useState, useContext } from "react";
import { createPortal } from "react-dom";
import styles from "../styles/serviceCardModal.module.css";
import { AuthContext } from "../context/AuthContext";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { useLoginValidation } from "../hooks/useLoginValidation";
import { useValidation } from "../hooks/useValidation";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru"; // Import Russian locale from date-fns
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

const ModalRootElement = document.querySelector("#ServiceCard");

// Register the locale with react-datepicker
registerLocale("ru", ru);

export default function ServiceCardModal(props) {
  const { isOpen, setIsOpen, onClose, isServiceModalOpen } = props;
  const { userData, isAuth } = useContext(AuthContext);
  const [startDate, setStartDate] = useState(new Date());
  const modalRef = useRef(null);
  const element = useMemo(() => document.createElement("div"), []);
  //offices from bd
  const offices = [
    { value: "Moscow", label: "г. Москва, ул. Красноказарменная 13" },
    { value: "Saint-Petesburg", label: "г. Санкт Петербург, ул. Пушкина" },
  ];
  //services from bd
  const services = [
    { value: "1", label: "Замена ..." },
    { value: "2", label: "Чистка ...1" },
    { value: "3", label: "Чистка ...2" },
    { value: "24", label: "Чистка ...3" },
    { value: "25", label: "Чистка ...4" },
    { value: "26", label: "Чистка ...5" },
    { value: "27", label: "Чистка ...6" },
    { value: "28", label: "Чистка ...7" },
    { value: "29", label: "Чистка ...8" },
    { value: "20", label: "Чистка ...9" },
    { value: "21", label: "Чистка ...0" },
    { value: "223", label: "Чистка ...123" },
  ];
  const handleColor = (time) => {
    return time.getHours() > 12 ? styles.textSuccess : styles.textError;
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
    setStartDate(date);
    console.log(date);
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
    console.log("click");
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
            onChange={getDateValue}
            timeClassName={handleColor}
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
