import React from 'react';

import Typography from 'components/atoms/Typography';

interface TimeZoneProps {
  position?: string;
  utc?: string;
}

const TimeZone: React.FC<TimeZoneProps> = ({
  position,
  utc,
}) => (
  <div className="m-timezone">
    <Typography content={position} modifiers={['blueNavy', 'capitalize', '16x24', '700']} />
    <Typography content={utc} modifiers={['blueNavy', 'uppercase', '16x24', '400']} />
  </div>
);

TimeZone.defaultProps = {
};

export default TimeZone;
