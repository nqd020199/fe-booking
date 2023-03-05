/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/rules-of-hooks */
import { Story, Meta } from '@storybook/react';
import React, { useEffect, useState } from 'react';

import Notify from '.';

export default {
  title: 'Components/organisms/Notify',
  component: Notify,
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['success', 'error'],
      },
      defaultValue: 'error',
    },
    title: {
      control: {
        type: 'text',
      },
      defaultValue: 'Error',
    },
    message: {
      control: {
        type: 'text',
      },
      defaultValue: 'Your appointment has been saved.<br/> Please wait for confirmation from [User’s name].',
    },
  },
} as Meta;

export const normal: Story = ({
  type,
  title,
  message,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [counter, setCounter] = useState(90);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (counter > 0) setCounter(counter - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, counter]);
  const handleConfirm = () => {
    setCounter(90);
  };
  const descLogin = 'Your appointment has been saved.<br/> Please wait for confirmation from [User’s name].';
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
      <Notify
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        type={type}
        title={title}
        message={message}
        btnText="RESEND"
        notifiLogin={false}
        // subBtnText="Cancel"
        descLogin={descLogin}
        CountDown={counter}
        handleConfirm={handleConfirm}
        animateNotify
      />
    </div>
  );
};
export const defaulf: Story = ({
  type,
  title,
  message,
}) => {
  const [isOpen, setIsOpen] = useState(false);

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
      <Notify
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        type={type}
        title={title}
        message={message}
        modifiers="default"
        animateNotify={false}
      />
    </div>
  );
};
export const twoButton: Story = ({
  type,
  title,
  message,

}) => {
  const [isOpen, setIsOpen] = useState(false);

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
      <Notify
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        type={type}
        title={title}
        message={message}
        btnText="RESEND"
        subBtnText="Cancel"
        modifiers="twoButton"
        animateNotify={false}
      />
    </div>
  );
};
export const onlyButton: Story = ({
  type,
  title,
  message,
}) => {
  const [isOpen, setIsOpen] = useState(false);

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
      <Notify
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        type={type}
        title={title}
        message={message}
        btnText="0k"
        modifiers="onlyButton"
        animateNotify={false}
      />
    </div>
  );
};
