import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import frontPageReducer from '../features/frontpage/frontPageSlice';
import createPostReducer from '../features/create-post/createPostSlice';
import threadReducer from '../features/thread/threadSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    frontPage: frontPageReducer,
    createPost: createPostReducer,
    thread: threadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;