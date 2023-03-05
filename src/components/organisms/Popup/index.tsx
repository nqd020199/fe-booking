import React, { useEffect } from 'react';
import Modal from 'react-modal';

import Icon, { IconSize } from 'components/atoms/Icon';
import Container from 'components/organisms/Container';
import mapModifiers from 'utils/functions';

export type VariantModal = 'default' | 'scrollBarMayGreen' | 'notify' | 'modalSearch' | 'position' | 'booking' | 'nofityInfomation' | 'positions' | 'medium';

interface PopupProps {
  isOpen: boolean;
  handleClose?: () => void;
  className?: string;
  closeName?: 'close';
  sizeClose?: IconSize;
  children: React.ReactNode;
  variant?: VariantModal;
  headerComponent?: React.ReactNode;
  outsideClose?: boolean;
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  handleClose,
  children,
  className,
  variant,
  closeName = 'close',
  sizeClose,
  headerComponent,
  outsideClose,
}) => {
  useEffect(() => {
    if (isOpen) document.documentElement.style.overflow = 'hidden';
    if (!isOpen) document.documentElement.style.removeProperty('overflow');
    return () => {
      document.documentElement.style.removeProperty('overflow');
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      closeTimeoutMS={250}
      className={mapModifiers('o-popup', className, variant)}
      appElement={document.getElementById('root') as HTMLElement}
      ariaHideApp={false}
      portalClassName={mapModifiers('o-popup_portal', isOpen && 'open')}
    >
      {outsideClose && handleClose && (
        <div className="o-popup_wrapClose o-popup_wrapClose-outside">
          <button type="button" className="o-popup_close" onClick={handleClose}>
            <Icon iconName={closeName} size={sizeClose} />
          </button>
        </div>

      )}
      <Container>
        <div className="o-popup_main">
          <div className="o-popup_wrapper">
            {!outsideClose && handleClose && (
              <div className="o-popup_wrapClose">
                <button type="button" className="o-popup_close" onClick={handleClose}>
                  <Icon iconName={closeName} size={sizeClose} />
                </button>
              </div>

            )}
            {headerComponent && (
              <div className="o-popup_header">{headerComponent}</div>
            )}
            <div className="o-popup_body">{children}</div>
          </div>
        </div>
      </Container>
    </Modal>
  );
};

Popup.defaultProps = {
  handleClose: undefined,
  className: undefined,
  closeName: 'close',
  variant: 'default',
  sizeClose: '32x32',
};

export default Popup;
