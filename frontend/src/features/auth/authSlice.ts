import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";
import { User } from "../../models/User";
import axios from 'axios';

const authUser = JSON.parse(localStorage.getItem('authUser')!);

interface AuthState {
    user: User | null,
    registered: boolean,
    loginError: boolean,
    registerError: boolean,
    jwtExpired: boolean
}

const initialState: AuthState = {
    user: authUser,
    registered: false,
    loginError: false,
    registerError: false,
    jwtExpired: false
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        attemptLoginReduce(state, action: PayloadAction<User>) {
            state.user = action.payload;

            console.log('set');

            if (state.jwtExpired) {
                state.jwtExpired = false;
            }
        },
        attemptLoginFailure(state) {
            state.loginError = true;
        },
        attemptLoginFailureEnd(state) {
            state.loginError = false;
        },
        attemptRegisterReduce(state) {
            state.registered = true;
        },
        attemptRegisterFailure(state) {
            state.registerError = true;
        },
        attemptRegisterFailureEnd(state) {
            state.registerError = false;
        },
        signOutReduce(state) {
            state.user = null;
            state.registered = false;
        },
        jwtExpiredReduce(state) {
            state.jwtExpired = true;
        }
    },
});

export const { attemptLoginFailureEnd, attemptRegisterFailureEnd, signOutReduce, jwtExpiredReduce } = authSlice.actions;

const { attemptLoginReduce, attemptRegisterReduce, attemptLoginFailure, attemptRegisterFailure } = authSlice.actions;

export const attemptLogin = (username: string, password: string): AppThunk => async dispatch => {
    try {
      const response = await axios.post<User>('http://localhost/api/login', { username, password });
      
      dispatch(attemptLoginReduce(response.data));
      localStorage.setItem('authUser', JSON.stringify(response.data));
    } catch (err) {
      console.log('Attempt Login error: ', err.response);
      //dispatch(attemptLoginFailure());
    }
  };

//export const selectLoggedIn = (state: RootState) => state.auth.user.loggedIn;
export const selectAuthUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;

