/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

import { NextArrow, PrevArrow } from 'components/organisms/Carousel';
import ContactMessage from 'components/organisms/ContactMessage';
import InfoUserMessage from 'components/organisms/InfoUserMessage';
import PopupUtility, { SlideItem } from 'components/organisms/PopupUtility';
import ContentMessages from 'components/templates/ContentMessages';
import MainLayout from 'components/templates/MainLayout';
import UnderDevelop from 'pages/UnderDevelop';
import getContactAllUserMessageServices, { getContactUserChatServices, putSeenMessage } from 'services/Message';
import { ContactAllUserTypes } from 'services/Message/types';
import { User } from 'services/types';
import { isChat } from 'store/example';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { IMAGEREGEX, SOCKET, TOKEN } from 'utils/constants';
import mapModifiers from 'utils/functions';

type UserCur = User & {
  media_messages?: any[]
};
const Messages: React.FC = () => {
  const { t } = useTranslation();
  const isChatmess = useAppSelector((state) => state.example.isChat);
  const Guest = localStorage.getItem(TOKEN);
  const [dataSearch, setDataSearch] = useState('');
  const [contactList, setContactList] = useState<any[]>([]);
  const [userCurrent, setUserCurrent] = useState<UserCur>();
  const [isChecked, setIsChecked] = useState(true);
  const [msgList, setMsgList] = useState([]);
  const dispatch = useAppDispatch();
  const [currWidthScreen, setCurrWidthScreen] = useState(window.innerWidth);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenContent, setIsOpenContent] = useState(false);
  const [dataImageList, setDataImageList] = useState<SlideItem[]>([]);
  const [dataImageListContent, setDataImageListContent] = useState<SlideItem[]>([]);

  const [indexSlide, setIndexSlide] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setCurrWidthScreen(window.innerWidth);
    };
    // hiển thị lại width
    window.addEventListener('resize', handleResize);
    // clean up để fix lỗi toggle
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const { mutate: getAllContact } = useMutation(
    'post-footer-form',
    () => getContactAllUserMessageServices(Number(Guest)),
    {
      onSuccess: (data) => {
        const list: ContactAllUserTypes[] = [];
        if (dataSearch) {
          data.forEach((item: ContactAllUserTypes) => {
            if (item?.user_name?.toLocaleLowerCase().search(dataSearch) !== -1) {
              list.push(item);
            }
          });
          setContactList(list as ContactAllUserTypes[]);
        } else {
          const d = data.filter((contact: any) => contact?.content_messages.length > 0);
          if (d.length) {
            d.sort((a: any, b: any) => b.content_messages[Number(b?.content_messages.length) - 1]?.today.localeCompare(a.content_messages[Number(a?.content_messages.length) - 1]?.today));
            setContactList(d);
          } else {
            setContactList(data);
          }
        }
      },
      onError: () => {
      }
    }
  );
  const { mutate: getUserContact, isLoading } = useMutation(
    'post-footer-form',
    (id: number) => getContactUserChatServices(Number(Guest), id),
    {
      onSuccess: (data) => {
        const dataList = data.get_contact.map((msg: any) => (
          {
            msg: msg.msg,
            today: msg.today,
            isUser: msg.id_user_send === msg.id_user,
            media: msg.media,
            avatar_receive: msg.avatar_send,
            id_content: msg.id_content
          }
        ));
        setMsgList(dataList);
        const dataImageListCon = dataList.filter((item: any) => item.media !== null && item.media.match(IMAGEREGEX)).slice(0).reverse().map((item: any, idx: any) => ({
          imgSrc: item.media, idx, id: item.id_content, desc: item.media.replace('http://110.35.173.82:8081/public/img_mes/', '')
        }));
        setDataImageListContent(dataImageListCon);
      },
      onError: () => {
      }
    }
  );

  const { mutate: seenMessage } = useMutation(
    'put-seen-message',
    (id: number) => putSeenMessage(id),
    {
      onSuccess: () => {
        getAllContact();
      },
      onError: () => {
      }
    }
  );
  const handleMessage = async (id: number, id_receive: number) => {
    const userData = await getContactUserChatServices(id, id_receive);
    setUserCurrent(userData[0]);
    seenMessage(id_receive);
  };

  useEffect(() => {
    if (isChatmess) {
      dispatch(isChat(false));
    }
    getAllContact();
  }, [dataSearch, isChatmess]);

  useEffect(() => {
    if (isChatmess) {
      dispatch(isChat(false));
      handleMessage(Number(Guest), Number(userCurrent?.id_user));
    }
    if (userCurrent) getUserContact(Number(userCurrent?.id_user));
    const listIamge = userCurrent?.media_messages?.filter((item) => item?.media?.match(IMAGEREGEX)).map((item, idx) => ({
      imgSrc: item.media, idx, id: item.id_media, desc: item.media.replace('http://110.35.173.82:8081/public/img_mes/', '')
    }));
    setDataImageList(listIamge || []);
  }, [userCurrent, isChatmess]);

  useEffect(() => {
    if (SOCKET) {
      SOCKET.on('getMessage', () => {
        getAllContact();
        if (userCurrent) {
          getUserContact(Number(userCurrent?.id_user));
        }
      });
    }
  }, [SOCKET]);
  const imageShowSettings = {
    arrows: true,
    slidesToScroll: 1,
    slidesToShow: 1,
    infinite: true,
    initialSlide: indexSlide,
    prevArrow: <PrevArrow customArrow="castletonArrow" />,
    nextArrow: <NextArrow customArrow="castletonArrow" />,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          arrows: false,
        },
      },
    ],
  };
  const imageListSettings = {
    infinite: true,
    arrows: false,
    focusOnSelect: true,
    centerMode: true,
    slidesToShow: 8.5,
    slidesToScroll: 1,
    initialSlide: indexSlide,
    centerPadding: '1.2%',
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 6,
          centerMode: false,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 4,
          centerMode: false,
        },
      },
    ],
  };
  const handleClickImage = (item: any) => {
    const idx = dataImageList.find((ele: any) => ele.id === item.id_media);
    setIndexSlide(idx?.idx || 0);
    setIsOpen(true);
  };
  const handleClickimageContent = (item: any) => {
    const idx = dataImageListContent.find((ele: any) => ele.id === item.id_content);
    setIndexSlide(idx?.idx || 0);
    setIsOpenContent(true);
  };
  return (
    <>
      {currWidthScreen > 567
        ? (
          <MainLayout isCalendarLayout>

            <div className={mapModifiers('p-message', !userCurrent && 'user')}>
              <div className="p-message_contact">
                <ContactMessage
                  title={t('training.contact') || ''}
                  placeholder={t('placeholder.contact') || ''}
                  dataSearch={dataSearch}
                  onchange={(e) => { setDataSearch(e.target.value); }}
                  contactList={contactList}
                  userId={Number(Guest)}
                  handleMessage={handleMessage}
                />
              </div>
              <div className="p-message_content">
                <ContentMessages
                  loading={isLoading}
                  user={userCurrent}
                  messagesList={msgList}
                  idUser={Number(Guest)}
                  id_user_receive={userCurrent?.id_user}
                  id_user_send={Number(Guest)}
                  handleClickimageContent={handleClickimageContent}
                />
              </div>
              <div className="p-message_info">
                {userCurrent
                  && (
                    <InfoUserMessage
                      titleSetting="Setting"
                      titleSearch="Search in conversation"
                      titleMutual="Mutual Group"
                      titleNotify="Message Notification"
                      user_name={userCurrent.user_name || ''}
                      departments={userCurrent.departments}
                      image_url={userCurrent.image_url || ''}
                      isChecked={isChecked}
                      onChange={() => setIsChecked(!isChecked)}
                      mediaList={userCurrent?.media_messages || []}
                      library="View media, files"
                      viewAll="View all"
                      handleClickImage={handleClickImage}
                    />
                  )}
              </div>
            </div>
            <PopupUtility
              isOpen={isOpen}
              handleClose={() => setIsOpen(false)}
              dataList={dataImageList || []}
              imageShowSettings={imageShowSettings}
              imageListSettings={imageListSettings}
            />
            <PopupUtility
              isOpen={isOpenContent}
              handleClose={() => setIsOpenContent(false)}
              dataList={dataImageListContent || []}
              imageShowSettings={imageShowSettings}
              imageListSettings={imageListSettings}
            />

          </MainLayout>
        )
        : <UnderDevelop />}
    </>
  );
};
export default Messages;
