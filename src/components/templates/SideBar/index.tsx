/* eslint-disable react/jsx-indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useState, useRef, useEffect, useMemo
} from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import logo from 'assets/images/image_default.png';
import Icon, { IconName } from 'components/atoms/Icon';
import Image from 'components/atoms/Image';
import Typography from 'components/atoms/Typography';
import useClickOutside from 'hooks/useClickOutside';
import { incrementSetIdSideBar, incrementSetShowSidebar } from 'store/example';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { TOKEN, USER_LOGIN } from 'utils/constants';

export type OptionSideBar = {
  id?: number;
  icon?: IconName;
  title?: string;
  child?: boolean;
  itemChild?: OptionSideBar[];
  slug: string;
};

interface SideBarProps {
  imageUser?: string;
  nameUser?: string;
  optionSideBar: OptionSideBar[];
  handleOffSideBar?: () => void;
  mainLayout: boolean;
  cloneShowSideBar: boolean;
}

const SideBar: React.FC<SideBarProps> = ({
  imageUser,
  nameUser,
  optionSideBar,
  handleOffSideBar,
  mainLayout,
  cloneShowSideBar,
}) => {
  const showbar = useAppSelector((state) => state.example.isShowSideBar);
  const idSideBarActive = useAppSelector((state) => state.example.idSideBar);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const sidebarSession = sessionStorage.getItem('id_sidebar');
  const Guest = localStorage.getItem(TOKEN);
  const [idActive, setIdActive] = useState<number>(0);
  const currUrl = window.location.pathname;
  const [cloneUrl, setUrl] = useState(currUrl);
  const [isCloseSkeleton, setIsCloseSkeleton] = useState(false);
  const listCheck = ['/setting', '/department', '/message', '/comming-soon/message', '/comming-soon/coupon'];

  const { t } = useTranslation();
  const navigator = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setUrl(window.location.pathname);
    dispatch(incrementSetShowSidebar(false));
  }, [currUrl]);

  useEffect(() => {
    setTimeout(() => {
      setIsCloseSkeleton(true);
    }, 2000);
  }, [isCloseSkeleton]);

  useEffect(() => {
    setIdActive(Number(idSideBarActive));
  }, [idSideBarActive]);

  useEffect(() => {
    setIdActive(Number(sidebarSession));
  }, []);

  const toggling = (item: boolean) => {
    if (item) { setIsOpen(!isOpen); }
  };
  useClickOutside(dropdownRef, () => {
    if (isOpen) setIsOpen(false);
  });

  const handleCheckPage = () => listCheck.includes(cloneUrl);

  return (
    <div className="t-sidebar">
      <div className="t-sidebar_wrapper">
        <div className="t-sidebar_wrapper_header">
          <div className="t-sidebar_wrapper_header-wrapper ">
            {Guest !== 'GUEST' && (
              !!imageUser && isCloseSkeleton && (
                <Image src={imageUser || logo} ratio="112x63" />
              ) || (
                !imageUser && (
                  <Image src={logo} ratio="112x63" />
                )
                || <span className="t-sidebar_wrapper_header-wrapper_loading t-sidebar_wrapper_header-wrapper_loading_avatar" />
              )
            )}
            {Guest === 'GUEST' && !isOpen && (<Image src={logo} ratio="112x63" />)}
            {!!nameUser && isCloseSkeleton && (
              <div className="t-sidebar_wrapper_header-wrapper_title">
                <Typography content={`Hi ${nameUser || 'User'}`} modifiers={['white', 'capitalize', '20x30', '700']} />
                <Typography content="nice to meet you!" modifiers={['white', 'capitalize', '16x24', '700', 'left']} />
              </div>
            ) || (
                <>
                  <span className="t-sidebar_wrapper_header-wrapper_loading t-sidebar_wrapper_header-wrapper_loading_name" />
                  <span className="t-sidebar_wrapper_header-wrapper_loading t-sidebar_wrapper_header-wrapper_loading_hi" />
                </>
              )}
          </div>
          {
            cloneShowSideBar && (
              <div className="t-sidebar_wrapper_header_off-sidebar" onClick={handleOffSideBar}>
                <Icon iconName="chevronLeft" size="16x16" isPointer />
              </div>
            )
          }
        </div>
        <div className={`t-sidebar_wrapper_content ${!handleCheckPage() && 'page_active'}`}>
          {
            optionSideBar.length && optionSideBar.map((sidebar) => (
              <Link to={sidebar.slug} key={sidebar.id}>
                <div
                  className={`t-sidebar_wrapper_content_item ${(idActive === sidebar.id) ? 'item_actives' : ''}`}
                  onClick={() => {
                    toggling(sidebar.child || false);
                    if (sidebar.icon === 'logout') {
                      localStorage.removeItem(USER_LOGIN);
                      localStorage.removeItem(TOKEN);
                      localStorage.removeItem('showPopup');
                      navigator('/authen/login');
                      // window.location.reload();
                    }
                    sessionStorage.setItem('id_sidebar', (sidebar.id || 0).toString());
                    dispatch(incrementSetIdSideBar(sidebar.id || 0));
                  }}
                >
                  <div
                    className="t-sidebar_wrapper_content_item_title"
                  >
                    <Icon iconName={sidebar.icon as IconName} size="30x30" isPointer />
                    <Typography content={t((sidebar.title || '').toString()) || ''} modifiers={['white', 'capitalize', '16x24', '700']} />
                  </div>
                  {sidebar.child ? (
                    <div>
                      <Icon
                        iconName="chevronRight"
                        size="16x16"
                        isPointer
                      />
                      {isOpen && (
                        <div key={sidebar.id} className="t-sidebar_wrapper_content_item-child">
                          {sidebar.itemChild?.length && sidebar.itemChild?.map((item) => (
                            <div key={item.id} className="t-sidebar_wrapper_content_item-child_item" onClick={() => toast.info(t('homepage.under_development'))}>
                              <Icon iconName={item.icon as IconName} size="36x36" isPointer />
                              <Typography content={item.title} type="p" modifiers={['blueNavy', 'capitalize', '20x30', '700']} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </Link>
            ))
          }
        </div>
      </div>

    </div>
  );
};

SideBar.defaultProps = {
};

export default SideBar;
