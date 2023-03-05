/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-redeclare */
import { Story, Meta } from '@storybook/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import CardNotifyList, { NewsListCard } from '.';

import Notify from 'assets/images/notify.png';

export default {
  title: 'Components/molecules/CardNotifyList',
  component: CardNotifyList,
  argTypes: {},
} as Meta;
const CardList = [
  {
    imgSrc: Notify,
    title: '[User ID] has booked an appointment with you at 09:30 AM on November 30, 2022',
    href: 'youtobe',
    nameUser: 'Admin',
    date: new Date(),
  },
  {
    imgSrc: Notify,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ,tempor',
    href: 'youtobe',
    nameUser: 'Admin',
    date: new Date(),
  }, {
    imgSrc: Notify,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ,tempor',
    href: 'youtobe',
    nameUser: 'Admin',
    date: new Date(),
  },
];
export const normal: Story = () => (
  <div style={{
    width: 340, height: 567, marginLeft: 100, marginTop: 100
  }}
  >
    <Router>
      <CardNotifyList
        notifyList={CardList}
        handleClickViewAll={() => alert('click view all')}
        handleClickDoneAll={() => alert('click view all')}
        title=""
      />
    </Router>
  </div>
);

export const NewsListCardItem: Story = () => (
  <Router>
    <div style={{ width: 340 }}>
      <NewsListCard
        imgSrc={Notify}
        title="[User ID] has booked an appointment with you at 09:30 AM on November 30, 2022"
        href="youtobe"
        nameUser="Admin"
        date={new Date('2023-01-07T07:30:00.000Z')}
      />
    </div>
  </Router>
);
