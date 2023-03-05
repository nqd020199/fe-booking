/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-no-useless-fragment */
import Picker from 'emoji-picker-react';
import React, {
  useEffect, useRef, useState
} from 'react';
import {
  DefaultExtensionType, FileIcon, defaultStyles
} from 'react-file-icon';
import { useTranslation } from 'react-i18next';
import { BsEmojiSmileFill } from 'react-icons/bs';
// import { useReactMediaRecorder } from 'react-media-recorder';
import { useReactMediaRecorder } from 'react-media-recorder';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { format } from 'timeago.js';
import { v4 as uuidv4 } from 'uuid';

import Button from 'components/atoms/Button';
import Icon from 'components/atoms/Icon';
import Image from 'components/atoms/Image';
// import Input from 'components/atoms/Input';
import Link from 'components/atoms/Link';
import Loading from 'components/atoms/Loading';
import LoadingVoice from 'components/atoms/LoadingVoice';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import Player from 'components/organisms/Player';
import WelcomeMessage from 'components/organisms/WelcomeMessage';
import { postMessageFileService, postMessageTextService } from 'services/Message';
import { User } from 'services/types';
import { count, isChat } from 'store/example';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import {
  AUDIOREGEX, IMAGEREGEX, SOCKET, VIDEOREGEX
} from 'utils/constants';
import mapModifiers from 'utils/functions';

export type UpdateMediaTypes = {
  file: File;
  idUser?: number;
  id_user_send?: number;
  id_user_receive?: number
};
export const fileCheck = (text: string) => { const namefile = text.substring(text.lastIndexOf('.') + 1, text.length); return namefile; };
interface ChatInputProps {
  handleSendMsg?: (msg?: string, currentFile?: UpdateMediaTypes) => void;
  idUser?: number;
  id_user_send?: number;
  id_user_receive?: number
}
const ChatInput: React.FC<ChatInputProps> = ({
  handleSendMsg,
  idUser,
  id_user_receive,
  id_user_send

}) => {
  const dispatch = useAppDispatch();
  const [msg, setMsg] = useState('');

  const [currentFile, setCurrentFile] = useState<UpdateMediaTypes>();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [countLine, setCount] = useState(0);
  const [second, setSecond] = useState('00');
  const [minute, setMinute] = useState('00');
  const [isActive, setIsActive] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [counter, setCounter] = useState(0);
  const form = useRef<HTMLFormElement>(null);
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  const {
    status,
    startRecording,
    stopRecording,
    pauseRecording,
    mediaBlobUrl
  } = useReactMediaRecorder({
    video: false,
    audio: true,
  });
  const stopTimer = () => {
    setIsHidden(false);
    setIsActive(false);
    setCounter(0);
    setSecond('00');
    setMinute('00');
  };
  const handleEmojiClick = (event: any, emojiObject: { emoji: any; }) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };
  const { mutate: postTextMess } = useMutation(
    'post-footer-form',
    (formdata: any) => postMessageTextService(Number(idUser), formdata),
    {
      onSuccess: () => {
        dispatch(isChat(true));
      },
      onError: () => {
      }
    }
  );
  const { mutate: postTextMedia } = useMutation(
    'post-footer-form',
    (formdata: any) => postMessageFileService(Number(idUser), formdata),
    {
      onSuccess: () => {
        dispatch(isChat(true));
      },
      onError: () => {
      }
    }
  );

  const sendChat = (event: any) => {
    event.preventDefault();
    if (msg.length > 0) {
      if (handleSendMsg) { handleSendMsg(msg); }
      SOCKET.emit('sendMessage', {
        msg,
        idUser,
        id_user_receive,
        id_user_send
      });
      postTextMess({
        msg,
        idUser,
        id_user_receive,
        id_user_send
      });
      setMsg('');
    }
    if (isHidden) {
      stopRecording();
      pauseRecording();
      setIsHidden(false);
      stopTimer();
      const fetchAudio = async () => {
        if (mediaBlobUrl) {
          const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
          const fileStamp = new File(
            [audioBlob],
            'audio.wav',
            { type: 'audio/wav' }
          );
          setCurrentFile({ file: fileStamp });
          // setAudio('');
        }
      };
      fetchAudio();
    }
  };

  useEffect(() => {
    if (!isHidden) {
      stopRecording();
      pauseRecording();
      setIsHidden(false);
      stopTimer();
    }
  }, [isHidden]);

  useEffect(() => {
    if (currentFile) {
      if (handleSendMsg) {
        handleSendMsg('', currentFile);
        console.log('object');
        SOCKET.emit('sendMessage', {
          currentFile,
          idUser,
          id_user_receive,
          id_user_send
        });
        postTextMedia({
          file: currentFile.file,
          idUser,
          id_user_receive,
          id_user_send
        });
      }
      setCurrentFile(undefined);
    }
  }, [currentFile]);

  const handleMicroOnclick = () => {
    setIsHidden(!isHidden);
  };
  // const handleFileOnclick = () => {
  //   alert('object');
  // };
  const { t } = useTranslation();
  const handleLoadImg = async (file: UpdateMediaTypes) => {
    if (!file) return;
    if (file && file.file.size > (20 * 1024 * 1024)) {
      setCurrentFile(undefined);
      toast.error(t('notify.avatar_big'));
    } else {
      setCurrentFile(file);
    }
  };

  useEffect(() => {
    const lines = msg.split(/\r|\r\n|\n/);
    setCount(lines.length);
  }, [msg]);
  useEffect(() => {
    dispatch(count(countLine));
  }, [countLine]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive) {
      intervalId = setInterval(() => {
        const secondCounter = counter % 60;
        const minuteCounter = Math.floor(counter / 60);

        const computedSecond = String(secondCounter).length === 1
          ? `0${secondCounter}`
          : secondCounter;
        const computedMinute = String(minuteCounter).length === 1
          ? `0${minuteCounter}`
          : minuteCounter;

        setSecond(computedSecond as string);
        setMinute(computedMinute as string);

        setCounter((counter: number) => counter + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, counter]);

  const handleVoice = () => {
    if (!isActive) {
      startRecording();
    } else {
      pauseRecording();
    }

    setIsActive(!isActive);
  };

  return (
    <form
      className="t-chatInput"
      ref={form}
      onSubmit={(event) => sendChat(event)}
    >
      <div className="t-chatInput_input">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker
            && <Picker onEmojiClick={(emoji) => handleEmojiClick('click', emoji)} />}
        </div>
        <TextArea
          rows={2}
          placeholder={t('placeholder.message') || ''}
          handleOnchange={(e) => setMsg(e.target.value)}
          value={msg}
          id="inputmessage"
          readOnly={false}
        />

      </div>
      <div className="t-chatInput_button">
        <div className="t-chatInput_button-icon">
          <div className="icon-bg icon-bg_mic" onClick={handleMicroOnclick}>
            <Icon iconName="micro" size="32x32" />
          </div>
          <div
            className="icon-bg"
          // onClick={handleFileOnclick}
          >
            <label htmlFor="avatar">
              <div className="">
                <Icon iconName="file" size="32x32" />
              </div>
              <input
                multiple
                id="avatar"
                type="file"
                size={3145728}
                className="icon-bg_input"
                onChange={(e) => e.target.files !== null
                  && handleLoadImg({ file: e.target.files[0] })}
              />
            </label>
          </div>
        </div>
        <Button type="submit">
          send
        </Button>
      </div>
      {isHidden
        && (
          <div className="t-chatInput_voice">
            <div className="t-chatInput_voice-wrap">
              <div onClick={handleVoice} className="t-chatInput_voice-control">
                {isActive
                  ? <Icon iconName="pauseVoice" size="36x36" />
                  : <Icon iconName="playVoice" size="36x36" />}
              </div>
              <div className="t-chatInput_voice-loading">
                <LoadingVoice active={isActive} />
              </div>
              <div className="t-chatInput_voice-timer">
                <span className="minute">{minute}</span>
                <span>:</span>
                <span className="second">{second}</span>
              </div>
              <div onClick={stopTimer} className="t-chatInput_voice-close">
                <Icon iconName="close" size="17x17" />
              </div>
            </div>
          </div>
        )}
    </form>
  );
};

type Messages = {
  avatar_receive?: string;
  msg?: string;
  isUser?: boolean;
  today?: Date;
  media?: string;
  id_content?: number
};
type ContentMessagesProps = ChatInputProps & {
  handleSendMsg?: (msg: string) => void;
  user?: User;
  messagesList?: Messages[];
  handleClickimageContent?: (item: any) => void;
  loading?: boolean;
};

const ContentMessages: React.FC<ContentMessagesProps> = ({
  handleSendMsg,
  user,
  messagesList,
  idUser,
  id_user_receive,
  id_user_send,
  handleClickimageContent,
  loading
}) => {
  const countLine = useAppSelector((state) => state.example.count);

  const scrollRef = useRef<any>(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  }, [messagesList]);

  function linkify(text: string) {
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.replace(urlRegex, (url: string) => `<a href="${url}" target: '_blank'>${url}</a>`);
  }
  const isYoutube = (text: string) => {
    if (text?.includes('www.youtube.com' || 'https://youtu.be/')) return true;
    return false;
  };
  const isYoutubeIframe = (text: string) => {
    if (text?.includes('<iframe width')) return true;
    return false;
  };
  return (
    <>
      {user
        ? (
          <div className={mapModifiers('t-contentMessage', countLine > 2 && 'countLine')}>
            <div className="t-contentMessage_header">
              <div className="t-contentMessage_details">
                <div className="t-contentMessage_avatar">
                  {user?.image_url
                    ? <Image src={user?.image_url} alt={`avatar ${user.image_url}`} />
                    : <Icon iconName="user" size="44x44" />}
                </div>
                <div className="t-contentMessage_info">
                  <div className="t-contentMessage_info-name">
                    <Typography content={user.user_name} modifiers={['700', '20x30', 'blueNavy']} />
                  </div>
                  <div className="t-contentMessage_info-personality">
                    {user.persionalities.length
                      ? user.persionalities.map((p, idx) => <Typography type="span" key={`${idx.toString()}`} content={`${p.label}, `} modifiers={['400', '14x21', 'jet']} />) : 'No Department'}
                  </div>
                </div>
              </div>
            </div>

            <div className={mapModifiers('t-contentMessage_chat', loading && 'loading')}>
              {loading ? <Loading variant="fullScreen" isShow />
                : messagesList && messagesList.length ? messagesList.map((message) => {
                  const result: DefaultExtensionType = fileCheck(message.media || '.doc') as DefaultExtensionType;
                  const text = linkify(message?.msg?.replace('\n', '<br/>') || '');

                  const isVideo = isYoutube(message?.msg as string);
                  const iframeElement = isYoutubeIframe(message?.msg as string);
                  return (
                    <div ref={scrollRef} key={uuidv4()}>
                      <div
                        className={`t-contentMessage_chat-message ${message.isUser ? 'sended' : 'recieved'
                          }`}
                      >
                        {!message.isUser
                          && (
                            <div>
                              {message?.avatar_receive
                                ? <Image src={message?.avatar_receive} alt={`avatar ${user.image_url}`} />
                                : <Icon iconName="user" size="44x44" />}
                            </div>
                          )}
                        <div className="timeContent">
                          {message.isUser
                            && <Typography modifiers={['12x18', '400', 'dimGray']}>{format(message.today || new Date())}</Typography>}
                          <div className={mapModifiers(
                            'content',
                            (message.media && (message.media.match(IMAGEREGEX) || message.media.match(VIDEOREGEX)) ? 'media' : ''),

                            isVideo && 'video'
                          )}
                          >
                            {message.msg && (isVideo
                              ? (iframeElement ? <Typography modifiers={['16x24', '400', 'jet']} content={(message.msg)} /> : <Player videoSrc={message.msg} videoThumbnail={message.msg} />)
                              : <Typography modifiers={['16x24', '400', 'jet']} type="p" content={(text as string)} />
                            )}
                            {message.media
                              && (
                                <div className={`content-media ${message.media.match(VIDEOREGEX) ? 'content-media-content' : ''}`}>
                                  {(message.media.match(IMAGEREGEX)
                                    ? (
                                      <div onClick={() => { if (handleClickimageContent) { handleClickimageContent(message); } }} className="content-media_image">
                                        <Image src={message.media} />
                                      </div>
                                    )
                                    : (
                                      message.media.match(AUDIOREGEX)
                                        ? (
                                          <audio controlsList="download" controls>
                                            <source src={message.media} type="audio/mpeg" />
                                          </audio>
                                        )
                                        : (message.media.match(VIDEOREGEX)
                                          ? (
                                            <Player
                                              videoSrc={message.media}
                                              isMuted
                                            />
                                          )
                                          : (
                                            <Link href={message.media} useExternal download>
                                              <div className="content-media_file">
                                                <div className="content-media_file-icon">
                                                  <FileIcon
                                                    extension={result}
                                                    {...defaultStyles[result]}
                                                  />
                                                </div>
                                                <div className="content-media_file-desc">
                                                  <Typography
                                                    content={message.media
                                                      .replace('http://110.35.173.82:8081/public/file_mes/', '').length
                                                      < 30 ? message.media
                                                        .replace('http://110.35.173.82:8081/public/file_mes/', '')
                                                      : `${message.media
                                                        .replace('http://110.35.173.82:8081/public/file_mes/', '')
                                                        .substring(0, 30)}...`}
                                                    modifiers={['400', '16x24', 'jet']}
                                                  />
                                                  <Icon iconName="download" size="20x20" />
                                                </div>
                                              </div>
                                            </Link>
                                          )
                                        )
                                    ))}
                                </div>
                              )}
                          </div>
                          {!message.isUser
                            && <Typography modifiers={['12x18', '400', 'dimGray']}>{format(message.today || new Date())}</Typography>}
                        </div>
                      </div>
                    </div>
                  );
                }) : <Typography content="" />}
            </div>

            <div className="t-contentMessage_chatInput">
              <ChatInput
                idUser={idUser}
                id_user_receive={id_user_receive}
                id_user_send={id_user_send}
                handleSendMsg={() => {
                  if (handleSendMsg) {
                    handleSendMsg();
                  }
                }}
              />
            </div>
          </div>
        ) : <WelcomeMessage desc="Connect and discuss work easily anytime, anywhere!" />}
    </>
  );
};

ContentMessages.defaultProps = {
};

export default ContentMessages;
