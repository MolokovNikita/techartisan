export default function Body() {
    return (
        <>
            <div class="topic-container">
                <div class="topic">
                    <div class="topic-arrow">
                        <ol class="arrow-list">
                            <li><img src="/arrow.png" alt="" /></li>
                            <li class="second-arrow" ><img src="/arrow.png" alt="" /></li>
                            <li><img src="/arrow.png" alt="" /></li>
                        </ol>
                    </div>
                    <div class="topic-text">
                        <ol class="topic-list">
                            <li>
                                <p>
                                    Профессионально ремонтируем,</p>
                                прокачиваем и собираем компьютеры по всей России с 2015 года !
                            </li>
                            <li>
                                Занимаемся всей техникой !
                            </li>
                            <li>
                                <div class="notebook-container">
                                    Предоставляем лучшие цены на рынке !
                                    <img src="/notebooklogo.png" alt="" />
                                </div>

                            </li>
                        </ol>
                        <div class="SignUp-container">
                            <ol>
                                <li><img src="/monitorlogo.png" alt="" /></li>
                                <li class="SignUpButton"><button>Записаться онлайн</button></li>
                                <li> <img src="/smartphonelogo.png" alt="" /> </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <div class="Services">
                <div class="Services-container">
                    <p>Услуги</p>
                </div>
                <div class="MostPopularServices">
                    <p>самые популярные услуги</p></div>
                <div class="Services-card">
                    <div class="Services-contaiener-1">
                        <ol class="Services-list">
                            <li>
                                Сборка компьютера
                            </li>
                            <li>
                                Замена дисплея смартфона
                            </li>
                            <li>
                                Замена тачскрина смартфона
                            </li>
                            <li>
                                Замена  термопасты
                            </li>
                            <li>
                                Ремнот матрицы ноутбука
                            </li>
                            <li>
                                Ремонт тачпада ноутбука
                            </li>
                        </ol>
                    </div>
                    <div class="Services-contaiener-2">
                        <ol class="Services-list">
                            <li>
                                5% от стоимости комлпектующих
                            </li>
                            <li>
                                4000р.
                            </li>
                            <li>
                                3000р
                            </li>
                            <li>
                                500р.
                            </li>
                            <li>
                                7000р.
                            </li>
                            <li>
                                1500р.
                            </li>
                        </ol>
                    </div>
                </div>
                <div class="Services-button-container">
                    <button>
                        Показать все услуги
                    </button>
                </div>
            </div>
            <hr class="Vertical-line" style={{ width: "65%", margin: "auto", marginTop: "30px" }}></hr>
            <div class="Contacts">
                <div class="Contacts-text-container">
                    <div class="Contacts-text">Контакты</div>
                </div>
                <div class="Contacts-block-container">
                    <div class="Contacts-block">
                        <div class="social-logo-list">
                            <ul>
                                <li>
                                    <img src='/maillogo.png' /></li>
                                <li>
                                    <img src='/tg.png' />
                                </li>
                                <li>
                                    <img src='/vk.png' />
                                </li>
                                <li> <img src="/wapp.png" alt="" />
                                </li>
                            </ul>
                        </div>
                        <div class = "block-info">
                        <div class = "telephone-number">
                            <a href="">
                            <img src="/tellogo.png" alt="" class = "tellogo-body" />
                            +7-999-999-99-99
                            </a>
                        </div>
                        <ul>
                            <li>
                                <a href="#">
                                    mail - techartisan@mail.ru
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    telegram - @TechArtisan
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    vkontakte - vk.com/techartisan
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    whatsApp - +7-999-999-99-99
                                </a>
                            </li>
                        </ul>
                        <p>Так же вы можете заказать звонок</p>
                        <button>Заказать звонок</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class= 'find-container'>
            <p class = 'find-text'>Как нас найти ? </p>
            <a href="https://yandex.ru/maps/213/moscow/house/krasnokazarmennaya_ulitsa_13/Z04YcQdlTUYAQFtvfXt0dn5kZw==/?ll=37.705436%2C55.757273&z=16.86" target="_blank">
            <button>
                Яндекс карты
            </button>
            </a>
            </div>
        </>
    )
}