/* eslint-disable import/no-cycle */
/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
import {
  LoginTypes, SignUpTypes, ForgotServiceType, ChangePassServiceType, OptionDept
} from './types';

import { Option } from 'components/atoms/DropDownCheckbox';
import { UpdateAvatarTypes } from 'components/templates/Account';
import axiosInstance from 'services/common/instance';
import { SeclectType, User } from 'services/types';

export const loginService = async (data: LoginTypes) => {
  const response = await axiosInstance.post('user/login', data);
  return response.data;
};

export const signupService = async (data: SignUpTypes) => {
  const response = await axiosInstance.post('user/sigup-user', data);
  return response.data;
};
export const forgotService = async (data: ForgotServiceType) => {
  const response = await axiosInstance.post('user/forgot-pass', data);
  return response;
};

export const UpdatePassWordService = async (data: ChangePassServiceType) => {
  const response = await axiosInstance.post('user/change-pass ', data);
  return response;
};

export const updateUserService = async (id: number, data: SignUpTypes) => {
  const response = await axiosInstance.put(`user/update-user/${id}`, data);
  return response;
};

export const getUserInfo = async (id: number): Promise<User> => {
  const response = await axiosInstance.get(`/user/get-user/${id}`);
  return response.data?.content;
};

export const hidePopup = async (id: number, data: boolean) => {
  const response = await axiosInstance.put(`/user/skip-show/${id}`, { isShow: data });
  return response.data;
};

export const getOtherUserInfo = async (id: number): Promise<User> => {
  const response = await axiosInstance.get(`/user/orther-user/${id}`);
  return response.data?.content;
};
export const getAllUserInfo = async (): Promise<User[]> => {
  const response = await axiosInstance.get('/user/get-user');
  return response.data?.content;
};

export const updateServiceType = async (id: number, data: SeclectType[]) => {
  const response = await axiosInstance.put(`booking/update-select/${id}`, data);
  return response;
};

export const updateDepartmentType = async (id: number, data: OptionDept) => {
  const response = await axiosInstance.put(`booking/update-department/${id}`, data);
  return response;
};
export const updateDepartmentById = async (id: number, data: OptionDept) => {
  const response = await axiosInstance.put(`booking/update-department-new/${id}`, data);
  return response;
};
export const deleteDepartmentById = async (data: number) => {
  const response = await axiosInstance.delete(`booking/delete-department/${data}`);
  return response;
};

export const updatePersionalitySevice = async (id: number, data: Option[]) => {
  const response = await axiosInstance.put(`booking/update-persional/${id}`, data);
  return response;
};

export const updateImageService = async (id: number, data: UpdateAvatarTypes) => {
  const dataTemp = new FormData();
  dataTemp.append('image_url', data.image_url);
  const response = await axiosInstance.put(`user/upimg/${id}`, dataTemp);
  return response;
};

export const searchDepartment = async (data: string) => {
  const response = await axiosInstance.get(`user/search-department?search=${data}`);
  return response.data?.content;
};

export const updateUserMail = async (id: number, data: SignUpTypes) => {
  const response = await axiosInstance.put(`user/update-email-user/${id}`, data);
  return response.data;
};
