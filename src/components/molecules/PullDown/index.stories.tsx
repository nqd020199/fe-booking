import { Story, Meta } from '@storybook/react';
import React, { useState } from 'react';

import PullDown from '.';

import { SeclectType } from 'services/types';

export default {
  title: 'Components/molecules/PullDown',
  component: PullDown,
  argTypes: {
    isRequired: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    error: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
    isSearch: {
      type: 'boolean'
    }
  },
} as Meta;

export const list = [
  { id_selection: 1, label: '1', _values: '이슈비춰보기' },
  { id_selection: 2, label: '2', _values: '논의 미팅' },
  { id_selection: 3, label: '3', _values: '인력공급 호치민현지' },
];

export const Normal: Story = ({
  error, isRequired, isSearch
}) => {
  const [select, setSelect] = useState<SeclectType>();
  return (
    <div style={{
      padding: '50px',
      height: '300px',
    }}
    >
      <PullDown
        label="Service Type"
        name="test"
        error={error}
        value={select}
        handleSelect={(value) => setSelect(value)}
        optionData={list}
        isRequired={isRequired}
        placeholder="Choose Service Type"
        isSearch={isSearch}
      />
    </div>
  );
};
