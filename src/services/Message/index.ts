import { UpdateMediaTypes } from 'components/templates/ContentMessages';
import axiosInstance from 'services/common/instance';

const getContactAllUserMessageServices = async (id: number) => {
  const response = await axiosInstance.get(`message/get-contacts-all/${id}`);
  return response.data.content;
};

export const getContactUserChatServices = async (id: number, id_receive: number) => {
  const response = await axiosInstance.get(`message/get-contacts/${id}/${id_receive}`,);
  return response.data.content;
};

export const postMessageTextService = async (id: number, data: any) => {
  const response = await axiosInstance.post(`message/send-mess/${id}`, data);
  return response.data;
};

export const postMessageFileService = async (id: number, data: UpdateMediaTypes) => {
  const dataTemp = new FormData();
  dataTemp.append('files', data.file);
  dataTemp.append('idUser', data.idUser as unknown as string);
  dataTemp.append('id_user_send', data.id_user_send as unknown as string);
  dataTemp.append('id_user_receive', data.id_user_receive as unknown as string);

  const response = await axiosInstance.post(`message/send-media/${id}`, dataTemp);
  return response.data;
};
export const postMessageImageService = async (id: number) => {
  const response = await axiosInstance.post(`message/send-image/${id}`);
  return response.data;
};

export const putSeenMessage = async (id: number) => {
  const response = await axiosInstance.put(`message/send-status/${id}`);
  return response;
};

export default getContactAllUserMessageServices;
