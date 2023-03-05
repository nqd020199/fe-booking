import { Story, Meta } from '@storybook/react';
import React, { useState } from 'react';

import { NextArrow, PrevArrow } from '../Carousel';

import PopupUtility from '.';

const imgPopup = 'https://source.unsplash.com/random';

export default {
  title: 'Components/organisms/PopupUtility',
  component: PopupUtility,
  argTypes: {},
} as Meta;

export const dataImageList = [
  { imgSrc: imgPopup },
  { imgSrc: imgPopup },
  { imgSrc: imgPopup },
  { imgSrc: imgPopup },
  { imgSrc: imgPopup },
  { imgSrc: imgPopup },
  { imgSrc: imgPopup },
  { imgSrc: imgPopup },
  { imgSrc: imgPopup },
  { imgSrc: imgPopup },
  { imgSrc: imgPopup },
  { imgSrc: imgPopup },
];
const imageShowSettings = {
  arrows: true,
  slidesToScroll: 1,
  slidesToShow: 1,
  infinite: true,
  prevArrow: <PrevArrow customArrow="circleGray" />,
  nextArrow: <NextArrow customArrow="circleGray" />,
  responsive: [
    {
      breakpoint: 767,
      settings: {
        arrows: false,
      },
    },
  ],
};
const imageListSettings = {
  infinite: true,
  arrows: false,
  focusOnSelect: true,
  centerMode: true,
  slidesToShow: 8.5,
  slidesToScroll: 1,
  centerPadding: '1.2%',
  responsive: [
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 6,
        centerMode: false,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 4,
        centerMode: false,
      },
    },
  ],
};

export const Normal: Story = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      style={{
        height: '100vh',
        background: '#fff',
      }}
    >
      <button type="button" onClick={() => setIsOpen(true)}>
        Open Modal
      </button>
      <PopupUtility
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        dataList={dataImageList}
        imageShowSettings={imageShowSettings}
        imageListSettings={imageListSettings}
      />
    </div>
  );
};
