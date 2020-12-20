import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Comment from "../../models/Comment";
import axios from 'axios';
import { AppThunk, RootState } from "../../app/store";
import { Post } from "../../models/Post";

interface ThreadState {
    mainPost: SinglePost | null,
    comments: Comment[]
}

const initialState: ThreadState = {
    mainPost: null,
    comments: []
};

interface SinglePost {
    post: Post;
    comments: Comment[];
}

export const threadSlice = createSlice({
    name: 'thread',
    initialState,
    reducers: {
        setMainPostReduce(state, action: PayloadAction<SinglePost>) {
            state.mainPost = action.payload;
        }
    },
});

const { setMainPostReduce } = threadSlice.actions;

export const fetchThread = (thread: string): AppThunk => async dispatch => {
    try {
        const response = await axios.get<SinglePost>(`${process.env.REACT_APP_API_URL}api/post/${thread}`);
        
        dispatch(setMainPostReduce(response.data));
    } catch (err) {
        console.log('Get Front Page Posts error: ', err);
    }
};

export const selectMainPost = (state: RootState) => state.thread.mainPost;

export default threadSlice.reducer;
