/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, memo } from 'react';
import { useTranslation } from 'react-i18next';

import Icon from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import useClickOutside from 'hooks/useClickOutside';
import { OptionDept } from 'services/Login/types';
import mapModifiers from 'utils/functions';

interface SwitchDivisionProps {
  optionDavision?: OptionDept[];
  isDisabled?: boolean;
  handleClick?: (item: OptionDept) => void;
  username?: string;
  division?: OptionDept;
}

const SwitchDivision: React.FC<SwitchDivisionProps> = ({
  optionDavision = [],
  handleClick,
  isDisabled,
  username,
  division,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const toggling = () => setIsOpen(!isOpen);
  useClickOutside(dropdownRef, () => {
    if (isOpen) setIsOpen(false);
  });

  return (
    <div className="m-division" ref={dropdownRef} onClick={!isDisabled ? toggling : () => isDisabled}>
      <div className={mapModifiers('m-division_btn', isOpen && 'rarote')}>
        <Typography type="h2" content={optionDavision.length ? (division?.label || optionDavision[0].label) : username} isDivision modifiers={['blueNavy', 'capitalize', '24x36', '700']} />
        {!isDisabled && <Icon iconName="dropDown" size="16x16" isPointer />}
      </div>
      {isOpen
        && (
          <ul className="m-division_list">
            {
              optionDavision.length ? (optionDavision.map((option, idx) => (
                <li
                  className="m-division_list_item"
                  key={`m-division_list${idx.toString()}`}
                  onClick={() => {
                    if (handleClick) {
                      handleClick(option);
                      sessionStorage.setItem('OptionDept', JSON.stringify(option));
                      setIsOpen(false);
                    }
                  }}
                >
                  <Typography modifiers={['blueNavy', 'capitalize', '20x30', '700']} content={option.label} />
                </li>
              ))) : <Typography modifiers={['dimGray', 'capitalize', '16x28', '500', 'center']} content={t('notify.nothing') || ''} />
            }
          </ul>
        )}
    </div>
  );
};

SwitchDivision.defaultProps = {
};

export default memo(SwitchDivision);
