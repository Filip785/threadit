import React from 'react';
import CommentModel from '../../../models/Comment';
import Comment from './Comment';
import uniqid from 'uniqid';

interface RepliesProps {
    replies: CommentModel[];
    post_id: string;
}

function Replies(props: RepliesProps) {
    return (
        <>
            {props.replies.map((comment) => <Comment key={uniqid()} comment={comment} post_id={props.post_id} />)}
        </>
    );
}

export default React.memo(Replies);