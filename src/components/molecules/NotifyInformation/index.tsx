/* eslint-disable react/no-array-index-key */
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from 'components/atoms/Button';
import Icon, { IconName } from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';

export type OptionTask = {
  icon?: IconName;
  content?: string;
};

interface NotifyInformationProps {
  desc?: string;
  recommend?: string;
  option?: OptionTask[];
  handleClose?: () => void;
}

const NotifyInformation: React.FC<NotifyInformationProps> = ({
  desc,
  option,
  handleClose,
  recommend
}) => {
  const { t } = useTranslation();

  return (
    <div className="m-notify-infos">
      <div className="m-notify-infos_left">
        <div className="m-notify-infos_left_content">
          <div className="m-notify-infos_left_content_name">
            <Typography modifiers={['40x36', '700', 'blueNavy', 'capitalize']} type="p" content={`${t('homepage.hi') || ''} ${t('homepage.guest') || ''},`} />
          </div>
          {
            desc && (
              <div className="m-notify-infos_left_content_desc">
                <Typography modifiers={['16x24', '400', 'jetSub', 'normal']} type="p" content={desc} />
              </div>
            )
          }
          {
            option?.length && option.map((item, index) => (
              <div className="m-notify-infos_left_content_task" key={`index${index}`}>
                <Icon iconName={item.icon as IconName} size="32x32" />
                <Typography modifiers={['16x24', '400', 'jetSub', 'normal']} type="p" content={t((item.content || '').toString()) || ''} />
              </div>
            ))
          }
          {
            recommend && (
              <div className="m-notify-infos_left_content_recommend">
                <Typography modifiers={['16x24', '400', 'jetSub', 'normal']} type="p" content={recommend} />
              </div>
            )
          }
        </div>
        <div className="m-notify-infos_left_btn">
          <Button
            modifiers={['primary']}
            onClick={() => { if (handleClose) handleClose(); }}
          >
            <Typography
              modifiers={['16x24', '700', 'white', 'uppercase']}
              content={t('notify.close') || ''}
            />
          </Button>
        </div>
      </div>
      <div className="m-notify-infos_right">
        <div className="m-notify-infos_right_calendar" />
      </div>
    </div>
  );
};

NotifyInformation.defaultProps = {
};

export default NotifyInformation;
