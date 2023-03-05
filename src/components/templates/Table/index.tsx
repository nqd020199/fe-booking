/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { startOfWeek, isEqual } from 'date-fns';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Typography from 'components/atoms/Typography';
import useClickOutside from 'hooks/useClickOutside';
import { useAppSelector } from 'store/hooks';
import mapModifiers, { RenderDateToWeek } from 'utils/functions';

export type NoteItem = {
  id_note?: number
  indexRow?: number
  date: Date;
  title?: string
  id_user?: number
  user_name?: string
  department?: string
};
export type ListNote = {
  id?: string
  value: Date;
  item?: NoteItem[]
};

interface TableProps {
  handleOpenPopupNote?: () => void;
  handleGetVisitNote?: (data: any) => void;
  listNoteUser?: NoteItem[];
  overTimeRow?: number;
  isBoss?: boolean;
}

const Table: React.FC<TableProps> = ({ handleOpenPopupNote, handleGetVisitNote, listNoteUser, overTimeRow, isBoss }) => {
  const currDates = useAppSelector((state) => state.deparment.dateDefault);
  const infoNote = useAppSelector((state) => state.user.noteList);
  const [listNoteConvert, setListNoteConver] = useState<ListNote[]>();
  const { content } = JSON.parse(localStorage.getItem('USER_LOGIN') || '');
  const accessToken = localStorage.getItem('accessToken');
  const [idItemHover, setIdItemHover] = useState<Number>();
  const [itemHover, setItemHover] = useState<NoteItem>();
  const [isOpen, setIsOpen] = useState(false);
  const [right, setRight] = useState(true);
  const { t } = useTranslation();
  const eventRef = useRef<any>(null);
  const showbar = useAppSelector((state) => state.example.isShowSideBar);
  const [cloneShowBar, setCloneShowBar] = useState(showbar);

  const startDayofWeed = startOfWeek(new Date(currDates)).getDate() + 1;
  const handleConverData = () => {
    const monday: NoteItem[] = []; const tues: NoteItem[] = []; const wedn: NoteItem[] = []; const thur: NoteItem[] = []; const fri: NoteItem[] = []; const sat: NoteItem[] = []; const sun: NoteItem[] = [];
    listNoteUser?.length && listNoteUser.forEach((note) => {
      if (isEqual(new Date(`${note.date}`), RenderDateToWeek(startDayofWeed, new Date(currDates).getMonth(), new Date(currDates).getFullYear()))) { monday.push(note); }
      if (isEqual(new Date(`${note.date}`), RenderDateToWeek(startDayofWeed + 1, new Date(currDates).getMonth(), new Date(currDates).getFullYear()))) { tues.push(note); }
      if (isEqual(new Date(`${note.date}`), RenderDateToWeek(startDayofWeed + 2, new Date(currDates).getMonth(), new Date(currDates).getFullYear()))) { wedn.push(note); }
      if (isEqual(new Date(`${note.date}`), RenderDateToWeek(startDayofWeed + 3, new Date(currDates).getMonth(), new Date(currDates).getFullYear()))) { thur.push(note); }
      if (isEqual(new Date(`${note.date}`), RenderDateToWeek(startDayofWeed + 4, new Date(currDates).getMonth(), new Date(currDates).getFullYear()))) { fri.push(note); }
      if (isEqual(new Date(`${note.date}`), RenderDateToWeek(startDayofWeed + 5, new Date(currDates).getMonth(), new Date(currDates).getFullYear()))) { sat.push(note); }
      if (isEqual(new Date(`${note.date}`), RenderDateToWeek(startDayofWeed + 6, new Date(currDates).getMonth(), new Date(currDates).getFullYear()))) { sun.push(note); }
    });
    const week = [
      { id: 'thu2', value: RenderDateToWeek(startDayofWeed, new Date(currDates).getMonth(), new Date(currDates).getFullYear()), item: monday },
      { id: 'thu3', value: RenderDateToWeek(startDayofWeed + 1, new Date(currDates)?.getMonth(), new Date(currDates)?.getFullYear()), item: tues },
      { id: 'thu4', value: RenderDateToWeek(startDayofWeed + 2, new Date(currDates)?.getMonth(), new Date(currDates)?.getFullYear()), item: wedn },
      { id: 'thu5', value: RenderDateToWeek(startDayofWeed + 3, new Date(currDates)?.getMonth(), new Date(currDates)?.getFullYear()), item: thur },
      { id: 'thu6', value: RenderDateToWeek(startDayofWeed + 4, new Date(currDates)?.getMonth(), new Date(currDates)?.getFullYear()), item: fri },
      { id: 'thu7', value: RenderDateToWeek(startDayofWeed + 5, new Date(currDates)?.getMonth(), new Date(currDates)?.getFullYear()), item: sat },
      { id: 'chunhat', value: RenderDateToWeek(startDayofWeed + 6, new Date(currDates)?.getMonth(), new Date(currDates)?.getFullYear()), item: sun },
    ];
    setListNoteConver(week);
  };

  useEffect(() => {
    setCloneShowBar(showbar);
  }, [showbar]);

  useEffect(() => {
    handleConverData();
  }, [currDates, listNoteUser, infoNote]);

  const handleCheckMatch = (list: NoteItem[], value: Date, index: number) => {
    const check = list.find((item) => new Date(item.date).getTime() === value.getTime() && item.indexRow === index);
    return check;
  };

  const componentHover = (data: NoteItem) => {
    if (!data) {
      setIsOpen(false);
    } else {
      setIdItemHover(data?.id_note);
      setItemHover(data);
      setIsOpen(true);
    }
  };
  const handleCheckNote = (data: NoteItem) => {
    if (accessToken === 'GUEST') {
      return false;
    }
    const { user_name: username = '' } = content;
    return username === data.user_name;
  };

  const handleCheckPosition = (event: any) => {
    if (event.pageX > 500) {
      setRight(false);
    }
    if (event.pageX < 300) {
      setRight(true);
    }
  };

  const renderHover = () => (
    <div
      className={mapModifiers('t-table-item_info', right && 'right')}
      style={{
        bottom: 48,
      }}
    >
      <ul>
        <li style={{ fontWeight: '700' }}>
          {`${t('hover.from') || ''}:`}
          <span style={{ fontWeight: '400' }}>{`${itemHover?.user_name}`}</span>
        </li>
        <li style={{ fontWeight: '700' }}>
          {`${t('hover.department') || ''}:  `}
          <span style={{ fontWeight: '400' }}>{`${itemHover?.department}`}</span>
        </li>
        <li style={{ fontWeight: '700' }} className="t-table-item_info_detail">
          {`${t('hover.detail') || ''}:  `}
          <span style={{ fontWeight: '400' }}>{`${itemHover?.title}`}</span>
        </li>
      </ul>
    </div>
  );

  return (
    <div className={mapModifiers('t-table')} onMouseLeave={() => setIsOpen(false)} ref={eventRef} onMouseMove={(event) => handleCheckPosition(event)}>
      {[...Array(overTimeRow)].map((item, index) => (
        <div className="t-table_row" key={index}>
          <div className="t-table_row_title">{t('popup.overtime_title')}</div>
          <div className="t-table_row_list">
            {listNoteConvert && listNoteConvert.map((days) => (
              <div
                className={`t-table_row_list_col ${days.value.getDate() === new Date().getDate() ? 'is_today' : ''}
                ${handleCheckMatch((days.item || []), days.value, index)
                    ? (handleCheckNote(handleCheckMatch((days.item || []), days.value, index) as NoteItem) ? 'have-item'
                      : 'have-item-guest') : ''} ${handleCheckMatch((days.item || []), days.value, index)?.id_note && idItemHover === handleCheckMatch((days.item || []), days.value, index)?.id_note ? `item-hover_${idItemHover}` : ''}`}
                key={days.id}
                onMouseOver={() => {
                  componentHover(handleCheckMatch((days.item || []), days.value, index) as NoteItem);
                }}
                onClick={() => {
                  const data = { date: days.value, idx: index, item: handleCheckMatch((days.item || []), days.value, index) };
                  if (handleOpenPopupNote) {
                    if (isBoss && !handleCheckMatch((days.item || []), days.value, index)) {
                      // console.log('ss');
                    } else {
                      handleOpenPopupNote();
                    }
                  }
                  if (handleGetVisitNote) handleGetVisitNote(data);
                }}
              >
                <p>
                  {handleCheckMatch((days.item || []), days.value, index)?.title}
                </p>
                {isOpen && (handleCheckMatch((days.item || []), days.value, index)?.id_note && idItemHover === handleCheckMatch((days.item || []), days.value, index)?.id_note) && renderHover()}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

Table.defaultProps = {
};

export default Table;
