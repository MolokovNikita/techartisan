import React, { useRef, useState, useEffect } from "react";
import { BsEraser } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";

import styles from "../styles/enter.code.module.css";

export default function EnterCode({
  callback,
  reset,
  isLoading,
  back,
  targetRecover,
}) {
  const [code, setCode] = useState("");
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const resetCode = () => {
    inputRefs.forEach((ref) => {
      ref.current.value = "";
    });
    inputRefs[0].current.focus();
    setCode("");
  };

  useEffect(() => {
    if (code.length === 4) {
      if (typeof callback === "function") callback(code);
      resetCode();
    }
  }, [code]);

  useEffect(() => {
    resetCode();
  }, [reset]);

  function handleInput(e, index) {
    const input = e.target;
    const previousInput = inputRefs[index - 1];
    const nextInput = inputRefs[index + 1];

    const newCode = [...code];
    newCode[index] = input.value;
    setCode(newCode.join(""));

    input.select();

    if (input.value === "") {
      if (previousInput) {
        previousInput.current.focus();
      }
    } else if (nextInput) {
      nextInput.current.select();
    }

    input.classList.add(styles.animate);

    setTimeout(() => {
      input.classList.remove(styles.animate);
    }, 300);
  }

  function handleFocus(e) {
    e.target.select();
  }

  function handleKeyDown(e, index) {
    const input = e.target;
    const previousInput = inputRefs[index - 1];
    const nextInput = inputRefs[index + 1];

    if ((e.keyCode === 8 || e.keyCode === 46) && input.value === "") {
      e.preventDefault();
      setCode(
        (prevCode) => prevCode.slice(0, index) + prevCode.slice(index + 1),
      );
      if (previousInput) {
        previousInput.current.focus();
      }
    }
  }

  const handlePaste = (e) => {
    const pastedCode = e.clipboardData.getData("text");
    if (pastedCode.length === 4) {
      setCode(pastedCode);
      inputRefs.forEach((inputRef, index) => {
        inputRef.current.value = pastedCode.charAt(index);
      });
    }
  };

  const maskTargetRecover = (target) => {
    if (/^\d+$/.test(target)) {
      // Если это номер телефона
      return target.slice(0, 2) + "****" + target.slice(-4);
    } else {
      // Если это email
      const [localPart, domain] = target.split("@");
      const maskedLocalPart =
        localPart.slice(0, 2) + "***" + localPart.slice(-1);
      return `${maskedLocalPart}@${domain}`;
    }
  };

  const ClearButton = () => {
    return (
      <button onClick={resetCode} className={styles.clear__btn}>
        <BsEraser />
      </button>
    );
  };

  return (
    <>
      <div className={styles.back_arrow__container}>
        <button className={styles.back__btn} onClick={back}>
          <IoIosArrowBack size={30} />
        </button>
        <div className={styles.target__container}>
          <div className={styles.code__title}>
            Введите 4-х значный код, высланный на -
          </div>
          <div className={styles.target__recover}>
            {maskTargetRecover(targetRecover)}
          </div>
        </div>
      </div>
      <div className={styles.code_inpt__container}>
        {[0, 1, 2, 3].map((index) => (
          <input
            className={styles.code__inpt}
            key={index}
            type="text"
            maxLength={1}
            onChange={(e) => handleInput(e, index)}
            ref={inputRefs[index]}
            autoFocus={index === 0}
            onFocus={handleFocus}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={isLoading}
          />
        ))}
        {code.length ? <ClearButton /> : <></>}
      </div>
    </>
  );
}
