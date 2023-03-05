/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { Story, Meta } from '@storybook/react';
import React, { useState } from 'react';

import PopupPosition from '.';

import { OptionType } from 'components/molecules/PullDown';
import { SeclectType } from 'services/types';

export default {
  title: 'Components/organisms/PopupPosition',
  component: PopupPosition,
  argTypes: {
    name: {
      control: {
        type: 'text',
      },
      defaultValue: 'Haha',
    },
    company: {
      control: {
        type: 'text',
      },
      defaultValue: 'MINIU',
    },
    title: {
      control: {
        type: 'text',
      },
      defaultValue: 'Department',
    },
    message: {
      control: {
        type: 'text',
      },
      defaultValue: 'Please update your position and department.',
    },
  },
} as Meta;

const positionsList = [
  {
    id: 1,
    _values: '말레이시아_컨벤션제안프로젝트_이슈도우미',
    label: '말레이시아_컨벤션제안프로젝트_이슈도우미'
  },
  {
    id: 2,
    _values: 'TH Coporation Service',
    label: 'TH Coporation Service'
  }
];
export const normal: Story = ({
  name,
  message,
  company,
  title
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [select, setSelect] = useState<SeclectType>();
  const [position, setPosition] = useState<SeclectType[]>(positionsList);

  const handleShowAdd = () => {
    setIsHidden(true);
  };
  const handleSelect = (e: SeclectType) => {
    setSelect(e);
    setIsHidden(false);
    setPosition((items) => [...items, e]);
    setSelect(undefined);
  };

  const handleRemove = (item: SeclectType) => {
    setPosition((position) => position.filter(
      (position) => position.id_selection !== item.id_selection
    ));
  };

  const optionPositions = [
    {
      id_selection: 4,
      value: 'Vietnam Biz',
      label: 'Vietnam Biz',
    },
    {
      id_selection: 5,
      value: 'VietNam Division Asean',
      label: 'VietNam Division Asean',
    },
    {
      id_selection: 6,
      value: 'MiniU',
      label: 'MiniU',
    },
    {
      id_selection: 7,
      value: 'Korean Company',
      label: 'Korean Company',
    },
  ];
  return (
    <div
      style={{
        height: '100vh',
        background: '#000',
      }}
    >
      <button type="button" onClick={() => setIsOpen(true)}>
        Open
      </button>
      <PopupPosition
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        nameUser={name}
        message={message}
        btnText="Save"
        subBtnText="Cancel"
        title={title}
        textAdd="Add your position here"
        handleShowAdd={handleShowAdd}
        // isHidden={isHidden}
        positionsList={position || []}
        // optionPositions={optionPositions}
        // value={select}
        // handleSelect={(value) => handleSelect(value)}
        handleRemove={(item) => handleRemove(item)}
      />
    </div>
  );
};
