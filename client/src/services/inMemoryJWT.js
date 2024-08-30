import { useContext } from "react";
import config from "../config";
import { AuthClient, AuthContext } from "../context/AuthContext";

const inMemoryJWTService = () => {
  let inMemoryJWT = null;
  let refreshTimeoutId = null;

  const refreshToken = (expiration) => {
    console.log(expiration);
    const timeoutTrigger = expiration - 10000;
    const { userData, setUserData } = useContext(AuthContext);
    refreshTimeoutId = setTimeout(() => {
      AuthClient.post("/refresh")
        .then((res) => {
          const { accessToken, accessTokenExpiration } = res.data;
          setUserData({
            ...userData,
            id: res.data.id,
            f_name: res.data.f_name,
            email: res.data.email,
          });
          sessionStorage.setItem("userId", res.data.id);
          sessionStorage.setItem("userName", res.data.f_name);
          setToken(accessToken, accessTokenExpiration);
        })
        .catch(console.error);
    }, timeoutTrigger);
  };

  const abortRefreshToken = () => {
    if (refreshTimeoutId) {
      clearTimeout(refreshTimeoutId);
    }
  };

  const getToken = () => inMemoryJWT;

  const setToken = (token, tokenExpiration) => {
    inMemoryJWT = token;
    refreshToken(tokenExpiration);
  };

  const deleteToken = () => {
    inMemoryJWT = null;
    abortRefreshToken();
    localStorage.setItem(config.LOGOUT_STORAGE_KEY, Date.now());
  };

  return {
    getToken,
    setToken,
    deleteToken,
  };
};

export default inMemoryJWTService();
