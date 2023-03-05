/* eslint-disable react-hooks/rules-of-hooks */
import { Story, Meta } from '@storybook/react';
import React, { useState } from 'react';

import CalendarViews, { OptionViews } from '.';

const optionsViews = [
  {
    id: 1, view: 'Monthly', value: 'month'
  },
  {
    id: 2, view: 'Weekly', value: 'week'
  },
  {
    id: 3, view: 'Daly', value: 'day'
  },
];

export default {
  title: 'Components/molecules/CalendarViews',
  component: CalendarViews,
  argTypes: {},
} as Meta;

export const normal: Story = () => {
  const [view, setView] = useState('week');

  const handleChangView = (item: OptionViews) => {
    setView(item.value || '');
  };
  return (
    <CalendarViews
      optionViews={optionsViews}
      viewActive={view}
      onChangeView={handleChangView}
    />
  );
};
