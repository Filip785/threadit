import React from 'react';
import { ArrowUp } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { resetStateReduce, upvotePost, upvotePostReduce } from '../frontPageSlice';
import history from '../../../shared/history';
import { selectAuthUser } from '../../auth/authSlice';
import { Post } from '../../../models/Post';

interface UpvoteProps {
    post: Post;
}

export default function Upvote(props: UpvoteProps) {
    const dispatch = useDispatch();
    const authUser = useSelector(selectAuthUser);
    const { post } = props;

    return (
        <div className="arrow-holder">
            <ArrowUp onClick={() => {
                if (!authUser) {
                    history.push('/auth');

                    dispatch(resetStateReduce());

                    return;
                }

                dispatch(upvotePostReduce(post.id!));
                dispatch(upvotePost(authUser.id!, post.id!, authUser.api_token!));
            }} fill='#ff4500' />
            <p className={post.did_upvote ? 'upvoted' : ''}>{post.voteCount}</p>
        </div>
    );
}