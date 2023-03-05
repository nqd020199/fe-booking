/* eslint-disable react-hooks/rules-of-hooks */
import { Story, Meta } from '@storybook/react';
import React from 'react';

import Genaral from '.';

export default {
  title: 'Components/templates/Genaral',
  component: Genaral,
  argTypes: {},
} as Meta;

const optionTimeZone = [
  { id_selection: 1, _values: '1', _name: '이슈비춰보기' },
  { id_selection: 2, _values: '2', _name: '논의 미팅' },
  { id_selection: 3, _values: '3', _name: '인력공급 호치민현지' },
];
const optionDuaration = [
  { id_selection: 1, _values: '1', _name: '이슈비춰보기' },
  { id_selection: 2, _values: '2', _name: '논의 미팅' },
  { id_selection: 3, _values: '3', _name: '인력공급 호치민현지' },
];

export const normal: Story = () => (
  <div style={{ padding: '100px', height: 10000 }}>
    <Genaral
      optionTimeZone={optionTimeZone}
      optionDuaration={optionDuaration}
    />
  </div>
);
