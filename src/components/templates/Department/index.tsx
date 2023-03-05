/* eslint-disable no-sequences */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Button from 'components/atoms/Button';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import { PullDownProps } from 'components/molecules/PullDown';
import Container from 'components/organisms/Container';
import Popup from 'components/organisms/Popup';
import { PositionProps } from 'components/organisms/PopupPosition';
import useClickOutside from 'hooks/useClickOutside';
import { deleteDepartmentById, updateDepartmentById, updateDepartmentType } from 'services/Login';
import { OptionDept } from 'services/Login/types';
import { getAllDepartments } from 'store/UpdateBooking';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getUserAction } from 'store/infouser';
import { TOKEN, USER_LOGIN } from 'utils/constants';
import mapModifiers from 'utils/functions';

type DepartmentProps = PullDownProps & PositionProps & {
  desc?: string
  title?: string;
};

const Department: React.FC<DepartmentProps> = ({
  textAdd,
  subBtnText,
  btnText,
  title,
  desc,
  placeholder
}) => {
  const user = useAppSelector((state) => state.user.infuser);
  const idnexTab = useAppSelector((state) => state.example.indexTabSetting);
  const prefix = useAppSelector((state) => state.example.prefix);

  const Guest = localStorage.getItem(TOKEN);
  const [prefixClone, setPrefixClone] = useState(prefix);
  const [cloneIndexTab, setCloneIndexTab] = useState(idnexTab);
  const [stamp, setStamp] = useState(user?.departments);
  const [isHidden, setIsHidden] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [valueDept, setValueDept] = useState('');
  const [emailDept, setEmailDept] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addition, setAddition] = useState('');
  const [isGuest, setIsGuest] = useState(true);
  const [idUser, setidUser] = useState<number>();
  const [userData, setUserDatas] = useState(user);
  const [isUpdate, setIsUpdate] = useState(false);
  const [cloneDataUpdate, setCloneDataUpdate] = useState<OptionDept>();
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [idEdit, setIdEdit] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDeleteDept, setIsDeleteDept] = useState(false);
  const [idDelete, setIdDelete] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const { t } = useTranslation();
  const AllDepartment = useAppSelector((state) => state.update.AllDepartment);
  const [dulicateDer, setDulicateDer] = useState('');
  const navigator = useNavigate();

  useClickOutside(dropdownRef, () => {
    if (isShowEdit) setIsShowEdit(!isShowEdit);
  });
  const toggling = () => setIsShowEdit(!isShowEdit);

  useEffect(() => {
    setValueDept(cloneDataUpdate?.label || '');
    setEmailDept(cloneDataUpdate?.email_depart || '');
    setPhoneNumber(cloneDataUpdate?.phoneNumber.slice(3) || '');
  }, [cloneDataUpdate]);

  useEffect(() => {
    setidUser(Number(Guest) || 0);
  }, [Guest]);

  useEffect(() => {
    setPrefixClone(prefix);
  }, [prefix]);

  useEffect(() => {
    setCloneIndexTab(idnexTab);
    setIsHidden(false);
  }, [idnexTab]);

  useEffect(() => {
    dispatch(getAllDepartments());
  }, []);

  useEffect(() => {
    if (Guest !== 'GUEST') {
      setIsGuest(false);
    }
    setUserDatas(user);
    setStamp(user?.departments);
  }, [Guest, user]);

  const handleShowAdd = () => {
    setIsHidden(true);
  };

  const handleEditDept = (option: OptionDept) => {
    setValueDept(option.label);
    setEmailDept(option.email_depart);
    setPhoneNumber(option.phoneNumber);
    setCloneDataUpdate(option);
  };
  const handleCancel = () => {
    setIsHidden(false);
    if (isSave) {
      setStamp(stamp);
    }
    setIsSave(false);
  };

  const handleClickIcon = () => {
    if (!isUpdate) {
      if (valueDept.trim() !== '') {
        const tam = [...(stamp || [])];
        const newDepartment = {
          id_user: userData?.id_user,
          label: valueDept,
          value: Math.floor(Math.random() * (50000 - 10 + 1)) + 10,
          email_depart: emailDept,
          phoneNumber: `${phoneNumber && `+${prefixClone}`}${phoneNumber}`,
          domain: '',
          addition: '',
        };
        const isDulicate = (AllDepartment || []).find((item) => item.label.toLowerCase() === newDepartment.label.toLowerCase());
        if (!isDulicate) {
          tam.push(newDepartment);
          setIsSave(true);
          setIsHidden(false);
          setValueDept('');
          postRegister(newDepartment);
        } else {
          toast.error(t('notify.department_valid') || '');
        }
      } else {
        toast.error(t('notify.data_is_required') || '');
      }
    } else {
      const newDataUpdate = {
        ...cloneDataUpdate,
        email_depart: emailDept || cloneDataUpdate?.email_depart,
        phoneNumber: `${phoneNumber && `+${prefixClone}`}${phoneNumber}`,
        addition: addition || cloneDataUpdate?.addition,
      };
      updateDept(newDataUpdate as OptionDept);
    }
  };

  const updateDept = async (data: OptionDept) => {
    await postUpdateDeptByid(data);
  };

  const dispatch = useAppDispatch();

  const { mutate: postRegister } = useMutation(
    'post-footer-form',
    (data: OptionDept) => updateDepartmentType(data.id_derp || 0, data),
    {
      onSuccess: () => {
        dispatch(getUserAction(Number(idUser) || 0));
        setIsSave(false);
        toast.success(t('notify.update_success') || '');
      },
      onError: () => {
      }
    }
  );
  const { mutate: postUpdateDeptByid } = useMutation(
    'post-footer-form',
    (data: OptionDept) => updateDepartmentById(data.id_derp || 0, data),
    {
      onSuccess: () => {
        dispatch(getUserAction(Number(idUser) || 0));
        toast.success(t('notify.update_success') || '');
        setIsSave(true);
        setAddition('');
        setEmailDept('');
        setPhoneNumber('');
        setValueDept('');
        setIsUpdate(false);
      },
      onError: () => {
      }
    }
  );
  const { mutate: deleteDeptByid } = useMutation(
    'post-footer-form',
    (data: number) => deleteDepartmentById(data || 0),
    {
      onSuccess: () => {
        dispatch(getUserAction(Number(idUser) || 0));
        toast.success(t('notify.delete_success') || '');
        setIsDeleteDept(false);
      },
      onError: () => {
      }
    }
  );

  const handleDeleteDept = async (id: number) => {
    await deleteDeptByid(id);
  };

  const copyToClipBoard = (valueCopy: string) => {
    toast.info(t('notify.copyed') || '');
  };

  const renderPopupUpdateDeptById = () => (
    <div className="wrapper-popup_update">
      <div className={mapModifiers('wrapper-popup_update', 'item', 'dept')}>
        <Typography modifiers={['center', '16x24', '700', 'blueNavy', 'capitalize']}>{t('menu.department') || ''}</Typography>
        <Input
          autoFocus
          autoComplete="off"
          value={valueDept}
          placeholder={placeholder}
          readOnly
          variant="border8"
          id=""
        />
      </div>
      <div className={mapModifiers('wrapper-popup_update', 'item', 'email')}>
        <Typography modifiers={['center', '16x24', '700', 'blueNavy', 'capitalize']}>{t('login.email') || ''}</Typography>
        <Input
          placeholder={t('login.email_address') || ''}
          id="email_address"
          variant="border8"
          type="email"
          error={dulicateDer}
          value={emailDept}
          onChange={(event) => { setEmailDept(event.target.value); }}
        />
      </div>
      <div className={mapModifiers('wrapper-popup_update', 'item', 'phone_number')}>
        <Typography modifiers={['center', '16x24', '700', 'blueNavy', 'capitalize']}>{t('login.phone_number') || ''}</Typography>
        <Input
          placeholder={t('login.phone_number') || ''}
          id=""
          variant="border8"
          type="phone_number"
          error={dulicateDer}
          value={phoneNumber}
          onChange={(event) => { setPhoneNumber(event.target.value.replace(/\D/g, '')); }}
        />
      </div>
      <div className={mapModifiers('wrapper-popup_update', 'item', 'additon')}>
        <Typography modifiers={['center', '16x24', '700', 'blueNavy', 'capitalize']}>{t('login.addition') || ''}</Typography>
        <TextArea id="" readOnly={false} value={addition || cloneDataUpdate?.addition} handleOnchange={(e) => setAddition(e.target.value)} />
      </div>
      <div className="wrapper-popup_update_btn">
        {subBtnText && (
          <Button
            modifiers={['columbia-blue']}
            onClick={() => {
              setIsUpdate(false);
            }}
          >
            <Typography content={subBtnText} modifiers={['700', '16x24', 'uppercase']} />
          </Button>
        )}
        {btnText && (
          <Button
            modifiers={['primary']}
            onClick={() => {
              if (handleClickIcon) handleClickIcon();
            }}
            type="submit"
          >
            <Typography content={btnText} modifiers={['700', '16x24', 'uppercase']} />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="t-serviceSetting t-department_wrapper">
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
                <div className="t-serviceSetting_addType t-department-wrapper">
                  <div className="t-serviceSetting_addType_title">
                    <Typography
                      modifiers={['20x30', 'center', 'blueNavy', 'uppercase', '700']}
                      content={title}
                    />
                  </div>
                  <div className="t-serviceSetting_addType-input">
                    {isHidden && (
                      <div className="t-serviceSetting_input t-department_input">
                        <Input
                          id="test"
                          error={dulicateDer}
                          autoFocus
                          iconName="save_all"
                          iconSize="24x24"
                          autoComplete="off"
                          value={valueDept}
                          placeholder={placeholder}
                          handleClickIcon={handleClickIcon}
                          onChange={(e) => { setValueDept(e.target.value); setDulicateDer(''); }}
                          onKeyDown={(event) => {
                            if (event.code === 'Enter') {
                              handleClickIcon();
                            }
                            if (handleCancel && event.code === 'Escape') handleCancel();
                          }}
                        />
                      </div>
                    )}
                    {!isHidden && (
                      <div className="t-serviceSetting_textAdd t-department_setting_text" onClick={handleShowAdd}>
                        <Icon iconName="add" size="30x30" />
                        <Typography type="span" modifiers={['blueNavy', '700']} content={textAdd} />
                      </div>
                    )}
                    <Typography modifiers={['dimGray', '400', 'italic', '12x18']} content={t('training.department_setting') || ''} />
                  </div>
                  <div className="t-department_addType_list">
                    {stamp?.length
                      ? stamp?.map((itemDept: OptionDept) => (
                        <div className="t-department_addType_list_item" key={itemDept.value} ref={idEdit === itemDept.value && dropdownRef || null}>
                          <div className="t-department_addType_list_item_info item_dept"><Typography type="span" modifiers={['16x24', 'blueNavy']} content={itemDept.label} /></div>
                          <div
                            className="t-department_addType_list_item_info edit-dept"
                            onClick={() => {
                              toggling(); setIdEdit(itemDept.value || 0);
                            }}
                          >
                            <Icon iconName="edit_dept" isPointer />
                            {isShowEdit && itemDept.value === idEdit && (
                              <div className="edit-dept_option">
                                <CopyToClipboard
                                  text={`${itemDept.slug || ''}`}
                                  onCopy={() => copyToClipBoard(itemDept.slug || '')}
                                >
                                  <div className="edit-dept_item">
                                    <Typography type="span" modifiers={['16x24', 'blueNavy', 'center', 'capitalize']}>{t('popup.copy_slug_dept') || ''}</Typography>
                                  </div>
                                </CopyToClipboard>
                                <div className="edit-dept_item" onClick={() => { setIsUpdate(true); setCloneDataUpdate(itemDept); }}>
                                  <Typography type="span" modifiers={['16x24', 'blueNavy', 'center', 'capitalize']}>{t('popup.edit_dept') || ''}</Typography>
                                </div>
                                <div
                                  className="edit-dept_item"
                                  onClick={() => {
                                    setIsDeleteDept(true);
                                    setIdDelete(itemDept.id_derp || 0);
                                  }}
                                >
                                  <Typography type="span" modifiers={['16x24', 'blueNavy', 'center', 'capitalize']}>{t('popup.delete') || ''}</Typography>

                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )) : <Typography modifiers={['20x30', 'dimGray', '400', 'left']} content={t('menu.subtitle') || ''} />}
                  </div>
                </div>
              </div>
            </Container>
          )}
      </div>
      <Popup
        variant="medium"
        isOpen={isUpdate}
        handleClose={() => setIsUpdate(false)}
      >
        {renderPopupUpdateDeptById()}
      </Popup>
      <Popup
        variant="notify"
        isOpen={isDeleteDept}
        handleClose={() => setIsDeleteDept(false)}
      >
        <div className="t-department_popup_delete">
          <Icon iconName="errorOutline" size="80x80" />
          <Typography content={t('notify.delete_dept_confirm') || ''} modifiers={['700', '20x30', 'jet']} />
          <div className="t-department_popup_delete_btn">
            <Button
              modifiers={['columbia-blue']}
              onClick={() => {
                setIsDeleteDept(false);
              }}
            >
              <Typography content={subBtnText} modifiers={['700', '16x24', 'uppercase']} />
            </Button>
            <Button
              modifiers={['primary']}
              onClick={() => {
                handleDeleteDept(idDelete);
              }}
              type="submit"
            >
              <Typography content={t('popup.delete') || ''} modifiers={['700', '16x24', 'uppercase']} />
            </Button>
          </div>
        </div>
      </Popup>
    </>
  );
};

export default Department;
