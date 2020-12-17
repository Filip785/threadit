import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";
import axios from 'axios';
import { Post } from '../../models/Post';

interface FrontPageState {
    posts: Post[],
}

const initialState: FrontPageState = {
    posts: []
};

export const frontPageSlice = createSlice({
    name: 'frontPage',
    initialState,
    reducers: {
        getFrontPagePostsReduce(state, action: PayloadAction<Post[]>) {
            state.posts = action.payload;
        }
    },
});

const { getFrontPagePostsReduce } = frontPageSlice.actions;

export const getFrontPagePosts = (): AppThunk => async dispatch => {
    try {
        const response = await axios.get<Post[]>(`${process.env.REACT_APP_API_URL}api/post`);
    
        dispatch(getFrontPagePostsReduce(response.data));
    } catch (err) {
        console.log('Get Front Page Posts error: ', err);
    }
};

export const selectPosts = (state: RootState) => state.frontPage.posts;

export default frontPageSlice.reducer;

