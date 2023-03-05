/* eslint-disable max-len */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Button from 'components/atoms/Button';
import Checkbox from 'components/atoms/Checkbox';
import Quality from 'components/atoms/Quality';
import Typography from 'components/atoms/Typography';
import PullDown from 'components/molecules/PullDown';
import Container from 'components/organisms/Container';
import {
  UpdateIndexRows, UpdateMaxTimeLineService, UpdateMinTimeLineService, updateTimeNotify
} from 'services/Booking';
import { SeclectType } from 'services/types';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getUserAction } from 'store/infouser';
import { TOKEN, USER_LOGIN } from 'utils/constants';

interface GenaralProps {
  optionTimeZone?: SeclectType[];
  optionDuaration?: SeclectType[];
  subBtnText?: string;
  btnText?: string;
  optionMinTimeZone?: SeclectType[]
  optionOverTime?: SeclectType[]
}

const Genaral: React.FC<GenaralProps> = ({
  optionTimeZone,
  optionDuaration,
  subBtnText,
  btnText,
  optionMinTimeZone,
  optionOverTime
}) => {
  const user = useAppSelector((state) => state.user.infuser);
  const [userData, setUserData] = useState(user);
  const [timezone, setTimeZone] = useState<SeclectType>();
  const [timezoneMin, setTimeZoneMin] = useState<SeclectType>();
  const [duaration, setDuaration] = useState<SeclectType>();
  const [indexRowSetting, setIndexRowSetting] = useState<SeclectType>();
  const [isSave, setIsSave] = useState(false);
  const Guest = localStorage.getItem(TOKEN);
  const navigator = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [qualityOverTime, setQualityOverTime] = useState(0);
  const [isChecked, setIsChecked] = useState(true);
  const [loadingCheck, setLoadingCheck] = useState(true);

  useEffect(() => {
    setIsChecked(userData?.isNotify as boolean);
  }, [userData]);

  useEffect(() => {
    if (timezone !== undefined || timezoneMin !== undefined || indexRowSetting !== undefined || isChecked !== undefined) {
      setIsSave(true);
    }
    setUserData(user);
  }, [timezone, timezoneMin, indexRowSetting, isChecked, user]);

  const { mutate: postMaxTime } = useMutation(
    'post-footer-form',
    (data: number) => UpdateMaxTimeLineService(Number(userData?.id_user), data),
    {
      onSuccess: () => {
        dispatch(getUserAction(Number(userData?.id_user) || 0));
        // toast.success(t('notify.update_password') || '');
      },
      onError: () => {
        // toast.error(t('notify.password_match') || '');
      }
    }
  );
  const { mutate: postMinTime } = useMutation(
    'post-footer-form',
    (data: number) => UpdateMinTimeLineService(Number(userData?.id_user), data),
    {
      onSuccess: () => {
        dispatch(getUserAction(Number(userData?.id_user) || 0));
      },
      onError: () => {
        toast.error(t('notify.password_match') || '');
      }
    }
  );
  const { mutate: postIndexRow } = useMutation(
    'post-footer-form',
    (data: number) => UpdateIndexRows(Number(userData?.id_user), data),
    {
      onSuccess: () => {
        dispatch(getUserAction(Number(userData?.id_user) || 0));
        toast.success(t('notify.update_success') || '');
      },
      onError: () => {
      }
    }
  );
  const { mutate: updateNotify } = useMutation(
    'update-time-notify',
    (data: boolean) => updateTimeNotify(Number(userData?.id_user), data),
    {
      onSuccess: () => {
        dispatch(getUserAction(Number(userData?.id_user) || 0));
      },
      onError: () => {
      }
    }
  );

  const handleConfirm = async () => {
    setIsSave(false);
    await postMinTime(Number(timezoneMin?._name === undefined
      ? userData?.mintime : timezoneMin?._name));
    await postMaxTime(Number(timezone?._name === undefined ? userData?.maxtime : timezone?._name));
    await postIndexRow(Number(indexRowSetting?._name === undefined ? userData?.indexRow : indexRowSetting?._name));
    await updateNotify(isChecked);
  };
  const handleCancel = () => {
    setIsSave(false);
    setTimeZone(undefined);
    setTimeZoneMin(undefined);
  };

  return (
    <div>
      {
        Guest === 'GUEST' ? (
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
        ) : (
          <Container modifiers={['left']}>
            <div className="t-genaral">
              <div className="t-genaral-wrapper">
                <div className="t-genaral-wrapper_calendar">
                  <Typography modifiers={['700', 'jet', '14x21', 'capitalize']}>
                    {t('setting.calendar_setting') || ''}
                  </Typography>
                  <div className="t-genaral_child">
                    <div className="t-genaral-wrapper_item t-genaral-wrapper_timezone">
                      <Typography modifiers={['14x21', 'jetSub']} content={t('validate.start_time') || ''} />
                      <PullDown
                        optionData={optionMinTimeZone || []}
                        value={timezoneMin as SeclectType}
                        handleSelect={(value) => setTimeZoneMin(value)}
                        placeholder={`${userData?.mintime === null || userData?.mintime === undefined ? '7 : 00 AM' : `${userData?.mintime} : 00 AM`} `}
                      />
                      <Typography modifiers={['14x21', 'jetSub']} content={t('validate.end_time') || ''} />
                      <PullDown
                        optionData={optionTimeZone || []}
                        value={timezone as SeclectType}
                        handleSelect={(value) => setTimeZone(value)}
                        placeholder={`${userData?.maxtime === null || userData?.maxtime === undefined ? '6 : 00 PM' : `${userData?.maxtime - 12} : 00 PM`} `}
                      />
                    </div>
                    <div className="t-genaral-wrapper_item t-genaral-wrapper_duration">
                      <Typography modifiers={['14x21', 'jetSub']} content={t('setting.appointment_duration_setting') || ''} />
                      <PullDown optionData={optionDuaration || []} value={duaration as SeclectType} handleSelect={(value) => setDuaration(value)} placeholder={`30 ${t('setting.minutes')}`} />
                    </div>
                    <div className="t-genaral-wrapper_item t-genaral-wrapper_quality">
                      <Typography modifiers={['14x21', 'jetSub']} content={t('popup.overtime_title_slot') || ''} />
                      <PullDown optionData={optionOverTime || []} value={indexRowSetting as SeclectType} handleSelect={(value) => setIndexRowSetting(value)} placeholder={`${userData?.indexRow} ${t('setting.row')}`} />
                    </div>
                  </div>
                  <Typography modifiers={['700', 'jet', '14x21', 'capitalize']}>{t('setting.notification_setting') || ''}</Typography>
                  <div className="t-genaral_child">
                    <Checkbox
                      isChecked={isChecked}
                      isCheckCustom
                      label={t('setting.notify_title') || ''}
                      desc={t('setting.notify_desc') || ''}
                      onChange={() => setIsChecked(!isChecked)}
                    />
                  </div>

                  <div className="t-genaral-wrapper_btn">
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
                          if (handleConfirm) handleConfirm();
                        }}
                        type="submit"
                      >
                        <Typography content={btnText} modifiers={['700', '16x24', 'uppercase']} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        )
      }
    </div>
  );
};

Genaral.defaultProps = {
};

export default Genaral;
