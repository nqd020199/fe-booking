import {
  configureStore, ThunkAction, Action, getDefaultMiddleware
} from '@reduxjs/toolkit';

import Updatebooking from './UpdateBooking';
import deparmentReduser from './department';
import exampleReducer from './example';
import otherReducer from './infoOtheruser';
import userReducer from './infouser';

export const store = configureStore({
  devTools: process.env.NODE_ENV === 'development',
  reducer: {
    example: exampleReducer,
    user: userReducer,
    update: Updatebooking,
    deparment: deparmentReduser,
    otherUser: otherReducer
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
