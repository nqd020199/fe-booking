/* eslint-disable react-hooks/rules-of-hooks */
import { Option } from './types';

import { Event } from 'components/templates/CalendarCustom';
import { NoteItem } from 'components/templates/Table';
import { OptionDept } from 'services/Login/types';
import axiosInstance from 'services/common/instance';
import { TOKEN } from 'utils/constants';

export const slug = localStorage.getItem(TOKEN);

export const AddBookingService = async (data: Event) => {
  const response = await axiosInstance.post(`booking/add-booking/${slug} `, data);
  return response;
};

export const idUpdate = localStorage.getItem('idUpdate');

export const UpdateBookingService = async (data: Event) => {
  const response = await axiosInstance.put(`booking/update-booking/${idUpdate} `, data);
  return response;
};

export const DeleteBookingService = async (id: number) => {
  const response = await axiosInstance.delete(`booking/delete-booking/${id} `);
  return response;
};

export const GetBookingById = async (id: number): Promise<Event[]> => {
  const response = await axiosInstance.get(`booking/get-booking/${id}`);
  return response?.data?.content;
};

export const GetPersonalityById = async (id: number): Promise<Option[]> => {
  const response = await axiosInstance.get(`booking/get-personality/${id}`);
  return response?.data?.content;
};

export const getAllDepartment = async (): Promise<OptionDept[]> => {
  const response = await axiosInstance.get('booking/get-department');
  return response?.data?.content;
};

export const UpdateMaxTimeLineService = async (id: number, data: number) => {
  const response = await axiosInstance.put(`user/max-time/${id}?maxtime=${data}`,);
  return response;
};

export const UpdateMinTimeLineService = async (id: number, data: number) => {
  const response = await axiosInstance.put(`user/min-time/${id}?mintime=${data}`,);
  return response;
};

export const UpdateIndexRows = async (id: number, data: number) => {
  const response = await axiosInstance.put(`user/update-row/${id}`, { indexRow: data });
  return response;
};

export const getNoteById = async (id: number) => {
  const response = await axiosInstance.get(`user/get-note/${id}`);
  return response?.data?.content;
};

export const AddNoteItem = async (data: NoteItem) => {
  const response = await axiosInstance.post('user/create-note', data);
  return response?.data?.content;
};

export const updateNoteItem = async (id: number, data: NoteItem) => {
  const response = await axiosInstance.put(`user/update-note/${id}`, data);
  return response?.data?.content;
};

export const deleteNoteItem = async (id: number) => {
  const response = await axiosInstance.delete(`user/delete-note/${id}`);
  return response;
};

export const updateTimeNotify = async (id: number, data: boolean) => {
  const response = await axiosInstance.put(`user/update-isNotify/${id}`, { isNotify: data });
  return response;
};
