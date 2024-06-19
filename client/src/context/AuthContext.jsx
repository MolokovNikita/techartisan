import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Circle } from "react-preloaders"; // loader 
import config from "../config.js";
import inMemoryJWT from "../services/inMemoryJWT.js";
import showErrorMessage from "../utils/showErrorMessage";

export const AuthClient = axios.create({
  baseURL: `${config.API_URL}/auth`,
  withCredentials: true,
});

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [isAuth, setisAuth] = useState(false);
  const [token, setToken] = useState(null);
  const handleFetchProtected = () => {};
 
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
      setisAuth(true);
    }
  }, []);

  const handleLogOut = () => {
    setToken(null);
    localStorage.removeItem('accessToken');
    setisAuth(false);
  };

  // const handleSignOut = () => {
  //   setToken(null);
  //   localStorage.removeItem('accessToken');
  //   setisAuth(false);
  // };
  const handleSignUp = (data) => {
    AuthClient.post("/sign-up", data)
      .then((res) => {
        const { accessToken, accessTokenExpiration } = res.data;
        setToken(accessToken);
        localStorage.setItem('accessToken', accessToken);
        inMemoryJWT.setToken(accessToken, accessTokenExpiration);
        setisAuth(true);
      })
      .catch((e)=>{
        console.log(e.response)
      });
  };

  const handleSignIn = (data) => {
    AuthClient.post("/sign-in", data)
      .then((res) => {
        const { accessToken, accessTokenExpiration } = res.data;

        inMemoryJWT.setToken(accessToken, accessTokenExpiration);
        setisAuth(true);
      })
      .catch(showErrorMessage);
  };

  useEffect(() => {
    const handlePersistedLogOut = (event) => {
      if (event.key === config.LOGOUT_STORAGE_KEY) {
        inMemoryJWT.deleteToken();
        setIsUserLogged(false);
      }
    };

    window.addEventListener("storage", handlePersistedLogOut);

    return () => {
      window.removeEventListener("storage", handlePersistedLogOut);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        setisAuth,
        handleFetchProtected,
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