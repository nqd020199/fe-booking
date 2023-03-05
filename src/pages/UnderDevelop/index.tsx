/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Button from 'components/atoms/Button';
import Container from 'components/organisms/Container';
import MainLayout from 'components/templates/MainLayout';

const UnderDevelop: React.FC = () => {
  const { t } = useTranslation();
  const navigator = useNavigate();
  useEffect(() => {

  }, []);

  return (
    <MainLayout isShowBarLayout>
      <div className="p-anthencation">
        <Container modifiers={['fullScreen']}>
          <div className="p-under_page">
            <p className="p-under_page_h2">
              {t('training.developing')}
            </p>
            <p className="p-under_page_h3">{t('training.coming_soon')}</p>
            <div className="p-under_page_btn">
              <Button modifiers={['primary']} onClick={() => navigator('/')}>
                {t('training.go_home')}
              </Button>
            </div>
          </div>
        </Container>
        <span className="p-anthencation_neumorphism size-sm" />
        <span className="p-anthencation_neumorphism size-md" />
        <span className="p-anthencation_neumorphism size-lg" />
        <span className="p-anthencation_circle" />
        <span className="p-anthencation_circle-dou1" />
        <span className="p-anthencation_circle-dou2" />
      </div>
    </MainLayout>
  );
};

export default UnderDevelop;
