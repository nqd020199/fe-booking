/* eslint-disable react-hooks/rules-of-hooks */
import { Story, Meta } from '@storybook/react';
import React, { useState } from 'react';

import DatePickerCustom from '.';

export default {
  title: 'Components/organisms/DatePicker',
  component: DatePickerCustom,
  argTypes: {},
} as Meta;

export const normal: Story = () => {
  const [selected, setSelected] = useState<Date>(new Date());
  return (
    <DatePickerCustom
      selected={selected}
      handleChange={(value: Date) => setSelected(value)}
      label="ccccc"
      iconName="clock"
      size="21x21"
    />
  );
};
