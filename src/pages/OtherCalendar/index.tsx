/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from 'moment';
import React, {
  useState, useEffect, memo, useCallback, useMemo, useRef
} from 'react';
import { SlotInfo } from 'react-big-calendar';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Button from 'components/atoms/Button';
import { Option } from 'components/atoms/DropDownCheckbox';
import { options } from 'components/atoms/DropDownCheckbox/index.stories';
import Loading from 'components/atoms/Loading';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import { list } from 'components/molecules/PullDown/index.stories';
import SwitchDivision from 'components/molecules/SwitchDivision';
import Popup from 'components/organisms/Popup';
import PopupBooking from 'components/organisms/PopupBooking';
import CalendarCustom, { Event, SlotEvent } from 'components/templates/CalendarCustom';
import { optionsCalendar } from 'components/templates/CalendarCustom/index.stories';
import MainLayout from 'components/templates/MainLayout';
import { NoteItem } from 'components/templates/Table';
import {
  AddNoteItem, DeleteBookingService, deleteNoteItem, updateNoteItem
} from 'services/Booking';
import { OptionDept } from 'services/Login/types';
import axiosInstance from 'services/common/instance';
import { postNotification } from 'services/notification';
import { NotifyType } from 'services/notification/types';
import { SeclectType } from 'services/types';
import { GetBookingByUserId } from 'store/UpdateBooking';
import { department } from 'store/department';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getOtherUserAction } from 'store/infoOtheruser';
import { getNoteByIdAction, getUserAction, } from 'store/infouser';
import { SOCKET, TOKEN } from 'utils/constants';
import mapModifiers from 'utils/functions';

const OtherCalendar: React.FC = () => {
  const user = useAppSelector((state) => state.otherUser.otherUser);
  const user2 = useAppSelector((state) => state.user.infuser);
  const invitee = useAppSelector((state) => state.example.invitee);
  const MyBooking = useAppSelector((state) => state.update.allBookingById);
  const lang = useAppSelector((state) => state.example.language);
  const listNoteOtherUser = useAppSelector((state) => state.user.noteList);
  const dispatch = useAppDispatch();
  const Guest = localStorage.getItem(TOKEN);

  const { t } = useTranslation();
  const [noteDataClone, setNoteDataClone] = useState(listNoteOtherUser);
  const [userData, setUserData] = useState(user);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingCheck, setLoading] = useState(false);
  const [eventList, setEventList] = useState<Event[]>(optionsCalendar);
  const [selected, setSelected] = useState<SlotInfo>();
  const [select, setSelect] = useState<SeclectType>(userData?.select_types
    ? userData?.select_types[0] : list[0]);
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [optionSelected, setOptionSelected] = useState<Option[]>(user2?.persionalities || []);
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());
  const [detail, setDetail] = useState('');
  const [division, setDivision] = useState<OptionDept>();

  const [myId, setMyId] = useState<number>(Number(Guest));
  const [dateDefaul, setdateDefaul] = useState(new Date());
  const [maxtime, setMaxtime] = useState(22);
  const [mintime, setMintime] = useState(7);
  const isShowSideBar = useAppSelector((state) => state.example.isShowSideBar);
  const { userId, departmentName } = useParams();
  const getHeightOtherPage = useRef<HTMLDivElement>(null);
  const [dataResponNoteRow, setDataResponNoteRow] = useState<Number>();
  const [dataResponNoteDate, setDataResponNoteDate] = useState<Date>();
  const [contentNote, setContentNote] = useState('');
  const [isOpenPopupNote, setIsOpenPopupNote] = useState(false);
  const [itemNoteCurr, setItemNoteCurr] = useState();
  const [idItemNoteCurr, setIdItemNoteCurr] = useState();
  const [idUserItemNote, setIdIUsertemNote] = useState();
  const [eventListMyBooking, setEventListMyBooking] = useState<Event[]>(optionsCalendar);
  const utcOffset = moment().format('Z');
  const [curentUser, setCurentUser] = useState('');
  const [isOpenCloseBtn, setIsOpenCloseBtn] = useState(false);
  const [currWidthScreen, setCurrWidthScreen] = useState(window.innerWidth);

  useEffect(() => {
    setUserData(user);
    dispatch(department(division as OptionDept));
    dispatch(getNoteByIdAction(Number(userData?.id_user)));
    sessionStorage.setItem('indexSettingTab', '0');
  }, [user]);

  useEffect(() => {
    setEventListMyBooking(MyBooking);
  }, [MyBooking]);

  const navigate = useNavigate();
  useEffect(() => {
    if (userId === Guest) {
      return navigate('/');
    }
  }, [userId]);

  useEffect(() => {
    if (!isUpdate) {
      dispatch(GetBookingByUserId(Number(Guest)));
    }
  }, [isUpdate]);

  useEffect(() => {
    setNoteDataClone(listNoteOtherUser);
  }, [listNoteOtherUser]);

  useEffect(() => {
    sessionStorage.setItem('height_calendar', (getHeightOtherPage.current?.offsetHeight || 0)?.toString());
  }, [loadingCheck]);

  useEffect(() => {
    dispatch(getOtherUserAction(Number(userId) || 0));
    dispatch(getUserAction(Number(Guest) || 0));
    dispatch(GetBookingByUserId(Number(Guest)));
  }, [userId, userData?.id_user, Guest]);

  useEffect(() => {
    setLoading(true);
  }, [invitee]);

  useEffect(() => {
    setLoading(true);
  }, [lang]);

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

  useEffect(() => {
    if (currWidthScreen <= 440) {
      setIsOpenCloseBtn(true);
    }
    if (currWidthScreen > 441) {
      setIsOpenCloseBtn(false);
    }
  }, [currWidthScreen]);

  useEffect(() => {
    if (lang.acronym !== 'KO') {
      document.body.style.fontFamily = 'Noto Sans,sans-serif';
    } else {
      document.body.style.fontFamily = 'Noto Sans KR,sans-serif';
    }
  }, [lang]);

  useEffect(() => {
    const hi = userData?.departments.filter((department) => (department.sub_name === departmentName));
    setDivision(hi?.[0] as OptionDept);
  }, [userData?.id_user]);

  useEffect(() => {
    setCurentUser(user2?.user_name || '');
    if (Guest !== 'GUEST') {
      dispatch(GetBookingByUserId(Number(myId)));
      setOptionSelected(user2?.persionalities || [],);
      const optionEvent = userData?.data_booking?.map((item) => ({
        start: new Date(`${item.start}`),
        department: item.department_tbs[0],
        detail: item.detail,
        end: new Date(`${item.end}`),
        service: item.select_type_tbs[0],
        title: item.detail,
        personality: item.persionality_tbs,
        id: item.id_booking,
        id_orther_user: item.id_orther_user,
        id_user: item.id_orther_user,
        isCheck: item.isCheck
      }));
      setEventList(optionEvent as Event[]);
      setMyId(Number(user2?.id_user));
      if (userData?.maxtime !== null && userData?.maxtime !== undefined) {
        setMaxtime(userData?.maxtime);
      }
      if (userData?.mintime !== null && userData?.mintime !== undefined) {
        setMintime(userData?.mintime);
      }
    } else if (Guest === 'GUEST') {
      dispatch(GetBookingByUserId(Number(myId)));
      setOptionSelected(user2?.persionalities || [],);
      const optionEvent = userData?.data_booking?.map((item) => ({
        start: new Date(`${item.start}`),
        department: item.department_tbs[0],
        detail: item.detail,
        end: new Date(`${item.end}`),
        service: item.select_type_tbs[0],
        title: item.detail,
        personality: item.persionality_tbs,
        id: item.id_booking,
        id_orther_user: item.id_orther_user,
        id_user: item.id_orther_user,
        isCheck: item.isCheck
      }));
      if (userData?.maxtime !== null && userData?.maxtime !== undefined) {
        setMaxtime(userData?.maxtime);
      }
      if (userData?.mintime !== null && userData?.mintime !== undefined) {
        setMintime(userData?.mintime);
      }
      setEventList(optionEvent as Event[]);
      setMyId(Number(Guest));
      dispatch(GetBookingByUserId(Number(Guest)));
    }
  }, [Guest, userData, user2]);

  useEffect(() => {
    if (loadingCheck) {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }, [loadingCheck]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsUpdate(false);
        setSelectedEvent(undefined);
        setOptionSelected(user2?.persionalities || []);
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selected !== undefined) {
      setStart(selected?.start);
      setEnd(selected?.end);
    }
    setSelect(userData?.select_types ? userData?.select_types[0] : list[0]);
  }, [selected, userData]);

  useEffect(() => {
    if (selectedEvent !== undefined) {
      setStart(selectedEvent?.start || new Date());
      setEnd(selectedEvent?.end || new Date());
      setSelect(selectedEvent?.service as SeclectType);
      setOptionSelected(selectedEvent.personality || []);
      setDetail(selectedEvent.detail || '');
    }
  }, [selectedEvent]);

  const clear = () => {
    setTimeout(() => {
      setSelect(userData?.select_types ? userData?.select_types[0] : list[0]);
      setOptionSelected(optionSelected || []);
      setDetail('');
    }, 500);
  };

  const handleSelectSlot = useCallback((slot: SlotInfo) => {
    setIsOpen(true);
    setSelected(slot);
    setdateDefaul(slot.end);
  }, []);

  const handleSelected = (slot: Event) => {
    if (slot.id_orther_user === Number(Guest) || (Guest === 'GUEST' && slot.isCheck)) {
      setSelectedEvent(slot);
      setIsOpen(true);
      setIsUpdate(true);
      setdateDefaul(slot.end || new Date());
    } else {
      toast.error(t('notify.move_event_error') || '');
    }
  };

  const handleChange = (selected: Option[]) => {
    setOptionSelected(selected);
  };

  const { mutate: updateTutorial } = useMutation(
    async (data: Event) => axiosInstance.put(`booking/update-booking/${data.id} `, data),
    {
      onSuccess: (data) => {
        setLoading(true);
        dispatch(getOtherUserAction(Number(userId) || 0));
        toast.success(t('notify.update_booking_success') || '');
        SOCKET?.emit('sendNotification', {
          senderName: Guest !== 'GUEST' ? user2?.user_name : 'GUEST', receiverName: userData?.user_name, type: 1, status: false, id_user: Number(userId), data: { ...data?.data.content, utcOffset }
        });
      },
      onError: () => {
        dispatch(getOtherUserAction(Number(userId) || 0));
        toast.error(t('notify.update_err') || '');
      },
    }
  );

  const { mutate: postBookingNotify } = useMutation(
    async (data: NotifyType) => postNotification(Number(userId), data),
    {
      onSuccess: (data) => {
        // console.log('success', data);
      },
      onError: (err: { code: number }) => {
        // console.log('error');
      }
    },
  );

  const { mutate: postTutorial } = useMutation(
    async (data: Event) => axiosInstance.post(`booking/add-booking/${userId} `, data),
    {
      onSuccess: (data) => {
        dispatch(getOtherUserAction(Number(userId) || 0));
        dispatch(getUserAction(Number(myId) || 0));
        toast.success(t('notify.update_booking_success') || '');
        clear();
        setLoading(true);
        SOCKET?.emit('sendNotification', {
          senderName: Guest !== 'GUEST' ? user2?.user_name : 'GUEST', receiverName: userData?.user_name, type: 1, status: false, id_user: Number(userId), data: { ...data?.data.content, utcOffset }
        });
        postBookingNotify({
          senderName: Guest !== 'GUEST' ? user2?.user_name || '' : 'GUEST',
          receiverName: userData?.user_name,
          type: 1,
          status: false,
          id_user: Number(userId),
          data: { ...data?.data.content, utcOffset },
          isNotify: userData?.isNotify || false,
        });
      },
      onError: (err: { code: number }) => {
        const { code } = err;
        dispatch(getOtherUserAction(Number(userId) || 0));
        if (code === 9) {
          toast.error(t('notify.time_invalid'));
        } else {
          toast.error(t('notify.add_booking_error'));
        }
      },
    }
  );

  const { mutate: postTutorialMy } = useMutation(
    async (data: Event) => axiosInstance.post(`booking/add-booking/${myId} `, data),
    {
      onSuccess: () => {
        dispatch(getUserAction(Number(myId) || 0));
        setLoading(true);
      },
      onError: () => {
      },
    }
  );

  const handleConfirm = async () => {
    const utcOffset = moment().format('Z');

    if (isUpdate) {
      const index = eventList.findIndex((event) => event.id === selectedEvent?.id);
      const updatedEvent = eventList.slice();
      updatedEvent[index].title = detail;
      updatedEvent[index].start = new Date(start);
      updatedEvent[index].end = new Date(end);
      updatedEvent[index].detail = detail;
      updatedEvent[index].service = select as { id: number, _values: string, _name: string };
      updatedEvent[index].personality = optionSelected as {
        value: number; label: string;
      }[];
      updatedEvent[index].department = division as {
        value: number; label: string;
      };
      if (updatedEvent[index].id_orther_user === myId || (Guest === 'GUEST' && updatedEvent[index].isCheck)) {
        setEventList(updatedEvent);
        await updateTutorial({
          ...updatedEvent[index] as Event
        });
        setTimeout(() => {
          setIsUpdate(false);
          setSelectedEvent(undefined);
        }, 500);
      } else {
        dispatch(getOtherUserAction(Number(userId) || 0));
        return toast.error(t('notify.move_event_error') || '');
      }
    } else {
      const Stamp = [...eventList];
      const newEvent = {
        id: Math.floor(Math.random() * (50000 - 10 + 1)) + 10,
        detail,
        personality: optionSelected as {
          value: number; label: string;
        }[],
        service: select as { id: number, _values: string, _name: string },
        end,
        start,
        isCheck: false,
        title: detail,
        department: division,
        id_orther_user: Number(Guest),
        utcOffset
      };
      const newEventGuest = {
        id: Math.floor(Math.random() * (50000 - 10 + 1)) + 10,
        detail,
        service: select as { id: number, _values: string, _name: string },
        end,
        start,
        isCheck: true,
        title: detail,
        department: division
      };
      if (!division) {
        return toast.error(t('validate.missing_department') || '');
      }

      const checkDuplicate = eventList.map((booking) => {
        const bookedCalendar = {
          start: new Date(`${booking.start}`).getTime(),
          end: new Date(`${booking.end}`).getTime()
        };
        if (newEvent.start.getTime() < bookedCalendar.end && newEvent.end.getTime() > bookedCalendar.start) {
          return false;
        }
        if (newEventGuest.start.getTime() < bookedCalendar.end && newEventGuest.end.getTime() > bookedCalendar.start) {
          return false;
        }
        return true;
      });
      const checkDuplicateMyBooking = eventListMyBooking.map((booking) => {
        const bookedCalendar = {
          start: new Date(`${booking.start}`).getTime(),
          end: new Date(`${booking.end}`).getTime()
        };
        if (newEvent.start.getTime() < bookedCalendar.end && newEvent.end.getTime() > bookedCalendar.start) {
          return false;
        }
        if (newEventGuest.start.getTime() < bookedCalendar.end && newEventGuest.end.getTime() > bookedCalendar.start) {
          return false;
        }
        return true;
      });
      if (checkDuplicate.every((element) => element === true)) {
        if (checkDuplicateMyBooking.every((element) => element === true)) {
          Stamp.push(newEvent);
          if (Guest === 'GUEST') {
            await postTutorial({
              ...newEventGuest as Event
            });
          } else {
            await postTutorial({
              ...newEvent as Event
            });
            await postTutorialMy({
              ...newEvent as Event
            });
          }
          clear();
        } else {
          setOptionSelected(user2?.persionalities || []);
          toast.error(t('notify.time_invalid') || '');
        }
      } else {
        toast.error(t('notify.add_booking_err_time') || '');
      }
    }
  };

  const handleSubBtn = () => {
    if (isUpdate) {
      const listUpdates = [...eventList];
      const index = listUpdates.findIndex((event) => (event.id === selectedEvent?.id && event.id_orther_user === myId));
      const indexGuest = listUpdates.findIndex((event) => (event.isCheck === true && event.id === selectedEvent?.id));

      if (index !== -1) {
        listUpdates.splice(index, 1);
        DeleteBookingService(selectedEvent?.id || 0);
        toast.success(t('notify.delete_booking_success') || '');
        SOCKET?.emit('sendNotification', {
          senderName: Guest !== 'GUEST' ? user2?.user_name : 'GUEST', receiverName: userData?.user_name, type: 1, status: false, id_user: Number(userId), data: {}
        });
        localStorage.removeItem('idUpdate');
        setLoading(true);
      } else if (Guest === 'GUEST' && indexGuest !== -1) {
        listUpdates.splice(indexGuest, 1);
        DeleteBookingService(selectedEvent?.id || 0);
        toast.success(t('notify.delete_booking_success') || '');
        setLoading(true);
      } else {
        toast.error(t('notify.delete_booking_fail') || '');
      }
      setEventList(listUpdates);
      setEventListMyBooking(MyBooking);
    }
    setTimeout(() => {
      setIsUpdate(false);
    }, 500);
  };

  const checkDulicatebooking = (newBooking: Event, oldBooking: Event) => (newBooking.start || new Date()) < (oldBooking.end || new Date())
    && (newBooking.end || new Date()) > ((oldBooking.start || new Date()));

  const moveEvent = async ({ event, start, end }: SlotEvent) => {
    const idx = eventList.indexOf(event as { id: number; title: string; start: Date; end: Date; detail: string; service: { id: number, _values: string, _name: string }; personality: { value: number; label: string; }[]; isCheck: boolean; });
    const updatedEvent = { ...event, start, end };
    const nextEvents = eventList.filter((event) => event.id !== updatedEvent.id);
    const idStamp = Number(updatedEvent.id) + 1;
    const nextEventsOther = eventListMyBooking.filter((event) => Number(event.id_booking) !== idStamp);

    const checkDuplicateMyBooking = nextEventsOther.map((booking) => {
      const bookedCalendar = {
        start: new Date(`${booking.start}`).getTime(),
        end: new Date(`${booking.end}`).getTime()
      };
      if (updatedEvent.start?.valueOf() as number < bookedCalendar.end && updatedEvent.end?.valueOf() as number > bookedCalendar.start) {
        return false;
      }
      return true;
    });
    const checkDuplicateMoveBooking = nextEvents.map((oldEvent) => {
      if (checkDulicatebooking(updatedEvent as Event, oldEvent)) {
        return false;
      }
      return true;
    });

    if (checkDuplicateMoveBooking.every((item) => item === true)) {
      if ((updatedEvent.id_orther_user === myId || (Guest === 'GUEST' && updatedEvent.isCheck)) && checkDuplicateMyBooking.every((item) => item === true)) {
        await updateTutorial({
          ...updatedEvent as Event
        });
        nextEvents.splice(idx, 0, updatedEvent as { id: number; title: string; start: Date; end: Date; detail: string; service: { id: number, _values: string, _name: string }; personality: { value: number; label: string; }[]; isCheck: boolean; });
        setEventList(nextEvents);
      } else if (updatedEvent.id_orther_user !== myId) {
        return toast.error(t('notify.move_event_error') || '');
      } else {
        return toast.error(t('notify.update_booking_err_move') || '');
      }
    } else {
      return toast.error(t('notify.add_booking_err_move') || '');
    }
  };

  const resizeEvent = async ({ event, start, end }: SlotEvent) => {
    const nextEvents = eventList.map((existingEvent) => (existingEvent.id === event.id
      ? { ...existingEvent, start, end }
      : existingEvent));
    const updatedEvent = { ...event, start, end };

    const result = eventList.filter((event) => event.id !== updatedEvent.id);
    const resultOther = eventListMyBooking.filter((event) => event.id !== updatedEvent.id);

    if ((updatedEvent.end as Date).getTime() - (updatedEvent.start as Date).getTime() > 0) {
      const checkDuplicateMoveBooking = result.map((oldEvent) => {
        if (checkDulicatebooking(updatedEvent as Event, oldEvent)) {
          return false;
        }
        return true;
      });

      const checkDuplicateMyBooking = resultOther.map((oldEvent) => {
        if (checkDulicatebooking(updatedEvent as Event, oldEvent)) {
          return false;
        }
        return true;
      });

      if (checkDuplicateMoveBooking.every((item) => item === true)) {
        if ((updatedEvent.id_orther_user === myId || updatedEvent.isCheck) && checkDuplicateMyBooking.every((item) => item === true)) {
          await updateTutorial({
            ...updatedEvent as Event
          });
          setEventList(nextEvents as { id: number; title: string; start: Date; end: Date; detail: string; service: { id: number, _values: string, _name: string }; personality: { value: number; label: string; }[]; isCheck: boolean; }[]);
        } else {
          return toast.error(t('notify.move_event_error') || '');
        }
      } else {
        return toast.error(t('notify.add_booking_err_move') || '');
      }
    }
  };

  const { mutate: postNoteItem } = useMutation(
    'post-footer-form',
    (data: NoteItem) => AddNoteItem(data),
    {
      onSuccess: () => {
        dispatch(getNoteByIdAction(userData?.id_user || 0));
        setIsOpenPopupNote(false);
        setContentNote('');
        toast.success(t('notify.add_note_success') || '');
        setLoading(true);
      },
      onError: () => {
      }
    }
  );
  const { mutate: updateNoteItemAction } = useMutation(
    'post-footer-form',
    (data: NoteItem) => updateNoteItem(idItemNoteCurr || 0, data),
    {
      onSuccess: () => {
        dispatch(getNoteByIdAction(userData?.id_user || 0));
        toast.success(t('notify.update_note_success') || '');
        setIsOpenPopupNote(false);
        setContentNote('');
        setLoading(true);
      },
      onError: () => {
      }
    }
  );
  const { mutate: deleteNoteById } = useMutation(
    'post-footer-form',
    (id: number) => deleteNoteItem(id),
    {
      onSuccess: () => {
        dispatch(getNoteByIdAction(userData?.id_user || 0));
        toast.success(t('notify.delete_note_success') || '');
        setIsOpenPopupNote(false);
        setLoading(true);
      },
      onError: () => {
      }
    }
  );

  const handleGetVisitNote = (data: any) => {
    const { date, idx, item } = data;
    setDataResponNoteRow(idx);
    setDataResponNoteDate(date);
    setItemNoteCurr(item);
    setContentNote(item?.title);
    setIdItemNoteCurr(item?.id_note);
    setIdIUsertemNote(item?.user_name);
  };

  const handleChangeDivision = (item: OptionDept) => {
    // setDivision(item);
    // dispatch(department(item as OptionDept));
  };

  const handleShowhidepopupNote = () => {
    setIsOpenPopupNote(!isOpenPopupNote);
  };

  const hanleAddNote = async () => {
    const content = await localStorage.getItem('USER_LOGIN');
    const { user_name } = JSON.parse(content || '');
    const params = {
      indexRow: dataResponNoteRow,
      date: dataResponNoteDate,
      title: contentNote,
      id_user: userData?.id_user,
      user_name: user2?.user_name || user_name,
      department: division?.label,
    };
    await postNoteItem(params as NoteItem);
  };

  const handleUpdateNote = async () => {
    const params = { ...itemNoteCurr as any, title: contentNote, user_name: user2?.user_name };
    await updateNoteItemAction(params as NoteItem);
  };

  const handleDeleteNote = async () => {
    await deleteNoteById(idItemNoteCurr || 0);
  };

  const minTime = new Date();
  minTime.setHours(mintime, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(maxtime, 0, 0);

  const child2 = useMemo(() => (
    <CalendarCustom
      events={eventList}
      handleSelectSlot={(slot) => handleSelectSlot(slot)}
      handleSelected={(slot) => handleSelected(slot)}
      moveEvent={(slot) => moveEvent(slot)}
      resizeEvent={(slot) => (resizeEvent(slot))}
      dateDefaul={dateDefaul}
      maxtime={maxTime}
      mintime={minTime}
      overTimeRow={user?.indexRow}
      listNoteUser={noteDataClone}
      handleGetVisitNote={({ date: Date, idx: number, item: NoteItem }) => handleGetVisitNote({ date: Date, idx: number, item: NoteItem })}
      handleOpenPopupNote={handleShowhidepopupNote}
    />
  ), [eventList, userData, lang, noteDataClone, eventListMyBooking]);

  return (
    <MainLayout isCalendarLayout>
      {
        loadingCheck ? <Loading variant="fullScreen" isShow size="medium" />
          : (
            <div className="p-calendar" ref={getHeightOtherPage}>
              <div className="p-calendar_calendarOther">
                {child2}
                <PopupBooking
                  isbtn={isUpdate ? !selectedEvent?.isCheck && selectedEvent?.id_orther_user === user2?.id_user || (Guest === 'GUEST' && selectedEvent?.isCheck) : true}
                  isOpen={isOpen}
                  end={end}
                  start={start}
                  handleClose={() => { setIsOpen(false); clear(); }}
                  date={end}
                  handleSelect={(option) => setSelect(option)}
                  optionList={userData?.select_types || list}
                  select={select}
                  title={t('popup.edit') || ''}
                  handleChangeMulti={handleChange}
                  optionSelected={optionSelected || []}
                  subBtnText={isUpdate ? t('popup.delete') || '' : t('popup.cancel') || ''}
                  btnText={isUpdate ? t('popup.change') || '' : t('popup.submit') || ''}
                  handleConfirm={handleConfirm}
                  handleSelectEnd={(value) => setEnd(value)}
                  handleSelectStart={(value) => setStart(value)}
                  onChangValue={(value) => setDetail(value.target.value)}
                  valueTest={detail}
                  handleSubBtn={handleSubBtn}
                  options={user2?.persionalities || options}
                  isOpenCloseBtn={isOpenCloseBtn}
                />
              </div>
              <div className={mapModifiers('p-calendar_departmentOther p-calendar_department', isShowSideBar && 'showbar')}>
                <SwitchDivision
                  optionDavision={userData?.departments || []}
                  handleClick={handleChangeDivision}
                  username={userData?.user_name || 'GUEST'}
                  division={division}
                />
              </div>
              <div className="popup-note">
                <Popup
                  isOpen={isOpenPopupNote}
                  handleClose={handleShowhidepopupNote}
                  variant="booking"
                >
                  <div className="popup-note">
                    <div className="popup-note_wrapper_header">
                      <Typography content={t('popup.leave_message') || ''} modifiers={['white', '20x30', '700', 'uppercase']} />
                    </div>
                    <div className="popup-note_wrapper_content">
                      <Typography content={t('popup.title_note') || ''} modifiers={['jet', '14x21', '400']} />
                      <TextArea id="TextAreas" value={contentNote} handleOnchange={(event) => setContentNote(event.target.value)} readOnly={false} />
                    </div>
                    <div className="popup-note_wrapper_btn">

                      {itemNoteCurr ? (
                        <Button
                          modifiers={['columbia-blue']}
                          onClick={() => {
                            if (handleDeleteNote && curentUser === idUserItemNote) {
                              handleDeleteNote();
                            } else {
                              toast.error(t('notify.delete_note_err') || '');
                            }
                          }}
                        >
                          <Typography
                            modifiers={['700', 'uppercase']}
                            content={t('popup.delete') || ''}
                          />
                        </Button>
                      ) : (
                        <Button
                          modifiers={['columbia-blue']}
                          onClick={() => {
                            setIsOpenPopupNote(false);
                          }}
                        >
                          <Typography
                            modifiers={['700', 'uppercase']}
                            content={t('popup.cancel') || ''}
                          />
                        </Button>
                      )}

                      <Button
                        modifiers={['primary']}
                        onClick={() => {
                          if (Guest === 'GUEST' && !!contentNote) {
                            return hanleAddNote();
                          }
                          if (Guest === 'GUEST' && !contentNote) {
                            return toast.error(t('notify.content_note_empty') || '');
                          }
                          if (!contentNote.trim()) {
                            return toast.error(t('notify.content_note_empty') || '');
                          }
                          if (!itemNoteCurr) {
                            return hanleAddNote();
                          }
                          if (curentUser === idUserItemNote) {
                            handleUpdateNote();
                          } else {
                            toast.error(t('notify.update_note_err') || '');
                          }
                        }}
                      >
                        <Typography
                          modifiers={['700', 'uppercase']}
                          content={t('popup.submit') || ''}
                        />
                      </Button>
                    </div>
                  </div>
                </Popup>
              </div>
            </div>
          )
      }
    </MainLayout>
  );
};

export default memo(OtherCalendar);
