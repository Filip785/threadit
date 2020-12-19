import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { AppThunk, RootState } from "../../app/store";

interface CreatePostState {
    postCreated: boolean,
}

const initialState: CreatePostState = {
    postCreated: false,
};

export const createPostSlice = createSlice({
    name: 'create-post',
    initialState,
    reducers: {
        createPostReduce(state) {
            state.postCreated = true;
        },
        resetStateReduce(state) {
            state.postCreated = false;
        }
    },
});

const { createPostReduce } = createPostSlice.actions;
export const { resetStateReduce } = createPostSlice.actions;

export const createPost = (postTitle: string, postContent: string, userId: number, apiToken: string): AppThunk => async dispatch => {
    try {
        await axios.post(`${process.env.REACT_APP_API_URL}api/post/create`, { post_title: postTitle, description: postContent, user_id: userId }, {
            headers: {
                Authorization: `Bearer ${apiToken}`
            }
        });

        // create post reduce
        dispatch(createPostReduce());
    } catch (err) {
        console.log('Create Post error: ', err);
    }
};

export const selectPostCreated = (state: RootState) => state.createPost.postCreated;

export default createPostSlice.reducer;
