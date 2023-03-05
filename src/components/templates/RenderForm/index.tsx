/* eslint-disable no-mixed-operators */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import ForgotPassword from './ForgotPassword';
import Login from './Login';
import Register from './Register';
import UpdatePassword from './UpdatePassword';

import ToastNotify from 'components/atoms/ToastNotify';
import Typography from 'components/atoms/Typography';

export type TypeForm =
  'login' |
  'register' |
  'profile' |
  'forgot'; // forgot password

interface RenderFormProps {
}

const RenderForm: React.FC<RenderFormProps> = ({
}) => {
  const navigator = useNavigate();
  const param = useParams();
  const [params, setParams] = useState(param.page);

  useEffect(() => {
    setParams(param.page);
  }, [param]);

  const { t } = useTranslation();
  /* End APIs */
  const handleChangeFormForgot = () => {
    navigator('/authen/forgot');
  };

  const handleChangeFormRegister = () => {
    navigator('/authen/register');
  };

  const handleChangeFormLogin = () => {
    navigator('/authen/login');
  };

  const handleChangeFormUpdate = () => {
    navigator('/authen/register');
  };

  return (
    <div className="t-form">
      <div className="t-form_heading">
        <Typography modifiers={['blueNavy', 'uppercase', '32x48']}>
          {params === 'login' && t('login.login') || ''}
          {params === 'register' && t('signup.register') || ''}
          {params === 'forgot' && t('login.update_password') || ''}
          {params === 'reset' && t('login.update_password') || ''}
        </Typography>
      </div>
      {params === 'login'
        && (
          <Login
            handleChangeFormForgot={handleChangeFormForgot}
            handleChangeFormRegister={handleChangeFormRegister}
          />
        )}
      {
        params === 'register'
        && (
          <Register handleChangeFormLogin={handleChangeFormLogin} />
        )
      }
      {
        params === 'forgot'
        && (
          <ForgotPassword
            handleChangeFormLogin={handleChangeFormLogin}
            handleChangeFormUpdate={handleChangeFormUpdate}
          />
        )
      }
      {params === 'reset'
        && (
          <UpdatePassword
            handleChangeFormForgot={handleChangeFormForgot}
            handleChangeFormLogin={handleChangeFormLogin}
          />
        )}
      <ToastNotify />

    </div>
  );
};

RenderForm.defaultProps = {
};

export default RenderForm;
