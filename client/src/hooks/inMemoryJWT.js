import { useContext, useEffect, useState } from "react";
import config from "../config";
import { AuthClient, AuthContext } from "../context/AuthContext";

const useInMemoryJWT = () => {
  const { userData, setUserData } = useContext(AuthContext);
  const [inMemoryJWT, setInMemoryJWT] = useState(null);
  let refreshTimeoutId = null;

  const refreshToken = (expiration) => {
    const timeoutTrigger = expiration - 10000;

    refreshTimeoutId = setTimeout(() => {
      AuthClient.post("/refresh")
        .then((res) => {
          const { accessToken, accessTokenExpiration } = res.data;
          setUserData({
            ...userData,
            id: res.data.id,
            f_name: res.data.f_name,
            email: res.data.email
          });
          sessionStorage.setItem('userId', res.data.id);
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
    setInMemoryJWT(token);
    refreshToken(tokenExpiration);
  };

  const deleteToken = () => {
    setInMemoryJWT(null);
    abortRefreshToken();
    localStorage.setItem(config.LOGOUT_STORAGE_KEY, Date.now());
  };

  useEffect(() => {
    return () => {
      abortRefreshToken();
    };
  }, []);

  return {
    getToken,
    setToken,
    deleteToken,
  };
};

export default useInMemoryJWT;
