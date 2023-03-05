/* eslint-disable no-underscore-dangle */
import React, { useMemo, useRef, useState } from 'react';

import useClickOutside from 'hooks/useClickOutside';
import { SeclectType } from 'services/types';
import mapModifiers from 'utils/functions';

export interface OptionType {
  id: string;
  value: string,
  label: string;
}

export interface DropDownReference {
  reset: () => void;
}

export interface PullDownProps {
  id?: string;
  error?: string;
  label?: string;
  name?: string,
  optionData: SeclectType[];
  handleSelect?: (option: SeclectType) => void;
  isSearch?: boolean;
  value?: SeclectType;
  isRequired?: boolean;
  placeholder: string;
  isDisabled?: boolean;
}

const PullDown: React.FC<PullDownProps> = ({
  id,
  error,
  label,
  handleSelect,
  name,
  optionData,
  isSearch,
  isRequired,
  placeholder,
  value,
  isDisabled,
}) => {
  const pulldownRef = useRef<HTMLDivElement>(null);
  const [txtSearch, setTxtSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const toggling = () => setIsOpen(!isOpen);

  const optionDataFilter = useMemo<SeclectType[]>(() => {
    if (!isSearch || txtSearch === '') return optionData;
    const regex = new RegExp(txtSearch, 'gi');

    return optionData.filter((option) => {
      if (option._values?.match(regex) !== null) return true;
      return false;
    });
  }, [isSearch, txtSearch, optionData]);

  useClickOutside(pulldownRef, () => {
    if (isOpen) setIsOpen(false);
  });

  return (
    <div
      className={mapModifiers(
        'm-pulldown',
        error && 'error',
        isDisabled && 'disabled',
      )}
      ref={pulldownRef}
    >
      {label && (
        <label
          className={mapModifiers('m-pulldown_label')}
          htmlFor={id}
        >
          {label}
          {isRequired && <span className="m-pulldown_required">*</span>}
        </label>
      )}
      <div
        className={mapModifiers(
          'm-pulldown_header',
          label && 'haslabel',
          isOpen && 'active',
          error ? 'error' : ''
        )}
        onClick={!isDisabled ? toggling : () => isDisabled}
      >
        {!txtSearch && (
          <div className={`m-pulldown_header_content${value ? '' : ' placeholder'}`}>
            <span>
              {value ? value._values : placeholder}
            </span>
            <span
              className={isOpen ? 'm-pulldown_arrow opened' : 'm-pulldown_arrow'}
            />
          </div>
        )}
        {isSearch && (
          <input
            name={name}
            className="m-pulldown_search"
            value={txtSearch}
            onChange={(e) => setTxtSearch(e.currentTarget.value)}
            disabled={isDisabled}
          />
        )}
      </div>
      {isOpen && !isDisabled && (
        <div className="m-pulldown_wrapper">
          <ul className="m-pulldown_list">
            {optionDataFilter.length ? optionDataFilter.map((option, index) => (
              <li
                key={`m-pulldown_item-${index.toString()}`}
                className="m-pulldown_item"
                onClick={() => {
                  if (handleSelect) {
                    handleSelect(option);
                    setTxtSearch('');
                    setIsOpen(false);
                  }
                }}
              >
                {option._values}
              </li>
            ),) : <li className="m-pulldown_item none">No Option</li>}
          </ul>
        </div>
      )}
      {error && <span className="m-pulldown_errorMessage">{error}</span>}
    </div>
  );
};

PullDown.defaultProps = {
  id: '',
  label: '',
  handleSelect: undefined,
  error: '',
  name: '',
  isSearch: undefined,
  isRequired: undefined,
  value: undefined,
  isDisabled: false,
};

export default PullDown;
