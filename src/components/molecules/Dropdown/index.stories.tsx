/* eslint-disable react-hooks/rules-of-hooks */
import { Story, Meta } from '@storybook/react';
import React, { useState } from 'react';

// eslint-disable-next-line import/no-named-as-default

import Dropdown, { OptionsChild } from '.';

import { IconName } from 'components/atoms/Icon';

const flagNation = [
  {
    id: 1, name: 'VietNamese', acronym: 'VN', IconName: 'VietNam'
  },
  {
    id: 2, name: 'England', acronym: 'EN', IconName: 'England'
  },
  {
    id: 3, name: 'Korea', acronym: 'KO', IconName: 'Korea'
  },
];

export default {
  title: 'Components/molecules/Dropdown',
  component: Dropdown,
  argTypes: {},
} as Meta;

export const normal: Story = () => {
  const [iconName, setIconName] = useState<IconName>('VietNam');
  const [name, setname] = useState('VN');

  const handleClick = (option: OptionsChild) => {
    setIconName(option.IconName as IconName);
    setname(option.acronym || 'VN');
  };
  return (
    <div style={{ padding: '0 0 0 100px', height: 10000 }}>
      <Dropdown
        iconName={iconName}
        optionsChild={flagNation}
        typeDropdown="dropDown"
        handleClick={handleClick}
        name={name}
      />

    </div>
  );
};
