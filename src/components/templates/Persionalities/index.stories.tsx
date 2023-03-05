import { Story, Meta } from '@storybook/react';
import React from 'react';

import Persionalities from '.';

export default {
  title: 'Components/templates/Department',
  component: Persionalities,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <div style={{ minHeight: 600 }}>
    <Persionalities
      desc="Please update position and department below."
      title="DEPARTMENT"
      textAdd="Add your department here"
      btnText="save"
      subBtnText="cancel"
      optionData={[]}
      placeholder=""
    />
  </div>
);
