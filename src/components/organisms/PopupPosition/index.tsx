/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import Popup from '../Popup';

import Button from 'components/atoms/Button';
import { Option } from 'components/atoms/DropDownCheckbox';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import Typography from 'components/atoms/Typography';
import { deleteDepartmentById } from 'services/Login';
import { OptionDept } from 'services/Login/types';
import { SeclectType } from 'services/types';
import { department } from 'store/department';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getUserAction } from 'store/infouser';
import { TOKEN } from 'utils/constants';

export interface PositionProps {
  isOpen?: boolean;
  handleClose?: () => void;
  nameUser?: string;
  message?: string;
  btnText?: string;
  subBtnText?: string;
  skipBtnText?: string;
  handleSubBtn?: () => void;
  positionsList?: SeclectType[];
  textAdd?: string;
  handleShowAdd?: () => void;
  // value?: SeclectType;
  handleRemove?: (option: SeclectType) => void;
  idUser?: number;
  textPlaceholder?: string;
  viewActive?: {};
  indexView?: number;
  title: {};
  handleConfirmDepartment?: () => void;
  handleConfirmPersonalities?: (option: Option[]) => void;
  handleConfirmService?: (option: SeclectType[]) => void;
  handleAddDept?: (option: OptionDept) => void;
}

const PopupPosition: React.FC<PositionProps> = ({
  isOpen = false,
  handleClose,
  nameUser,
  message,
  btnText,
  subBtnText,
  skipBtnText,
  handleSubBtn,
  positionsList,
  viewActive,
  indexView = 0,
  textAdd,
  handleShowAdd,
  handleRemove,
  idUser,
  textPlaceholder,
  title,
  handleConfirmDepartment,
  handleConfirmPersonalities,
  handleConfirmService,
  handleAddDept
}) => {
  const userData = useAppSelector((state) => state.user.infuser);
  const lang = useAppSelector((state) => state.example.language);
  const prefix = useAppSelector((state) => state.example.prefix);

  const [cacheDepartment, setCacheDepartment] = useState<OptionDept[]>(userData?.departments || []);
  const [cachePersonality, setCachePersonality] = useState<Option[]>(userData?.persionalities || []);
  const [cacheServiceType, setCacheServiceType] = useState<SeclectType[]>(userData?.select_types || []);
  const [departmentItem, setDepartmentItem] = useState('');
  const [personalityItem, setPersonalityItem] = useState('');
  const [serviceItem, setServiceItem] = useState('');
  const [toggle, setToggle] = useState(false);
  const nameButton = ['popup.next', 'popup.next', 'popup.finish'];
  const { t } = useTranslation();
  const AllDepartment = useAppSelector((state) => state.update.AllDepartment);
  const cloneAllDepartment = AllDepartment;
  const [dulicateDer, setDulicateDer] = useState('');
  const [emailDepartment, setEmailDepartment] = useState('');
  const [phoneNumberDept, setPhoneNumberDept] = useState('');
  const [prefixClone, setPrefixClone] = useState(prefix);
  const dispatch = useAppDispatch();
  /// language
  const titlePopup = ['popup.titlePerson', 'popup.titleDerpart', 'popup.titleSerVice'];
  const nameBooking = ['popup.personality', 'popup.department', 'popup.service'];
  const nameButtonAddItem = ['popup.add-personalities', 'popup.add-department', 'popup.add-service'];
  const titleTraning = ['training.personailty', 'training.department', 'training.service_type'];

  const handleRemovePersonality = (item: Option) => {
    const newcachePersonality = cachePersonality?.filter((z) => z.label !== item.label);
    setCachePersonality(newcachePersonality);
  };
  const handleRemoveServiceType = (item: SeclectType) => {
    const newcacheServiceType = cacheServiceType?.filter((y) => y.id_selection !== item.id_selection);
    setCacheServiceType(newcacheServiceType);
  };
  useEffect(() => {
    setCacheDepartment(userData?.departments || []);
    setCachePersonality(userData?.persionalities || []);
    setCacheServiceType(userData?.select_types || []);
  }, [userData]);

  useEffect(() => {
    setPrefixClone(prefix);
  }, [prefix]);

  const { mutate: deleteDeptByid } = useMutation(
    'post-footer-form',
    (data: number) => deleteDepartmentById(data || 0),
    {
      onSuccess: () => {
        dispatch(getUserAction(Number(idUser) || 0));
        toast.success(t('notify.delete_success') || '');
        if (!userData?.departments.length) {
          dispatch(department(userData?.departments[0] as OptionDept));
        }
      },
      onError: () => {
      }
    }
  );
  const handleRemoveDepartment = async (item: number) => {
    await deleteDeptByid(item);
  };

  const handleCacheDepartment = (type: string) => {
    switch (type) {
      case 'Department':
        if (departmentItem.trim() !== '') {
          const listDepartment = [...cacheDepartment || []];
          const newDepartment = {
            id_user: idUser || Math.floor(Math.random() * (50000 - 10 + 1)) + 10,
            label: departmentItem,
            value: Math.floor(Math.random() * 100000),
            email_depart: '',
            phoneNumber: '',
            domain: '',
            addition: ''
          };
          const isDulicate = (cloneAllDepartment || []).find((item) => item.label.toLowerCase() === newDepartment.label.toLowerCase());
          const isDulicateNewList = (listDepartment || []).find((item) => item.label.toLowerCase() === newDepartment.label.toLowerCase());
          if (!isDulicate && !isDulicateNewList) {
            setCacheDepartment(listDepartment);
            setDepartmentItem('');
            if (handleAddDept) handleAddDept(newDepartment as OptionDept);
          } else {
            toast.error(t('notify.department_valid') || '');
          }
        } else {
          toast.error(t('notify.enter_your_department') || '');
        }
        break;
      case 'Personality':
        if (personalityItem.trim() !== '') {
          const listDepartment = [...cachePersonality || []];
          const newcachePersonality = {
            id_user: idUser || Math.floor(Math.random() * 1000),
            label: personalityItem,
            value: Math.floor(Math.random() * (50000 - 10 + 1)) + 10,
          };
          listDepartment.push(newcachePersonality);
          setCachePersonality(listDepartment);
          setPersonalityItem('');
        } else {
          toast.error(t('notify.enter_your_department') || '');
        }
        break;
      case 'Service':
        if (serviceItem.trim() !== '') {
          const CloneList = [...cacheServiceType || []];
          const NewItem = {
            id_user: userData?.id_user,
            id_selection: Math.floor(Math.random() * (50000 - 10 + 1)) + 10,
            _values: serviceItem,
          };
          CloneList.push(NewItem);
          setCacheServiceType(CloneList);
          setServiceItem('');
        } else {
          toast.error(t('notify.enter_your_department') || '');
        }
        break;

      default: break;
    }
  };

  const renderForServiceType = () => (cacheServiceType?.length ? (
    <div className="o-position_positionList">
      {cacheServiceType?.length && cacheServiceType.map((cacheItem) => (
        <div className="o-position_positionList_item" key={cacheItem.id_selection}>
          <Typography modifiers={['dimGray', '400', '16x24']} content={cacheItem._values} key={cacheItem.id_user} />
          <div
            className="o-position_positionList_icon"
            onClick={() => {
              if (handleRemoveServiceType) {
                handleRemoveServiceType(cacheItem);
              }
            }}
          >
            <Icon iconName="cancel" size="12x12" isPointer />
          </div>
        </div>
      ))}
    </div>
  ) : <Typography modifiers={['jet', '300', '14x21', 'left']}>{t('popup.noService') || ''}</Typography>);

  const renderDepartment = () => (cacheDepartment?.length ? (
    <div className="o-position_positionList o-position_department_list">
      {cacheDepartment?.length && cacheDepartment.map((cacheItem) => (
        <div className="o-position_positionList_item" key={cacheItem.label}>
          <Typography modifiers={['dimGray', '400', '16x24']} content={cacheItem.label} key={cacheItem.id_user} />
          <div
            className="o-position_positionList_icon"
            onClick={() => {
              if (handleRemoveDepartment) {
                handleRemoveDepartment(cacheItem.id_derp || 0);
              }
            }}
          >
            <Icon iconName="cancel" size="12x12" isPointer />
          </div>
        </div>
      ))}
    </div>
  ) : <Typography modifiers={['jet', '300', '14x21', 'left']}>{t('popup.noDepartment') || ''}</Typography>);

  const renderPersonality = () => (cachePersonality?.length ? (
    <div className="o-position_positionList">
      {cachePersonality?.length && cachePersonality.map((cacheItem) => (
        <div className="o-position_positionList_item" key={cacheItem.label}>
          <Typography modifiers={['dimGray', '400', '16x24']} content={cacheItem.label} key={cacheItem.id_user} />
          <div
            className="o-position_positionList_icon"
            onClick={() => {
              if (handleRemovePersonality) {
                handleRemovePersonality(cacheItem);
              }
            }}
          >
            <Icon iconName="cancel" size="12x12" isPointer />
          </div>
        </div>
      ))}
    </div>
  ) : <Typography modifiers={['jet', '300', '14x21', 'left']}>{t('popup.noPersonal') || ''}</Typography>);

  const renderData = () => {
    switch (indexView) {
      case 0: return renderPersonality();
      case 1: return renderDepartment();
      case 2: return renderForServiceType();
      default: break;
    }
  };

  return (
    <Popup
      isOpen={isOpen}
      handleClose={handleClose}
      closeName="close"
      sizeClose="34x34"
      variant="positions"
    >
      <div className="o-position_main">
        <div className="o-position_desc">
          {
            indexView === 0 && (
              <div className="o-position_name">
                <Typography type="h3" modifiers={['jet', '24x36', '700']}>
                  {`${t('homepage.hi') || ''} ${nameUser}${lang.acronym === 'KO' ? '님' : '!'}`}
                </Typography>
              </div>
            )
          }
          {indexView === 0
            && (
              <div className="o-position_company">
                <Typography type="p" modifiers={['jet', '400', '14x21']} content={t('menu.department-title') || ''} />
              </div>
            )}
          <div className="o-position_message">
            <Typography type="p" modifiers={['jet', '400', '14x21']} content={t(`${titlePopup[indexView]}`) || ''} />
          </div>
          <div className="o-position_title">
            <Typography type="p" modifiers={['blueNavy', '700', '20x30', 'center', 'uppercase']} content={t(`${nameBooking[indexView]}`) || ''} />
          </div>
          <div className="o-position_session">
            {renderData()}
            {toggle ? (
              <div className="o-position_input">
                {indexView === 0 && (
                  <Input
                    placeholder={t('popup.add-personalities') || ''}
                    id=""
                    variant="border8"
                    iconName="addInput"
                    iconSize="20x20"
                    value={personalityItem}
                    onChange={(event) => setPersonalityItem(event.target.value || '')}
                    onKeyPress={(e) => {
                      if (e.code === 'Enter') handleCacheDepartment('Personality');
                    }}
                    handleClickIcon={() => handleCacheDepartment('Personality')}
                  />
                )}
                {indexView === 1 && (
                  <Input
                    placeholder={t('popup.add-department') || ''}
                    id=""
                    variant="border8"
                    iconName="addInput"
                    iconSize="20x20"
                    error={dulicateDer}
                    value={departmentItem}
                    onChange={(event) => { setDepartmentItem(event.target.value || ''); setDulicateDer(''); }}
                    onKeyPress={(e) => {
                      if (e.code === 'Enter') handleCacheDepartment('Department');
                    }}
                    handleClickIcon={() => handleCacheDepartment('Department')}
                  />
                )}
                {indexView === 2 && (
                  <Input
                    placeholder={t('popup.add-service') || ''}
                    id=""
                    variant="border8"
                    iconName="addInput"
                    iconSize="20x20"
                    value={serviceItem}
                    onChange={(event) => setServiceItem(event.target.value || '')}
                    onKeyPress={(e) => {
                      if (e.code === 'Enter') handleCacheDepartment('Service');
                    }}
                    handleClickIcon={() => handleCacheDepartment('Service')}
                  />
                )}
              </div>
            ) : (
              <div className="o-position_textAdd" onClick={() => setToggle(!toggle)}>
                <Icon iconName="add" size="30x30" isPointer />
                <Typography modifiers={['blueNavy', '700', 'normal']} content={t(`${nameButtonAddItem[indexView]}`) || ''} />
              </div>
            )}
            <div className="o-position_title_training">
              <Typography modifiers={['dimGray', '400', 'italic', '12x18']} content={t(`${titleTraning[indexView]}`) || ''} />
            </div>
          </div>
        </div>
        <div className="o-position_btn">
          {skipBtnText && (
            <Button
              modifiers={['white']}
              onClick={() => {
                if (handleClose) handleClose();
              }}
            >
              {skipBtnText}
            </Button>
          )}
          {subBtnText && indexView !== 0 && (
            <Button
              modifiers={['columbia-blue']}
              onClick={() => {
                if (handleSubBtn) handleSubBtn();
              }}
            >
              <Typography modifiers={['blueNavy', '700', '16x24', 'uppercase']} content={subBtnText} />
            </Button>
          )}
          {btnText && (
            <Button
              modifiers={['primary']}
              onClick={() => {
                if (handleConfirmPersonalities && indexView === 0) handleConfirmPersonalities(cachePersonality);
                if (handleConfirmDepartment && indexView === 1) handleConfirmDepartment();
                if (handleConfirmService && indexView === 2) handleConfirmService(cacheServiceType);
              }}
            >
              <Typography
                modifiers={['16x24', '700', 'white', 'uppercase']}
                content={t(`${nameButton[indexView]}`) || ''}
              />
            </Button>
          )}
        </div>
      </div>
    </Popup>
  );
};
PopupPosition.defaultProps = {
  isOpen: false,
  nameUser: 'userName ...',
  message: '',
  btnText: undefined,
  subBtnText: '',
  handleSubBtn: undefined,
  positionsList: [],
  handleRemove: undefined,
};
export default PopupPosition;
