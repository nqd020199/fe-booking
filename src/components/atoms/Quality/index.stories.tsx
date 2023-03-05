import { Story, Meta } from '@storybook/react';
import React from 'react';

import Quality from '.';

export default {
  title: 'Components/atoms/Quality',
  component: Quality,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <Quality />
);
