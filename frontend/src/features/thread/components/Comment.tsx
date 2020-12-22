import React, { useState } from 'react';
import CommentModel from '../../../models/Comment';
import uniqid from 'uniqid';
import { Button, Card } from 'react-bootstrap';
import { format } from 'date-fns';
import CreateComment from './CreateComment';
import { selectAuthUser } from '../../auth/authSlice';
import { useSelector } from 'react-redux';

interface CommentProps {
    comment: CommentModel;
    post_id: string;
}

export default function Comment(props: CommentProps) {
    const [doReply, setDoReply] = useState(false);
    const authUser = useSelector(selectAuthUser);

    return (
        <div className="comment">
            <div className="comment-info d-flex justify-content-between">
                <span>u/{props.comment.user.username} wrote:</span>
                <span>{
                    format(new Date(props.comment.created_at), "dd.MM.yyyy 'at' HH:mm")
                }</span>
            </div>

            <Card>
                <Card.Body>
                    <Card.Text>{props.comment.content}</Card.Text>

                    {authUser && <Button variant='link' style={{ padding: 0 }} onClick={() => setDoReply(!doReply)}>Reply</Button>}
                </Card.Body>
            </Card>

            <div className="replies">
                {doReply && (
                    <div className='comment reply-box'>
                        <div className='comment-info'>
                            <span>Write your reply...</span>
                        </div>

                        <Card>
                            <Card.Body>
                                
                                <CreateComment pattern={props.comment.pattern || props.comment.id.toString()} post_id={props.post_id} />

                            </Card.Body>
                        </Card>
                    </div>
                )}
                {props.comment.replies.length > 0 && props.comment.replies.map((comment) => <Comment key={uniqid()} comment={comment} post_id={props.post_id} />)}
            </div>
        </div>
    );
}