import { Story, Meta } from '@storybook/react';
import React from 'react';

import Domain from '.';

export default {
  title: 'Components/templates/Domain',
  component: Domain,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <Domain />
);
