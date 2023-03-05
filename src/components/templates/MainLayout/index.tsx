/* eslint-disable import/order */
/* eslint-disable no-lonely-if */
/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Notifications } from 'react-push-notification';
import { useMutation } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import alarm from 'assets/images/alarmSVG.svg';
import booked from 'assets/images/bookingSVG.svg';
import Notify from 'assets/images/notify.png';
import { Option } from 'components/atoms/DropDownCheckbox/index';
import Icon, { IconName } from 'components/atoms/Icon';
import Loading from 'components/atoms/Loading';
import ToastNotify from 'components/atoms/ToastNotify';
import { NewsListCardProps } from 'components/molecules/CardNotifyList';
import { OptionsChild } from 'components/molecules/Dropdown';
import Header from 'components/templates/Header';
import SideBar, { OptionSideBar } from 'components/templates/SideBar';
import { OptionDept } from 'services/Login/types';
import { getNotification, updateNotificationSeenItem } from 'services/notification';
import { department } from 'store/department';
import { homePage, increment, incrementSetShowSidebar } from 'store/example';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getUserAction } from 'store/infouser';
import { SOCKET, TOKEN, USER_LOGIN } from 'utils/constants';
import 'moment/locale/ko';
import mapModifiers, { pushNotifications } from 'utils/functions';

interface MainLayoutProps {
  children?: React.ReactNode;
  isCalendarLayout?: boolean;
  isShowBarLayout?: boolean;
}

export const optionsLanguage = [
  {
    id: 1, name: 'English', acronym: 'EN', IconName: 'England'
  },
  {
    id: 2, name: 'Tiếng Việt', acronym: 'VI', IconName: 'VietNam'
  },
  {
    id: 3, name: '한국어', acronym: 'KO', IconName: 'Korea'
  },
];
const CardList = [
  {
    imgSrc: Notify, title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor', href: 'youtobe', nameUser: 'Admin', date: new Date(),
  },
  {
    imgSrc: Notify, title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ,tempor', href: 'youtobe', nameUser: 'Admin', date: new Date(),
  },
  {
    imgSrc: Notify, title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ,tempor', href: 'youtobe', nameUser: 'Admin', date: new Date(),
  },
];
export const optionSideBar = [
  {
    id: 0, icon: 'calendar_white', title: 'menu.my_calendar', child: false, slug: '/',
  },
  {
    id: 1, icon: 'tag', title: 'menu.coupon_management', child: false, slug: '/comming-soon/coupon',
  },
  {
    id: 4,
    icon: 'message',
    title: 'menu.message',
    child: false,
    slug: '/comming-soon/message',
    // itemChild: [
    //   {
    //     id: 1, icon: 'England', title: 'my calendar', child: false,
    //   },
    //   {
    //     id: 2, icon: 'VietNam', title: t('menu.coupon_management'), child: false,
    //   },
    //   {
    //     id: 3, icon: 'Korea', title: 'Setting', child: false,
    //   },
    // ]
  },
  {
    id: 5, icon: 'department_list', title: 'popup.dept', child: false, slug: '/department',
  },

  {
    id: 6, icon: 'setting', title: 'menu.setting', child: false, slug: '/setting',
  },
];
export const optionSideBarMobile = [
  {
    id: 1, icon: 'calendar_white', title: 'menu.my_calendar', child: false, slug: '/',
  },
  // {
  //   id: 2, icon: 'tag', title: 'menu.coupon_management', child: false, slug: '/comming-soon/coupon',
  // },
  // {
  //   id: 3,
  //   icon: 'message',
  //   title: 'menu.message',
  //   child: true,
  //   slug: '/message',
  //   itemChild: [
  //     {
  //       id: 1, icon: 'England', title: 'my calendar', child: false,
  //     },
  //     {
  //       id: 2, icon: 'VietNam', title: 'coupon management', child: false,
  //     },
  //     {
  //       id: 3, icon: 'Korea', title: 'Setting', child: false,
  //     },
  //   ]
  // },
  {
    id: 4, icon: 'department_list', title: 'popup.dept', child: false, slug: '/department',
  },
  {
    id: 5, icon: 'setting', title: 'menu.setting', child: false, slug: '/setting',
  },
  {
    id: 6, icon: 'logout', title: 'menu.logout', child: false, slug: '/authen/login',
  },
];
export const showBarContext = React.createContext(false);

const MainLayout: React.FC<MainLayoutProps> = ({ children, isCalendarLayout, isShowBarLayout = false }) => {
  const languageRedux = useAppSelector((state) => state.example.language);
  const user = useAppSelector((state) => state.user.infuser);
  const [userData, setUserData] = useState(user);
  const [userName, setName] = useState(user?.user_name);
  const currLanguageClone = sessionStorage.getItem('currLanguage');

  const [cloneShowSideBar, setCloneShowSideBar] = useState(isCalendarLayout);
  const [languageLocal, setLanguageLocal] = useState(languageRedux);
  const [showSideBar, setShowSideBar] = useState(false);
  const [language, setLanguage] = useState(languageLocal.acronym);
  const [iconNameLanguage, setIconNameLanguage] = useState<IconName>(languageLocal.IconName as IconName);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const navigator = useNavigate();
  const location = useLocation();
  const [width, setWidth] = useState(window.innerWidth);
  const [isActiveSideBarMobile, setIsActiveSideBarMobile] = useState(false);
  const dispatch = useAppDispatch();
  const heigthSidebar = sessionStorage.getItem('height_calendar');
  const [hieghtCalen, setHieghtCalen] = useState(heigthSidebar);
  const getHeightCalendar = useRef<HTMLDivElement>(null);
  const [notifiList, setNotifilist] = useState([]);
  const [countNotifi, setCountNotifi] = useState(0);
  const [cardListnotify, setCardListnotify] = useState<NewsListCardProps[]>([]);
  const [depath, setPepath] = useState<OptionDept>();
  const [cloneIsShowBarLayout, setCloneIsShowBarLayout] = useState(isShowBarLayout);
  const Guest2 = localStorage.getItem(USER_LOGIN);
  const Guest = localStorage.getItem(TOKEN);

  useEffect(() => {
    if (currLanguageClone) {
      return setLanguageLocal(JSON.parse(currLanguageClone || '') as OptionsChild);
    }
    return setLanguageLocal(languageRedux);
  }, []);

  useEffect(() => {
    setLanguage(languageLocal?.acronym);
    setIconNameLanguage(languageLocal?.IconName as IconName);
    i18n.changeLanguage(languageLocal?.acronym);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    // hiển thị lại width
    window.addEventListener('resize', handleResize);
    // clean up để fix lỗi toggle
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem('isShowPoup', showSideBar.toString());
  }, [showSideBar]);

  const { mutate: getnotification } = useMutation(
    ['getAllTrackings'],
    (id: number) => getNotification(id),
    {
      onSuccess(data) {
        setNotifilist(data?.content);
      },
      onError() {
      },
    },
  );

  useEffect(() => {
    const count = notifiList.filter((acc: any) => acc?.status === false);
    setCountNotifi(count.length);
  }, [notifiList]);

  useEffect(() => {
    if (Guest !== 'GUEST') {
      if (Guest2 !== null) {
        const { content } = JSON.parse(localStorage.getItem(USER_LOGIN) || '');
        dispatch(getUserAction(Number(Guest) || 0));
        setName(content?.user_name);
      }
    } else {
      const Guest3 = JSON.parse(localStorage.getItem(USER_LOGIN) || '');
      setName(Guest3.user_name);
    }
  }, [Guest]);

  useEffect(() => {
    if (Guest !== 'GUEST') {
      getnotification(Number(Guest));
      setUserData(user);
      SOCKET?.emit('newUser', userData);
    } else {
      setUserData(undefined);
    }
    setHieghtCalen(heigthSidebar);
  }, [user, Guest]);

  const { mutate: putnotifySeen } = useMutation(
    'put-notifiwatch',
    (id: number) => updateNotificationSeenItem(id),
    {
      onSuccess: () => {
        getnotification(Number(Guest));
      },
      onError: () => {
      }
    }
  );

  useEffect(() => {
    const checkLanguage = optionsLanguage.find((element) => element.acronym === languageLocal.acronym);
    if (currLanguageClone && languageLocal.acronym === JSON.parse(currLanguageClone || '').acronym) {
      setLanguage(checkLanguage?.acronym || '');
      setIconNameLanguage(checkLanguage?.IconName as IconName);
      i18n.changeLanguage(languageLocal.acronym);
    }
  }, [i18n.language, languageLocal]);

  useEffect(() => {
    if (width < 1010) {
      setIsActiveSideBarMobile(true);
    }
  }, [width]);
  useEffect(() => {
    if (width <= 1025 && !isCalendarLayout) {
      setShowSideBar(false);
      setCloneShowSideBar(true);
      setCloneIsShowBarLayout(false);
    }
  }, [width]);
  useEffect(() => {
    if (width > 1024 && !isCalendarLayout) {
      setCloneShowSideBar(false);
      setCloneIsShowBarLayout(isShowBarLayout);
    }
  }, [width]);

  useEffect(() => {
    if (width > 1010) { setIsActiveSideBarMobile(false); }
  }, [width]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [loading]);

  useEffect(() => {
    if (location.pathname && (location.pathname !== '/' && location.pathname !== '/authen/login')) {
      localStorage.setItem('urlStore', location.pathname);
    }
    if (!localStorage.getItem(USER_LOGIN) && loading) {
      if (location.pathname !== '/') {
        dispatch(homePage(location.pathname));
      }
      navigator('/authen/login');
    }
  }, [loading, location]);

  useEffect(() => {
    const getUrl = localStorage.getItem('urlStore');
    if (Guest === 'GUEST' && getUrl) {
      navigator(getUrl);
    }
  }, []);

  const handleClick = (option: OptionsChild) => {
    dispatch(increment(option));
    setIconNameLanguage(option.IconName as IconName);
    setLanguage(option.acronym || 'KO');
    i18n.changeLanguage(option.acronym);
    sessionStorage.setItem('currLanguage', JSON.stringify(option));
  };

  const handelLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    dispatch(department({
      value: 0, label: '', email_depart: '', phoneNumber: '',
    }));
    navigator('/authen/login');
  };

  const handleShowSideBar = () => {
    if (cloneShowSideBar || isCalendarLayout) {
      setShowSideBar(!showSideBar);
      dispatch(incrementSetShowSidebar(!showSideBar));
      return showSideBar;
    }
    return false;
  };

  const optionsProfile = [
    { id: 0, name: t('menu.my_profile'), slug: '/setting' },
    {
      id: 0, name: t(Guest === 'GUEST' ? 'login.login' : 'menu.logout'), slug: '/authen/login', click: handelLogout
    }
  ];

  useEffect(() => {
    SOCKET?.on('getNotification', ({
      id_user, type, data
    }) => {
      const person = data?.res_per
        && data?.res_per?.length > 0
        ? data.res_per?.map((d: Option) => d.label).join(',  ') : [data?.res_bk?.detail];

      const close = <Icon iconName="close" />;

      const booking = `${data.res_der?.label.length > 24 ? `${data.res_der?.label.slice(0, 24)}...` : data.res_der?.label} - ${moment(data.res_bk.start).locale(languageLocal.acronym?.toLowerCase() as string).format('MMMM/Do')
        }  ${moment(data.res_bk.start).format('hh:mm')} ~${moment(data.res_bk.end).locale('ko').format('hh:mm')} ${t('notify.booked')} ${person?.toString().length ? person?.toString().length > 30 ? `${person?.toString().slice(0, 30)}...` : person?.toString() : 'Guest'} `;

      const ala = `${t('notify.alarm')} ${data.res_der?.label.length > 24 ? `${data.res_der?.label.slice(0, 24)}...` : data.res_der?.label} ${t('notify.schedule')} ${t('notify.requester')} ${person?.toString().length ? person?.toString().length > 30 ? `${person?.toString().slice(0, 30)}...` : person.toString() : 'Guest'} `;

      if (id_user === Number(Guest)) {
        // notifyMe();
        pushNotifications(
          '',
          `${(type === 1 || type === 3) ? booking : ala} `,
          `${(type === 1 || type === 3) ? booked : alarm} `,
          close as unknown as string,
          'castis.world'
        );
      }
      getnotification(Number(Guest) || 0);
    });
  }, [SOCKET]);

  useEffect(() => {
    if (depath) dispatch(department(depath));
  }, [depath]);

  const handleClickNotify = (dep: OptionDept, isCheck: boolean, id: number) => {
    setPepath(dep);
    dispatch(getUserAction(Number(Guest) || 0));
    if (isCheck) putnotifySeen(id);
  };

  useEffect(() => {
    const list = notifiList.map((notifi: any) => {
      const person = notifi?.persionality_notifies
        && notifi?.persionality_notifies?.length > 0
        ? notifi.persionality_notifies?.map((d: Option) => d.label).join(',  ') : [notifi?.detail];
      if (notifi.type === 1) {
        return {
          imgSrc: booked,
          nameUser: '',
          title: `<strong> ${notifi?.department && notifi?.department?.length > 24 ? `${notifi.department?.slice(0, 24)}...` : notifi.department}</strong > - ${moment(notifi.start).locale(languageLocal.acronym?.toLowerCase() as string).format('MMMM/Do')} <br />
          ${moment(notifi.start).format('hh:mm')} ~${moment(notifi.end).locale('ko').format('hh:mm')}  ${t('notify.booked')} <br/>
           <strong> ${person?.toString().length ? person?.toString().length > 30 ? `${person?.toString().slice(0, 30)}...` : person?.toString() : 'Guest'}</strong>`,
          date: notifi.today,
          handleClick: () => handleClickNotify(notifi?.department_notifies[0], notifi.isRead, notifi.id_notify),
          href: '/',
          isVertical: notifi.isRead
        };
      } if (notifi.type === 3) {
        return {
          imgSrc: booked,
          nameUser: '',
          title: `<strong > ${notifi?.department && notifi?.department?.length > 24 ? `${notifi.department?.slice(0, 24)}...` : notifi.department}</strong > -
  ${moment(notifi.start).locale(languageLocal.acronym?.toLowerCase() as string).format('MMMM/Do')} <br />
          ${moment(notifi.start).format('hh:mm')} ~${moment(notifi.end).format('hh:mm')} ${t('notify.booked')} <br/>
          <strong> ${person?.toString().length ? person?.toString().length > 30 ? `${person?.toString().slice(0, 30)}...` : person?.toString() : 'Guest'}</strong>`,
          date: notifi.today,
          handleClick: () => handleClickNotify(notifi?.department_notifies[0], notifi.isRead, notifi.id_notify),
          href: '/',
          isVertical: notifi.isRead
        };
      }
      return {
        imgSrc: alarm,
        nameUser: '',
        title: `${t('notify.alarm')} <strong > ${notifi.department}</strong > ${t('notify.schedule')} <strong><br />${t('notify.requester')} </strong> ${person?.toString().length ? person?.toString().length > 30 ? `${person?.toString().slice(0, 30)}...` : person.toString() : 'Guest'} `,
        date: notifi.today,
        handleClick: () => handleClickNotify(notifi?.department_notifies[0], notifi.isRead, notifi.id_notify),
        href: '/',
        isVertical: notifi.isRead
      };
    });
    setCardListnotify(list as NewsListCardProps[]);
  }, [notifiList, languageLocal]);

  return (
    <div>
      <ToastNotify />
      <Notifications position="bottom-right" />
      <div className="t-layout">
        <div className={`t - layout_wrapper  ${showSideBar ? 'showfull' : ''} `}>
          {showSideBar && isActiveSideBarMobile && width < 440 && (<span className="t-layout-mobile_overlay" onClick={handleShowSideBar} />)}
          {isActiveSideBarMobile && (
            <div className="t-layout_wrapper_sidebar-mobile">
              <SideBar
                optionSideBar={optionSideBarMobile as OptionSideBar[]}
                nameUser={userData?.user_name || 'GUEST'}
                handleOffSideBar={handleShowSideBar}
                mainLayout
                cloneShowSideBar={cloneShowSideBar || false}
                imageUser={userData?.image_url && userData?.image_url}
              />
            </div>
          )}
          <div className="t-layout_wrapper_header">
            <Header
              nameApp={t('homepage.name_page') || ''}
              toggleShowMenu={handleShowSideBar}
              optionsLanguage={optionsLanguage}
              optionsProfile={Guest === 'GUEST' ? optionsProfile.splice(1) as OptionsChild[] : optionsProfile as OptionsChild[]}
              handleChangeLanguage={handleClick}
              iconNameLanguage={iconNameLanguage}
              nameLanguage={language}
              nameUser={userName || 'GUEST'}
              CardList={cardListnotify}
              numberNotifi={countNotifi}
              deptBtn={t('homepage.dep_list')}
              loadingClickSearchItem={() => { setLoading(true); }}
            />
          </div>
          <div className={mapModifiers('t-layout_wrapper_main', showSideBar ? 'showbar' : (cloneIsShowBarLayout && 'showbar'))}>
            {width > 440 && (
              <div className="t-layout_wrapper_main_sidebar" ref={getHeightCalendar}>
                <SideBar
                  optionSideBar={width > 530 ? optionSideBar as OptionSideBar[] : [...optionSideBar, {
                    id: 9, icon: 'logout', title: 'menu.logout', child: false, slug: '/authen/login',
                  }] as OptionSideBar[]}
                  nameUser={userData?.user_name || 'GUEST'}
                  handleOffSideBar={handleShowSideBar}
                  mainLayout
                  cloneShowSideBar={cloneShowSideBar || false}
                  imageUser={userData?.image_url && userData?.image_url}
                />
              </div>
            )}
            <div className="t-layout_wrapper_main_child">
              {loading ? <Loading variant="fullScreen" isShow size="medium" />
                : (
                  children
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

MainLayout.defaultProps = {
  children: undefined,
  isCalendarLayout: false,
};

export default MainLayout;
