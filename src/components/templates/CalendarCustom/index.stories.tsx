import { Story, Meta } from '@storybook/react';
import React from 'react';

import CalendarCustom from '.';

export const optionsCalendar = [
  {
    id: 0,
    title: 'training',
    start: new Date(2022, 10, 30, 9, 0, 0),
    end: new Date(2022, 10, 30, 10, 0, 0),
    detail: 'hiihih',
    service: { id: 1, _values: 'hhii', _name: 'híhfi' },
    personality: [{ value: 0, label: 'Goranboy' }],
    isCheck: false,
  },
  {
    id: 1,
    title: 'late lunch',
    start: new Date(2022, 10, 30, 14, 0, 0),
    end: new Date(2022, 10, 30, 15, 30, 0),
    detail: 'hihihiih',
    service: { id: 1, _values: 'hhii', _name: 'híhfi' },
    personality: [{ value: 0, label: 'Goranboy' }],
    isCheck: true,

  },
  {
    id: 2,
    title: 'training',
    start: new Date(2022, 11, 3, 9, 0, 0),
    end: new Date(2022, 11, 3, 10, 0, 0),
    detail: 'hiihih',
    service: { id: 1, _values: 'hhii', _name: 'híhfi' },
    personality: [{ value: 0, label: 'Goranboy' }],
    isCheck: false,

  },
  {
    id: 3,
    title: 'late lunch',
    start: new Date(2022, 11, 3, 14, 0, 0),
    end: new Date(2022, 11, 3, 15, 0, 0),
    detail: 'hihihiih',
    service: { id: 1, _values: 'hhii', _name: 'híhfi' },
    personality: [{ value: 0, label: 'Goranboy' }],
    isCheck: false,

  },
  {
    id: 4,
    title: 'training',
    start: new Date(2022, 11, 4, 10, 0, 0),
    end: new Date(2022, 11, 4, 11, 0, 0),
    detail: 'hiihih',
    service: { id: 1, _values: 'hhii', _name: 'híhfi' },
    personality: [{ value: 0, label: 'Goranboy' }],
    isCheck: true,

  },
  {
    id: 5,
    title: 'late lunch',
    start: new Date(2022, 11, 2, 14, 0, 0),
    end: new Date(2022, 11, 2, 14, 30, 0),
    detail: 'hihihiih',
    service: { id: 1, _values: 'hhii', _name: 'híhfi' },
    personality: [{ value: 0, label: 'Goranboy' }],
    isCheck: true,
  },
  {
    id: 6,
    title: 'training',
    start: new Date(2022, 11, 2, 9, 0, 0),
    end: new Date(2022, 11, 2, 9, 30, 0),
    detail: 'hiihih',
    service: { id: 1, _values: 'hhii', _name: 'híhfi' },
    personality: [{ value: 0, label: 'Goranboy' }],
    isCheck: true,
  },
  {
    id: 7,
    title: 'late lunch',
    start: new Date(2022, 11, 1, 14, 0, 0),
    end: new Date(2022, 11, 1, 15, 30, 0),
    detail: 'hihihiih',
    service: { id: 1, _values: 'hhii', _name: 'híhfi' },
    personality: [{ value: 0, label: 'Goranboy' }],
    isCheck: true,

  },
];

export default {
  title: 'Components/templates/CalendarCustom',
  component: CalendarCustom,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <CalendarCustom
    events={optionsCalendar}
    handleSelectSlot={(slot) => console.log(slot)}
    handleSelected={(slot) => console.log(slot)}
    moveEvent={(slot) => console.log(slot)}
    resizeEvent={(slot) => console.log(slot)}
    dateDefaul={new Date()}
    maxtime={new Date()}
    mintime={new Date()}
  />
);
