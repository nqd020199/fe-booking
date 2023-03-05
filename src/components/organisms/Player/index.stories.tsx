import { Story, Meta } from '@storybook/react';
import React from 'react';

import Player from '.';

import { imgLink, mp4Video, youtubeVideo } from 'assets/dataDummy/media';

export default {
  title: 'Components/organisms/Player',
  component: Player,
  argTypes: {
    videoSrc: {
      control: {
        type: 'select',
        options: [
          mp4Video,
          youtubeVideo
        ]
      },
      defaultValue: mp4Video,
    },
    videoThumbnail: {
      control: {
        type: 'text',
      },
      defaultValue: imgLink,
    },
  },
} as Meta;

export const normal: Story = ({
  videoSrc, videoThumbnail
}) => (
  <div style={{ maxWidth: '646px' }}>
    <Player
      videoSrc={videoSrc}
      videoThumbnail={videoThumbnail}
    />
  </div>
);
