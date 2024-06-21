import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { Circle } from "react-preloaders"; // loader TO DO
import config from "../config.js";
import useInMemoryJWT from "../hooks/inMemoryJWT.js";

export const AuthClient = axios.create({
  baseURL: `${config.API_URL}/auth`,
  withCredentials: true,
});

const ResourceClient = axios.create({
  baseURL: `${config.API_URL}/clients`
});

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const { getToken, setToken, deleteToken } = useInMemoryJWT();
  const [isAuth, setisAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [userData, setUserData] = useState({
    id: '',
    f_name: '',
    l_name: '',
    email: '',
    phone_number: '',
  });

  const handleFetchProtected = () => {
    ResourceClient.get("/clients")
      .then((res) => {
        console.log(res);
      }).catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AuthClient.post("/refresh");
        const { accessToken, accessTokenExpiration } = response.data;
        setToken(accessToken, accessTokenExpiration);
        setUserData({
          id: response.data.id,
          f_name: response.data.f_name,
          email: response.data.email
        });
        setisAuth(true);
      } catch (error) {
        console.log(error.response.data);
        setisAuth(false);
      } finally {
        setIsLoading(false);
      }
    };
  
    // Выполнять запрос только при первой загрузке (isLoading === true)
    if (isLoading) {
      fetchData();
    }
  }, [isLoading]); // Зависимость от isLoading

  const handleLogOut = () => {
    AuthClient.post("/logout")
      .then(() => {
        setisAuth(false);
        sessionStorage.clear();
        localStorage.clear();
        deleteToken();
        setUserData({
          id: '',
          f_name: '',
          l_name: '',
          email: '',
          phone_number: '',
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
          email: data[0].email
        });
        sessionStorage.setItem('userId', res.data.id);
        data[1]();
        setisAuth(true);
      })
      .catch((e) => {
        console.log(e.response);
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
          email: res.data.email
        });
        sessionStorage.setItem('userId', res.data.id);
        data[1]();
        setisAuth(true);
      })
      .catch((e) => {
        console.log(e.response.data);
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
        isLoading,
        isAuth,
        userData,
        setisAuth,
        handleSignUp,
        handleSignIn,
        handleLogOut,
        setUserData,
        handleFetchProtected
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
