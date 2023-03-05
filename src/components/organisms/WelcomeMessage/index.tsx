import React from 'react';

import mess from 'assets/images/messageWelcom.gif';
import Image from 'components/atoms/Image';
import Typography from 'components/atoms/Typography';

interface WelcomeMessageProps {
  desc?: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ desc }) => (
  <div className="o-welcome">
    <Image src={mess} alt="" />
    <Typography content={desc} modifiers={['14x21', 'jet', '400']} />
  </div>
);

WelcomeMessage.defaultProps = {
};

export default WelcomeMessage;
