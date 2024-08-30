import styles from "../styles/order.call.module.css";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import config from "../config/config";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const ModalRootElement = document.querySelector("#OrderCallPopUp");

export default function OrderCall(props) {
  const element = useMemo(() => document.createElement("div"), []);
  const { isOpen, onClose } = props;
  //валидация
  const [name, setName] = useState("");
  const [nameDirty, setNameDirty] = useState(false);
  const [nameError, setNameError] = useState(
    "*Данное поле не можеть быть пустым",
  );

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberDirty, setPhoneNumberDirty] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(
    "*Данное поле не можеть быть пустым",
  );

  const [formValid, setFormValid] = useState(false);
  useEffect(() => {
    if (nameError || phoneNumberError) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [nameError, phoneNumberError]);

  const phoneNumberHandler = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    if (!value) {
      setPhoneNumberError("*Данное поле не можеть быть пустым");
      return;
    }
    const phoneNumberRegex = /^7\d{10}$/;
    if (!phoneNumberRegex.test(value)) {
      setPhoneNumberError("Некорректный номер телефона Пример: 79994567890");
    } else {
      setPhoneNumberError("");
    }
  };

  const nameHandler = (e) => {
    const value = e.target.value;
    setName(value);
    if (!value) {
      setNameError("*Данное поле не можеть быть пустым");
    } else if (!/^[а-яА-Я ]+$/.test(value.toLowerCase())) {
      setNameError("*Неккоректное имя (Пример : Иван)");
    } else if (value.length < 2) {
      setNameError("*Минимальная длина имени 2 символа");
    } else {
      setNameError("");
    }
  };

  const blurHandler = (e) => {
    switch (e.target.name) {
      case "name":
        setNameDirty(true);
        break;
      case "phoneNumber":
        setPhoneNumberDirty(true);
        break;
      default:
        break;
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
    const handleKeyDown = (e) => {
      // Закрытие модального окна при нажатии на Esc
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackgroundClick = () => {
    onClose();
  };
  const handleCardClick = (event) => {
    event.stopPropagation();
  };
  const handleOrderCall = () => {
    if (name && phoneNumber) {
      axios
        .post(`${config.API_URL}/order-call`, {
          name: name,
          phone_number: phoneNumber,
        })
        .then((res) => {
          enqueueSnackbar(
            `Ваш запрос успешно был отправлен! С вами свяжется первый освободившийся оператор!`,
            {
              variant: "success",
              autoHideDuration: 3000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            },
          );
        })
        .catch((e) => {
          enqueueSnackbar(`Упс, кажется что-то пошло не так! - ${e}`, {
            variant: "error",
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          });
          console.error(e);
        })
        .finally(() => {
          setName("");
          setPhoneNumber("");
          setNameDirty(false);
          setPhoneNumberDirty(false);
          setNameError("*Данное поле не можеть быть пустым");
          setPhoneNumberError("*Данное поле не можеть быть пустым");
          onClose();
        });
    } else {
      enqueueSnackbar(`Упс, кажется что-то пошло не так!`, {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      return;
    }
  };
  return createPortal(
    <div
      className={styles.order_call__background}
      onClick={handleBackgroundClick}
    >
      <div
        className={styles.order_call_modal__container}
        onClick={handleCardClick}
        tabIndex="-1"
      >
        <div className={styles.close}>
          <button
            className={styles.closeButton}
            onClick={handleBackgroundClick}
          >
            <img src="/close.png" alt="close" className={styles.closeImage} />
          </button>
        </div>
        <div className={styles.name_area__container}>
          <div className={styles.input__wrapper}>
            <input
              onChange={nameHandler}
              value={name}
              onBlur={blurHandler}
              name="name"
              className={styles.name__area}
              type="text"
              placeholder=" "
              autoComplete="name"
            />
            <label className={styles.placeholder__label}>
              Как к вам обращаться ?
            </label>
          </div>
        </div>
        {nameDirty && nameError && (
          <p className={styles.error__area}>{nameError}</p>
        )}
        <div className={styles.phone_area__container}>
          <div className={styles.input__wrapper}>
            <input
              onChange={phoneNumberHandler}
              value={phoneNumber}
              onBlur={blurHandler}
              name="phoneNumber"
              className={styles.phone__area}
              type="text"
              placeholder=" "
              autoComplete="phone"
            />
            <label className={styles.placeholder__label}>
              Ваш номер телефона
            </label>
          </div>
        </div>
        {phoneNumberDirty && phoneNumberError && (
          <div className={styles.error__area}>{phoneNumberError}</div>
        )}
        <div className={styles.order_btn__container}>
          <button
            onClick={handleOrderCall}
            disabled={!formValid}
            className={
              formValid ? styles.order__btn : styles.order__btnDisabled
            }
          >
            Заказать звонок
          </button>
        </div>
      </div>
    </div>,
    element,
  );
}
