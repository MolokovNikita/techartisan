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
import { enqueueSnackbar } from "notistack";

const animatedComponents = makeAnimated();

const ModalRootElement = document.querySelector("#ServiceCard");

// Register the locale with react-datepicker
registerLocale("ru", ru);

const getNearestAvailableTime = (now) => {
  const nearestTime = new Date(now);
  if (now.getHours() >= 7 && now.getHours() < 20) {
    if (now.getMinutes() >= 30) {
      nearestTime.setHours(now.getHours() + 1, 0, 0, 0);
    } else {
      nearestTime.setHours(now.getHours(), 30, 0, 0);
    }
  } else if (now.getHours() < 7) {
    nearestTime.setHours(7, 0, 0, 0);
  } else {
    nearestTime.setDate(nearestTime.getDate() + 1);
    nearestTime.setHours(7, 0, 0, 0);
  }
  return nearestTime;
};

export default function ServiceCardModal(props) {
  const element = useMemo(() => document.createElement("div"), []);

  const { isOpen, setIsOpen, onClose, isServiceModalOpen } = props;

  const { userData, isAuth } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    const minTime = getNearestAvailableTime(now);
    return minTime;
  });
  const [selectedOffice, setSelectedOffice] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const commentRef = useRef(null);

  const [offices, setOffices] = useState([]); // offices from bd
  const [services, setServices] = useState([]); // services from bd

  const getMinTime = () => {
    const now = new Date();
    const minTime = new Date(startDate);
    if (startDate.toDateString() === now.toDateString()) {
      return getNearestAvailableTime(now);
    } else {
      minTime.setHours(7, 0, 0, 0);
      return minTime;
    }
  };
  const getMinDay = () => {
    const now = new Date();
    const condition = now.getHours() >= 20 && now.getMinutes() >= 30;
    return condition ? new Date(now.setDate(now.getDate() + 1)) : now;
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
    const currentMinTime = getMinTime();
    if (date.toDateString() === now.toDateString()) {
      const nearestAvailableTime = getNearestAvailableTime(now);
      if (date.getTime() < nearestAvailableTime.getTime()) {
        setStartDate(nearestAvailableTime);
      } else {
        setStartDate(date);
      }
    } else {
      setStartDate(date);
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
          setIsLoading(true);
          const [servicesResponse, officesResponse] = await Promise.all([
            axios.get(`${config.API_URL}/services`),
            axios.get(`${config.API_URL}/offices`),
          ]);

          setServices(
            servicesResponse.data.map((item) => ({
              value: item.id,
              label: item.name,
              price: item.price,
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
        } finally {
          setIsLoading(false);
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
    const price = selectedServices.reduce(
      (acc, item) => acc + Number(item.price),
      0,
    );
    if (!selectedOffice || selectedServices.length === 0) {
      return enqueueSnackbar(`Возникла ошибка при создании карточки!`, {
        variant: "error",
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
    }
    setIsLoading(true);
    axios
      .post(`http://localhost:5002/order-card`, {
        price: price,
        client_id: userData.id,
        comment: commentRef.current.value,
        visit: startDate.toISOString(),
      })
      .then((res) => {
        const CARD_ID = res.data.id;
        const servicePromises = selectedServices.map((item) =>
          axios.post(`http://localhost:5002/services-order/create`, {
            cardoforder_id: CARD_ID,
            services_id: item.value,
          }),
        );

        const officePromise = axios.post(
          `http://localhost:5002/offices-order/create`,
          {
            cardoforder_id: CARD_ID,
            offices_id: selectedOffice.value,
          },
        );

        // Выполнение всех промисов параллельно
        Promise.all([...servicePromises, officePromise])
          .then((res) => {
            console.log(res);
            enqueueSnackbar(`Вы успешно оформили заказ`, {
              variant: "success",
              autoHideDuration: 2000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            });
            onClose();
            setSelectedOffice([]);
            setSelectedServices([]);
            return axios.post(`http://localhost:5002/status-order/create`, {
              cardoforder_id: CARD_ID,
              statusoforder_id: 5,
            });
          })
          .catch((e) => {
            enqueueSnackbar(`Возникла ошибка при создании карточки`, {
              variant: "error",
              autoHideDuration: 2000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch((e) => {
        enqueueSnackbar(`Возникла ошибка при создании карточки`, {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
        setIsLoading(false);
        onClose();
      });
  };

  if (!isServiceModalOpen) return null;

  return createPortal(
    <div
      className={styles.service_modal__background}
      onClick={handleBackgroundClick}
    >
      {!isLoading ? (
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
                <img
                  src="/close.png"
                  alt="close"
                  className={styles.closeImage}
                />
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
              minDate={getMinDay()}
              minTime={getMinTime()}
              maxTime={getMaxTime()}
              onChange={getDateValue}
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
              onChange={(value) => {
                setSelectedOffice(value);
              }}
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
              onChange={(value) => {
                setSelectedServices(value);
              }}
            />
            <div className={styles.services_label__container}>
              <label className={styles.services__label}>
                Если вам нужно несколько одинаковых услуг, просто добавьте
                нужную услугу, и напишите в комментарии к заказу количество
                услуг
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
      ) : (
        <div className={styles.loader_container}>
          <div className={styles.spinner}></div>
        </div>
      )}
    </div>,
    element,
  );
}
