/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Option } from '../../atoms/DropDownCheckbox/index';

import Button from 'components/atoms/Button';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import Typography from 'components/atoms/Typography';
import { PullDownProps } from 'components/molecules/PullDown';
import Container from 'components/organisms/Container';
import { PositionProps } from 'components/organisms/PopupPosition';
import { updatePersionalitySevice } from 'services/Login';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getUserAction } from 'store/infouser';
import { TOKEN, USER_LOGIN } from 'utils/constants';

type PersionalitiesProps = PullDownProps & PositionProps & {
  desc?: string
  title?: string;
  indexActive?: number;
};

const Persionalities: React.FC<PersionalitiesProps> = ({
  textAdd,
  subBtnText,
  btnText,
  title,
  desc, placeholder,
  indexActive,
}) => {
  const userData = useAppSelector((state) => state.user.infuser);
  const Guest = localStorage.getItem(TOKEN);

  const [optionDatas, setOptionData] = useState(userData?.persionalities);
  const [stamp, setStamp] = useState(optionDatas);
  const [isHidden, setIsHidden] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [value, setValue] = useState('');
  const [isGuest, setIsGuest] = useState(true);
  const navigator = useNavigate();
  const [idUser, setidUser] = useState<number>();
  const { t } = useTranslation();

  useEffect(() => {
    setidUser(Number(Guest) || 0);
  }, [Guest]);

  useEffect(() => {
    if (Guest !== 'GUEST') {
      setIsGuest(false);
    }
  }, [Guest]);

  const handleShowAdd = () => {
    setIsHidden(true);
  };

  const handleRemove = (option: Option) => {
    setIsSave(true);
    setStamp((stamp) => stamp?.filter((optionData) => optionData.value !== option.value));
  };

  const handleCancel = () => {
    setIsHidden(false);
    if (isSave) {
      setStamp(optionDatas);
    }
    setIsSave(false);
  };

  const handleClickIcon = () => {
    if (value.trim() !== '') {
      const idx = stamp?.findIndex((item) => item.value === value);
      if (idx === -1) {
        const tam = [...stamp || []];
        tam.push({
          id_user: userData?.id_user,
          label: value,
          value: Math.floor(Math.random() * (50000 - 10 + 1)) + 10
        });
        setStamp(tam);
        setIsSave(true);
        setIsHidden(false);
        setValue('');
      }
    }
  };

  // const handleConfirm = () => {
  //   setOptionData(stamp);
  //   setIsSave(false);
  // };

  const dispatch = useAppDispatch();
  const { mutate: postPersionality } = useMutation(
    'post-footer-form',
    (data: Option[]) => updatePersionalitySevice(idUser || 0, data),
    {
      onSuccess: (data) => {
        dispatch(getUserAction(Number(idUser)));
        toast.success(t('notify.update_success') || '');
        setIsSave(false);
      },
      onError: () => {
      }
    }
  );

  const onSubmit = async () => {
    await postPersionality([
      ...stamp as Option[]
    ]);
  };

  return (
    <div className="t-serviceSetting">
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
            <div className="t-serviceSetting_wrapper">
              <div className="t-serviceSetting_title">
                <Typography
                  modifiers={['16x24', '500', 'blueNavy']}
                  content={desc}
                />
              </div>
              <div className="t-serviceSetting_addType">
                <div className="t-serviceSetting_addType_title">
                  <Typography
                    modifiers={['20x30', 'center', 'blueNavy', 'uppercase', '700']}
                    content={title}
                  />
                </div>
                <div className="t-serviceSetting_addType_list">
                  {stamp?.length
                    ? stamp?.map((item: Option) => (
                      <div className="t-serviceSetting_addType_item" key={item.value}>
                        <Typography type="span" modifiers={['16x24']} content={item.label} />
                        <div
                          className="t-serviceSetting_addType_icon"
                          onClick={() => {
                            if (handleRemove) {
                              handleRemove(item);
                            }
                          }}
                        >
                          <Icon iconName="cancel" size="12x12" isPointer />
                        </div>
                      </div>
                    )) : <Typography modifiers={['20x30', 'dimGray', '400', 'left']} content={t('popup.noPersonal') || ''} />}
                </div>
                <div className="t-serviceSetting_addType-input">
                  {isHidden && (
                    <div className="t-serviceSetting_input">
                      <Input
                        onKeyPress={(e) => { if (e.code === 'Enter') handleClickIcon(); }}
                        id="test"
                        autoFocus
                        autoComplete="off"
                        placeholder={placeholder}
                        iconName="addInput"
                        iconSize="25x25"
                        value={value}
                        handleClickIcon={handleClickIcon}
                        onChange={(e) => setValue(e.target.value)}
                      />
                    </div>
                  )}
                  {!isHidden && (
                    <div className="t-serviceSetting_textAdd" onClick={handleShowAdd}>
                      <Icon iconName="add" size="30x30" />
                      <Typography type="span" modifiers={['blueNavy', '700']} content={textAdd} />
                    </div>
                  )}
                  <Typography modifiers={['dimGray', '400', 'italic', '12x18']} content={t('training.personailty') || ''} />
                </div>
              </div>
              <div className="t-serviceSetting_btn">
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
                    disabled={!isSave}
                    onClick={() => {
                      if (onSubmit) onSubmit();
                    }}
                    type="submit"
                  >
                    <Typography content={btnText} modifiers={['700', '16x24', 'uppercase']} />
                  </Button>
                )}
              </div>
            </div>
          </Container>
        )}
    </div>
  );
};

export default Persionalities;
