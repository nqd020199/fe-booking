/* eslint-disable react-hooks/rules-of-hooks */
import { Story, Meta } from '@storybook/react';
import React, { useState } from 'react';

import DuarationView from '.';

export default {
  title: 'Components/molecules/DuarationView',
  component: DuarationView,
  argTypes: {},
} as Meta;

export const normal: Story = () => {
  const [duaration, setDuaration] = useState('');
  const handleNext = () => {
    setDuaration(`${Math.floor(Math.random() * 1000)}`);
  };
  const handlePrev = () => {
    setDuaration(`${Math.floor(Math.random() * 1000)}`);
  };
  return (
    <DuarationView onClickNext={handleNext} onClickPrev={handlePrev} duarationTime={duaration || ''} />
  );
};
