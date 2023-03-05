/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-cycle */
/* eslint-disable import/order */
import moment from 'moment';
import React, {
  cloneElement, useEffect, useMemo, useState
} from 'react';
import {
  Calendar as ReactBigCalendar,
  momentLocalizer,
  SlotInfo,
  Views,
} from 'react-big-calendar';

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import { Option } from 'components/atoms/DropDownCheckbox';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/en-gb';
import 'moment/locale/ko';
import 'moment/locale/vi';
import Component, { ViewMonth } from './Component';
import HeaderCalendar from '../HeaderCalendar';
import i18n from 'i18n';
import { SeclectType } from 'services/types';
import Table, { NoteItem } from '../Table';
import { useAppSelector } from 'store/hooks';
import { minTime } from 'date-fns';

export type Event = {
  [x: string]: any;
  id?: number;
  start?: Date;
  end?: Date;
  detail?: string;
  service?: SeclectType;
  personality?: Option[];
  title?: string;
  isCheck?: boolean;
  id_orther_user?: number,
};
export type SlotEvent = {
  event: Event;
  start?: Date | string;
  end?: Date | string;
  isAllDay?: boolean;
};

interface CalendarCustomProps {
  events?: Event[]
  handleSelected?: (event: Event) => void;
  moveEvent?: (event: SlotEvent) => void;
  handleSelectSlot?: (event: SlotInfo) => void;
  resizeEvent?: (event: SlotEvent) => void;
  dateDefaul: Date,
  maxtime: Date,
  handleOpenPopupNote?: () => void;
  mintime: Date
  handleGetVisitNote?: (data: any) => void;
  listNoteUser?: NoteItem[];
  overTimeRow?: number;
  isBoss?: boolean;
  isOpenCloseBtn?: boolean;
}

const CalendarCustom: React.FC<CalendarCustomProps> = ({
  events, handleSelected, handleSelectSlot, moveEvent,
  resizeEvent, dateDefaul, maxtime, mintime,
  handleOpenPopupNote, handleGetVisitNote, listNoteUser, overTimeRow, isBoss,
  isOpenCloseBtn
}) => {
  const DragAndDropCalendar = withDragAndDrop(ReactBigCalendar);
  const localizer = momentLocalizer(moment);

  const { scrollToTime } = useMemo(
    () => ({
      scrollToTime: new Date(1972, 0, 1, 8),
    }),
    []
  );

  const CALENDAR_COMPONENTS = useMemo(() => ({
    event: Component,
    month: { event: ViewMonth },
    toolbar: HeaderCalendar,
  }), []);

  return (
    <>
      <DragAndDropCalendar
        culture={i18n.language}
        localizer={localizer}
        events={events}
        defaultView={Views.WEEK}
        selectable
        resizable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelected}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        resizableAccessor={() => true}
        draggableAccessor={() => true}
        scrollToTime={scrollToTime}
        step={30}
        // longPressThreshold={20}
        timeslots={1}
        defaultDate={dateDefaul}
        min={mintime}
        max={maxtime}
        popup
        components={CALENDAR_COMPONENTS}
      />
      <Table
        handleOpenPopupNote={handleOpenPopupNote}
        handleGetVisitNote={(data: any) => { if (handleGetVisitNote) handleGetVisitNote(data); }}
        listNoteUser={listNoteUser}
        overTimeRow={overTimeRow}
        isBoss={isBoss}
      />
    </>
  );
};

CalendarCustom.defaultProps = {
};

export default React.memo(CalendarCustom);
