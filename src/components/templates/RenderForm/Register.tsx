/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from 'components/atoms/Button';
import Input from 'components/atoms/Input';
import Typography from 'components/atoms/Typography';
import { signupService } from 'services/Login';

interface IFormInput {
  user_name: string;
  _password: string;
  email: string;
  confirm_password: string;
}
interface RegisterFormProps {
  handleChangeFormLogin?: () => void;
}
const Register: React.FC<RegisterFormProps> = ({
  handleChangeFormLogin
}) => {
  const { t } = useTranslation();
  const formSchema = Yup.object().shape({
    _password: Yup.string()
      .required(t('validate.password_required') || '')
      .min(6, t('validate.minimun_char') || '')
      .max(20, t('validate.password_max') || ''),
    confirm_password: Yup.string()
      .required(t('validate.password_required') || '')
      .oneOf([Yup.ref('_password')], t('validate.password_match') || ''),
    user_name: Yup.string()
      .required(t('validate.user_id_required') || '')
      .min(6, t('validate.minimun_char') || '')
      .max(20, t('validate.user_id_max') || ''),
    email: Yup.string()
      .required(t('validate.email_required') || '')
      .email(t('validate.email_pattern') || ''),
  });
  const formOptions = { resolver: yupResolver(formSchema) };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    setFocus
  } = useForm<IFormInput>(formOptions);

  useEffect(() => {
    setFocus('user_name');
  }, [setFocus]);

  const { mutate: postRegister } = useMutation(
    'post-footer-form',
    signupService,
    {
      onSuccess: () => {
        reset();
        if (handleChangeFormLogin) handleChangeFormLogin();
        toast.success(t('notify.register_success') || '');
      },
      onError: (err: { code: number }) => {
        const { code } = err;
        if (code === 3) {
          setError('user_name', {
            message: t('validate.userid_exist') || ''
          });
        }
        if (code === 4) {
          setError('email', {
            message: t('validate.email_exist') || ''
          });
        }
      }
    }
  );

  const handleValidate = (data: IFormInput) => !!data.user_name.match(/\W/);

  const onSubmitRegister = async (data: IFormInput) => {
    if (handleValidate(data)) {
      setError('user_name', {
        message: t('validate.special_char') || ''
      });
      return;
    }
    await postRegister({ ...data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitRegister)}>
      <Input
        id="user_name"
        label={t('login.user_id') || ''}
        {...register('user_name')}
        error={errors.user_name?.message}
      />
      <Input
        id="email"
        label={t('login.email_address') || ''}
        placeholder="abcdefgh@gmail.com"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        id="password"
        label={t('login.password') || ''}
        type="password"
        isPassword
        error={errors._password?.message}
        {...register('_password',)}
      />
      <Input
        id="confirm_password"
        label={t('login.confirm_password') || ''}
        type="password"
        isPassword
        error={errors.confirm_password?.message}
        {...register('confirm_password',)}
      />
      <div className="t-form_btn">
        <Button type="submit" modifiers={['primary']}>
          <Typography content={t('signup.register') || ''} modifiers={['700', '18x32', 'uppercase']} />
        </Button>
      </div>
      <div style={{ display: 'flex' }}>
        <span style={{ marginRight: 5, cursor: 'default' }}>{t('login.have_account') || ''}</span>
        <div className="t-form_change" onClick={handleChangeFormLogin}>
          <Typography content={t('login.login') || ''} modifiers={['400', '16x24', 'blueNavy', 'capitalize']} />
        </div>
      </div>
    </form>
  );
};

export default Register;
