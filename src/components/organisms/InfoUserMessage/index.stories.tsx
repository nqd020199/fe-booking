import { Story, Meta } from '@storybook/react';
import React from 'react';

import InfoUserMessage from '.';

export default {
  title: 'Components/organisms/InfoUserMessage',
  component: InfoUserMessage,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <InfoUserMessage
    departments={[]}
    titleSetting=""
    titleSearch=""
    titleMutual=""
    titleNotify=""
    user_name=""
    image_url=""
    isChecked={false}
    mediaList={[]}
    library=""
    viewAll=""
  />
);
