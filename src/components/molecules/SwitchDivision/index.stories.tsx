/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { Story, Meta } from '@storybook/react';
import React, { useState } from 'react';

import SwitchDivision from '.';

import { OptionDept } from 'services/Login/types';

export default {
  title: 'Components/molecules/SwitchDivision',
  component: SwitchDivision,
  argTypes: {},
} as Meta;

export const normal: Story = () => {
  const [division, setDivision] = useState<string>();

  const handleChangeDivision = (item: OptionDept) => {
    setDivision(item.label);
  };
  return (
    <SwitchDivision
      // optionDavision={optionDavision}
      // davision={division || ''}
      handleClick={handleChangeDivision}
    />
  );
};
