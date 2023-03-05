import { OptionDept } from './Login/types';

import { Option } from 'components/atoms/DropDownCheckbox';
import { Event } from 'components/templates/CalendarCustom';

export type GetUser = User[];

export type PersonType = {
  id_person: number | string
  _name?: string
  id_user?: number
  _values: string
};
export type Selectdata = {
  data: SeclectType[]
};

export type SeclectType = {
  _values: string | undefined;
  id_selection?: number
  _name?: string
  id_user?: number
  _values?: string
};

export type User = {
  id_user?: number
  user_name?: string
  email?: string
  _password?: string
  image_url?: string
  persionalities: Option[]
  select_types: SeclectType[]
  departments: OptionDept[],
  data_booking: Event[],
  maxtime?: number,
  mintime?: number,
  isShow?: boolean,
  indexRow: number,
  isNotify?: boolean
};
export type UserGet = {
  message: string,
  content: User
};
