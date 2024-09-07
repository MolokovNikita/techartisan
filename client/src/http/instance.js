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
    const accesToken = window.localStorage.getItem("accessToken") || "";
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
    if (response.status === 200) {
      return response;
    } else {
      if (messages) {
        if (messages instanceof Array) {
          return Promise.reject({ messages });
        }
        return Promise.reject({ messages: [messages] });
      }
      return Promise.reject({ messages: ["got errors"] });
    }
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
    } else if (error.response && error.response.status === 500) {
      return Promise.reject(error.response);
    } else return Promise.reject(error);
  },
);

export const http = instance;

export default http;
