/* eslint-disable import/no-cycle */
/* eslint-disable object-curly-newline */
import { Story, Meta } from '@storybook/react';
import React from 'react';

import Table from '.';

export default {
  title: 'Components/templates/Table',
  component: Table,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <Table />
);
