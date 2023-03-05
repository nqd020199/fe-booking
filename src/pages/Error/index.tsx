import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Button from 'components/atoms/Button';
import MainLayout from 'components/templates/MainLayout';
// import Image from 'components/atoms/Image';

const Error: React.FC = () => {
  const { t } = useTranslation();
  const navigator = useNavigate();
  useEffect(() => {

  }, []);

  return (
    <MainLayout isShowBarLayout>
      <div className="p-anthencation">
        <div className="p-error_wrapper">
          <div>
            {/* <Image src={imErr} alt="" widths={600} heights={400} /> */}
            <p className="p-error_wrapper_h1">Oops!</p>
            <p className="p-error_wrapper_h1">404</p>
            <p className="p-error_wrapper_h2">
              {t('training.error')}
            </p>
            <div className="p-error_btn">
              <Button modifiers={['primary']} onClick={() => navigator('/')}>
                {t('training.go_home')}
              </Button>
            </div>
          </div>
        </div>
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

export default Error;
