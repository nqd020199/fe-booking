import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

/* eslint-disable no-spaced-func */

import { Option } from '../services/Booking/types';
import { OptionDept } from '../services/Login/types';

import { Event } from 'components/templates/CalendarCustom';
import {
  UpdateBookingService, GetBookingById, getAllDepartment, GetPersonalityById
} from 'services/Booking';

interface UpdateState {
  data?: Event;
  id?: number;
  allBookingById: Event[];
  AllDepartment: OptionDept[];
  Personalities: Option[];
}

const initialState: UpdateState = {
  data: undefined,
  id: 0,
  allBookingById: [],
  AllDepartment: [],
  Personalities: []
};

export const UpdateAction = createAsyncThunk<
  Event,
  { rejectValue: any }
>('mapsReducer/getProjectAction', async (data: Event, { rejectWithValue }) => {
  try {
    const response = await UpdateBookingService(data);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const GetBookingByUserId = createAsyncThunk<
  Event[],
  number,
  { rejectValue: any }
>('mapsReducer/getBookingByUserId', async (id, { rejectWithValue }) => {
  try {
    const response = await GetBookingById(id);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getAllDepartments = createAsyncThunk<
  OptionDept[],
  void
>('mapsReducer/getAllDepartmen', async (_, { rejectWithValue }) => {
  try {
    const response = await getAllDepartment();
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getPersonalitys = createAsyncThunk<
  Option[],
  number,
  { rejectValue: any }
>('mapsReducer/perrsionality', async (id, { rejectWithValue }) => {
  try {
    const response = await GetPersonalityById(id);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const userSlice = createSlice({
  name: 'updateReducer',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(UpdateAction.fulfilled, ($state, action) => {
      $state.data = action.payload;
    });
    builder.addCase(GetBookingByUserId.fulfilled, ($state, action) => {
      $state.allBookingById = action.payload;
    });
    builder.addCase(getAllDepartments.fulfilled, ($state, action) => {
      $state.AllDepartment = action.payload;
    });
    builder.addCase(getPersonalitys.fulfilled, ($state, action) => {
      $state.Personalities = action.payload;
    });
  },
});

export default userSlice.reducer;
