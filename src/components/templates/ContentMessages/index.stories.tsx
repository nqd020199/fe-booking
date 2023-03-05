import { Story, Meta } from '@storybook/react';
import React from 'react';

import ContentMessages from '.';

export default {
  title: 'Components/templates/ContentMessages',
  component: ContentMessages,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ContentMessages />
);
