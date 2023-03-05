/* eslint-disable @typescript-eslint/no-unused-vars */
import { Story, Meta } from '@storybook/react';
import React, { useState } from 'react';

import Popup from '.';

import NotifyInformation from 'components/molecules/NotifyInformation';

export default {
  title: 'Components/organisms/Popup',
  component: Popup,
  argTypes: {
    outsideClose: {
      control: {
        type: 'select',
        options: [true, false],
      },
      defaultValue: false,
    },
    closeName: {
      control: {
        type: 'select',
        options: ['close', 'closeBlack'],
      },
      defaultValue: 'close',
    },
    sizeClose: {
      control: {
        type: 'select',
        options: ['28x28', '32x32'],
      },
      defaultValue: '28x28',
    },
  },
} as Meta;

export const Nomal: Story = ({ outsideClose, closeName, sizeClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      style={{
        height: '100vh',
        background: '#000',
      }}
    >
      <button type="button" onClick={() => setIsOpen(true)}>
        Open Popup
      </button>
      <Popup
        isOpen
        handleClose={() => setIsOpen(false)}
        outsideClose={outsideClose}
        sizeClose={sizeClose}
        closeName={closeName}
        variant="nofityInfomation"
      >
        <NotifyInformation />
      </Popup>
    </div>
  );
};
