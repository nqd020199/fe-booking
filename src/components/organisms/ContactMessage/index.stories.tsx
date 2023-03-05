import { Story, Meta } from '@storybook/react';
import React from 'react';

import ContactMessage from '.';

export default {
  title: 'Components/organisms/ContactMessage',
  component: ContactMessage,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ContactMessage dataSearch="" />
);
