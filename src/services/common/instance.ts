import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { getAccessToken, removeAccessToken } from './storage';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  ($config: AxiosRequestConfig): AxiosRequestConfig => {
    if ($config.headers) {
      const token = getAccessToken();
      if (token) {
        $config.headers.Authorization = `Bearer ${token}`;
      }
      $config.headers['Content-Type'] = 'application/json';
      $config.headers.Accept = 'application/json';
    }
    return $config;
  },
  async (error: AxiosError): Promise<AxiosError> => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<AxiosError> => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          window.location.href = '/authen/login';
          removeAccessToken();
          return Promise.reject(
            (error.response.data as { content: any }).content
          );
        case 422:
          return Promise.reject(
            (error.response.data as { content: any }).content
          );
        default:
          return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
