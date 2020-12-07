import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";
import { User } from "../../models/User";
import axios, { AxiosError } from 'axios';
import AxiosRegisterError, { RegisterError } from '../../models/AxiosRegisterError';

const authUser = JSON.parse(localStorage.getItem('authUser')!);

interface AuthState {
    user: User | null,
    registered: boolean,
    loginError: boolean,
    jwtExpired: boolean,
    registerErrors: RegisterError,
    registerError: boolean
}

const initialState: AuthState = {
    user: authUser,
    registered: false,
    loginError: false,
    jwtExpired: false,
    registerErrors: {},
    registerError: false
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        attemptLoginReduce(state, action: PayloadAction<User>) {
            state.user = action.payload;

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
        attemptRegisterFailureValidation(state, action: PayloadAction<AxiosRegisterError | undefined>) {
            if(!action.payload) {
                return;
            }

            state.registerErrors = action.payload.errors;
        },
        attemptRegisterUnknownError(state) {
            state.registerError = true;
        },
        attemptRegisterFailureEnd(state) {
            state.registerErrors = {};
        },
        attemptRegisterReduce(state) {
            state.registered = !state.registered;  
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

export const { attemptLoginFailureEnd, attemptRegisterFailureEnd, signOutReduce, jwtExpiredReduce, attemptRegisterReduce } = authSlice.actions;

const { attemptLoginReduce, attemptLoginFailure, attemptRegisterFailureValidation, attemptRegisterUnknownError } = authSlice.actions;

export const attemptLogin = (username: string, password: string): AppThunk => async dispatch => {
    try {
        const response = await axios.post<User>('http://localhost:8080/api/login', { username, password });

        dispatch(attemptLoginReduce(response.data));
        localStorage.setItem('authUser', JSON.stringify(response.data));
    } catch (err) {
        console.log('Attempt Login error: ', err);
        dispatch(attemptLoginFailure());
    }
};

export const attemptRegister = (username: string, email: string, password: string): AppThunk => async dispatch => {
    try {
        await axios.post('http://localhost:8080/api/register', { username, email, password });

        dispatch(attemptRegisterReduce());
    } catch (err) {
        if(!err && !err.response) {
            dispatch(attemptRegisterUnknownError());
            return;
        }
        console.log('Attempt Register error: ', err.response.data);
        const axiosValidationError = err as AxiosError<AxiosRegisterError>;   

        dispatch(attemptRegisterFailureValidation(axiosValidationError.response?.data));
    }
};

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectLoginError = (state: RootState) => state.auth.loginError;
export const selectRegisterErrors = (state: RootState) => state.auth.registerErrors;
export const selectRegistered = (state: RootState) => state.auth.registered;
export const selectRegisterError = (state: RootState) => state.auth.registerError;

export default authSlice.reducer;

