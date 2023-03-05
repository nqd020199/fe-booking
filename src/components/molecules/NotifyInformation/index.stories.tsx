import { Story, Meta } from '@storybook/react';
import React from 'react';

import NotifyInformation from '.';

export default {
  title: 'Components/molecules/NotifyInformation',
  component: NotifyInformation,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <NotifyInformation />
);
