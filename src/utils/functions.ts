/* eslint-disable consistent-return */

import addNotification from 'react-push-notification';

/* eslint-disable max-len */
function mapModifiers(
  baseClassName: string,
  ...modifiers: (string | string[] | false | undefined)[]
): string {
  return modifiers
    .reduce<string[]>(
      (acc, m) => (!m ? acc : [...acc, ...(typeof m === 'string' ? [m] : m)]),
      [],
    )
    .map((m) => `-${m}`)
    .reduce<string>(
      (classNames, suffix) => `${classNames} ${baseClassName}${suffix}`,
      baseClassName,
    );
}
export const BASE_URL = process.env.REACT_APP_BASE_URL;

export default mapModifiers;

/*!
 * Scroll down to next block element
 */
export function scrollDownNextSection(ref: React.RefObject<HTMLDivElement>) {
  if (ref && ref.current) {
    window.scrollTo(
      { behavior: 'smooth', top: ref.current.offsetTop - 68 },
    ); // Minus header height
  }
}

/*!
 * getMousePosition(event) - cross browser normalizing of:
 * clientX, clientY, screenX, screenY, offsetX, offsetY, pageX, pageY
 * HTMLElement
 */
export function getMousePosition(
  evt:
    | React.MouseEvent<SVGPathElement, MouseEvent>
    | React.MouseEvent<SVGRectElement, MouseEvent>,
  item: HTMLDivElement,
) {
  let { pageX } = evt;
  let { pageY } = evt;
  if (pageX === undefined) {
    pageX = evt.clientX
      + document.body.scrollLeft
      + document.documentElement.scrollLeft;
    pageY = evt.clientY
      + document.body.scrollTop
      + document.documentElement.scrollTop;
  }

  const rect = item.getBoundingClientRect();
  const offsetX = evt.clientX - rect.left;
  const offsetY = evt.clientY - rect.top;

  return {
    client: { x: evt.clientX, y: evt.clientY }, // relative to the viewport
    screen: { x: evt.screenX, y: evt.screenY }, // relative to the physical screen
    offset: { x: offsetX, y: offsetY }, // relative to the event target
    page: { x: pageX, y: pageY }, // relative to the html document
  };
}

export function getDimensions(ele: HTMLDivElement) {
  const { height } = ele.getBoundingClientRect();
  const { offsetTop } = ele;
  const offsetBottom = offsetTop + height;

  return {
    height,
    offsetTop,
    offsetBottom,
  };
}

export function scrollStop(callback: (value: any) => void, time = 2000) {
  // Make sure a valid callback was provided
  if (!callback || typeof callback !== 'function') return;

  // Setup scrolling variable
  let isScrolling: any;

  // Listen for scroll events
  window.addEventListener(
    'scroll',
    () => {
      // Clear our timeout throughout the scroll
      window.clearTimeout(isScrolling);

      // Set a timeout to run after scrolling ends
      isScrolling = setTimeout(callback, time);
    },
    false,
  );
}

export const formatDateDDMMYYYY = (date?: string, unitDot?: boolean) => {
  if (!date) return '';
  const dateFormat = new Date(date);
  let day: string | number = dateFormat.getDate();
  let month: string | number = dateFormat.getMonth() + 1;
  if (day < 10) {
    day = `0${day}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }

  if (unitDot) return `${day}.${month}.${dateFormat.getFullYear()}`;
  return `${day}/${month}/${dateFormat.getFullYear()}`;
};

export const lengthMinutes = (minutes: Date) => {
  if (minutes.getMinutes().toString().length === 1) {
    return '00';
  }
  return '30';
};
export const handleScrollCenter = (
  ref: React.RefObject<HTMLDivElement | HTMLUListElement | null>,
  classNameEleActive: string,
) => {
  const eleScroll = ref.current;
  const eleActive = eleScroll && eleScroll.querySelector(classNameEleActive);
  if (!eleActive || !eleScroll) return;
  // get width element scroll
  const widthEleScroll = eleScroll.getBoundingClientRect().width;
  // get distance element scroll compared to y window
  const xEleScroll = eleScroll.getBoundingClientRect().x;
  // get width element active
  const widthEleActive = eleActive.getBoundingClientRect().width;
  // get distance element active compared to y window
  const xEleActive = eleActive.getBoundingClientRect().x;
  // get position sroll bar
  const positionScroll = eleScroll.scrollLeft;
  const scrollX = xEleActive - xEleScroll
    + widthEleActive / 2 + positionScroll - widthEleScroll / 2;
  eleScroll.scroll({
    left: scrollX,
    behavior: 'smooth',
  });
};

export function getImageURL(imgUrl?: string) {
  if (!imgUrl) return '';
  return imgUrl;
}

export const RenderDateToWeek = (currDate: number, currMonth: number, currYear: number) => new Date(currYear, currMonth, currDate);
export const pushNotifications = (title: string, message: string, icon: string, closeButton: string, href: string) => {
  addNotification({
    title,
    message,
    icon,
    closeButton,
    duration: 8000,
    backgroundTop: 'white',
    backgroundBottom: 'white',
    native: true,
    onClick: () => {
      window.open(`https://${href}`);
    }
  });
};

export const checkUrlVideoYoutube = (url: string): string => {
  const youtubeDomainEmbded = 'https://www.youtube.com/embed/';

  if (url.includes(youtubeDomainEmbded)) {
    return url;
  }
  const videoId = new URL(url).searchParams.get('v');

  if (videoId) {
    return `${youtubeDomainEmbded}${videoId}`;
  }

  return url;
};
