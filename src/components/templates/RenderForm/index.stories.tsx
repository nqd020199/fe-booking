import { Story, Meta } from '@storybook/react';
import React from 'react';

import LoginForm from '.';

export default {
  title: 'Components/templates/LoginForm',
  component: LoginForm,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <LoginForm />
);
