import React from 'react';

import Typography from 'components/atoms/Typography';

export type OptionViews = {
  id?: number;
  view?: string;
  value?: string;
};

interface CalendarViewsProps {
  optionViews?: OptionViews[];
  onChangeView?: (item: OptionViews) => void;
  viewActive: string;
}

const CalendarViews: React.FC<CalendarViewsProps> = ({
  optionViews,
  onChangeView,
  viewActive,
}) => (
  <div className="m-viewers">
    {optionViews?.length && optionViews.map((item) => (
      <div
        className={`m-viewers_item ${item.value === viewActive ? 'active' : ''}`}
        key={item.id}
        id={item.value}
        onClick={() => {
          if (onChangeView) {
            onChangeView(item);
            sessionStorage.setItem('viewCalendar', (item.value || 'week'));
          }
        }}
      >
        <Typography content={item.view} type="p" modifiers={['blueNavy', 'capitalize', '16x24', '500', 'center']} />
      </div>
    ))}
  </div>
);

CalendarViews.defaultProps = {
};

export default CalendarViews;
