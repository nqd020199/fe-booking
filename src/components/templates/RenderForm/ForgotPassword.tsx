/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import * as Yup from 'yup';

import Button from 'components/atoms/Button';
import Input from 'components/atoms/Input';
import Typography from 'components/atoms/Typography';
import Notify from 'components/organisms/Notify';
import { forgotService } from 'services/Login';

interface IFormInput {
  email: string;
}
interface ForgotPasswordProps {
  handleChangeFormLogin?: () => void;
  handleChangeFormUpdate?: () => void

}
const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  handleChangeFormLogin,
}) => {
  const [titleNotify, setTitleNotify] = useState('');
  const [nameNotifyBtn, setNameNotifyBtn] = useState('');
  const [cloneData, setCloneData] = useState<IFormInput>();
  const [isOpen, setIsOpen] = useState(false);
  const [counter, setCounter] = useState(60);
  const { t } = useTranslation();

  const formSchema = Yup.object().shape({
    email: Yup.string()
      .required(t('validate.email_required') || '')
      .email(t('validate.email_pattern') || ''),
  });
  const formOptions = { resolver: yupResolver(formSchema) };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (counter > 0) setCounter(counter - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, counter]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    // setError
  } = useForm<IFormInput>(formOptions);

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const {
    mutate: forgotPassword
  } = useMutation(
    'post-footer-form',
    forgotService,
    {
      onSuccess: () => {
        setIsOpen(true);
        setNameNotifyBtn(t('popup.resend') || '');
      },
      onError: () => {
        // setError('email', {
        //   message: t('validate.email_not_found') || ''
        // });
      }
    }
  );
  const onSubmitForgot = async (data: IFormInput) => {
    setTitleNotify(`${t('validate.notify_content1') || ''} ${data.email} ${t('validate.notify_content2') || ''}`);
    // setError('email', { message: '' });
    await forgotPassword({ ...data });
    localStorage.setItem('emailForgot', data.email);
    setCloneData(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitForgot)}>
        <Input
          id="email"
          label={t('login.email_address') || ''}
          placeholder="abcd@gmail.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <div className="t-form_btn">
          <Button modifiers={['columbia-blue']} onClick={handleChangeFormLogin}>
            <Typography content={t('login.back') || ''} modifiers={['700', '18x32', 'uppercase']} />
          </Button>
          <Button type="submit" modifiers={['primary']}>
            <Typography content={t('login.next') || ''} modifiers={['700', '18x32', 'uppercase']} />
          </Button>
        </div>
      </form>
      <Notify
        isOpen={counter !== 0 && isOpen}
        handleClose={() => setIsOpen(false)}
        descLogin={titleNotify}
        btnText={nameNotifyBtn}
        notifiLogin
        modifiers="onlyButton"
        // descLogin={descLogin}
        CountDown={counter}
        handleConfirm={() => {
          onSubmitForgot(cloneData as IFormInput);
          setCounter(60);
        }}
        animateNotify={false}
      />
    </div>
  );
};

export default ForgotPassword;
