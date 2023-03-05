/* eslint-disable react/jsx-indent */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-cycle */
import moment from 'moment';
import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { number } from 'yup';

import { Event } from './index';

import { Option } from 'components/atoms/DropDownCheckbox';
import Typography from 'components/atoms/Typography';
import { useAppSelector } from 'store/hooks';
import { TOKEN } from 'utils/constants';
import mapModifiers from 'utils/functions';

const Component = (event: Event) => {
  const Otheruser = useAppSelector((state) => state.otherUser.otherUser);
  const user = useAppSelector((state) => state.user.infuser);

  const Guest = localStorage.getItem(TOKEN);
  const [hidden, setHidden] = useState(true);
  const [top, setTop] = useState(true);
  const [right, setRight] = useState(true);
  const [myBooking, setMyBooking] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [checkDepartment, setCheckDepartment] = useState<any>();
  const Savedepartment = useAppSelector((state) => state.deparment.department);

  const listCheck = ['/setting', '/department', '/comming-soon/message', '/comming-soon/coupon', '/'];
  const currUrl = window.location.pathname;
  const [cloneUrl, setUrl] = useState(currUrl);
  const { t } = useTranslation();

  useEffect(() => {
    setUrl(window.location.pathname);
  }, [currUrl]);

  const handleCheckPage = () => listCheck.includes(cloneUrl);

  useEffect(() => {
    if (event?.event?.department?.value === Savedepartment?.value) {
      setCheckDepartment(true);
    } else {
      setCheckDepartment(false);
    }
  }, [Savedepartment, user]);

  useEffect(() => {
    if (event?.event?.id_user === Number(Guest)
      && (event.event.id_orther_user === null
        || event.event.id_orther_user === Number(Guest))
      && !event?.event.isCheck) {
      setMyBooking(true);
    } else {
      setMyBooking(false);
    }
  }, [Guest, event]);

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
  const eventRef = useRef<any>(null);

  useEffect(() => {
    const position = eventRef.current.getBoundingClientRect();
    if (position.right < width && position.left > width - eventRef.current.offsetWidth - 10) {
      setRight(false);
    }
  }, [width]);
  const onHover = useCallback(() => {
    const position = eventRef.current.getBoundingClientRect();
    setHidden(false);
    if (position.top > 370) {
      setTop(false);
    }
    if (width < 1900 && width > 1400) {
      if (position.right < width && position.left > width - 300) {
        setRight(false);
      }
    } else if (width < 1400) {
      if (position.right < width && position.left > width - eventRef.current.offsetWidth - 10) {
        setRight(false);
      }
    }
  }, [event]);

  return (
    <div
      onMouseLeave={() => { setTop(true); setHidden(true); }}
      onMouseMove={() => {
        if (
          (!!event.event?.personality?.length && event.event?.id_orther_user === null && event.event?.id_user === null && checkDepartment && !handleCheckPage())
          || (!!event.event?.personality?.length && event.event?.id_orther_user === null && event.event?.id_user === null && !checkDepartment && !handleCheckPage())// 7
          || (!!event.event?.personality?.length && event.event?.id_orther_user === Number(Guest) && event.event?.id_user === Number(Guest) && !checkDepartment && !handleCheckPage())// 7
          || (!!event.event?.personality?.length && event.event?.id_orther_user !== Number(Guest) && event.event?.id_user !== Number(Guest) && event.event?.id_orther_user === event.event?.id_user && checkDepartment && !handleCheckPage())// 7
          || (!!event.event?.personality?.length && event.event?.id_orther_user !== Number(Guest) && event.event?.id_user !== Number(Guest) && event.event?.id_orther_user === event.event?.id_user && !checkDepartment && !handleCheckPage())// 7
        ) {
          // console.log('DaiNQ 🚀 -> Component -> event');
        } else {
          onHover();
        }
      }}
      onTouchStart={() => onHover()}
      className={mapModifiers(
        't-component',
        !!event.event?.personality?.length && myBooking && checkDepartment && handleCheckPage() && 'mypage_mybooking_department', // 1-===
        !!event.event?.personality?.length && !myBooking && checkDepartment && handleCheckPage() && 'mypage_otherbooking_department', // 3-===========
        !event.event?.personality?.length && checkDepartment && handleCheckPage() && 'mypage_guestbooking_department', // 4-===========
        !!event.event?.personality?.length && myBooking && !checkDepartment && handleCheckPage() && 'mypage_mybooking_diff_department', // 2=======
        !!event.event?.personality?.length && !myBooking && !checkDepartment && handleCheckPage() && 'mypage_otherbooking_diff_department', // 4.1-========================
        !event.event?.personality?.length && !checkDepartment && handleCheckPage() && 'mypage_guestbooking_diff_department', // 5-=========================
        !!event.event?.personality?.length && event.event?.id_orther_user === Number(Guest) && event.event?.id_user === Number(Guest) && checkDepartment && !handleCheckPage() && 'otherpage_mybooking_department', // 8-===========
        !event.event?.personality?.length && event.event?.id_orther_user === null && event.event?.id_user === null && checkDepartment && !handleCheckPage() && 'otherpage_guestbooking_department', // 6-===================
        !event.event?.personality?.length && event.event?.id_orther_user === null && event.event?.id_user === null && !checkDepartment && !handleCheckPage() && 'otherpage_guestbooking_diff_department', // 7-============================
        !!event.event?.personality?.length && event.event?.id_orther_user === Number(Guest) && event.event?.id_user === Number(Guest) && !checkDepartment && !handleCheckPage() && 'otherpage_mybooking_diff_department', // 9======
        !!event.event?.personality?.length && event.event?.id_orther_user !== Number(Guest) && event.event?.id_user !== Number(Guest) && event.event?.id_orther_user === event.event?.id_user && checkDepartment && !handleCheckPage() && 'otherpage_otherbooking_department',
        !!event.event?.personality?.length && event.event?.id_orther_user !== Number(Guest) && event.event?.id_user !== Number(Guest) && event.event?.id_orther_user === event.event?.id_user && !checkDepartment && !handleCheckPage() && 'otherpage_otherbooking_diff_department', //
      )}
      ref={eventRef}
    >

      {
        ((!!event.event?.personality?.length && myBooking && checkDepartment && handleCheckPage())// 1
          || (!!event.event?.personality?.length && !myBooking && checkDepartment && handleCheckPage())// 3
          || (!!event.event?.personality?.length && event.event?.id_orther_user === Number(Guest) && event.event?.id_user === Number(Guest) && checkDepartment && !handleCheckPage())// 8
        )
        && (
          <>
            <div className="t-component_personality">
              {event?.event?.personality?.map((item: { id_user: number | null | undefined; label: string | undefined; }, index: number) => ((
                event.event?.personality?.length !== index + 1)
                ? (item.label)?.concat(', ') : item.label))}
            </div>
            <div className="t-component_detail">
              <Typography
                content={event?.event?.detail}
                modifiers={['12x14', '400', 'white']}
              />
            </div>
          </>
        )
      }

      {(
        (!!event.event?.personality?.length && event.event?.id_orther_user !== Number(Guest) && event.event?.id_user !== Number(Guest) && event.event?.id_orther_user === event.event?.id_user && checkDepartment && !handleCheckPage())
        || (!!event.event?.personality?.length && event.event?.id_orther_user !== Number(Guest) && event.event?.id_user !== Number(Guest) && event.event?.id_orther_user === event.event?.id_user && !checkDepartment && !handleCheckPage())

      )
        && (
          <div className="t-component_detail">
            <Typography
              content={t('homepage.reserved') || ''}
              modifiers={['16x24', '400', 'white']}
            />
          </div>
        )}
      {(
        (!event.event?.personality?.length && event.event?.id_orther_user === null && event.event?.id_user === null && !checkDepartment && !handleCheckPage())// 7
        || (!!event.event?.personality?.length && myBooking && !checkDepartment && handleCheckPage())// 2
        || (!!event.event?.personality?.length && !myBooking && !checkDepartment && handleCheckPage())// 4.1
        || (!event.event?.personality?.length && !checkDepartment && handleCheckPage())// 5
        || (!!event.event?.personality?.length && event.event?.id_orther_user === Number(Guest) && event.event?.id_user === Number(Guest) && !checkDepartment && !handleCheckPage()) // 9
      ) && (
          <div className="t-component_detail">
            <Typography
              content={`${event?.event.department?.label} - ${t('homepage.booking') || ''}`}
              modifiers={['14x20', '400', 'white']}
            />
          </div>
        )}
      {(
        (!event.event?.personality?.length && event.event?.id_orther_user === null && event.event?.id_user === null && checkDepartment && !handleCheckPage())/// //=====
        || (!event.event?.personality?.length && checkDepartment && handleCheckPage())// 4
      ) && (
          <div className="t-component_guest_detail">
            <Typography
              content={t('homepage.guest') || ''}
              modifiers={['12x14', '400', 'white']}
            />
            <Typography
              content={event?.event?.detail}
              modifiers={['12x14', '400', 'white']}
            />
          </div>
        )}

      {!hidden && (
        <div className={mapModifiers('t-component_hover', top && 'top', right && 'right')}>
          <ul>
            <li style={{ fontWeight: '700' }}>
              {`${t('hover.date') || ''}:  `}
              <span style={{ fontWeight: '400' }}>{`${moment(event.event.end).format('DD/MM/YYYY ')}`}</span>
            </li>
            <li style={{ fontWeight: '700' }}>
              {`${t('hover.time') || ''}:  `}
              <span style={{ fontWeight: '400' }}>{`${moment(event.event.start).format('hh:mm ')} to ${moment(event.event.end).format('hh:mm')}`}</span>
            </li>
            <li style={{ fontWeight: '700' }}>
              {`${t('hover.department') || ''}:`}
              <span style={{ fontWeight: '400' }}>{`${event?.event?.department?.label || ''}`}</span>
            </li>
            <li style={{ fontWeight: '700' }}>
              {`${t('hover.personality') || ''}:  `}
              <span style={{ fontWeight: '400' }}>
                {event?.event.isCheck
                  ? t('homepage.guest') || ''
                  : `${event?.event?.personality?.length ? event.event.personality.map((item: Option) => (
                    ` ${item.label}`
                  )).splice(0, 5) : ''}`}
              </span>
            </li>
            <li style={{ fontWeight: '700' }}>
              {`${t('hover.service') || ''}:  `}
              <span style={{ fontWeight: '400' }}>{`${event?.event?.service?._values || ''}`}</span>
            </li>
            <li style={{ fontWeight: '700' }}>
              {`${t('hover.detail') || ''}:  `}
              <span style={{ fontWeight: '400' }}>{`${event.event.detail}`}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default React.memo(Component);

export const ViewMonth = React.memo((event: Event) => {
  const Guest = localStorage.getItem(TOKEN);
  const [myBooking, setMyBooking] = useState(false);
  const [checkDepartment, setCheckDepartment] = useState<any>();
  const department = useAppSelector((state) => state.deparment.department);
  useEffect(() => {
    if (event?.event?.department?.value === department?.value) {
      setCheckDepartment(true);
    } else {
      setCheckDepartment(false);
    }
  }, [department]);

  useEffect(() => {
    if (event?.event?.id_user === Number(Guest)
      && (event.event.id_orther_user === null
        || event.event.id_orther_user === Number(Guest))
      && !event?.event.isCheck) {
      setMyBooking(true);
    } else {
      setMyBooking(false);
    }
  }, [Guest, event]);

  return (
    <div className={` ${mapModifiers('t-component', !checkDepartment && 'ischeck', myBooking && 'mybooking', (event?.event.isCheck && Guest === 'GUEST') && 'guest')} t-component_month`}>
      <Typography
        type="span"
        content={`${moment(event.event.start).format('hh:mm ')} -
     ${moment(event.event.end).format('hh:mm')}`}
        modifiers={['14x21', 'white', '400']}
      />
      <Typography
        type="span"
        modifiers={['14x21', 'black']}
        content={event?.title}
      />
    </div>
  );
});
