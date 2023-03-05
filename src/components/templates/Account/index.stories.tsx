import { Story, Meta } from '@storybook/react';
import React from 'react';

import Account from '.';

export default {
  title: 'Components/templates/Account',
  component: Account,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <Account />
);
