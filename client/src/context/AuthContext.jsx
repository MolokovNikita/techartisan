import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Circle } from "react-preloaders"; // loader TO DO
import config from "../config.js";
import inMemoryJWT from "../services/inMemoryJWT.js";

export const AuthClient = axios.create({
  baseURL: `${config.API_URL}/auth`,
  withCredentials: true,
});

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [isAuth, setisAuth] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      //TO DO : Добавить логику проверки валидности accesToken
            setisAuth(true);
    }
  }, []);

  const handleLogOut = () => {
    AuthClient.post("/logout")
      .then(() => {
        setisAuth(false);
        localStorage.removeItem('userName')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userId')
        // inMemoryJWT.deleteToken();
      })
      .catch((e) => { 
        console.log(e);
      });
  };

  const handleSignUp = (data) => { //Done
    AuthClient.post("/sign-up", data[0]) 
      .then((res) => {
        const { accessToken, accessTokenExpiration } = res.data;
        inMemoryJWT.setToken(accessToken, accessTokenExpiration);
        localStorage.setItem('userId', res.data.id);
        localStorage.setItem('userName', data[0].f_name);
        localStorage.setItem('accessToken', accessToken);
        data[1]();
        setisAuth(true);
      })
      .catch((e) => {
        console.log(e.response)
      });
  };

  const handleSignIn = (data) => { //Done
    AuthClient.post("/sign-in", data[0])
      .then((res) => {
        console.log(res);
        const { accessToken, accessTokenExpiration } = res.data;
        inMemoryJWT.setToken(accessToken, accessTokenExpiration);
        localStorage.setItem('userId', res.data.id);
        localStorage.setItem('userName',  res.data.f_name);
        localStorage.setItem('accessToken', accessToken);
        data[1]();
        setisAuth(true);
      })
      .catch((e) => {
        console.log(e.response)
      });
  };

  // useEffect(() => {
  //   const handlePersistedLogOut = (event) => {
  //     if (event.key === config.LOGOUT_STORAGE_KEY) {
  //       localStorage.removeItem('userName')
  //       inMemoryJWT.deleteToken();
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
        isAuth,
        setisAuth,
        handleSignUp,
        handleSignIn,
        handleLogOut,
      }}
    >
      
      {children}
    </AuthContext.Provider>
    
  );
};

export default AuthProvider;