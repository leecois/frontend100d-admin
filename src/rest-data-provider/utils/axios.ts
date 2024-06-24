import type { HttpError } from '@refinedev/core';
import axios from 'axios';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'LEECOIS-AUTH';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get(TOKEN_KEY);
    if (token) {
      const modifiedConfig = { ...config };
      modifiedConfig.headers.Authorization = `Bearer ${token}`;
      return modifiedConfig;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    };

    return Promise.reject(customError);
  },
);

export { axiosInstance };
