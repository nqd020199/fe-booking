/* eslint-disable consistent-return */
/* eslint-disable import/no-named-as-default */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';

import Button from 'components/atoms/Button';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import Typography from 'components/atoms/Typography';
import CardNotifyList, { NewsListCardProps } from 'components/molecules/CardNotifyList';
import Dropdown, { OptionsChild } from 'components/molecules/Dropdown';
import useClickOutside from 'hooks/useClickOutside';
import { getAllUserInfo } from 'services/Login';
import { OptionDept } from 'services/Login/types';
import { getNotification, updateNotification, updateNotificationSeenAll } from 'services/notification';
import { User } from 'services/types';
import { department } from 'store/department';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getAllUserAction, getRespSearch, getUserAction } from 'store/infouser';
import { TOKEN } from 'utils/constants';

export type ResponseSearch = {
  id_derp: number;
  id_user?: number;
  label?: string;
  value?: number;
};
interface HeaderProps {
  // nameUser?: string;
  nameApp?: string;
  toggleShowMenu?: () => void;
  optionsLanguage?: OptionsChild[];
  optionsProfile?: OptionsChild[];
  handleChangeLanguage?: (option: OptionsChild) => void;
  handleClickProfile?: (option: OptionsChild) => void;
  iconNameLanguage?: string;
  iconNameProfile?: string;
  nameLanguage?: string;
  nameUser?: string;
  CardList?: NewsListCardProps[],
  numberNotifi?: number
  deptBtn: string;
  loadingClickSearchItem?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  nameApp,
  toggleShowMenu,
  optionsLanguage,
  optionsProfile,
  handleChangeLanguage,
  handleClickProfile,
  iconNameLanguage,
  iconNameProfile,
  nameLanguage,
  nameUser,
  CardList,
  numberNotifi = 0,
  deptBtn,
  loadingClickSearchItem
}) => {
  const Guest = localStorage.getItem(TOKEN);
  const [isOpenNotify, setisShowNotify] = useState(false);
  const [isOpenDialogSearch, setisOpenDialogSearch] = useState(false);
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [listData, setListData] = useState([]);
  const [dataSearch, setDataSearch] = useState('');
  const navigate = useNavigate();
  const refSearch = useRef<HTMLDivElement>(null);
  const [isOpenBoxSearch, setIsOpenBoxSearch] = useState(false);
  const user = useAppSelector((state) => state.user.infuser);
  const [userData, setUserData] = useState(user);
  const [numNotifi, SetnumNotifi] = useState(numberNotifi);

  const toggleSearch = () => setIsOpenBoxSearch(true);
  useClickOutside(refSearch, () => {
    if (isOpenBoxSearch) setIsOpenBoxSearch(false);
  });
  useEffect(() => {
    dispatch(getAllUserAction());
  }, []);

  useEffect(() => {
    SetnumNotifi(numberNotifi);
  }, [numberNotifi]);

  const { mutate: searchDepartments } = useMutation(
    'post-footer-form',
    () => getAllUserInfo(),
    {
      onSuccess: (data) => {
        const dataDepartmentList = data.map((item) => (item.departments.length && { id: item.id_user, name: item.user_name, departments: item.departments }));
        const listSearch = dataDepartmentList.filter((item) => (item !== 0)).map((item: any) => (
          item.departments.map((department: any) => ({ id: item.id, name: item.name, department }))
        ));

        const list: any = [];
        if (dataSearch) {
          listSearch.flat(1).forEach((item) => {
            if (item?.department?.label.toLocaleLowerCase().search(dataSearch) !== -1) {
              if (item?.name !== userData?.user_name) {
                list.push(item);
              }
            }
          });
          setListData(list);
        } else {
          setListData(list);
        }
      },
      onError: () => {
      }
    }
  );

  useEffect(() => {
    searchDepartments();
  }, [dataSearch]);

  useEffect(() => {
    if (Guest !== 'GUEST') {
      setUserData(user);
    } else {
      setUserData({} as User);
    }
  }, [user, Guest]);

  const toggling = () => {
    setisShowNotify(!isOpenNotify);
  };

  useClickOutside(dropdownRef, () => {
    if (isOpenNotify) setisShowNotify(false);
  });

  const handleClickUser = async (user: any) => {
    setDataSearch('');
    if (userData?.id_user !== user.id) {
      sessionStorage.setItem('id_sidebar', (0).toString());
      return navigate(`/${user.id}/${user.department.label}`);
    }
    return navigate('/');
  };

  const { mutate: putnotifi } = useMutation(
    'put-notifiwatch',
    (id: number) => updateNotification(id),
    {
      onSuccess: () => {
        SetnumNotifi(0);
      },
      onError: () => {
      }
    }
  );
  const { mutate: putNotifySeenAll } = useMutation(
    'put-notifiwatch',
    (id: number) => updateNotificationSeenAll(id),
    {
      onSuccess: () => {
        getNotification(Number(userData?.id_user));
      },
      onError: () => {
      }
    }
  );

  useEffect(() => {
    if (isOpenNotify) {
      setTimeout(() => putnotifi(Number(Guest)), 3000);
    }
  }, [isOpenNotify, CardList]);

  return (
    <div className="t-header">
      <div className="t-header-wrapper">
        <div className="t-header-wrapper_left">
          <div
            className="t-header-wrapper_left-toggle"
            onClick={() => {
              if (toggleShowMenu) {
                toggleShowMenu();
              }
            }}
          >
            <Icon iconName="hamburger" isPointer />
          </div>
          <Link to="/">
            <div
              className="t-header-wrapper_left-name"
              onClick={() => {
                dispatch(getUserAction(Number(user?.id_user) || 0));
                dispatch(department(user?.departments[0] as OptionDept));
                sessionStorage.setItem('id_sidebar', (0).toString());
              }}
            >

              <Typography content={nameApp || 'my calendar'} type="span" modifiers={['blueNavy', 'uppercase', '24x36', '700']} />
            </div>
          </Link>
        </div>
        <div className="t-header-wrapper_right">
          <div className="t-header-wrapper_right-btn_dept t-header-wrapper_right_item">
            <Button
              modifiers={['primary']}
              onClick={() => {
                sessionStorage.setItem('id_sidebar', (5).toString());
                return navigate('/department');
              }}
              type="submit"
            >
              <Typography content={deptBtn} modifiers={['700', '16x24', 'uppercase']} />
            </Button>
          </div>
          <div className="t-header-wrapper_right-search t-header-wrapper_right_item" ref={refSearch} onClick={() => { toggleSearch(); }}>
            <Input
              id="search_id"
              variant="searchAnimate"
              type="text"
              value={dataSearch}
              iconName="search"
              iconSize="20x20"
              // placeholder={t('placeholder.search') || ''}
              onChange={(event) => { setDataSearch(event.target.value); }}
            />
            {dataSearch.length > 0 && isOpenBoxSearch && (
              <div className="t-header-wrapper_right-search_listSearch">
                {listData.length && listData.map((i: any, idx) => (
                  <div
                    key={`${idx.toString()}`}
                    className="t-header-wrapper_right-search_listSearch-item"
                    onClick={() => { handleClickUser(i); if (loadingClickSearchItem) loadingClickSearchItem(); }}
                  >
                    <Typography content={i.name} type="p" modifiers={['dimGray', '14x21', '700', 'capitalize']} />
                    <div className="t-header-wrapper_right-search_listSearch-item_depart">
                      <Typography content={i.department.label} type="span" modifiers={['dimGray', '14x21', '500']} />
                    </div>
                    <div />
                  </div>
                ))
                  || (
                    <Typography content={t('notify.search_no_data') || ''} type="span" modifiers={['dimGray', '14x21', '400']} />
                  )}
              </div>
            )}
          </div>
          <div className={`t-header-wrapper_right-search-mobile ${isOpenDialogSearch ? 'search-dialog' : ''}`}>
            <div
              className="t-header-wrapper_right-search-mobile-showSearch"
              onKeyDown={(event) => {
                if (event.code === 'Escape' || event.code === 'Enter') {
                  setisOpenDialogSearch(true);
                }
              }}
            >
              <Input
                id="search_id"
                variant="inputSearch"
                type="text"
                iconName="search"
                value={dataSearch}
                iconSize="24x24"
                placeholder={t('placeholder.search') || ''}
                onChange={(event) => setDataSearch(event.target.value)}
              />
              {dataSearch.length > 0 && (
                <div className="t-header-wrapper_right-search-mobile-showSearch_listSearch">
                  {listData.length && listData.map((i: any, idx) => (
                    <div
                      key={`${idx.toString()}`}
                      className="t-header-wrapper_right-search-mobile-showSearch_listSearch-item"
                      onClick={() => { handleClickUser(i); if (loadingClickSearchItem) loadingClickSearchItem(); }}
                    >
                      <Typography content={i.name} type="p" modifiers={['dimGray', '14x21', '700', 'capitalize']} />
                      <div className="t-header-wrapper_right-search-mobile-showSearch_listSearch-item_depart">
                        <Typography content={i.department.label} type="span" modifiers={['dimGray', '14x21', '500']} />
                      </div>
                      <div />
                    </div>
                  ))
                    || (
                      <Typography content={t('notify.search_no_data') || ''} type="span" modifiers={['dimGray', '14x21', '400']} />
                    )}
                </div>
              )}
              <div onClick={() => setisOpenDialogSearch(false)}>
                <Icon iconName="close" isPointer />
              </div>
            </div>
            <div onClick={() => setisOpenDialogSearch(true)}>
              <Icon iconName="search" isPointer />
            </div>
          </div>
          <div className="t-header-wrapper_right-language t-header-wrapper_right_item">
            <Dropdown
              optionsChild={optionsLanguage || []}
              handleClick={handleChangeLanguage}
              typeDropdown="dropDown"
              iconName={iconNameLanguage}
              name={nameLanguage}
            />
          </div>
          <div className="t-header-wrapper_right-notify t-header-wrapper_right_item" ref={dropdownRef} onClick={() => { setisShowNotify(!isOpenNotify); toggling(); }}>
            <Icon iconName="bell" isPointer />
            {numNotifi > 0
              && <span className="icon-button__badge">{numNotifi}</span>}
            {isOpenNotify && (
              <CardNotifyList
                title={t('notify.notify')}
                notifyList={CardList}
                handleClickDoneAll={() => putNotifySeenAll(Number(userData?.id_user))}
              />
            )}
          </div>
          <div className="t-header-wrapper_right-profile t-header-wrapper_right_item">
            <Dropdown
              optionsChild={optionsProfile || []}
              handleClick={handleClickProfile}
              typeDropdown="menu"
              iconName={iconNameProfile}
              isAvatar={!!userData?.image_url}
              img={userData?.image_url}
              name={nameUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

Header.defaultProps = {
};

export default Header;
