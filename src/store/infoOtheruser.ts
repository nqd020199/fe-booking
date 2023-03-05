import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOtherUserInfo } from '../services/Login';

import { User } from 'services/types';

interface HomeState {
  otherUser?: User;
}

const initialState: HomeState = {
  otherUser: undefined
};

export const getOtherUserAction = createAsyncThunk<
  User,
  number,
  { rejectValue: any }
>('mapsReducer/getInfoOther', async (id, { rejectWithValue }) => {
  try {
    const response = await getOtherUserInfo(id);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const userSlice = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getOtherUserAction.fulfilled, ($state, action) => {
      $state.otherUser = action.payload;
    });
  },
});

export default userSlice.reducer;
