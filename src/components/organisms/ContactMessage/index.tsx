/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
import moment from 'moment';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import logo from 'assets/images/image_default.png';
import Image from 'components/atoms/Image';
import Input from 'components/atoms/Input';
import Typography from 'components/atoms/Typography';
import { IMAGEREGEX } from 'utils/constants';
import mapModifiers from 'utils/functions';

interface CardContactProps {
  avatar?: string;
  username?: string;
  time?: Date
  msg?: string;
  seen?: number
}
const CardContact: React.FC<CardContactProps> = ({
  avatar, username, time, msg, seen
}) => (
  <div
    className={mapModifiers('o-cardContact')}
  >
    <div className="o-cardContact_avatar">
      {avatar
        ? <Image src={avatar} /> : <Image src={logo} ratio="40x40" />}
    </div>
    <div className="o-cardContact_desc">
      <div className="o-cardContact_desc-username">
        <Typography modifiers={['14x21', '700', 'jet']}>{username}</Typography>
        <Typography modifiers={['12x18', '400', 'silver']}>{moment(time).locale('en').format('hh:mm A')}</Typography>
      </div>
      <div className="o-cardContact_desc-msg">
        <div className="o-cardContact_desc-msgText">
          <Typography modifiers={['12x18', '400', 'dimGray']}>
            {msg}
          </Typography>
        </div>
        <div className="o-cardContact_desc-msgStatus">
          {seen && seen > 0
            ? (
              <Typography modifiers={['12x18', '700', 'white']}>
                {seen > 9 ? '9+' : seen}
              </Typography>
            ) : ''}
        </div>
      </div>
    </div>
  </div>
);

interface ContactMessageProps {
  contactList?: any[];
  title?: string;
  placeholder?: string;
  dataSearch: string;
  handleMessage?: (id: number, id_receive: number) => void;
  onchange?: (e: ChangeEvent<HTMLInputElement>) => void;
  userId?: number
}

const ContactMessage: React.FC<ContactMessageProps> = ({
  contactList,
  title,
  placeholder,
  dataSearch,
  handleMessage,
  onchange,
  userId,
}) => {
  const { t } = useTranslation();
  const [currentSelected, setCurrentSelected] = useState<number | undefined>(undefined);
  const handleActive = (index: number, id: number, contact: number) => {
    setCurrentSelected(index);
    if (handleMessage) handleMessage(id, contact);
  };
  return (
    <div className="o-contact">
      <div className="o-contact_search">
        <Typography modifiers={['700', 'jet', '20x30']} content={title} />
        <Input
          id="search_id"
          variant="inputSearch"
          type="text"
          value={dataSearch}
          iconName="search"
          iconSize="17x17"
          placeholder={placeholder}
          onChange={(e) => { if (onchange) onchange(e); }}
        />
      </div>
      <div className="o-contact_user">
        {contactList
          && contactList.length
          ? contactList.map((contact, idx) => {
            if (contact.id_user !== userId) {
              const isOwn = contact
                ?.content_messages[Number(contact?.content_messages.length) - 1]?.id_user_send === userId ? `${t('training.you')} : ` : `${contact.user_name} :`;
              let count = 0;
              contact.content_messages.map((msg: any) => {
                if (!msg.status && msg.id_user_send !== userId) {
                  count += 1;
                }
              });
              return (
                <div
                  key={` ${idx.toString()}-contact`}
                  className={`o-contact_user-active ${idx === currentSelected ? 'active' : ''
                    }`}
                  onClick={() => {
                    if (handleActive) handleActive(idx, Number(userId), Number(contact.id_user));
                  }}
                >
                  <CardContact
                    seen={count}
                    avatar={contact.image_url}
                    username={contact.user_name}
                    time={contact
                      .content_messages ? contact
                        .content_messages[Number(contact?.content_messages.length) - 1]?.today
                      : new Date()}
                    msg={contact
                      .content_messages[Number(contact?.content_messages.length) - 1] ? contact
                        .content_messages[Number(contact?.content_messages.length) - 1]?.msg ? `${isOwn} ${contact
                          .content_messages[Number(contact?.content_messages.length) - 1]?.msg}`
                      : (
                        contact
                          .content_messages[Number(contact?.content_messages.length) - 1]?.media
                          && contact
                            .content_messages[Number(contact?.content_messages.length) - 1]?.media.match(IMAGEREGEX) ? `${isOwn} ${t('training.image')}` : `${isOwn} ${t('training.file')}`
                      ) : ''}
                  />
                </div>
              );
            }
          })
          : <Typography modifiers={['12x18', '400', 'dimGray', 'center']}>{t('notify.search_no_data')}</Typography>}
      </div>
      <div className="o-contact_du" />
    </div>
  );
};

ContactMessage.defaultProps = {
};

export default ContactMessage;
