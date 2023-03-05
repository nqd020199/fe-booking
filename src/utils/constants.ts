import { io } from 'socket.io-client';

export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const SOCKET = io(process.env.REACT_APP_API_BASE_SOCKET || '');

export const LOCAL_STORAGE = {
  LANGUAGE: 'NVS_Language',
  ACCESS_TOKEN: 'NVS_AccessToken',
};

// export const CONSTANT_LANGUAGE_LIST = ['vi', 'en'];
// export const CONSTANT_LANGUAGE_KEY_LIST: LanguageKey[] = CONSTANT_LANGUAGE_LIST as LanguageKey[];

export const DEFAULT_QUERY_OPTION = {
  retry: 0,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

export const MENU_CODE = {
  MENU_HEADER: 'header',
  MENU_FOOTER: 'footer',
  MENU_PDFLIST: 'pdf-list',
};

export type ConstantRoutesCodes = keyof typeof CONSTANT_ROUTES;
export type ConstantRoutesType = typeof CONSTANT_ROUTES;

export const CONSTANT_ROUTES = {
  HOME: '',
  // ABOUT_US: 've-chung-toi',
  // CONTACT: 'lien-he',
  SEARCH_RESULTS: 'tim-kiem',
  RECRUITMENT: 'tuyen-dung',
  NEWS: 'tin-tuc',
  NEWS_DETAIL: 'chi-tiet-tin-tuc',
  // POLICY_TERMS: 'chinh-sach-dieu-khoan',
  TRADEMARK: 'thuong-hieu',
  ERROR_404: '404',
  NOVAID: 'novaid'
};

export const CONSTANT_ROUTES_EN: ConstantRoutesType = {
  HOME: '',
  // ABOUT_US: 'about-us',
  // CONTACT: 'contact-us',
  SEARCH_RESULTS: 'search',
  RECRUITMENT: 'recruitment',
  NEWS: 'news',
  NEWS_DETAIL: 'news-detail',
  // POLICY_TERMS: 'policy',
  TRADEMARK: 'trademark',
  ERROR_404: '404',
  NOVAID: 'novaid'
};

// export type LanguageKey = keyof LocalesType;

// export type LocalesType = {
//   vi: LocalesItem,
//   en: LocalesItem,
// };
export const USER_LOGIN = 'USER_LOGIN';
export const TOKEN = 'accessToken';
export const IMAGEREGEX = /.(jpg|jpeg|png|gif|bmp|webp)$/i;
export const VIDEOREGEX = /.(m4v|avi|mpg|mp4|webm)$/i;
export const AUDIOREGEX = /.(mp3|wav)$/i;
