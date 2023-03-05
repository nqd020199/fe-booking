/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';

import Button from 'components/atoms/Button';
import Icon, { IconName } from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import Popup from 'components/organisms/Popup';
import mapModifiers from 'utils/functions';

export type NotifyType = 'success' | 'error' | 'none';

export type NotifyButtonType = 'default' | 'twoButton' | 'onlyButton';
export interface NotifyProps {
  isOpen?: boolean;
  handleClose?: () => void;
  type?: NotifyType;
  title?: string;
  message?: string;
  btnText?: string;
  subBtnText?: string;
  handleConfirm?: () => void;
  handleSubBtn?: () => void;
  notifiLogin?: boolean;
  userName?: string;
  descLogin?: string
  CountDown?: number;
  modifiers?: NotifyButtonType;
  animateNotify: boolean;
  iconProps?: IconName;
}

const Notify: React.FC<NotifyProps> = ({
  isOpen = false,
  handleClose,
  type = 'success',
  title,
  message,
  btnText,
  handleConfirm,
  subBtnText,
  handleSubBtn,
  notifiLogin,
  userName,
  descLogin,
  CountDown,
  modifiers,
  animateNotify,
  iconProps = 'circle_half',
}) => {
  const [swithIcon, setSwithIcon] = useState(false);
  const [icon, setIcon] = useState<IconName>(iconProps);
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setSwithIcon(true);
        setIcon('done_notify');
      }, 3000);
    }
  }, [isOpen]);
  return (
    <Popup
      isOpen={isOpen}
      handleClose={handleClose}
      closeName="close"
      sizeClose="24x24"
      variant="notify"
    >
      {notifiLogin
        ? (
          <div className="o-notify_mainLogin">
            <Typography type="span" modifiers={['blueNavy', '400']} content={userName} />
            <div className="o-notify_title">
              <Typography modifiers={['dimGray', '400', 'center']} content={descLogin} />
            </div>
            {CountDown && (
              <Typography modifiers={['blueNavy', '14x21']}>
                {CountDown}
                s
              </Typography>
            )}
            <div className="o-notify_mainLogin_btn">
              {btnText && (
                <Button
                  modifiers={['primary']}
                  onClick={() => {
                    if (handleConfirm) handleConfirm();
                  }}
                >
                  {btnText}
                </Button>
              )}
            </div>
          </div>
        )
        : (
          <div className={mapModifiers('o-notify_main', modifiers)}>
            {animateNotify ? (
              <div className="o-notify_main_animate">
                <div className="o-notify_main_animate_icon">
                  {
                    !swithIcon ? (
                      <div className="o-notify_main_animate_icon_loading">
                        <Icon iconName={icon} size="80x80" />
                      </div>
                    ) : (
                      <div className="o-notify_main_animate_icon_done">
                        <Icon iconName={icon} size="80x80" />
                      </div>
                    )
                  }
                  <div className="o-notify_main_animate_icon_line" />
                </div>
                <div className="o-notify_main_animate_title">
                  {message && (
                    <div className="o-notify_title_message">
                      <Typography type="p" modifiers={['dimGray', '400']} content={message} />
                    </div>
                  )}
                </div>
              </div>
            )
              : (
                <div className="o-notify_main_title">
                  <div className="o-notify_icon">
                    <Icon iconName={type === 'success' ? 'successOutline' : 'errorOutline'} size="69x72" />
                  </div>
                  <div className="o-notify_title">
                    <Typography type="h3" modifiers={['cg-red', '20x30', '700']}>
                      {title}
                    </Typography>
                    {message && (
                      <div className="o-notify_title_message">
                        <Typography type="p" modifiers={['dimGray', '400']} content={message} />
                      </div>
                    )}
                  </div>
                </div>

              )}

            <div className="o-notify_btn">
              {subBtnText && (
                <Button
                  modifiers={['columbia-blue']}
                  onClick={() => {
                    if (handleClose) handleClose();
                    if (handleSubBtn) handleSubBtn();
                    setSwithIcon(false);
                  }}
                >
                  <Typography
                    modifiers={['700', 'uppercase']}
                    content={subBtnText}
                  />
                </Button>
              )}
              {btnText && (
                <Button
                  modifiers={['primary']}
                  onClick={() => {
                    if (handleClose) handleClose();
                    if (handleConfirm) handleConfirm();
                  }}
                >
                  <Typography
                    modifiers={['700', 'uppercase']}
                    content={btnText}
                  />
                </Button>
              )}
            </div>
          </div>
        )}
    </Popup>
  );
};

Notify.defaultProps = {
  isOpen: false,
  type: 'success',
  title: '',
  message: '',
  btnText: undefined,
  handleConfirm: undefined,
  subBtnText: '',
  handleSubBtn: undefined,
  CountDown: 60,
  animateNotify: false,
};

export default Notify;
