import React, { useState } from 'react';
import Slider, { Settings } from 'react-slick';

import Image from 'components/atoms/Image';
import Typography from 'components/atoms/Typography';
import Carousel from 'components/organisms/Carousel';
import Container from 'components/organisms/Container';
import Popup from 'components/organisms/Popup';
import mapModifiers from 'utils/functions';

export interface SlideItem {
  imgSrc: string;
  imgAlt?: string;
  idx?: number;
  desc?: string;
}

interface PopupUtilityProps {
  isOpen: boolean;
  handleClose: () => void;
  dataList: SlideItem[];
  title?: string;
  imageShowSettings?: Settings;
  imageListSettings?: Settings;
  imageShowRatio?: Ratio;
  imageListRatio?: Ratio;
}

const PopupUtility: React.FC<PopupUtilityProps> = ({
  isOpen,
  handleClose,
  dataList,
  title,
  imageShowSettings,
  imageListSettings,
  imageShowRatio,
  imageListRatio
}) => {
  const [nav1, setNav1] = useState<Slider | null>();
  const [nav2, setNav2] = useState<Slider | null>();

  return (
    <div className="t-popupUtility">
      <Popup
        isOpen={isOpen}
        handleClose={handleClose}
        sizeClose="28x28"
        variant="scrollBarMayGreen"
      >
        <div className="t-popupUtility_title">
          <Typography
            type="h1"
            modifiers={['black', 'center', '500', '32x48']}
            content={title}
          />
        </div>

        {dataList
          && dataList.length > 0
          && (
            <div className="t-popupUtility_wrapper">
              <div className="t-popupUtility_imageShow">
                <Carousel
                  asNavFor={nav2 as Slider}
                  ref={(slider) => setNav1(slider)}
                  settings={imageShowSettings}
                >
                  {dataList.map((item, index) => (
                    <div
                      key={`t-popupUtility_imageShow_item${index.toString()}`}
                    >
                      <div className="t-popupUtility_desc">
                        <Container>
                          <Typography
                            modifiers={['jet', 'center', '400', '20x30']}
                            content={item.desc}
                          />
                        </Container>
                      </div>
                      <Image
                        src={item.imgSrc}
                        alt={item.imgAlt}
                        ratio={imageShowRatio}
                        size="contain"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
              <div className={mapModifiers('t-popupUtility_imageList', dataList?.length < 9 && 'none')}>
                <Carousel
                  asNavFor={nav1 as Slider}
                  ref={(slider) => setNav2(slider)}
                  settings={imageListSettings}
                >
                  {dataList.map((item, index) => (
                    <div
                      className="t-popupUtility_imageList_item"
                      key={`t-popupUtility_imageList_item-${index.toString()}`}
                    >
                      <Image
                        src={item.imgSrc}
                        alt={item.imgAlt}
                        ratio={imageListRatio}
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          )}
      </Popup>
    </div>
  );
};

PopupUtility.defaultProps = {
  imageShowRatio: '740x417',
  imageListRatio: '117x66'
};

export default PopupUtility;
