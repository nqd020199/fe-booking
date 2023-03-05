/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-cycle */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-named-as-default */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from 'moment';
import 'moment-timezone';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '../../../store/hooks';

import CalendarViews, { OptionViews } from 'components/molecules/CalendarViews';
import DuarationView from 'components/molecules/DuarationView';
import TimeZone from 'components/molecules/TimeZone';
import { setDateDefault } from 'store/department';
import { incrementSetViewCalendar } from 'store/example';
import { useAppSelector } from 'store/hooks';
import mapModifiers from 'utils/functions';

interface HeaderCalendarProps {
  [x: string]: any;
}

const HeaderCalendar: React.FC<HeaderCalendarProps> = (toolbar) => {
  const {
    label, view, onView, onNavigate
  } = toolbar;
  const uct = moment().format('Z');
  const { t } = useTranslation();
  const isShowSideBar = useAppSelector((state) => state.example.isShowSideBar);
  const [width, setWidth] = useState(window.innerWidth);
  const [isActiveMobile, setIsActiveMobile] = useState(false);
  const dispatch = useAppDispatch();

  const listTimeZone = [
    { utc: '+07:00', country: 'VietNam', value: '7' },
    { utc: '+08:00', country: 'Malaysia', value: '8' },
    { utc: '+09:00', country: 'Seoul', value: '9' },
  ];
  const optionsViews = [
    { id: 3, view: t('homepage.daily'), value: 'day' },
    { id: 1, view: t('homepage.weekly'), value: 'week' },
    { id: 2, view: t('homepage.monthly'), value: 'month' },
  ];

  const handleCheckTimeZone = (inputUtc: string) => listTimeZone.find((item) => item.utc === inputUtc);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setIsActiveMobile(true);
  }, [width < 530]);

  useEffect(() => {
    setIsActiveMobile(false);
  }, [width > 530]);

  const handleChangView = (item: OptionViews) => {
    onView(item.value || '');
  };

  useEffect(() => {
    dispatch(setDateDefault(toolbar.date as Date));
    dispatch(incrementSetViewCalendar(toolbar.view));
  }, [toolbar.date]);

  return (
    <div className={mapModifiers('t-header-calendar', isShowSideBar && 'showbar')}>
      <div className="t-header-calendar_item item_left">
        <div className="t-header-calendar_item_timezone">
          <TimeZone position={handleCheckTimeZone(uct)?.country} utc={`UTC +${handleCheckTimeZone(uct)?.value}`} />
        </div>
        <div className="t-header-calendar_item_duration">
          <DuarationView
            duarationTime={label}
            onClickNext={() => {
              onNavigate('NEXT');
            }}
            onClickPrev={() => {
              onNavigate('PREV');
            }}
          />
        </div>
      </div>
      <div className="t-header-calendar_item item_right">
        <CalendarViews
          optionViews={optionsViews}
          viewActive={view}
          onChangeView={(handleChangView)}
        />
      </div>
    </div>

  );
};

HeaderCalendar.defaultProps = {
};

export default React.memo(HeaderCalendar);
