import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Comment from "../../models/Comment";
import axios from 'axios';
import { AppThunk, RootState } from "../../app/store";
import { Post } from "../../models/Post";
import _ from 'lodash';

interface ThreadState {
    mainPost: SinglePost | null,
    comments: Comment[]
}

interface CreateCommentBodyParams {
    content: string;
    post_id: string;
    user_id: number;
    reply?: string;
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
        },
        setCommentTreeReduce(state, action: PayloadAction<Comment>) {
            state.mainPost!.comments = state.mainPost!.comments.map(comment => comment.id === action.payload.id ? action.payload : comment);
        },
        setCommentReduce(state, action: PayloadAction<Comment>) {
            state.mainPost!.comments = [...state.mainPost!.comments, action.payload];
        },
        updateUpvotesReduce(state, action: PayloadAction<{initialIndex: number, voteCount: number, did_upvote: number, pathArray: string[]}>) {
            const { initialIndex, pathArray, voteCount, did_upvote } = action.payload;

            if(pathArray.length === 0) {
                // top level comment
                state.mainPost!.comments = state.mainPost!.comments.map((item, i) => i === initialIndex ? { ...item, voteCount, did_upvote } : item);
            } else {
                // deeply nested comment
                state.mainPost!.comments[initialIndex] = _.set<Comment>(state.mainPost!.comments[initialIndex], [...pathArray, 'voteCount'], voteCount);
                state.mainPost!.comments[initialIndex] = _.set<Comment>(state.mainPost!.comments[initialIndex], [...pathArray, 'did_upvote'], did_upvote);
            }
        }
    },
});

const { setMainPostReduce, setCommentTreeReduce, setCommentReduce } = threadSlice.actions;
export const { updateUpvotesReduce } = threadSlice.actions;

export const fetchThread = (thread: string, apiToken?: string): AppThunk => async dispatch => {
    const headers = apiToken ? { Authorization: `Bearer ${apiToken}` } : null;

    try {
        const response = await axios.get<SinglePost>(`${process.env.REACT_APP_API_URL}api/post/${thread}`, {
            headers: headers
        });
        
        dispatch(setMainPostReduce(response.data));
    } catch (err) {
        console.log('Get Front Page Posts error: ', err);
    }
};

export const createComment = (content: string, user_id: number, pattern: string | null, post_id: string, apiToken: string): AppThunk => async dispatch => {
    let bodyParams: CreateCommentBodyParams = { content, user_id, post_id };
    let addToTree = false;

    if(pattern) {
        addToTree = true;
        bodyParams = { ...bodyParams, reply: pattern };
    }

    try {
        const response = await axios.post<{comment: Comment}>(`${process.env.REACT_APP_API_URL}api/comment/create`, bodyParams, {
            headers: {
                Authorization: `Bearer ${apiToken}`
            }
        });
        
        if(addToTree)  {
            dispatch(setCommentTreeReduce(response.data.comment));
        } else {
            dispatch(setCommentReduce(response.data.comment));
        }
    } catch (err) {
        console.log('Create Comment error: ', err);
        // to do: error handling
    }
};

export const upvoteComment = (pattern: string, apiToken: string): AppThunk => async _dispatch => {
    try {
        await axios.post<number>(`${process.env.REACT_APP_API_URL}api/comment_upvote`, { pattern }, {
            headers: {
                Authorization: `Bearer ${apiToken}`
            }
        });
    } catch (err) {
        console.log('Upvote Comment error: ', err);
    }
};

export const selectMainPost = (state: RootState) => state.thread.mainPost;

export default threadSlice.reducer;
