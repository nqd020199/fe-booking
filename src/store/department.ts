import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

import { Option } from 'components/atoms/DropDownCheckbox';
import { OptionsChild } from 'components/molecules/Dropdown';
import { OptionDept } from 'services/Login/types';

interface ExampleState {
  department: OptionDept;
  departmentOther: Option;
  dateDefault: Date
}

const initialState: ExampleState = {
  department: {
  value: 0, label: '', email_depart: '', phoneNumber: '',

},
  departmentOther: { value: 0, label: 'Goranboy' },
  dateDefault: moment(new Date()).format('dd-mm-yyyy hh:mm') as unknown as Date,
};

export const incrementAsync = createAsyncThunk('exampleReducer/example', async (amount: OptionsChild) => amount);

export const departmentSlice = createSlice({
  name: 'exampleReducer',
  initialState,
  reducers: {
    department($state, action: PayloadAction<OptionDept>) {
      $state.department = action.payload;
    },
    setDateDefault($state, action: PayloadAction<Date>) {
      $state.dateDefault = action.payload;
    },
    departmentOther($state, action: PayloadAction<Option>) {
      $state.departmentOther = action.payload;
    },

  },
  extraReducers() {
  },
});

export const {
 department, setDateDefault, departmentOther
} = departmentSlice.actions;

export default departmentSlice.reducer;
