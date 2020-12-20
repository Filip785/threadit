import { createSlice } from "@reduxjs/toolkit";
import Comment from "../../models/Comment";

interface ThreadState {
    comments: Comment[]
}

const initialState: ThreadState = {
    comments: []
};

export const threadSlice = createSlice({
    name: 'thread',
    initialState,
    reducers: {
    },
});

export default threadSlice.reducer;
