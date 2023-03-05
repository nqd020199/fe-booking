import React from 'react';

import Button from 'components/atoms/Button';
import Icon from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import Container from 'components/organisms/Container';

const ComfirmSuccess: React.FC = () => (
  <div className="p-confirm_reset">
    <div className="p-anthencation">
      <Container modifiers={['smaillForm']}>
        <div className="p-confirm_reset_wrapper">
          <div className="p-confirm_reset_wrapper_animate">
            <div className="p-confirm_reset_wrapper_animate_loading">
              <Icon iconName="loading_notify" size="80x80" />
            </div>
            <div className="p-confirm_reset_wrapper_animate_line" />
          </div>
          <Button modifiers={['primary']}>
            <Typography content="continue" modifiers={['14x21', 'uppercase', 'white', 'uppercase']} />
          </Button>
        </div>
      </Container>
      <span className="p-anthencation_neumorphism size-sm" />
      <span className="p-anthencation_neumorphism size-md" />
      <span className="p-anthencation_neumorphism size-lg" />
      <span className="p-anthencation_circle" />
      <span className="p-anthencation_circle-dou1" />
      <span className="p-anthencation_circle-dou2" />
    </div>
  </div>
);
export default ComfirmSuccess;
