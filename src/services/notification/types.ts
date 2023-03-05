import { Option } from 'components/atoms/DropDownCheckbox/index';
import { OptionDept } from 'services/Login/types';

export type NotifyType = {
  department?: string
  end?: string
  id_notify?: number
  id_user: number
  persionality_notifies?: Option[];
  senderName?: string
  start?: string
  status?: boolean
  today?: Date
  type?: number
  receiverName?: string
  data: any;
  detail?: string
  department_notifies?: OptionDept[],
  isNotify: boolean,
};
