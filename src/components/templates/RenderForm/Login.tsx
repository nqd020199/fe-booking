/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { To, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import Button from 'components/atoms/Button';
import Input from 'components/atoms/Input';
import Link from 'components/atoms/Link';
import Typography from 'components/atoms/Typography';
import { loginService } from 'services/Login';
import { homePage } from 'store/example';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { TOKEN, USER_LOGIN } from 'utils/constants';

interface IFormInput {
  user_name: string;
  _password: string;
}
interface LoginFormProps {
  handleChangeFormForgot?: () => void;
  handleChangeFormRegister: () => void;
}
const Login: React.FC<LoginFormProps> = ({
  handleChangeFormForgot, handleChangeFormRegister
}) => {
  const navigator = useNavigate();
  const home = useAppSelector((state) => state.example.homePage);
  const dispatch = useAppDispatch();
  const dataGuest = { user_name: 'GUEST', _password: 'GUEST' };
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.example.language);
  const [checkLanguage, setCheckLanguage] = useState(language);

  const formSchema = Yup.object().shape({
    _password: Yup.string()
      .min(6, t('validate.minimun_char') || '')
      .max(20, t('validate.password_max') || ''),
    user_name: Yup.string()
      .min(6, t('validate.minimun_char') || '')
      .max(225, t('validate.user_id_max') || ''),
  });
  const formOptions = { resolver: yupResolver(formSchema) };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setFocus
  } = useForm<IFormInput>(formOptions);

  useEffect(() => {
    setCheckLanguage(language);
  }, [language]);

  useEffect(() => {
    setFocus('user_name');
  }, [setFocus]);

  const guestLogin = () => {
    localStorage.setItem(USER_LOGIN, JSON.stringify(dataGuest));
    localStorage.setItem(TOKEN, dataGuest.user_name);
    localStorage.setItem('PopupGuest', '0');
  };
  const location = useLocation();
  const { mutate: postLogin, } = useMutation(
    'post-footer-form',
    loginService,
    {
      onSuccess: (data) => {
        localStorage.setItem('showPopup', '0');
        localStorage.setItem(USER_LOGIN, JSON.stringify(data));
        localStorage.setItem(TOKEN, data.content.id_user);
        sessionStorage.setItem('currLanguage', JSON.stringify(checkLanguage));
        if (home) {
          navigator(home);
          dispatch(homePage(''));
        } else {
          navigator('/');
        }
      },
      onError: (err: { code: number }) => {
        const { code } = err;
        if (code === 2) {
          setError('user_name', {
            message: t('validate.name_not_found') || ''
          });
        }
        if (code === 1) {
          setError('_password', {
            message: t('validate.password_not_found') || ''
          });
        }
      }
    }
  );

  const onSubmit = async (data: IFormInput) => {
    await postLogin({ ...data });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="user_name"
          label={t('login.user_id') || ''}
          {...register('user_name')}
          error={errors.user_name?.message}
        />

        <Input
          id="password"
          label={t('login.password') || ''}
          type="password"
          isPassword
          {...register('_password',)}
          error={errors._password?.message}
        />

        <div className="t-form_btn">
          <Button modifiers={['primary']} type="submit">
            <Typography content={t('login.login') || ''} modifiers={['700', '18x32', 'uppercase', 'white']} />
          </Button>
          <Button onClick={guestLogin} modifiers={['primary']} className="t-form_btn_guest">
            <Link href="/">
              <Typography content={t('login.guest_login') || ''} modifiers={['700', '18x32', 'uppercase', 'white']} />
            </Link>
          </Button>
        </div>
        <div className="t-form_change" onClick={handleChangeFormForgot}>
          <Typography content={t('login.forget_password') || ''} modifiers={['400', '16x24', 'blueNavy']} />
        </div>
        <div className="t-form_change t-form_subbtn ">
          <span>{t('login.no_account') || ''}</span>
          <div onClick={handleChangeFormRegister}>
            <Typography content={t('login.signup') || ''} modifiers={['400', '16x24', 'blueNavy']} />
          </div>
        </div>
      </form>

    </div>
  );
};

export default Login;
