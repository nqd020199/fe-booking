/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/rules-of-hooks */
import { Story, Meta } from '@storybook/react';
import React, { useState } from 'react';

import MultiSelect, { Option } from '.';

export default {
  title: 'Components/atoms/DropDownCheckbox',
  component: MultiSelect,
  argTypes: {},
} as Meta;
export const options: any = [
  { value: 0, label: 'Goranboy' },
  { value: 1, label: 'Safikurd' },
  { value: 2, label: 'Baku' },
  { value: 3, label: 'Ganja' },
  { value: 4, label: 'Shusha' },
  { value: 5, label: 'Agdam' },
];
export const normal: Story = () => {
  const [optionSelected, setSelected] = useState<Option[] | null>();

  const handleChange = (selected: Option[]) => {
    setSelected(selected);
  };
  return (
    <div style={{ height: 1000 }}>
      <MultiSelect
        key="example_id"
        options={options}
        onChange={handleChange}
        value={optionSelected}
        isSelectAll
        menuPlacement="bottom"
      />
    </div>
  );
};
