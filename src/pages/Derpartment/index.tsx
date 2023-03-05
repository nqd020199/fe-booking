/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import imgDept from '../../assets/images/bg-derpartment1.png';

import Button from 'components/atoms/Button';
import Icon from 'components/atoms/Icon';
import Image from 'components/atoms/Image';
import Typography from 'components/atoms/Typography';
import MainLayout from 'components/templates/MainLayout';
import { OptionDept } from 'services/Login/types';
import { User } from 'services/types';
import { getAllDepartments } from 'store/UpdateBooking';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { getOtherUserAction } from 'store/infoOtheruser';
import { TOKEN } from 'utils/constants';

const Derpartment = () => {
  const derpartment = useAppSelector((state) => state.update.AllDepartment);
  const user = useAppSelector((state) => state.otherUser.otherUser);
  const [dataUser, setDataUser] = useState<User>();
  const [departmentShow, setDepartmentShow] = useState<string>();
  const [departmentUrl, setDepartmentUrl] = useState<string>();
  const [DeptClick, setDeptClick] = useState<OptionDept>();
  console.log('DaiNQ 🚀 -> Derpartment -> DeptClick:', DeptClick);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const Guest = localStorage.getItem(TOKEN);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getAllDepartments());
    sessionStorage.setItem('indexSettingTab', '0');
  }, []);

  useEffect(() => {
    dispatch(getOtherUserAction(Number(derpartment[0]?.id_user)));
  }, [derpartment]);

  useEffect(() => {
    setDataUser(user);
  }, [user, Guest]);

  const handleClickUser = (person: User, departments: OptionDept) => {
    if (Number(Guest) !== person.id_user) {
      return navigate(`/${person.id_user}/${departments.sub_name}`);
    }
    return navigate('/');
  };

  return (
    <MainLayout isShowBarLayout>
      <div className="p-department">
        {derpartment?.length
          ? (
            <div className="p-department_list ">
              {derpartment.map((derItem, idx) => (
                <Button
                  modifiers={['white']}
                  key={`index${idx.toString()}`}
                  className="p-button"
                  onClick={() => {
                    dispatch(getOtherUserAction(Number(derItem?.id_user)));
                    setDepartmentShow(derItem.label);
                    setDepartmentUrl(derItem.sub_name);
                    setDeptClick(derItem);
                  }}
                >
                  <Typography content={derItem.label} modifiers={['400', '16x24']} />
                </Button>
              ))}
            </div>
          ) : (
            <Typography modifiers={['700', '24x36', 'uppercase', 'blueNavy']} content="" />
          )}
        <div className="p-department_desc">
          <div className="p-department_desc-detail_bg">
            <Image src={imgDept} size="contain" />
            {dataUser && (
              <div className="p-department_desc-detail_bg_item">
                <div className="p-department_desc-detail_bg_item_content">
                  <div className="p-department_desc-detail_bg_item_title">
                    <Typography modifiers={['700', '24x36', 'uppercase', 'blueNavy']}>
                      {departmentShow || derpartment[0]?.label}
                    </Typography>
                  </div>
                  <div className="p-department_desc-detail_bg_item_info">
                    <Typography modifiers={['700', '16x24', 'blueNavy']}>
                      {dataUser?.user_name}
                    </Typography>
                    <div className="p-department_desc-detail_bg_item_info_icon">
                      <Icon iconName="dept_mail" size="24x24" />
                      {DeptClick?.email_depart
                        && (<Typography modifiers={['400', '14x21']} content={DeptClick?.email_depart} />)
                        || <Typography modifiers={['400', '14x21', 'silver']} content={t('validate.not_available') || ''} />}
                    </div>
                    <div className="p-department_desc-detail_bg_item_info_icon">
                      <Icon iconName="dept_phone" size="24x24" />
                      {DeptClick?.phoneNumber
                        && (<Typography modifiers={['400', '14x21']} content={DeptClick?.phoneNumber} />)
                        || <Typography modifiers={['400', '14x21', 'silver']} content={t('validate.not_available') || ''} />}
                    </div>
                    <div className="p-department_desc-detail_bg_item_info_icon desctiption-dept">
                      <Icon iconName="dept_info" size="24x24" />
                      {DeptClick?.addition
                        && (<Typography modifiers={['400', '14x21']} content={DeptClick?.addition.replace('\n', '</br>')} />)
                        || <Typography modifiers={['400', '14x21', 'silver']} content={t('validate.not_available') || ''} />}
                    </div>
                  </div>
                </div>
                <div className="p-department_desc-detail_bg_item_btn">
                  <Button onClick={() => handleClickUser(dataUser, DeptClick as OptionDept)}>
                    <Typography modifiers={['700', '16x24', 'uppercase']}>{t('login.calendar') || ''}</Typography>
                  </Button>
                  <Button>
                    <Typography modifiers={['700', '16x24', 'uppercase']}>{t('login.portal') || ''}</Typography>
                  </Button>

                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Derpartment;
