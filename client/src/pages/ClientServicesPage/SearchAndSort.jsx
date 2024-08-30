import { useRef } from "react";
import Select from "react-select";
import { CiSearch } from "react-icons/ci";
import styles from "../../styles/search.and.sort.module.css";

export default function SearchAndSort({
  serviceCards,
  setServiceCards,
  setServiceCardsFiltered,
  setIsSearch,
  isLoading,
}) {
  const options = [
    { value: "newAtFirst", label: "Сначала новые" },
    { value: "oldAtFirst", label: "Сначала старые" },
    { value: "expensiveAtFirst", label: "Сначала дорогие" },
    { value: "cheapAtFirst", label: "Сначала дешевые" },
  ];

  const sortValue = useRef("");
  const searchFilter = useRef("");

  const sortNewAtFirst = (a, b) => {
    return new Date(b.created) - new Date(a.created);
  };

  const sortOldAtFirst = (a, b) => {
    return new Date(a.created) - new Date(b.created);
  };

  const sortExpensiveAtFirst = (a, b) => b.price - a.price;
  const sortCheapAtFirst = (a, b) => a.price - b.price;

  const setSortType = () => {
    if (!isLoading) {
      const resultArray = [...serviceCards];
      switch (sortValue.current) {
        case "newAtFirst":
          resultArray.sort(sortNewAtFirst);
          break;
        case "oldAtFirst":
          resultArray.sort(sortOldAtFirst);
          break;
        case "expensiveAtFirst":
          resultArray.sort(sortExpensiveAtFirst);
          break;
        case "cheapAtFirst":
          resultArray.sort(sortCheapAtFirst);
          break;
        default:
          break;
      }
      setServiceCards(resultArray);
    }
  };

  const setSearchFilter = () => {
    if (!searchFilter.current.value) {
      setIsSearch(false);
      setServiceCardsFiltered(serviceCards);
      return;
    }
    setIsSearch(true);
    const resultArray = serviceCards.filter((card) =>
      card.id.toString().includes(searchFilter.current.value),
    );
    setServiceCardsFiltered(resultArray);
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

  return (
    <div className={styles.command_line__container}>
      <ul className={styles.command_line__list}>
        <li className={styles.command_search__item}>
          <p className={styles.search__text}>Поиск</p>
          <div className={styles.search_input__container}>
            <CiSearch className={styles.search__icon} size={25} />
            <input
              className={styles.search__input}
              type="text"
              placeholder="Введите номер карточки заказа"
              ref={searchFilter}
              onChange={setSearchFilter}
            />
          </div>
        </li>
        <li className={styles.sort__item}>
          <label>Сортировать</label>
          <div className={styles.sort_item__list}>
            <Select
              className={styles.select__container}
              options={options}
              placeholder={"Выберите способ сортировки"}
              styles={selectStyles}
              onChange={(e) => {
                sortValue.current = e.value;
                setSortType();
              }}
            />
          </div>
        </li>
      </ul>
    </div>
  );
}
