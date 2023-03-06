/* eslint-disable import/no-named-as-default */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Typography from 'components/atoms/Typography';
import Container from 'components/organisms/Container';
import RenderForm from 'components/templates/RenderForm';
import { useAppSelector } from 'store/hooks';
import { USER_LOGIN } from 'utils/constants';

const Authencation: React.FC = () => {
  const navigator = useNavigate();
  const language = useAppSelector((state) => state.example.language);

  useEffect(() => {
    if (localStorage.getItem(USER_LOGIN)) {
      navigator('/');
    }
  }, []);

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
    </div>
  );
};

export default Authencation;
