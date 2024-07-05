import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import config from "../config.js";
import useInMemoryJWT from "../hooks/inMemoryJWT.js";
import { enqueueSnackbar } from "notistack";

export const AuthClient = axios.create({
  baseURL: `${config.API_URL}/auth`,
  withCredentials: true,
});

const ResourceClient = axios.create({
  baseURL: `${config.API_URL}/clients`,
});

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const { getToken, setToken, deleteToken } = useInMemoryJWT();
  const [isAuth, setisAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [erorText, setErrorText] = useState("");
  const [isAdmin, setIsAdmin] = useState(true);
  const [userData, setUserData] = useState({
    id: "",
    f_name: "",
    l_name: "",
    email: "",
    phone_number: "",
  });

  const handleError = (data) => {
    setErrorText(data);
    setTimeout(() => {
      setErrorText("");
    }, 5000);
  };

  const handleFetchProtected = () => {
    ResourceClient.get("/clients")
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    AuthClient.post("/refresh")
      .then((res) => {
        const { accessToken, accessTokenExpiration } = res.data;
        setToken(accessToken, accessTokenExpiration);
        setUserData({
          ...userData,
          id: res.data.id,
          f_name: res.data.f_name,
          email: res.data.email,
        });
        setisAuth(true);
      })
      .catch((e) => {
        console.log(e.response.data);
        setisAuth(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleLogOut = () => {
    AuthClient.post("/logout")
      .then(() => {
        setisAuth(false);
        sessionStorage.clear();
        localStorage.clear();
        deleteToken();
        setUserData({
          id: "",
          f_name: "",
          l_name: "",
          email: "",
          phone_number: "",
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSignUp = (data) => {
    AuthClient.post("/sign-up", data[0])
      .then((res) => {
        const { accessToken, accessTokenExpiration } = res.data;
        setToken(accessToken, accessTokenExpiration);
        setUserData({
          ...userData,
          id: res.data.id,
          f_name: data[0].f_name,
          email: data[0].email,
        });
        sessionStorage.setItem("userId", res.data.id);
        data[1]();
        setisAuth(true);
        enqueueSnackbar(`Вы успешно зарегистрировались!, ${data[0].f_name}!`, {
          variant: "success",
          autoHideDuration: 1500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
      })
      .catch((e) => {
        handleError(e.response.data);
        enqueueSnackbar(`${e.response.data}`, {
          variant: "error",
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
      });
  };

  const handleSignIn = (data) => {
    AuthClient.post("/sign-in", data[0])
      .then((res) => {
        console.log(res.data.id, res.data.f_name, res.data.email);
        const { accessToken, accessTokenExpiration } = res.data;
        setToken(accessToken, accessTokenExpiration);
        setUserData({
          ...userData,
          id: res.data.id,
          f_name: res.data.f_name,
          email: res.data.email,
        });
        sessionStorage.setItem("userId", res.data.id);
        data[1]();
        setisAuth(true);
        enqueueSnackbar(`Привет, ${res.data.f_name}!`, {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
      })
      .catch((e) => {
        handleError(e.response.data);
        enqueueSnackbar(`${e.response.data}`, {
          variant: "error",
          autoHideDuration: 1500, // 3 seconds
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
      });
  };

  // useEffect(() => {
  //   const handlePersistedLogOut = (event) => {
  //     if (event.key === "logout") {
  //       deleteToken();
  //       setisAuth(false);
  //     }
  //   };

  //   window.addEventListener("storage", handlePersistedLogOut);

  //   return () => {
  //     window.removeEventListener("storage", handlePersistedLogOut);
  //   };
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        erorText,
        isLoading,
        isAuth,
        userData,
        setisAuth,
        handleSignUp,
        handleSignIn,
        handleLogOut,
        setUserData,
        handleFetchProtected,
        setErrorText,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
