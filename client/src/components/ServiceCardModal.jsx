import { useEffect, useMemo, useRef, useState, useContext } from "react";
import { createPortal } from "react-dom";
import styles from "../styles/serviceCardModal.module.css";
import { AuthContext } from "../context/AuthContext";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { useLoginValidation } from "../hooks/useLoginValidation";
import { useValidation } from "../hooks/useValidation";
import { useLocation, useNavigate } from "react-router-dom";

const ModalRootElement = document.querySelector("#ServiceCard");
export default function ServiceCardModal(props) {
  const { isOpen, setIsOpen, onClose, isServiceModalOpen } = props;
  const { userData, isAuth } = useContext(AuthContext);
  const modalRef = useRef(null);
  const element = useMemo(() => document.createElement("div"), []);
  const handleAuth = () => {
    onClose();
    setIsOpen(true);
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
        <div>Записать онлайн</div>
      </div>
    </div>,
    element,
  );
}
