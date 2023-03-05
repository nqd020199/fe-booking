import { Story, Meta } from '@storybook/react';
import React from 'react';

import TimeZone from '.';

export default {
  title: 'Components/molecules/TimeZone',
  component: TimeZone,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <TimeZone position="Vietnamese" utc="UTC+7" />
);
