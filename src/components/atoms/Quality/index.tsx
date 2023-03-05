/* eslint-disable react/no-unused-prop-types */
import React from 'react';

import Icon from 'components/atoms/Icon';

interface QualityProps {
  category?: string;
  quality?: number;
  handleAdd?: () => void;
  handleMinus?: () => void;
}

const Quality: React.FC<QualityProps> = ({
  category,
  quality = 0,
  handleAdd,
  handleMinus,
}) => {
  return (
    <div className="a-quality">
      <div className="a-quality_input">
        <p>{`${quality} ${category}`}</p>
        <div className="a-quality_control">
          <div onClick={() => { if (handleAdd && (quality || 0) < 10) handleAdd(); }}>
            <Icon iconName="drop_up" size="16x16" isPointer />
          </div>
          <div onClick={() => { if (handleMinus && (quality || 0) > 0) handleMinus(); }}>
            <Icon iconName="dropDown" size="16x16" isPointer />
          </div>
        </div>
      </div>
    </div>
  );

  Quality.defaultProps = {
  };
};

export default Quality;
