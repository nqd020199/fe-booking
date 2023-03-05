import { Story, Meta } from '@storybook/react';
import React from 'react';

import HeaderCalendar from '.';

export default {
  title: 'Components/templates/HeaderCalendar',
  component: HeaderCalendar,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <HeaderCalendar />
);
