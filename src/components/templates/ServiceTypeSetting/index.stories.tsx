import { Story, Meta } from '@storybook/react';
import React from 'react';

import ServiceTypeSetting from '.';

export default {
  title: 'Components/templates/ServiceTypeSetting',
  component: ServiceTypeSetting,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ServiceTypeSetting
    desc="Please create service types below."
    title="service type"
    textAdd="Add a service type here"
    optionData={[]}
    placeholder="Add a service type here"
    btnText=" save  "
    subBtnText="cancel"
  />
);
