import { useState } from 'react';
import styles from '../style.module.css';
//import geologo from ''
export default function Header({setIsOpen}) {
  const handleClick = () => {
    setIsOpen(prev => !prev);
  };
  return (
    <>
 <div class = "top-header">
    <ol class = "location-nav">
      <li>
        <img class = "geologo" src= '/geologo.png' alt="geologo" />
        Москва
      </li>
      <li>ул. Красноказарменая, д.13</li>
      </ol>
    <ol class = "social-nav">
      <li>
        
        <img class = "tellogo" src="/tellogo.png" alt="tellogo"/>
        <a href="tel:+79999999999">+7-999-999-99-99</a>
      </li>
      <li>
        <a href="#"><img class ="tglogo" src = "/tg.png" alt="tglogo"/></a>
      </li>
      <li>
        <a href="#"><img class = "vklogo" src="/vk.png" alt="vklogo"/></a>
      </li>
      <li>
        <a href="#"><img class = "wapplogo" src="/wapp.png" alt="wapplogo"/></a>
      </li>
    </ol>
</div>
  <div class = "bottom-header">
    <div class = "bottom-header-left">
      <img class = "logo" src="/logo.png" alt="logo"/>
    <ol class = "main-nav">
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
    <div class = "Auth-container">
      <a onClick={handleClick} href="#">  Войти </a>
    </div>
  </div>
    </>
  );
}
