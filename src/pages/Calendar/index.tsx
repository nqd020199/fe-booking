/* eslint-disable no-useless-return */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import moment, { utc } from 'moment';
import React, {
  useState, useEffect, memo, useCallback, useMemo, useRef, useLayoutEffect
} from 'react';
import { SlotInfo } from 'react-big-calendar';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import Button from 'components/atoms/Button';
import { Option } from 'components/atoms/DropDownCheckbox';
import { options } from 'components/atoms/DropDownCheckbox/index.stories';
import Loading from 'components/atoms/Loading';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import NotifyInformation, { OptionTask } from 'components/molecules/NotifyInformation';
import { list } from 'components/molecules/PullDown/index.stories';
import SwitchDivision from 'components/molecules/SwitchDivision';
import Popup from 'components/organisms/Popup';
import PopupBooking from 'components/organisms/PopupBooking';
import PopupPosition from 'components/organisms/PopupPosition';
import CalendarCustom, { Event, SlotEvent } from 'components/templates/CalendarCustom';
import MainLayout from 'components/templates/MainLayout';
import { DeleteBookingService, deleteNoteItem } from 'services/Booking';
import {
  hidePopup, updateDepartmentType, updatePersionalitySevice, updateServiceType
} from 'services/Login';
import { OptionDept } from 'services/Login/types';
import axiosInstance from 'services/common/instance';
import { SeclectType } from 'services/types';
import { getAllDepartments } from 'store/UpdateBooking';
import { department } from 'store/department';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getNoteByIdAction, getUserAction } from 'store/infouser';
import { SOCKET, TOKEN } from 'utils/constants';
import mapModifiers from 'utils/functions';

const OptionTasks = [
  { icon: 'task_notify', content: 'notify.guest_task1' },
  { icon: 'cancel_notify', content: 'notify.guest_task2' },
];

const Calendar: React.FC = () => {
  const user = useAppSelector((state) => state.user.infuser);
  const lang = useAppSelector((state) => state.example.language);
  const noteInfo = useAppSelector((state) => state.user.noteList);
  const viewActiveCalendar = useAppSelector((state) => state.example.viewActive);
  const departmentNotify = useAppSelector((state) => state.deparment.department);
  const dispatch = useAppDispatch();

  const { t } = useTranslation();
  const [cloneViewActive, setCloneViewActive] = useState(viewActiveCalendar);
  const [userData, setUserData] = useState(user);
  const [noteData, setNoteData] = useState(noteInfo);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingCheck, setLoading] = useState(false);
  const [eventList, setEventList] = useState<Event[]>([]);
  const [selected, setSelected] = useState<SlotInfo>();
  const [select, setSelect] = useState<SeclectType>(userData?.select_types
    ? userData?.select_types[0] : list[0]);
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [optionSelected, setOptionSelected] = useState<Option[]>(userData?.persionalities || []);
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());
  const [detail, setDetail] = useState('');
  const [division, setDivision] = useState<OptionDept>();

  const [isHidden, setIsHidden] = useState(false);
  const [idUser, setIdUser] = useState<number>();
  const isUser = userData?.id_user;
  const Guest = localStorage.getItem(TOKEN);
  const [togglePopup, setTogglePopup] = useState(['personality', 'department', 'service']);
  const [indexView, setIndexView] = useState<number>(0);
  const [dateDefaul, setdateDefaul] = useState(new Date());
  const isShowPopup = localStorage.getItem('showPopup');
  const isShowPopupGuest = localStorage.getItem('PopupGuest');
  const [showPop, setShowPop] = useState<number>(Number(isShowPopup) || 0);
  const [maxtime, setMaxtime] = useState(19);
  const [mintime, setMintime] = useState(9);
  const [showPopGuest, setShowPopGuest] = useState<number>(Number(isShowPopupGuest) || 0);
  const isShowSideBar = useAppSelector((state) => state.example.isShowSideBar);
  const getHeight = useRef<HTMLDivElement>(null);
  const [isOpenNotifyInfos, setIsOpenNotifyInfos] = useState(false);
  const [isOpenPopupNote, setIsOpenPopupNote] = useState(false);
  const [contentNote, setContentNote] = useState('');
  const [idNote, setIdNote] = useState();
  const [currWidthScreen, setCurrWidthScreen] = useState(window.innerWidth);
  const [isOpenCloseBtn, setIsOpenCloseBtn] = useState(false);
  const [cloneShowBar, setCloneShowBar] = useState(isShowSideBar);
  const currUrl = window.location.pathname;
  const cacheDivision = sessionStorage.getItem('OptionDept');
  const checkSetDept = sessionStorage.getItem('setDeptOtherPage');

  useEffect(() => {
    setCloneShowBar(isShowSideBar);
  }, [isShowSideBar, currUrl]);

  useEffect(() => {
    dispatch(getUserAction(Number(Guest) || 0));
    setIdUser(Number(Guest));
    dispatch(getNoteByIdAction(Number(Guest)));
  }, [Guest]);

  useEffect(() => {
    setCloneViewActive(viewActiveCalendar);
  }, [viewActiveCalendar]);

  useEffect(() => {
    setNoteData(noteInfo);
  }, [noteInfo]);

  useEffect(() => {
    setDivision(userData?.departments[0] as OptionDept);
    dispatch(getAllDepartments());
    sessionStorage.setItem('indexSettingTab', '0');
  }, []);

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
    if (loadingCheck) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [loadingCheck]);

  useEffect(() => {
    setLoading(true);
  }, [lang]);

  useEffect(() => {
    if (lang.acronym !== 'KO') {
      document.body.style.fontFamily = 'Noto Sans,sans-serif';
    } else {
      document.body.style.fontFamily = 'Noto Sans KR,sans-serif';
    }
  }, [lang]);

  useEffect(() => {
    if (!isHidden) {
      setLoading(true);
    }
  }, [user]);

  useEffect(() => {
    setUserData(user);
  }, [user]);

  useEffect(() => {
    if (Guest !== 'GUEST') {
      setOptionSelected(userData?.persionalities || [],);
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
        id_user: item.id_user,
        isCheck: item.isCheck
      }));
      setEventList(optionEvent as Event[]);
      if (userData?.maxtime !== null && userData?.maxtime !== undefined) {
        setMaxtime(userData?.maxtime);
      }
      if (userData?.mintime !== null && userData?.mintime !== undefined) {
        setMintime(userData?.mintime);
      }
    } else {
      setUserData(undefined);
    }
    SOCKET?.emit('newUser', userData);
  }, [Guest, userData, SOCKET]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsUpdate(false);
        setSelectedEvent(undefined);
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
    if (Guest === 'GUEST' && showPopGuest === 0) {
      setIsOpenNotifyInfos(true);
    }
  }, []);

  useEffect(() => {
    if (Guest !== 'GUEST' && !userData?.isShow && !userData?.persionalities.length) {
      return setIsHidden(true);
    }
    return setIsHidden(false);
  }, [isUser]);

  useEffect(() => {
    if (selectedEvent !== undefined) {
      setStart(selectedEvent?.start || new Date());
      setEnd(selectedEvent?.end || new Date());
      setSelect(selectedEvent?.service as SeclectType);
      setOptionSelected(selectedEvent.personality || []);
      setDetail(selectedEvent.detail || '');
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (!!departmentNotify && departmentNotify?.value !== 0 && user?.isShow) {
      dispatch(department(departmentNotify as OptionDept));
      return setDivision(departmentNotify);
    }
    if (cacheDivision && user?.isShow) {
      setDivision(JSON.parse(cacheDivision) as OptionDept);
      dispatch(department(JSON.parse(cacheDivision) as OptionDept));
      return;
    }
    setDivision(user?.departments[0] as OptionDept);
    dispatch(department(user?.departments[0] as OptionDept));
  }, [departmentNotify, userData]);

  const clear = () => {
    setTimeout(() => {
      setSelect(userData?.select_types ? userData?.select_types[0] : list[0]);
      setOptionSelected(userData?.persionalities || []);
      setDetail('');
    }, 500);
  };

  const handleSelectSlot = useCallback((slot: SlotInfo) => {
    if (Guest === 'GUEST') {
      toast.error(t('training.guest_booking') || '');
    } else {
      setIsOpen(true);
      setSelected(slot);
      setdateDefaul(slot.end);
    }
  }, []);

  const handleSelected = (slot: Event) => {
    setSelectedEvent(slot);
    setIsOpen(true);
    setIsUpdate(true);
    setdateDefaul(slot.end || new Date());
  };

  const handleChange = (selected: Option[]) => {
    setOptionSelected(selected);
  };

  const { mutate: updateTutorial } = useMutation(
    async (data: Event) => axiosInstance.put(`booking/update-booking/${data.id} `, data),
    {
      onSuccess: () => {
        setLoading(true);
        dispatch(getUserAction(idUser || 0));
        toast.success(t('notify.update_booking_success') || '');
        setTimeout(() => {
          setIsUpdate(false);
          setSelectedEvent(undefined);
        }, 500);
      },
      onError: () => {
        setTimeout(() => {
          setIsUpdate(false);
          setSelectedEvent(undefined);
        }, 500);
        toast.error(t('notify.delete_booking_fail') || '');
      },
    }
  );
  const { mutate: postTutorial } = useMutation(
    async (data: Event) => axiosInstance.post(`booking/add-booking/${idUser} `, data),
    {
      onSuccess: () => {
        dispatch(getUserAction(idUser || 0));
        setLoading(true);
        toast.success(t('notify.add_booking_success') || '');
      },
      onError: (err: { code: number }) => {
        const { code } = err;
        dispatch(getUserAction(idUser || 0));
        if (code === 9) {
          toast.error(t('notify.time_invalid'));
        } else {
          toast.error(t('notify.add_booking_error'));
        }
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
      if (updatedEvent[index].id_orther_user === null && !updatedEvent[index].isCheck) {
        await updateTutorial({
          ...updatedEvent[index] as Event
        });
      } else {
        dispatch(getUserAction(idUser || 0));
        toast.error(t('notify.move_event_error'));
      }
    } else if (Guest === 'GUEST') {
      // const newEventGuest = {
      //   id: Math.floor(Math.random() * (50000 - 10 + 1)) + 10,
      //   detail,
      //   service: select as { id: number, _values: string, _name: string },
      //   end,
      //   start,
      //   isCheck: false,
      //   title: detail,
      // };
      toast.info(t('training.guest_booking'));
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
        utcOffset,
      };
      const checkDuplicate = eventList.map((booking) => {
        const bookedCalendar = {
          start: new Date(`${booking.start}`).getTime(),
          end: new Date(`${booking.end}`).getTime()
        };
        if (newEvent.start.getTime() < bookedCalendar.end && newEvent.end.getTime() > bookedCalendar.start) {
          return false;
        }
        return true;
      });
      if (checkDuplicate.every((element) => element === true) && idUser === userData?.id_user) {
        // Stamp.push(newEvent);

        // setEventList(Stamp);

        await postTutorial({
          ...newEvent as Event
        });
        clear();
      } else {
        toast.error(t('notify.add_booking_err_time') || '');
      }
    }
  };

  const handleSubBtn = () => {
    if (isUpdate) {
      const listUpdates = [...eventList];
      const index = listUpdates.findIndex((event) => event.id === selectedEvent?.id);
      if (index !== -1) {
        listUpdates.splice(index, 1);
        DeleteBookingService(selectedEvent?.id || 0);
        toast.success(t('notify.delete_booking_success') || '');
        localStorage.removeItem('idUpdate');
      }
      setEventList(listUpdates);
    }
    setTimeout(() => {
      setIsUpdate(false);
    }, 500);
  };

  const checkDulicatebooking = (newBooking: Event, oldBooking: Event) => (newBooking.start || new Date()) < (oldBooking.end || new Date())
    && (newBooking.end || new Date()) > ((oldBooking.start || new Date()));

  const moveEvent = async ({ event, start, end }: SlotEvent) => {
    if (event.isCheck) return toast.error(t('notify.move_event_error') || '');
    const idx = eventList.indexOf(event as { id: number; title: string; start: Date; end: Date; detail: string; service: { id: number, _values: string, _name: string }; personality: { value: number; label: string; }[]; isCheck: boolean; });
    const updatedEvent = { ...event, start, end };
    const nextEvents = eventList.filter((event) => event.id !== updatedEvent.id);
    const checkDuplicateMoveBooking = nextEvents.map((oldEvent) => {
      if (checkDulicatebooking(updatedEvent as Event, oldEvent)) {
        return false;
      }
      return true;
    });

    if (checkDuplicateMoveBooking.every((item) => item === true)) {
      if (updatedEvent.id_orther_user === null) {
        await updateTutorial({
          ...updatedEvent as Event
        });
        nextEvents.splice(idx, 0, updatedEvent as { id: number; title: string; start: Date; end: Date; detail: string; service: { id: number, _values: string, _name: string }; personality: { value: number; label: string; }[]; isCheck: boolean; });
        setEventList(nextEvents);
      } else if (updatedEvent.id_orther_user === userData?.id_user) {
        return toast.error(t('notify.move_me_error') || '');
      } else {
        return toast.error(t('notify.move_event_error') || '');
      }
    } else {
      return toast.error(t('notify.add_booking_err_move') || '');
    }
  };

  const resizeEvent = async ({ event, start, end }: SlotEvent) => {
    if (event.isCheck) return toast.error(t('notify.move_event_error') || '');
    const nextEvents = eventList.map((existingEvent) => (existingEvent.id === event.id
      ? { ...existingEvent, start, end }
      : existingEvent));
    const updatedEvent = { ...event, start, end };
    const result = eventList.filter((event) => event.id !== updatedEvent.id);

    if ((updatedEvent.end as Date).getTime() - (updatedEvent.start as Date).getTime() > 0) {
      const checkDuplicateMoveBooking = result.map((oldEvent) => {
        if (checkDulicatebooking(updatedEvent as Event, oldEvent)) {
          return false;
        }
        return true;
      });
      if (checkDuplicateMoveBooking.every((item) => item === true)) {
        if (updatedEvent.id_orther_user === null) {
          await updateTutorial({
            ...updatedEvent as Event
          });
          setEventList(nextEvents as { id: number; title: string; start: Date; end: Date; detail: string; service: { id: number, _values: string, _name: string }; personality: { value: number; label: string; }[]; isCheck: boolean; }[]);
        } else if (updatedEvent.id_orther_user === userData?.id_user) {
          return toast.error(t('notify.move_me_error') || '');
        } else {
          return toast.error(t('notify.move_event_error') || '');
        }
      } else {
        return toast.error(t('notify.add_booking_err_move') || '');
      }
    }
  };

  const handleShowAdd = () => {
    setIsHidden(true);
    setShowPop(1);
  };

  const handleChangeDivision = (item: OptionDept) => {
    setDivision(item);
    dispatch(department(item as OptionDept));
  };

  const handleHideNotifyInfos = () => {
    setIsOpenNotifyInfos(false);
    setShowPopGuest(1);
    localStorage.setItem('PopupGuest', '1');
  };

  const handleShowhidepopupNote = () => {
    setIsOpenPopupNote(!isOpenPopupNote);
  };

  const { mutate: postHidePopup } = useMutation(
    'post-footer-form',
    (data: boolean) => hidePopup(idUser || 0, data),
    {
      onSuccess: () => {
        setLoading(true);
      },
      onError: () => {
      }
    }
  );

  const handleHidePopoup = async () => {
    const cloneData = true;
    await postHidePopup(cloneData);
  };

  /* call apis */
  const { mutate: postRegisterPersonalities } = useMutation(
    'post-footer-form',
    (data: Option[]) => updatePersionalitySevice(idUser || 0, data),
    {
      onSuccess: () => {
        dispatch(getUserAction(idUser || 0));
      },
      onError: () => {
      }
    }
  );
  const { mutate: postRegisterDepartment } = useMutation(
    'post-footer-form',
    (data: OptionDept) => updateDepartmentType(idUser || 0, data),
    {
      onSuccess: () => {
        dispatch(getUserAction(idUser || 0));
        toast.success(t('notify.update_success') || '');
      },
      onError: () => {
      }
    }
  );

  const { mutate: postRegisterService } = useMutation(
    'post-footer-form',
    (data: SeclectType[]) => updateServiceType(idUser || 0, data),
    {
      onSuccess: () => {
        dispatch(getUserAction(idUser || 0));
      },
      onError: () => {
      }
    }
  );

  /* department */
  const handleConfirmDepartment = () => {
    setIndexView(2);
  };
  /* end department */
  /* personalities */
  const handleConfirmPersonalities = async (cacheDepartment: Option[]) => {
    if (!cacheDepartment?.length) {
      toast.error(t('notify.notthing_save') || '');
    } else {
      await postRegisterPersonalities([
        ...cacheDepartment as Option[]
      ]);
      toast.success(t('notify.update_success') || '');
      setIndexView(1);
    }
  };
  /* end personalities */
  /* service_type */
  const handleConfirmService = async (cacheDepartment: SeclectType[]) => {
    if (!cacheDepartment?.length) {
      toast.error(t('notify.notthing_save') || '');
    } else {
      await postRegisterService([
        ...cacheDepartment
      ]);
      toast.success(t('notify.update_success') || '');
      setIsHidden(false);
      setLoading(true);
    }
  };

  const { mutate: deleteNoteById } = useMutation(
    'post-footer-form',
    (id: number) => deleteNoteItem(id),
    {
      onSuccess: () => {
        dispatch(getNoteByIdAction(Number(Guest)));
        toast.success(t('notify.delete_note_success') || '');
        setLoading(true);
        setIsOpenPopupNote(false);
      },
      onError: () => {
      }
    }
  );

  const handleGetVisitNote = (data: any) => {
    const { item } = data;
    setContentNote(item?.title);
    setIdNote(item?.id_note);
  };

  const handleAddDept = async (dept: OptionDept) => {
    await postRegisterDepartment(dept);
  };

  const hanleDeleteNote = async () => {
    await deleteNoteById(idNote || 0);
  };

  const minTime = new Date();
  minTime.setHours(mintime, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(maxtime, 0, 0);
  /* end service_type */

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
      handleOpenPopupNote={handleShowhidepopupNote}
      handleGetVisitNote={(data: any) => handleGetVisitNote(data)}
      overTimeRow={userData?.indexRow}
      listNoteUser={noteData}
      isBoss
      isOpenCloseBtn
    />
  ), [eventList, loadingCheck, userData, lang, user, noteData]);

  return (
    <MainLayout isCalendarLayout>
      {loadingCheck
        ? (
          <Loading variant="fullScreen" isShow size="medium" />
        )
        : (
          <div className="p-calendar" ref={getHeight}>
            <div className="p-calendar_calendar">
              {child2}
              <PopupBooking
                isbtn={isUpdate ? !selectedEvent?.isCheck && selectedEvent?.id_orther_user === null : true}
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
                btnText={!isUpdate ? t('popup.submit') || '' : t('popup.change') || ''}
                handleConfirm={handleConfirm}
                handleSelectEnd={(value) => setEnd(value)}
                handleSelectStart={(value) => setStart(value)}
                onChangValue={(value) => setDetail(value.target.value)}
                valueTest={detail}
                handleSubBtn={handleSubBtn}
                options={userData?.persionalities || options}
                isOpenCloseBtn={isOpenCloseBtn}
              />
            </div>
            <PopupPosition
              isOpen={isHidden}// department
              title=""
              textAdd={t('popup.add-department') || ''}
              btnText={t('popup.next') || ''}
              subBtnText={t('popup.back') || ''}
              skipBtnText={t('popup.skip') || ''}
              message=""
              textPlaceholder={t('placeholder.department') || ''}
              viewActive={togglePopup}
              indexView={indexView}
              nameUser={userData && userData?.user_name}
              idUser={userData?.id_user || 0}
              handleShowAdd={handleShowAdd}
              handleClose={() => {
                setIsHidden(false);
                setLoading(true);
                handleHidePopoup();
              }}
              handleSubBtn={() => setIndexView(indexView - 1)}
              handleConfirmDepartment={handleConfirmDepartment}
              handleConfirmPersonalities={handleConfirmPersonalities}
              handleConfirmService={handleConfirmService}
              handleAddDept={(data) => handleAddDept(data)}
            />
            <div className={mapModifiers('p-calendar_department', cloneShowBar && 'showbar')}>
              <SwitchDivision
                optionDavision={userData?.departments || []}
                handleClick={handleChangeDivision}
                username={userData?.user_name || 'GUEST'}
                division={division}
                isDisabled={Guest === 'GUEST'}
              />
            </div>
            <div className="popup-note_info_guest">
              <Popup
                isOpen={isOpenNotifyInfos}
                handleClose={handleHideNotifyInfos}
                variant="nofityInfomation"
              >
                <NotifyInformation
                  desc={t('notify.guest_title') || ''}
                  recommend={t('notify.guest_recomend') || ''}
                  option={OptionTasks as OptionTask[]}
                  handleClose={handleHideNotifyInfos}
                />
              </Popup>
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
                    <TextArea id="TextAreas" value={contentNote} handleOnchange={(event) => setContentNote(event.target.value)} readOnly />
                  </div>
                  <div className="popup-note_wrapper_btn">
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
                    <Button
                      modifiers={['primary']}
                      onClick={() => {
                        if (hanleDeleteNote) hanleDeleteNote();
                      }}
                    >
                      <Typography
                        modifiers={['700', 'uppercase']}
                        content={t('popup.delete') || ''}
                      />
                    </Button>
                  </div>
                </div>
              </Popup>
            </div>

          </div>

        )}
    </MainLayout>
  );
};

export default memo(Calendar);
