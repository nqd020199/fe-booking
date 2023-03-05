/* eslint-disable react/button-has-type */
/* eslint-disable react-hooks/rules-of-hooks */
import { Story, Meta } from '@storybook/react';
import React, { useState, useEffect } from 'react';

import PopupBooking from '.';

import { Option } from 'components/atoms/DropDownCheckbox';
import { list } from 'components/molecules/PullDown/index.stories';
import { SeclectType } from 'services/types';

export default {
  title: 'Components/organisms/PopupBooking',
  component: PopupBooking,
  argTypes: {},
} as Meta;

export const normal: Story = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [valueText, setValue] = useState('');
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());
  const [date, setDate] = useState<Date>(new Date());
  const [select, setSelect] = useState<SeclectType>();
  const [optionSelected, setSelected] = useState<Option[] | null>();

  useEffect(() => {
    const enndTime = end.setTime(end.getTime() + (30 * 60 * 1000));
    setEnd(new Date(enndTime));
  }, []);
  const handleChange = (selected: Option[]) => {
    setSelected(selected);
  };
  const handleConfirm = () => (
    console.log({
      start, end, date, select, optionSelected, valueText
    }));
  return (
    <div>
      <button onClick={() => setIsOpen(true)}> click me!!!</button>
      <PopupBooking
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        handleSelectEnd={(value) => setEnd(value)}
        handleSelectStart={(value) => setStart(value)}
        handleChangeDate={(value) => setDate(value)}
        end={end}
        start={start}
        date={date}
        title="ADD booking"
        optionList={list}
        select={select}
        handleSelect={(option) => setSelect(option)}
        handleChangeMulti={handleChange}
        optionSelected={optionSelected || []}
        subBtnText="Cancel"
        btnText="Submit"
        handleConfirm={handleConfirm}
        onChangValue={(value) => setValue(value.target.value)}
        valueTest=""
      />
    </div>
  );
};
