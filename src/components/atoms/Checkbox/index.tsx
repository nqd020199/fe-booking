/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { forwardRef } from 'react';

import Typography from 'components/atoms/Typography';

export interface CheckBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  isCheckCustom?: boolean;
  desc?: string;
  isChecked?: boolean;
  onChange?: () => void;
}

const Checkbox = forwardRef<HTMLInputElement, CheckBoxProps>(
  ({
    isCheckCustom, label, desc, isChecked, onChange, ...props
  }, ref) => (
    <div className="a-checkbox">
      {
        isCheckCustom
          ? (
            <div className="a-checkbox_center">
              <input type="checkbox" onChange={onChange} checked={isChecked} id="cbx" />
              <label htmlFor="cbx" className="a-checkbox_toggle">
                <span />
              </label>
              <span className="a-checkbox_text">
                <Typography content={label} modifiers={['14x21', 'jet', '400']} />
                <Typography modifiers={['400', '14x21', 'jet']}>{desc}</Typography>
              </span>
            </div>
          ) : (
            <label className="a-checkbox_label">
              <input
                type="checkbox"
                ref={ref}
                hidden
                {...props}
              />
              <span className="a-checkbox_checkMark" />
              <span className="a-checkbox_text">{label}</span>
            </label>
          )
      }
    </div>
  ),
);

export default React.memo(Checkbox);
