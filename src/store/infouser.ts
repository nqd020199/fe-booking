import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getUserInfo, getAllUserInfo, searchDepartment } from '../services/Login';

import { ResponseSearch } from 'components/templates/Header';
import { NoteItem } from 'components/templates/Table';
import { getNoteById } from 'services/Booking';
import { User } from 'services/types';

interface HomeState {
  noteList: NoteItem[];
  infuser?: User;
  id: number
  allUser: User[],
  respDataSearch: ResponseSearch[],
}

const initialState: HomeState = {
  infuser: undefined,
  id: 0,
  allUser: [],
  respDataSearch: [],
  noteList: [],
};

export const getAllUserAction = createAsyncThunk<
  User[],
  void
>('mapsReducer/getAllUsertAction', async (_, { rejectWithValue }) => {
  try {
    const response = await getAllUserInfo();
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getRespSearch = createAsyncThunk<
  ResponseSearch[],
  string,
  { rejectValue: any }
>('mapsReducer/getRespSearchs', async (data, { rejectWithValue }) => {
  try {
    const response = await searchDepartment(data);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getUserAction = createAsyncThunk<
  User,
  number,
  { rejectValue: any }
>('mapsReducer/getProjectAction', async (id, { rejectWithValue }) => {
  try {
    const response = await getUserInfo(id);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getNoteByIdAction = createAsyncThunk<
  NoteItem[],
  number,
  { rejectValue: any }
>('mapsReducer/getNoteByIdAction', async (id, { rejectWithValue }) => {
  try {
    const response = await getNoteById(id);
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
    builder.addCase(getUserAction.fulfilled, ($state, action) => {
      $state.infuser = action.payload;
    });
    builder.addCase(getAllUserAction.fulfilled, ($state, action) => {
      $state.allUser = action.payload;
    });
    builder.addCase(getRespSearch.fulfilled, ($state, action) => {
      $state.respDataSearch = action.payload;
    });
    builder.addCase(getNoteByIdAction.fulfilled, ($state, action) => {
      $state.noteList = action.payload;
    });
  },
});

export default userSlice.reducer;
