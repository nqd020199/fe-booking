import { Story, Meta } from '@storybook/react';
import React from 'react';

import WelcomeMessage from '.';

export default {
  title: 'Components/organisms/WelcomMessage',
  component: WelcomeMessage,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <WelcomeMessage />
);
