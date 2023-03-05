import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Account from '../../components/templates/Account';

import { Tab, TabPanel, Tabs } from 'components/organisms/Tabs';
import Department from 'components/templates/Department';
import Domain from 'components/templates/Domain';
import Genaral from 'components/templates/Genaral';
import MainLayout from 'components/templates/MainLayout';
import Persionalities from 'components/templates/Persionalities';
import ServiceTypeSetting from 'components/templates/ServiceTypeSetting';
import { useAppSelector } from 'store/hooks';

const optionTimeZone = [
  { id_selection: 1, _values: '06 : 00 PM', _name: '18' },
  { id_selection: 1, _values: '07 : 00 PM', _name: '19' },
  { id_selection: 2, _values: '08 : 00 PM', _name: '20' },
  { id_selection: 3, _values: '09 : 00 PM', _name: '21' },
  { id_selection: 4, _values: '10 : 00 PM', _name: '22' },
  { id_selection: 5, _values: '11 : 00 PM', _name: '23' },
];
const optionMinTimeZone = [
  { id_selection: 1, _values: '06 : 00 AM', _name: '6' },
  { id_selection: 1, _values: '07 : 00 AM', _name: '7' },
  { id_selection: 2, _values: '08 : 00 AM', _name: '8' },
  { id_selection: 3, _values: '09 : 00 AM', _name: '9' },
  { id_selection: 4, _values: '10 : 00 AM', _name: '10' },
  { id_selection: 5, _values: '11 : 00 AM', _name: '11' },
];
const Setting: React.FC = () => {
  const [indexActive, setIndexActive] = useState(0);
  const lang = useAppSelector((state) => state.example.language);
  const getIndexSession = sessionStorage.getItem('indexSettingTab');

  useEffect(() => {
    setIndexActive(Number(getIndexSession) || 0);
  }, []);

  useEffect(() => {
    if (lang.acronym !== 'KO') {
      document.body.style.fontFamily = 'Noto Sans,sans-serif';
    } else {
      document.body.style.fontFamily = 'Noto Sans KR,sans-serif';
    }
  }, [lang]);

  const { t } = useTranslation();
  const optionDuaration = [
    { id_selection: 1, _values: `30 ${t('setting.minutes')}`, _name: '30 minutes' },
    { id_selection: 2, _values: `1 ${t('setting.hours')}`, _name: '1 hours' },
    { id_selection: 3, _values: `2 ${t('setting.hours')}`, _name: '2 hours' },
  ];
  const optionOverTime = [
    { id_selection: 1, _values: `1 ${t('setting.row')}`, _name: '1' },
    { id_selection: 2, _values: `2 ${t('setting.row')}`, _name: '2' },
    { id_selection: 3, _values: `3 ${t('setting.row')}`, _name: '3' },
    { id_selection: 4, _values: `4 ${t('setting.row')}`, _name: '4' },
    { id_selection: 5, _values: `5 ${t('setting.row')}`, _name: '5' },
    { id_selection: 6, _values: `6 ${t('setting.row')}`, _name: '6' },
    { id_selection: 7, _values: `7 ${t('setting.row')}`, _name: '7' },
    { id_selection: 8, _values: `8 ${t('setting.row')}`, _name: '8' },
    { id_selection: 9, _values: `9 ${t('setting.row')}`, _name: '9' },
    { id_selection: 10, _values: `10 ${t('setting.row')}`, _name: '10' },
  ];
  const optionsTab = [
    {
      label: t('menu.general'),
      content: <Genaral
        optionTimeZone={optionTimeZone}
        optionMinTimeZone={optionMinTimeZone}
        optionDuaration={optionDuaration}
        optionOverTime={optionOverTime}
        btnText={t('popup.save') || ''}
        subBtnText={t('popup.cancel') || ''}
      />,
    },
    {
      label: t('menu.account'),
      content: <Account
        textAdd={t('login.change_password') || ''}
        btnText={t('popup.save') || ''}
        subBtnText={t('popup.cancel') || ''}
        textEditEmail={t('login.change_email') || ''}
      />,
    },
    {
      label: t('setting.personality'),
      content: <Persionalities
        desc={t('setting.personality_desc') || ''}
        title={t('setting.personality') || ''}
        textAdd={t('setting.personality_message') || ''}
        placeholder={t('setting.add_personality') || ''}
        btnText={t('popup.save') || ''}
        subBtnText={t('popup.cancel') || ''}
        optionData={[]}
        indexActive={indexActive}
      />,
    },
    {
      label: t('menu.department'),
      content: <Department
        desc={t('setting.department_desc') || ''}
        title={t('setting.department') || ''}
        textAdd={t('setting.department_message') || ''}
        placeholder={t('setting.add-department') || ''}
        btnText={t('popup.save') || ''}
        subBtnText={t('popup.cancel') || ''}
        optionData={[]}
      />,
    },
    {
      label: t('popup.service'),
      content: <ServiceTypeSetting
        desc={t('setting.service_desc') || ''}
        title={t('setting.service') || ''}
        textAdd={t('setting.service_message') || ''}
        placeholder={t('setting.add_service') || ''}
        btnText={t('popup.save') || ''}
        subBtnText={t('popup.cancel') || ''}
        optionData={[]}
      />,
    },
    {
      label: t('popup.domain'),
      content: <Domain
        desc={t('setting.domain_desc') || ''}
        title={t('setting.domain_appli') || ''}
        btnText={t('popup.save') || ''}
        subBtnText={t('popup.cancel') || ''}
        textAdd={t('setting.domain_text') || ''}
      // placeholder={t('setting.add_service') || ''}
      />,
    },
  ];

  return (
    <MainLayout isShowBarLayout>
      <div className="p-setting">
        <Tabs variableMutate={indexActive} type="search">
          {
            optionsTab.map((item, index) => (
              <Tab
                type="search"
                key={`tab-${index.toString()}`}
                label={item.label}
                active={index === indexActive}
                handleClick={() => {
                  setIndexActive(index);
                  sessionStorage.setItem('indexSettingTab', index.toString());
                }}
              />
            ))
          }
        </Tabs>
        {
          optionsTab.map((item, index) => (
            <TabPanel key={`tab-panel-${index.toString()}`} active={index === indexActive}>
              {item.content}
            </TabPanel>
          ))
        }
      </div>
    </MainLayout>
  );
};

export default Setting;
