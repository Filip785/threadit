import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { fetchThread, selectMainPost } from '../threadSlice';
import Comment from './Comment';
import uniqid from 'uniqid';

export default function Thread() {
    const dispatch = useDispatch();
    const params: { thread: string } = useParams();

    const mainPost = useSelector(selectMainPost);

    // strategy for fetching data? ideally post title / post description are fetched only when full page reload (state is empty)
    // the comments probably should be fetched on each hit (either from frontpage or from full page reload)
    useEffect(() => {
        dispatch(fetchThread(params.thread));
    }, [dispatch, params.thread]);

    return (
        <div>
            <h1>{mainPost?.post.post_title}</h1>
            <h3>{mainPost?.post.description}</h3>

            <div className="comments">
                {mainPost?.comments.map(comment => {
                    return <Comment key={uniqid()} comment={comment} />;
                })}
            </div>
        </div>
    );
}