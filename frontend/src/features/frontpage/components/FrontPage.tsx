import React, { useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectAuthUser, signOutReduce } from '../../auth/authSlice';
import { getFrontPagePosts, selectPage, selectPosts } from '../frontPageSlice';

export function FrontPage() {
    const dispatch = useDispatch();

    const authUser = useSelector(selectAuthUser);
    const posts = useSelector(selectPosts);
    const page = useSelector(selectPage);

    useEffect(() => {
        dispatch(getFrontPagePosts(page));
    }, [dispatch]);

    return (
        <div>
            <h1>Frontpage!</h1>

            {posts.map((post, index) => {
                return (
                    <Card key={index}>
                        <Card.Body>
                            <Card.Title>{post.post_title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Created by <Link to={`/u/${post.user.username}`}>/u/{post.user.username}</Link> at {new Date(post.created_at).toLocaleDateString('en-GB')}</Card.Subtitle>
                            <Card.Link href="#">Comments ({post.comment_count})</Card.Link>
                            <Card.Link href="#">Report</Card.Link>
                        </Card.Body>
                    </Card>
                );
            })}


            {authUser && <Button type='button' variant='danger' onClick={() => {
                localStorage.removeItem('authUser');
                dispatch(signOutReduce());
            }}>Logout</Button>}
            {!authUser && (
                <>
                    <div>
                        <Link to='/auth'>Login</Link>
                    </div>

                    <div>
                        <Link to='/register'>Register</Link>
                    </div>
                </>
            )}
        </div>
    );
}