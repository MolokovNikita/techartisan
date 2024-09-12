import axios from "axios";
import qs from "qs";
import packageJson from "../../package.json";
import config from "../config/config";
const REACT_APP_SERVER_URL = config.API_URL;

const instance = axios.create({
  baseURL: `${REACT_APP_SERVER_URL}`,
  withCredentials: true,
  paramsSerializer(params) {
    return qs.stringify(params, { indices: false });
  },
});
instance.interceptors.request.use(
  (config) => {
    const accesToken = window.localStorage.getItem("accessToken");
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accesToken}`,
    };
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.post(
          `${config.API_URL}/auth/refresh`,
          null,
          { withCredentials: true },
        );
        if (response.data.accesToken)
          localStorage.setItem("accessToken", response.data.accesToken);
        if (response.data.accessTokenExpiration)
          localStorage.setItem(
            "accessTokenExpiration",
            response.data.accessTokenExpiration,
          );
        return instance.request(originalRequest);
      } catch (e) {
        console.log("Unauthorized");
      }
    }
    throw error;
  },
);

export const http = instance;

export default http;
