/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Icon, { IconName, IconSize } from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';

interface DatePickerCustomProps {
  handleChange: (value: Date) => void;
  selected?: Date;
  label?: string;
  iconName?: IconName;
  size?: IconSize;
  isDate?: boolean;
}

const DatePickerCustom: React.FC<DatePickerCustomProps> = ({
  handleChange, selected, label, iconName = 'clock', size, isDate = false
}) => (
  <div className="o-customDate">
    <Typography modifiers={['dimGray', '400', '14x21']}>
      {label}
    </Typography>
    <div className="o-customDate_input">
      <label>
        <DatePicker
          disabled
          selected={selected || new Date()}
          onChange={(value) => {
            if (handleChange) { handleChange(value || new Date()); }
          }}
          showTimeSelect={!isDate}
          showTimeSelectOnly={!isDate}
          timeFormat="HH:mm "
          timeIntervals={30}
          timeCaption="time"
          dateFormat={isDate ? '  yyyy/MM/dd' : ' HH:mm'}
          minTime={new Date(0, 0, 0, 9, 0, 0)}
          maxTime={new Date(0, 0, 0, 18, 0, 0)}
          minDate={new Date()}
        />
        <Icon iconName={iconName} size={size} />
      </label>
    </div>
  </div>
);

DatePickerCustom.defaultProps = {
};

export default DatePickerCustom;
