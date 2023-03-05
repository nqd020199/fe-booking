/* eslint-disable no-nested-ternary */
import React from 'react';
import { DefaultExtensionType, FileIcon, defaultStyles } from 'react-file-icon';

import logo from 'assets/images/image_default.png';
import Checkbox from 'components/atoms/Checkbox';
import Icon from 'components/atoms/Icon';
import Image from 'components/atoms/Image';
import Link from 'components/atoms/Link';
import Typography from 'components/atoms/Typography';
import Player from 'components/organisms/Player';
import { fileCheck } from 'components/templates/ContentMessages';
import { OptionDept } from 'services/Login/types';
import { IMAGEREGEX, VIDEOREGEX } from 'utils/constants';

interface InfoUserMessageProps {
  titleSetting: string;
  titleSearch: string;
  titleMutual: string
  titleNotify: string
  user_name: string
  departments: OptionDept[]
  image_url: string
  isChecked: boolean
  onChange?: () => void
  onClickView?: () => void
  mediaList: any[];
  library: string;
  viewAll: string;
  handleClickImage?: (item: any) => void

}

const InfoUserMessage: React.FC<InfoUserMessageProps> = ({
  departments,
  user_name,
  image_url,
  titleSetting,
  titleSearch,
  titleMutual,
  titleNotify,
  isChecked,
  onChange,
  onClickView,
  mediaList,
  library,
  viewAll,
  handleClickImage
}) => (
  <div className="o-infoUserMessage">
    <div className="o-infoUserMessage_user">
      <div className="o-infoUserMessage_user-avatar">
        {image_url
          ? <Image src={image_url} alt="avartar" />
          : <Image src={logo} ratio="120x120" />}
      </div>
      <div className="o-infoUserMessage_user-name">
        <Typography modifiers={['20x30', '700', 'blueNavy']} content={user_name} />
      </div>
      {departments.length
        ? (
          <div className="o-infoUserMessage_user-department">
            {departments.map((department) => (
              <Typography
                key={`${department.label.toString()}`}
                content={department.label}
                modifiers={['14x21', '400', 'jet']}
              />
            ))}
          </div>
        ) : ''}
    </div>
    <div className="o-infoUserMessage_settings">
      <Typography modifiers={['14x21', '700', 'dimGray']} content={titleSetting} />
      <div className="o-infoUserMessage_settings-modifiers">
        <div className="o-infoUserMessage_settings-search">
          <Icon iconName="search" size="17x19" />
          <Typography modifiers={['14x21', '400', 'jet']} content={titleSearch} />
        </div>
        <div className="o-infoUserMessage_settings-mutual">
          <Icon iconName="addgroup" size="17x19" />
          <Typography modifiers={['14x21', '400', 'jet']} content={titleMutual} />
        </div>
        <div className="o-infoUserMessage_settings-bell">
          <div className="o-infoUserMessage_settings-icon">
            <Icon iconName="bell" size="17x19" />
            <Typography modifiers={['14x21', '400', 'jet']} content={titleNotify} />
          </div>
          <Checkbox isCheckCustom isChecked={isChecked} onChange={onChange} />
        </div>
      </div>
    </div>
    <div className="o-infoUserMessage_library">
      <div className="o-infoUserMessage_library-titles">
        <Typography modifiers={['14x21', '700', 'dimGray']} content={library} />
        <div onClick={onClickView}>
          <Typography modifiers={['14x21', '400', 'blueNavy']} content={viewAll} />
        </div>
      </div>
      <div className="o-infoUserMessage_library-imageList">
        {mediaList?.length
          ? mediaList.slice(0).reverse().map((item, idx) => {
            const result: DefaultExtensionType = fileCheck(item.media || '.doc') as DefaultExtensionType;
            return (
              <div key={`${idx.toString()}`} className="o-infoUserMessage_imageItem">
                {item.media.match(IMAGEREGEX)
                  ? (
                    <div
                      style={{ height: '100%' }}
                      onClick={() => {
                        if (handleClickImage) {
                          handleClickImage(item);
                        }
                      }}
                    >
                      <Image src={item.media} alt="image" />
                    </div>
                  )
                  : (item.media.match(VIDEOREGEX) ? (
                    <div
                      className="o-infoUserMessage_videoItem"
                    >
                      <Player
                        videoSrc={item.media}
                        isMuted
                      />
                    </div>
                  )
                    : (
                      <div
                        className="o-infoUserMessage_audioFileItem"
                      >
                        <FileIcon
                          extension={result}
                          {...defaultStyles[result]}
                        />
                        <div className="o-infoUserMessage_audioFileItem-name">
                          <Typography
                            modifiers={['14x21', '400', 'dimGray']}
                            content={item.media.replace('http://110.35.173.82:8081/public/file_mes/', '')}
                          />
                          <Link download href={item.media}>
                            <Icon iconName="download" size="20x20" />
                          </Link>
                        </div>
                      </div>
                    )
                  )}
              </div>
            );
          }) : ''}
      </div>
    </div>
  </div>
);

export default InfoUserMessage;
