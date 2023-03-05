import { Story, Meta } from '@storybook/react';
import React from 'react';

import ToastNotify from '.';

export default {
  title: 'Components/atoms/ToastNotify',
  component: ToastNotify,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ToastNotify />
);
