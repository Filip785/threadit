import React from 'react';
import CommentModel from '../../../models/Comment';
import uniqid from 'uniqid';

interface CommentProps {
    comment: CommentModel;
    parent?: CommentModel;
}

export default function Comment(props: CommentProps) {
    return (
        <div>
            {props.parent && <span>u/{props.comment.user.username} wrote in response to u/{props.parent.user.username}:</span>}
            <h3>{props.comment.content}</h3>

            <div className="replies">
                {props.comment.replies.length > 0 && props.comment.replies.map((comment) => <Comment key={uniqid()} comment={comment} parent={props.comment} />)}
            </div>
        </div>
    );
}