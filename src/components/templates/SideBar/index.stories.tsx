import { Story, Meta } from '@storybook/react';
import React from 'react';

import SideBar, { OptionSideBar } from '.';

const optionSideBar = [
  {
    id: 0, icon: 'calendar_white', title: 'my calendar', child: false,
  },
  {
    id: 1, icon: 'tag', title: 'coupon management', child: false,
  },
  {
    id: 4,
    icon: 'message',
    title: 'message',
    child: true,
    itemChild: [
      {
        id: 222, icon: 'tag', title: 'coupon management'
      }
    ]
  },
  {
    id: 5, icon: 'setting', title: 'Setting', child: false,
  },
];

export default {
  title: 'Components/templates/SideBar',
  component: SideBar,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <SideBar optionSideBar={optionSideBar as OptionSideBar[]} nameUser="Leo" mainLayout cloneShowSideBar={false} />
);
