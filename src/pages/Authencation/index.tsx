/* eslint-disable import/no-named-as-default */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { OptionsChild } from '../../components/molecules/Dropdown/index';

import Typography from 'components/atoms/Typography';
import Dropdown from 'components/molecules/Dropdown';
import Container from 'components/organisms/Container';
import { optionsLanguage } from 'components/templates/MainLayout';
import RenderForm from 'components/templates/RenderForm';
import i18n from 'i18n';
import { increment } from 'store/example';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { USER_LOGIN } from 'utils/constants';

const Authencation: React.FC = () => {
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.example.language);

  useEffect(() => {
    if (localStorage.getItem(USER_LOGIN)) {
      navigator('/');
    }
  }, []);

  const handleChangeLang = (option: OptionsChild) => {
    i18n.changeLanguage(option.acronym);
    dispatch(increment(option));
    sessionStorage.setItem('currLanguage', JSON.stringify(option));
  };

  useEffect(() => {
    if (language.acronym !== 'KO') {
      document.body.style.fontFamily = 'Noto Sans,sans-serif';
    } else {
      document.body.style.fontFamily = 'Noto Sans KR,sans-serif';
    }
  }, [language]);

  return (
    <div className="p-anthencation">
      <Container modifiers={['form']}>
        <div className="p-anthencation_language">
          <Dropdown
            optionsChild={optionsLanguage || []}
            handleClick={(item) => handleChangeLang(item)}
            typeDropdown="dropDown"
            iconName={language.IconName}
            name={language.acronym}
          />
        </div>
        <div className="p-anthencation_left">
          <Typography content="Booking<br />Management" modifiers={['blueNavy', 'capitalize', '46x50', '700']} />
          <div className="p-anthencation_left-mask">
            <span className="p-anthencation_left-mask_mask1" />
            <span className="p-anthencation_left-mask_mask2" />
          </div>
        </div>
        <div className="p-anthencation_right">
          <RenderForm />
        </div>
      </Container>
      <span className="p-anthencation_neumorphism size-sm" />
      <span className="p-anthencation_neumorphism size-md" />
      <span className="p-anthencation_neumorphism size-lg" />
      <span className="p-anthencation_circle" />
      <span className="p-anthencation_circle-dou1" />
      <span className="p-anthencation_circle-dou2" />
    </div>
  );
};

export default Authencation;
