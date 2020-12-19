import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";
import axios from 'axios';
import { Post } from '../../models/Post';

interface FrontPageState {
    posts: Post[],
    page: number
}

const initialState: FrontPageState = {
    posts: [],
    page: 1
};

export const frontPageSlice = createSlice({
    name: 'frontPage',
    initialState,
    reducers: {
        getFrontPagePostsReduce(state, action: PayloadAction<Post[]>) {
            state.posts = action.payload;
        },
        upvotePostReduce(state, action: PayloadAction<number>) {
            state.posts = state.posts.map(item => {
                if(item.id !== action.payload) {
                    return item;
                }

                if(item.did_upvote === 0) {
                    item.did_upvote = 1;
                    item.voteCount = item.voteCount + 1;
                } else {
                    item.did_upvote = 0;
                    item.voteCount = item.voteCount - 1;
                }

                return item;
            });
        },
        setPageReduce(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
        resetStateReduce(state) {
            state.posts = [];
            state.page = 1;
        },
    },
});

const { getFrontPagePostsReduce } = frontPageSlice.actions;
export const { setPageReduce, resetStateReduce, upvotePostReduce } = frontPageSlice.actions;

export const getFrontPagePosts = (page: number, apiToken: string): AppThunk => async dispatch => {
    const headers = apiToken ? { Authorization: `Bearer ${apiToken}` } : null;
    
    try {
        const response = await axios.get<Post[]>(`${process.env.REACT_APP_API_URL}api/post/all`, { params: { page }, headers });
    
        dispatch(getFrontPagePostsReduce(response.data));
    } catch (err) {
        console.log('Get Front Page Posts error: ', err);
    }
};

export const upvotePost = (userId: number, postId: number, apiToken: string): AppThunk => async _dispatch => {
    try {
        await axios.post<number>(`${process.env.REACT_APP_API_URL}api/post_upvote`, { userId, postId }, {
            headers: {
                Authorization: `Bearer ${apiToken}`
            }
        });
    } catch (err) {
        console.log('Get Front Page Posts error: ', err);
    }
};

export const selectPosts = (state: RootState) => state.frontPage.posts;
export const selectPage = (state: RootState) => state.frontPage.page;

export default frontPageSlice.reducer;

