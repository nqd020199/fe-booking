import React from 'react';

import Icon from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';

interface DuarationViewProps {
  duarationTime?: string;
  onClickNext?: () => void;
  onClickPrev?: () => void;

}

const DuarationView: React.FC<DuarationViewProps> = ({
  duarationTime,
  onClickNext,
  onClickPrev,
}) => (
  <div className="m-duaration">
    <div className="m-duaration_btn" onClick={onClickPrev}>
      <Icon iconName="left_feild" />
    </div>
    <Typography content={duarationTime || 'Hello world'} modifiers={['center', 'blueNavy', 'capitalize', '16x24', '500']} />
    <div className="m-duaration_btn" onClick={onClickNext}>
      <Icon iconName="right_feild" />
    </div>
  </div>
);

DuarationView.defaultProps = {
};

export default DuarationView;
