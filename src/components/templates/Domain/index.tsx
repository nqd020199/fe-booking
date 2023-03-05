/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Button from 'components/atoms/Button';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import Typography from 'components/atoms/Typography';
import Container from 'components/organisms/Container';
import { updateDepartmentById } from 'services/Login';
import { OptionDept } from 'services/Login/types';
import { useAppSelector } from 'store/hooks';
import { TOKEN, USER_LOGIN } from 'utils/constants';

interface DomainProps {
  subBtnText?: string;
  btnText?: string;
  title?: string;
  desc?: string;
  textAdd?: string;
}

const Domain: React.FC<DomainProps> = ({
  desc, title, subBtnText, btnText, textAdd
}) => {
  const userData = useAppSelector((state) => state.user.infuser);
  const Guest = localStorage.getItem(TOKEN);
  const [optionDatas, setOptionData] = useState(userData?.departments);
  const [isGuest, setIsGuest] = useState(true);
  const [valueDomain, setValueDomain] = useState();
  const [isSave, setIsSave] = useState(false);

  const navigator = useNavigate();
  const { t } = useTranslation();
  const [cloneState, setCloneState] = useState({});
  const [idDeptEdit, setidDeptEdit] = useState<number>();
  const [isEdit, setIsEdit] = useState(false);

  const handleRenderState = () => {
    let list = {};
    optionDatas?.forEach((item, index) => {
      const { label } = item;
      list = { ...list, [label]: '' };
    });
    setCloneState(list);
  };

  useEffect(() => {
    setOptionData(userData?.departments);
    handleRenderState();
  }, [userData]);

  useEffect(() => {
    if (Guest !== 'GUEST') {
      setIsGuest(false);
    }
  }, [Guest]);

  const handleOnchangeDomain = (value: string, name: string) => {
    setCloneState({ [name]: value });
  };

  const handleCancel = () => {
    setIsSave(false);
  };

  const { mutate: postUpdateDeptByid } = useMutation(
    'post-footer-form',
    (data: OptionDept) => updateDepartmentById(idDeptEdit || 0, data),
    {
      onSuccess: () => {
        // dispatch(getUserAction(Number(idUser) || 0));
        toast.success(t('notify.update_success') || '');
        setIsSave(true);
      },
      onError: () => {
      }
    }
  );
  const handleUpdateDomain = async () => {
    // await postUpdateDeptByid(data);
  };

  return (
    <div className="t-domain">
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
            <div className="t-domain_wrapper">
              <div className="t-domain_title">
                <Typography
                  modifiers={['16x24', '500', 'blueNavy']}
                  content={desc}
                />
              </div>
              <div className="t-domain_addType">
                <div className="t-domain_addType_title">
                  <Typography
                    modifiers={['20x30', 'center', 'blueNavy', 'uppercase', '700']}
                    content={title}
                  />
                </div>
                <div className="t-domain_addType_list">
                  {optionDatas?.length ? optionDatas.map((dept, index) => (
                    <div key={dept.value} className={`t-domain_addType_list_item ${idDeptEdit !== dept.id_derp ? 'disable_item' : ''}`}>
                      <Input value={dept.label} readOnly id={`dept-${index}`} />
                      <Input
                        id={`input-domain-${dept.value}`}
                        readOnly={idDeptEdit !== dept.id_derp}
                        value={valueDomain}
                        onChange={(event) => handleOnchangeDomain(event.target.value, `domain${index}`)}
                      />
                      <div className="t-domain_addType_list_item_icon_edit">
                        <div
                          onClick={() => {
                            setidDeptEdit(dept.id_derp);
                            setIsEdit(true);
                          }}
                          className="t-domain_addType_list_item_icon"
                        >
                          <Icon iconName="edit_dept" size="24x24" isPointer />
                        </div>
                        <div
                          onClick={() => {
                            setidDeptEdit(dept.id_derp);
                            setIsEdit(false);
                          }}
                          className="t-domain_addType_list_item_icon"
                        >
                          <Icon iconName="save_all" size="24x24" isPointer />
                        </div>

                      </div>
                    </div>
                  )) : <Typography modifiers={['dimGray', '700', 'italic', '16x24']} content={t('training.developing') || ''} />}
                </div>
                <div className="t-domain_addType_text">
                  <Typography modifiers={['dimGray', '400', 'italic', '12x18']} content={textAdd} />
                </div>
              </div>
            </div>
            <div className="t-domain_btn">
              {subBtnText && (
                <Button
                  modifiers={['columbia-blue']}
                  onClick={() => {
                    // if (handleCancel) handleCancel();
                    toast.info(t('training.developing'));
                  }}
                >
                  <Typography content={subBtnText} modifiers={['700', '16x24', 'uppercase']} />
                </Button>
              )}
              {btnText && (
                <Button
                  modifiers={['primary']}
                  onClick={() => {
                    // if (handleUpdateDomain) handleUpdateDomain()
                    toast.info(t('training.developing'));
                  }}
                  type="submit"
                >
                  <Typography content={btnText} modifiers={['700', '16x24', 'uppercase']} />
                </Button>
              )}
            </div>
          </Container>
        )}
    </div>
  );
};

Domain.defaultProps = {
};

export default Domain;
