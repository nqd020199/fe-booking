/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import IcUser from 'assets/images/image_default.png';
import Button from 'components/atoms/Button';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import Typography from 'components/atoms/Typography';
import Container from 'components/organisms/Container';
import { PopupBookingProps } from 'components/organisms/PopupBooking';
import { updateImageService, updateUserMail, updateUserService } from 'services/Login';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getUserAction } from 'store/infouser';
import { TOKEN, USER_LOGIN } from 'utils/constants';
import { getImageURL } from 'utils/functions';

type AccountProps = PopupBookingProps & {
  textAdd?: string;
  textEditEmail?: string;
};

interface IFormInput {
  email: string;
  user_name: string;
  _password: string;
  current_password: string;
  confirm_new_password: string;
}
interface IFormInputMail {
  email: string;
  user_name: string;
  _password: string;
}
export type UpdateAvatarTypes = {
  image_url: File;
};

const Account: React.FC<AccountProps> = ({
  textAdd, subBtnText, btnText, textEditEmail
}) => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.user.infuser);

  const [isHidden, setIsHidden] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [ispass, setIsPass] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [currentFile, setCurrentFile] = useState<UpdateAvatarTypes>();
  const [userData, setUserData] = useState(user);
  const [showChangeMail, setShowChangeMail] = useState(false);

  const navigator = useNavigate();

  const Guest = localStorage.getItem(TOKEN);

  useEffect(() => {
    if (Guest !== 'GUEST') {
      setIsGuest(false);
    }
    setUserData(user);
  }, [Guest, user, isHidden]);

  const formSchema = Yup.object().shape({
    _password: Yup.string()
      .required(t('validate.password_required') || '')
      .min(6, t('validate.user_id_min') || '')
      .max(20, t('validate.password_max') || '')
      .notOneOf([Yup.ref('current_password')], t('validate.new_password_err') || ''),
    confirm_new_password: Yup.string()
      .required(t('validate.password_required') || '')
      .oneOf([Yup.ref('_password')], t('validate.password_match') || ''),
    user_name: Yup.string()
      .min(5, t('validate.user_id_min') || '')
      .max(225, t('validate.user_id_max') || ''),
    email: Yup.string()
      .required(t('validate.email_required') || '')
      .email(t('validate.email_pattern') || ''),
    current_password: Yup.string()
      .required(t('validate.password_required') || '')
  });
  const formOptions = { resolver: yupResolver(formSchema) };

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
    setError
  } = useForm<IFormInput>(formOptions);
  const {
    handleSubmit: sub,
  } = useForm<UpdateAvatarTypes>(formOptions);

  const formSchemas = Yup.object().shape({
    _password: Yup.string()
      .required(t('validate.password_required') || '')
      .min(6, t('validate.user_id_min') || '')
      .max(20, t('validate.password_max') || ''),
    user_name: Yup.string()
      .min(5, t('validate.user_id_min') || '')
      .max(225, t('validate.user_id_max') || ''),
    email: Yup.string()
      .required(t('validate.email_required') || '')
      .email(t('validate.email_pattern') || '')
      .notOneOf([userData?.email], t('validate.new_email_err') || ''),

  });
  const formOptionss = { resolver: yupResolver(formSchemas) };

  const {
    register: reg,
    handleSubmit: chngeMail,
    resetField: resetInput,
    formState: { errors: erro },
    setError: setrEr
  } = useForm<IFormInputMail>(formOptionss);

  const handleShowAdd = () => {
    setIsHidden(true);
    resetField('_password');
    resetField('current_password');
    resetField('confirm_new_password');
  };
  const handleCancel = () => {
    setIsHidden(false);
    setShowChangeMail(false);
  };

  const dispatch = useAppDispatch();

  const { mutate: postRegister } = useMutation(
    'post-footer-form',
    (data: IFormInput) => updateUserService(Number(Guest), data),
    {
      onSuccess: () => {
        dispatch(getUserAction(Number(Guest) || 0));
        toast.success(t('notify.update_password') || '');
        setIsHidden(false);
      },
      onError: (err: { code: number }) => {
        const { code } = err;
        if (code === 5) {
          // setIsPass(true);
          setError('current_password', {
            message: t('validate.password_current') || ''
          });
        } else {
          toast.success(t('notify.update_err') || '');
        }
      }
    }
  );

  const { mutate: putimage } = useMutation(
    'put-image',
    (data: UpdateAvatarTypes) => updateImageService(Number(Guest), data),
    {
      onSuccess: () => {
        dispatch(getUserAction(Number(Guest) || 0));
        toast.success(t('notify.avatar_succeed') || '');
      },
      onError: (err: { code: number }) => {

      }
    }
  );

  const { mutate: ChangeEmail } = useMutation(
    'put-mail',
    (data: IFormInputMail) => updateUserMail(Number(Guest), data),
    {
      onSuccess: async () => {
        dispatch(getUserAction(Number(Guest) || 0));
        toast.success(t('notify.avatar_succeed') || '');
        setIsHidden(false);
        setShowChangeMail(false);
      },
      onError: (err: { code: number }) => {
        const { code } = err;
        setrEr('_password', {
          message: t('validate.password_current') || ''
        });
      }
    }
  );

  const onSubmit = async (data: IFormInput) => {
    postRegister({ ...data as IFormInput });
  };
  const onSubmitChangeMail = async (data: IFormInputMail) => {
    ChangeEmail({ ...data as IFormInputMail });
  };

  const handleUploadAvatar = async (data: UpdateAvatarTypes) => {
    putimage({
      ...data,
    });
  };

  const handleLoadImg = async (file: UpdateAvatarTypes) => {
    if (!file) return;
    if (file && file?.image_url.size > (10 * 1024 * 1024)) {
      setPreviewUrl(undefined);
      setCurrentFile(undefined);
      toast.error(t('notify.avatar_big'));
    } else if (
      file && ([
        'image/png',
        'image/jpg',
        'image/jpeg',
      ].includes(file?.image_url.type) === false)
    ) {
      setPreviewUrl(undefined);
      setCurrentFile(undefined);
      toast.error(t('notify.avatar_format'));
    } else {
      setPreviewUrl(URL.createObjectURL(file.image_url));
      setCurrentFile(file);
    }
  };
  const handleShowChangeMail = () => {
    setShowChangeMail(true);
    setIsHidden(true);
    resetInput('_password');
  };

  return (
    <div className="t-account">

      {isGuest ? (
        <div className="t-account_not-login">
          <Typography modifiers={['center', '16x24', '400']}>{t('setting.login_required') || ''}</Typography>
          <Button
            modifiers={['primary']}
            onClick={() => {
              localStorage.removeItem(USER_LOGIN);
              localStorage.removeItem(TOKEN);
              navigator('/authen/login');
            }}
          >
            <Typography modifiers={['center', '16x24', '700', 'uppercase']}>{t('login.login') || ''}</Typography>
          </Button>
        </div>
      )
        : (
          <Container modifiers={['left']}>
            <div className="t-account-wrapper">
              <div className="t-account_form">
                <div className="t-account_form_om">
                  <form onSubmit={sub(handleLoadImg)}>
                    <div className="t-account_avatar">
                      <div className="t-account_avatar_wrapper">
                        <img
                          src={previewUrl
                            || (userData?.image_url
                              ? getImageURL(userData?.image_url as string) : IcUser)}
                          alt="avatar"
                        />
                        {
                          previewUrl
                            ? (
                              <>
                                <div
                                  className="t-account_avatar_wrapper_confirm"
                                  onClick={() => {
                                    if (
                                      handleUploadAvatar && currentFile
                                    ) {
                                      handleUploadAvatar(currentFile);
                                    }
                                    setPreviewUrl(undefined);
                                  }}
                                >
                                  <Icon iconName="confirm" size="30x30" />

                                </div>
                                <div
                                  className="t-account_avatar_wrapper_cancel"
                                  onClick={() => setPreviewUrl(undefined)}
                                >
                                  <Icon iconName="cancelimage" size="30x30" />

                                </div>
                              </>
                            )
                            : (
                              <label htmlFor="avatar">
                                <div className="t-account_avatar_wrapper_edit">
                                  <Icon iconName="edit" size="30x30" />
                                </div>
                                <input
                                  accept=".jpg, .jpeg, .png"
                                  id="avatar"
                                  type="file"
                                  size={3145728}
                                  className="t-account_avatar_wrapper_input"
                                  onChange={(e) => e.target.files !== null
                                    && handleLoadImg({ image_url: e.target.files[0] })}
                                />
                              </label>
                            )
                        }
                      </div>
                    </div>
                  </form>
                  <form onSubmit={showChangeMail ? chngeMail(onSubmitChangeMail) : handleSubmit(onSubmit)}>
                    {!isHidden
                      ? (
                        <>
                          <Input
                            id="user_name"
                            label={t('login.user_id') || ''}
                            {...register('user_name')}
                            variant="borderRadius"
                            value={userData?.user_name}
                            error={errors.user_name?.message}
                            readOnly
                          />
                          <Input
                            id="email"
                            label={t('login.email_address') || ''}
                            placeholder="abcd@gmail.com"
                            {...reg('email')}
                            variant="borderRadius"
                            value={userData?.email}
                            readOnly
                          />
                          <div className="t-serviceSetting_account">
                            <div className="t-serviceSetting_textAdd" onClick={handleShowChangeMail}>
                              <Typography type="span" modifiers={['blueNavy', '400', '16x24']} content={textEditEmail} />
                            </div>
                            <div className="t-serviceSetting_textAdd" onClick={handleShowAdd}>
                              <Typography type="span" modifiers={['blueNavy', '400', '16x24']} content={textAdd} />
                            </div>
                          </div>
                        </>
                      )
                      : (
                        <div className="t-account_form_new">
                          {showChangeMail
                            ? (
                              <>
                                <Input
                                  id="user_name"
                                  label={t('login.user_id') || ''}
                                  {...reg('user_name')}
                                  variant="borderRadius"
                                  readOnly
                                  defaultValue={userData?.user_name}
                                  error={erro.user_name?.message}
                                />
                                <Input
                                  id="email"
                                  label={t('login.email_address') || ''}
                                  placeholder="abcd@gmail.com"
                                  {...reg('email')}
                                  variant="borderRadius"
                                  defaultValue={userData?.email}
                                  error={erro.email?.message}
                                />
                                <Input
                                  id="curenter"
                                  label={t('login.password') || ''}
                                  type="password"
                                  isPassword
                                  {...reg('_password')}
                                  variant="borderRadius"
                                  defaultValue=""
                                  error={erro._password?.message}
                                />
                              </>
                            )
                            : (
                              <>
                                <Input
                                  id="user_name"
                                  label={t('login.user_id') || ''}
                                  {...register('user_name')}
                                  variant="borderRadius"
                                  readOnly
                                  defaultValue={userData?.user_name}
                                  error={errors.user_name?.message}
                                />
                                <Input
                                  id="email"
                                  label={t('login.email_address') || ''}
                                  placeholder="abcd@gmail.com"
                                  {...register('email')}
                                  variant="borderRadius"
                                  readOnly
                                  value={userData?.email}
                                  error={errors.email?.message}
                                />
                                <Input
                                  id="Oldpassword"
                                  label={t('login.current_password') || ''}
                                  type="password"
                                  isPassword
                                  {...register('current_password')}
                                  variant="borderRadius"
                                  defaultValue=""
                                  onFocus={() => setIsPass(false)}
                                  error={errors.current_password?.message}
                                />
                                <Input
                                  id="Newpassword"
                                  label={t('login.new_password') || ''}
                                  type="password"
                                  isPassword
                                  {...register('_password')}
                                  variant="borderRadius"
                                  defaultValue=""
                                  error={errors._password?.message}
                                />
                                <Input
                                  id="CFNewpassword"
                                  label={t('login.confirm_new_password') || ''}
                                  type="password"
                                  isPassword
                                  {...register('confirm_new_password')}
                                  variant="borderRadius"
                                  defaultValue=""
                                  error={errors.confirm_new_password?.message}
                                />
                              </>
                            )}
                          <div className="t-account_form_btn">
                            {subBtnText && (
                              <Button
                                modifiers={['columbia-blue']}
                                onClick={() => {
                                  if (handleCancel) handleCancel();
                                }}
                              >
                                <Typography content={subBtnText} modifiers={['700', '16x24', 'uppercase']} />
                              </Button>
                            )}
                            {btnText && (
                              <Button
                                modifiers={['primary']}
                                // disabled={!isSave}
                                type="submit"
                              >
                                <Typography content={btnText} modifiers={['700', '16x24', 'uppercase']} />
                              </Button>
                            )}
                          </div>

                        </div>
                      )}
                  </form>
                </div>
              </div>
            </div>
          </Container>
        )}
    </div>
  );
};

Account.defaultProps = {
};

export default Account;
