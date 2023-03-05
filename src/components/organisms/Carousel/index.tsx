import React from 'react';
import ReactSlick, { CustomArrowProps, Settings } from 'react-slick';

import mapModifiers from 'utils/functions';

export interface CarouselProps {
  settings?: Settings;
  asNavFor?: ReactSlick;
  ref?: React.RefObject<ReactSlick>;
  children: React.ReactNode;
  centerMode?: boolean;
  beforeChange?: () => void
}

interface ArrowProps extends CustomArrowProps {
  extendClassName?: string;
  typeArrow?: 'default' | 'memberCompanies';
  customArrow?: 'defaultArrow' | 'blackArrow' | 'castletonArrow' | 'greenBoldArrow' | 'newsEventList' | 'circleGray';
}

export const PrevArrow: React.FC<ArrowProps> = ({
  className, onClick, extendClassName = '', customArrow, typeArrow,
}) => (
  <div
    className={
      `o-carousel_arrow o-carousel_arrow_prev 
    ${customArrow && `o-carousel_arrow_prev-${customArrow}`}
    ${className} ${extendClassName} ${typeArrow}`
    }
    onClick={onClick}
  />
);

export const NextArrow: React.FC<ArrowProps> = ({
  className, onClick, extendClassName = '', customArrow, typeArrow,
}) => (
  <div
    className={`o-carousel_arrow o-carousel_arrow_next
    ${customArrow && `o-carousel_arrow_next-${customArrow}`}
    ${className} ${extendClassName} ${typeArrow}`}
    onClick={onClick}
  />
);

const Carousel = React.forwardRef<ReactSlick, CarouselProps>(
  ({
    settings, children, asNavFor, beforeChange
  }, ref) => (
    <div className={mapModifiers('o-carousel', settings?.arrows && 'hasarrow')}>
      <ReactSlick
        centerPadding="0"
        {...settings}
        {...(asNavFor && { asNavFor })}
        ref={ref}
        beforeChange={beforeChange}
      >
        {React.Children.map(children, (item) => (
          <div className="o-carousel_wrap">
            <div className="o-carousel_item">{item}</div>
          </div>
        ))}
      </ReactSlick>
    </div>
  ),
);

Carousel.defaultProps = {
  settings: {
    infinite: true,
    dots: true,
    dotsClass: 'o-carousel_dots',
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    cssEase: 'ease-in-out',
  },
};

export default Carousel;
