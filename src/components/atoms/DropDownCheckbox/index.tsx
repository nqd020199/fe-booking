/* eslint-disable import/no-mutable-exports */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-named-default */
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { default as ReactSelect, components, InputAction } from 'react-select';

import Icon from '../Icon';

import Typography from 'components/atoms/Typography';

export interface Option {
  value: number | string;
  label: string;
  id_user?: number;

}

const MultiSelect = (props: any) => {
  const { t } = useTranslation();
  const [selectInput, setSelectInput] = useState<string>('');
  const [state, setState] = useState();
  const isAllSelected = useRef<boolean>(false);
  const selectAllLabel = useRef<string>('Select all');
  const allOption = { value: '*', label: selectAllLabel.current };
  const filterOptions = (options: Option[], input: string) => options?.filter(({ label }: Option) => label.toLowerCase().includes(input.toLowerCase()));
  const comparator = (v1: Option, v2: Option) => (v1.value as number) - (v2.value as number);

  const filteredOptions = filterOptions(props.options, selectInput);
  const filteredSelectedOptions = filterOptions(props.value, selectInput);

  const Option = (props: any) => (
    <components.Option {...props}>
      <label className="a-multiselect_option" style={{ fontSize: 14 }}>
        {props.value === '*'
          && !isAllSelected.current
          && filteredSelectedOptions?.length > 0 ? (
          <input
            className="a-multiselect_input"
            key={props.value}
            style={{ marginRight: 8 }}
            type="checkbox"
            ref={(input) => {
              if (input) input.indeterminate = true;
            }}
          />
        ) : (
          <input
            className="a-multiselect_input"
            key={props.value}
            type="checkbox"
            style={{ marginRight: 8 }}
            checked={props.isSelected || isAllSelected.current}
            onChange={() => { }}
          />
        )}
        {props.label}

      </label>
    </components.Option>
  );

  const Input = (props: any) => (
    <>
      {selectInput.length === 0 ? (
        <components.Input autoFocus={props.selectProps.menuIsOpen} {...props}>
          {props.children}
        </components.Input>
      ) : (
        <div style={{ border: '1px solid #a9a7a7' }}>
          <components.Input autoFocus={props.selectProps.menuIsOpen} {...props}>
            {props.children}
          </components.Input>
        </div>
      )}
    </>
  );

  const customFilterOption = ({ value, label }: Option, input: string) => (value !== '*' && label.toLowerCase().includes(input.toLowerCase()))
    || (value === '*' && filteredOptions?.length > 0);

  const onInputChange = (
    inputValue: string,
    event: { action: InputAction }
  ) => {
    if (event.action === 'input-change') setSelectInput(inputValue);
    else if (event.action === 'menu-close' && selectInput !== '') { setSelectInput(''); }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && !selectInput) { e.preventDefault(); }
  };

  const handleChange = (selected: Option[]) => {
    if (
      selected.length > 0
      && !isAllSelected.current
      && (selected[selected.length - 1].value === allOption.value
        || JSON.stringify(filteredOptions)
        === JSON.stringify(selected.sort(comparator)))
    ) {
      return props.onChange(
        [
          ...(props.value ?? []),
          ...props.options.filter(
            ({ label }: Option) => label.toLowerCase().includes(selectInput?.toLowerCase())
              && (props.value ?? []).filter((opt: Option) => opt.label === label)
                .length === 0
          ),
        ].sort(comparator)
      );
    }
    if (
      selected.length > 0
      && selected[selected.length - 1].value !== allOption.value
      && JSON.stringify(selected.sort(comparator))
      !== JSON.stringify(filteredOptions)
    ) return props.onChange(selected);
    return props.onChange([
      ...props.value?.filter(
        ({ label }: Option) => !label.toLowerCase().includes(selectInput?.toLowerCase())
      ),
    ]);
  };

  const customStyles = {
    multiValueLabel: (def: any) => ({
      ...def,
      backgroundColor: 'lightgray',
    }),
    multiValueRemove: (def: any) => ({
      ...def,
      backgroundColor: 'lightgray',
    }),
    valueContainer: (base: any) => ({
      ...base,
      maxHeight: '65px',
      overflow: 'auto',
    }),
    option: (styles: any, { isSelected, isFocused }: any) => ({
      ...styles,
      backgroundColor:
        isSelected && !isFocused
          ? null
          : isFocused && !isSelected
            ? styles.backgroundColor
            : isFocused && isSelected
              ? '#1976D2'
              : 'null',
      color: '#646363',
      borderRadius: '8px',
      background: '#fff',
      padding: '0 20px',
      '&:hover': {
        background: '#1976D2',
        color: '#fff'
      },
    }),
    menu: (def: any) => ({
      ...def,
      zIndex: 9999,
    }),
  };

  const NoOptionsMessage = (props: any) => (
    <components.NoOptionsMessage {...props}>
      <span className="custom-css-class">{t('training.no_persionality')}</span>
    </components.NoOptionsMessage>
  );
  const DropdownIndicator = (props: any) => {
    const { menuIsOpen } = props.selectProps;
    setState(menuIsOpen);
    return (
      <div className="a-multiselect_toogle"><components.DropdownIndicator {...props}><small style={state ? { transform: 'rotate(180deg)', transition: 'transform 0.2s linear' } : {}}><Icon iconName="dropDown" size="22x16" /></small></components.DropdownIndicator></div>
    );
  };

  if (props.isSelectAll && props.options.length !== 0) {
    isAllSelected.current = JSON.stringify(filteredSelectedOptions)
      === JSON.stringify(filteredOptions);

    if (filteredSelectedOptions?.length > 0) {
      if (filteredSelectedOptions?.length === filteredOptions?.length) { selectAllLabel.current = `All (${filteredOptions.length}) selected`; } else { selectAllLabel.current = `${filteredSelectedOptions?.length} / ${filteredOptions.length} selected`; }
    } else selectAllLabel.current = 'Select all';

    allOption.label = selectAllLabel.current;

    return (
      <div className="a-multiselect">
        <label className="a-multiselect_label">
          <Typography type="span" modifiers={['dimGray', '14x21']} content={t('setting.personality') || ''} />
          <Typography type="span" modifiers={['cg-red', '14x21']} content="*" />
          <ReactSelect
            className="react-select"
            {...props}
            inputValue={selectInput}
            onInputChange={onInputChange}
            onKeyDown={onKeyDown}
            options={[allOption, ...props.options]}
            onChange={handleChange}
            components={{
              DropdownIndicator,
              Option,
              Input,
              NoOptionsMessage,
              ...props.components,
            }}
            filterOption={customFilterOption}
            menuPlacement={props.menuPlacement ?? 'auto'}
            styles={customStyles}
            isMulti
            closeMenuOnSelect={false}
            tabSelectsValue={false}
            backspaceRemovesValue={false}
            hideSelectedOptions={false}
            blurInputOnSelect={false}
            placeholder="Choose Department"
          />
        </label>
      </div>
    );
  }

  return (
    <div>
      <label className="a-multiselect_label">
        <Typography type="span" modifiers={['dimGray', '16x24']} content={t('setting.personality') || ''} />
        <Typography type="span" modifiers={['cg-red', '16x24']} content="*" />
        <ReactSelect
          {...props}
          inputValue={selectInput}
          onInputChange={onInputChange}
          filterOption={customFilterOption}
          components={{
            DropdownIndicator,
            Option,
            Input,
            NoOptionsMessage,
            ...props.components,
          }}
          menuPlacement={props.menuPlacement ?? 'auto'}
          onKeyDown={onKeyDown}
          tabSelectsValue={false}
          hideSelectedOptions
          backspaceRemovesValue={false}
          blurInputOnSelect
        />
      </label>
    </div>
  );
};

export default MultiSelect;
