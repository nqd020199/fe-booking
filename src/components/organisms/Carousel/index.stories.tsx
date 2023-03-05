import { Story, Meta } from '@storybook/react';
import React from 'react';

import Carousel, { NextArrow, PrevArrow } from '.';

import bannerImg from 'assets/images/oanh-animate.png';

export default {
  title: 'Components/organisms/Carousel',
  component: Carousel,
  argTypes: {},
} as Meta;
const styleExample = {
  height: 400,
  backgroundColor: '#ccc',
};
const settingBanner = {
  dots: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  infinite: false,
  cssEase: 'ease-in-out',
};
export const Banner: Story = () => (
  <div>
    <Carousel settings={settingBanner}>
      <div>
        <img src={bannerImg} alt="banner" style={{ width: '100%' }} />
      </div>
      <div><img src={bannerImg} alt="banner" style={{ width: '100%' }} /></div>
      <div><img src={bannerImg} alt="banner" style={{ width: '100%' }} /></div>
    </Carousel>
  </div>
);

const settingDefault = {
  dots: false,
  centerMode: true,
  infinite: true,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  speed: 500,
  prevArrow: <PrevArrow customArrow="defaultArrow" />,
  nextArrow: <NextArrow customArrow="defaultArrow" />,
  cssEase: 'ease-in-out',
};

export const normal: Story = () => (
  <div style={{
    paddingBottom: '60px',
    background: '#999',
    padding: '120px',
  }}
  >
    <Carousel settings={Object.assign(settingDefault)}>
      <div style={styleExample}>a</div>
      <div style={styleExample}>b</div>
      <div style={styleExample}>c</div>
      <div style={styleExample}>d</div>
      <div style={styleExample}>a</div>
      <div style={styleExample}>b</div>
      <div style={styleExample}>c</div>
      <div style={styleExample}>d</div>
    </Carousel>
  </div>
);
