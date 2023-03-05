/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from 'components/atoms/Button';
import Input from 'components/atoms/Input';
import Typography from 'components/atoms/Typography';
import Notify from 'components/organisms/Notify';
import { UpdatePassWordService } from 'services/Login';

interface IFormInput {
  _password: string;
  confirm_password: string;
  code_verify: string;
  email: string;
}
interface UpdatePasswordProps {
  handleChangeFormForgot?: () => void;
  handleConfirm?: () => void;
  handleChangeFormLogin?: () => void;
}
const UpdatePassword: React.FC<UpdatePasswordProps> = ({
  handleChangeFormForgot, handleConfirm, handleChangeFormLogin
}) => {
  const [titleNotify, setTitleNotify] = useState('');
  const [nameNotifyBtn, setNameNotifyBtn] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [counter, setCounter] = useState(60);
  const { t } = useTranslation();
  const checkReset = localStorage.getItem('checkSubmit');
  const navigator = useNavigate();

  const formSchema = Yup.object().shape({
    _password: Yup.string()
      .required(t('validate.password_required') || '')
      .min(6, t('validate.minimun_char') || '')
      .max(20, t('validate.password_max') || ''),
    confirm_password: Yup.string()
      .required(t('validate.password_required') || '')
      .oneOf([Yup.ref('_password')], t('validate.password_match') || ''),
  });
  const formOptions = { resolver: yupResolver(formSchema) };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setFocus,
    setError
  } = useForm<IFormInput>(formOptions);

  useEffect(() => {
    setFocus('_password');
  }, [setFocus]);

  // useEffect(() => {
  //   if (!checkReset) {
  //     navigator('/authen/forgot');
  //   } else {
  // toast.error(t('login.access_err') || '');
  //   }
  // }, []);

  const {
    mutate: updatePassword
  } = useMutation(
    'post-footer-form',
    UpdatePassWordService,
    {
      onSuccess: () => {
        setIsOpen(true);
        setTitleNotify('Change password success');
        localStorage.removeItem('emailForgot');
        setNameNotifyBtn('cancel');
        localStorage.removeItem('emailForgot');
        if (handleChangeFormLogin) handleChangeFormLogin();
        toast.success(t('notify.update_password') || '');
      },
      onError: () => {
        setError('code_verify', {
          message: t('validate.code_verify') || ''
        });
      }
    }
  );
  const email = localStorage.getItem('emailForgot') || '';
  const onSubmitChangePassword = async (data: IFormInput) => {
    await updatePassword({ ...data, email });
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitChangePassword)}>
        <Input
          id="new_password"
          label={t('login.new_password') || ''}
          type="password"
          isPassword
          {...register('_password')}
          error={errors._password?.message}
        />
        <Input
          id="new_confirm_password"
          label={t('login.confirm_new_password') || ''}
          type="password"
          isPassword
          {...register('confirm_password')}
          error={errors.confirm_password?.message}
        />
        <Input
          id="code_verify"
          label={t('login.code_verify') || ''}
          type="text"
          {...register('code_verify')}
          error={errors.code_verify?.message}
        />
        <div className="t-form_btn">
          <Button
            modifiers={['columbia-blue']}
            onClick={handleChangeFormForgot}
          >
            <Typography content={t('login.back') || ''} modifiers={['700', '18x32', 'uppercase']} />
          </Button>
          <Button modifiers={['primary']} type="submit">
            <Typography content={t('popup.save') || ''} modifiers={['700', '18x32', 'uppercase', 'white']} />
          </Button>
        </div>
      </form>
      <Notify
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        descLogin={titleNotify}
        btnText={nameNotifyBtn}
        notifiLogin
        modifiers="onlyButton"
        // descLogin={descLogin}
        CountDown={counter}
        handleConfirm={() => {
          if (handleConfirm) handleConfirm();
          setIsOpen(false);
        }}
        animateNotify={false}
      />
    </div>
  );
};

export default UpdatePassword;
