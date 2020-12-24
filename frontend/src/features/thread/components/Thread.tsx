import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { fetchThread, selectMainPost } from '../threadSlice';
import Comment from './Comment';
import uniqid from 'uniqid';
import CreateComment from './CreateComment';
import { selectAuthUser } from '../../auth/authSlice';
import { Link } from 'react-router-dom';
import { History } from 'history';

interface ThreadProps {
    history?: History<{ from?: number }>
}

export default function Thread(props: ThreadProps) {
    const dispatch = useDispatch();
    const params: { thread: string, from: string } = useParams();

    const mainPost = useSelector(selectMainPost);
    const authUser = useSelector(selectAuthUser);

    useEffect(() => {
        dispatch(fetchThread(params.thread, authUser?.api_token));
    }, [dispatch, params.thread, authUser?.api_token]);

    return (
        <div>
            {<Link to={`/p/${props.history?.location.state?.from || '1'}`}>{props.history?.location.state?.from ? 'Go back' : 'Go to homepage'}</Link>}
            <h1><a href={mainPost?.post.description} target='_blank' rel='noopener noreferrer'>{mainPost?.post.post_title}</a></h1>

            {authUser && <CreateComment post_id={params.thread} />}
            {!authUser && <h3>To be able to comment either <Link to='/register'>create account</Link> or <Link to='/auth'>login</Link>.</h3>}

            <div className="comments">
                {mainPost?.comments.map(comment => <Comment key={uniqid()} comment={comment} post_id={params.thread} />)}
            </div>
        </div>
    );
}