import React, { useState } from 'react';
import CommentModel from '../../../models/Comment';
import { Button, Card } from 'react-bootstrap';
import { format } from 'date-fns';
import CreateComment from './CreateComment';
import { selectAuthUser } from '../../auth/authSlice';
import { useSelector } from 'react-redux';
import { DashCircle, PlusCircle } from 'react-bootstrap-icons';
import Replies from './Replies';

interface CommentProps {
    comment: CommentModel;
    post_id: string;
}

function Comment(props: CommentProps) {
    const [doReply, setDoReply] = useState(false);
    const [hideTree, setHideTree] = useState(false);
    const authUser = useSelector(selectAuthUser);

    return (
        <div className="comment">
            <div className="comment-info d-flex justify-content-between">
                <span>u/{props.comment.user.username} wrote:</span>
                <span>{
                    format(new Date(props.comment.created_at), "dd.MM.yyyy 'at' HH:mm")
                } {hideTree && <PlusCircle onClick={() => setHideTree(!hideTree)} />}</span>
            </div>
            
            <div className={`main-comment${hideTree ? ' hide' : ''}`}>
                <Card>
                    <Card.Body>
                        <div className="comment-content">
                            <Card.Text>{props.comment.content}</Card.Text>
                            <DashCircle onClick={() => setHideTree(!hideTree)} />
                        </div>

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

                    {props.comment.replies.length > 0 && <Replies replies={props.comment.replies} post_id={props.post_id} />}
                </div>
            </div>
        </div>
    );
}

export default Comment;