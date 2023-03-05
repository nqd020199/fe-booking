/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/require-default-props */
import React, {
  useEffect, useLayoutEffect, useRef, useState
} from 'react';

import Icon from 'components/atoms/Icon';
import useClickOutside from 'hooks/useClickOutside';
import mapModifiers, { handleScrollCenter } from 'utils/functions';

type ManyCases = 'default' | 'primary' | 'search';

interface TabPanelProps {
  active?: boolean;
  children?: React.ReactNode;
}

interface TabProps {
  label?: string;
  active?: boolean;
  size?: '16x24' | '14x20' | '14x22' | '24x36';
  type?: ManyCases;
  handleClick?: () => void;
}

interface TabsProps {
  variableMutate?: number | string;
  classTabsActive?: string;
  children?: React.ReactNode;
  type?: ManyCases;
}

export const TabPanel: React.FC<TabPanelProps> = ({ active, children }) => (
  <div className={mapModifiers('o-tabs_panel', active && 'active')}>{children}</div>
);

export const Tab: React.FC<TabProps> = ({
  active, label, size, handleClick, type,
}) => (
  <div onClick={handleClick} className={mapModifiers('o-tabs_tab', active && 'active', type || '')}>
    <span className={`o-tabs_label ${size ? `o-tabs_label-${size}` : ''}`}>{label}</span>
  </div>
);

export const Tabs: React.FC<TabsProps> = ({
  children, variableMutate, classTabsActive, type,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpenSideBarSetting, setIsOpenSideBarSetting] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    // hiển thị lại width
    window.addEventListener('resize', handleResize);
    // clean up để fix lỗi toggle
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (width <= 440) {
      setIsMobile(true);
    }
  }, [width]);
  useEffect(() => {
    if (width > 440) {
      setIsMobile(false);
    }
  }, [width]);

  useLayoutEffect(() => {
    handleScrollCenter(ref, classTabsActive || '.o-tabs_tab-active');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variableMutate]);

  const toggling = () => setIsOpenSideBarSetting(!isOpenSideBarSetting);

  useClickOutside(dropdownRef, () => {
    if (isOpenSideBarSetting) setIsOpenSideBarSetting(false);
  });

  return (
    <div className="o-tabs">

      <div ref={ref} className={mapModifiers('o-tabs_labels', type, isOpenSideBarSetting && 'show_sidebar')} onClick={toggling}>
        {children}
      </div>
    </div>
  );
};

TabPanel.defaultProps = {
  active: false,
};

Tab.defaultProps = {
  label: '',
  active: false,
  size: undefined,
  type: 'default',
  handleClick: undefined,
};

Tabs.defaultProps = {
  variableMutate: undefined,
  classTabsActive: '',
  type: 'default',
};

export default React.memo(Tabs);
