/* eslint-disable import/prefer-default-export */
import axiosInstance from 'services/common/instance';
import { NotifyType } from 'services/notification/types';

export const updateNotification = async (id: number) => {
  const response = await axiosInstance.put(`user/notification-update/${id}`);
  return response;
};

export const deleteNotification = async (id: number) => {
  const response = await axiosInstance.delete(`user/delete-notify/${id}`);
  return response;
};

export const getNotification = async (id: number) => {
  const response = await axiosInstance.get(`user/get-notify/${id}`);
  return response.data;
};

export const postNotification = async (id: number, data: NotifyType) => {
  const response = await axiosInstance.post(`/booking/notification-socket/${id}`, data);
  return response;
};
export const updateNotificationSeenItem = async (id: number) => {
  const response = await axiosInstance.put(`user/isRead-one-update/${id}`);
  return response;
};
export const updateNotificationSeenAll = async (id: number) => {
  const response = await axiosInstance.put(`user/isRead-all-update/${id}`);
  return response;
};
