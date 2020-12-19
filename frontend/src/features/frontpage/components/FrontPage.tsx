import React, { useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { selectAuthUser, signOutReduce } from '../../auth/authSlice';
import { getFrontPagePosts, selectPage, selectPosts, setPageReduce } from '../frontPageSlice';
import Upvote from './Upvote';

export default function FrontPage() {
    const dispatch = useDispatch();

    const authUser = useSelector(selectAuthUser);
    const posts = useSelector(selectPosts);
    const page = useSelector(selectPage);
    const params: { page: string } = useParams();

    useEffect(() => {
        const pageParam = Number(params.page);

        if(pageParam !== page) {
            dispatch(setPageReduce(pageParam));
        } else {
            dispatch(getFrontPagePosts(page, authUser?.api_token!));
        }
    }, [dispatch, page, params.page, authUser?.api_token]);

    return (
        <div>
            <h1>Frontpage!</h1>

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

            {posts.map((post, index) => {
                return (
                    <Card key={index}>

                        <Card.Body>
                            <div className="post-header-holder">
                                <Upvote post={post} />
                                <div className="title-holder">
                                    <Card.Title>{post.post_title}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Created by <Link to={`/u/${post.user.username}`}>/u/{post.user.username}</Link> at {new Date(post.created_at).toLocaleDateString('en-GB')}</Card.Subtitle>
                                </div>
                            </div>
                            <Card.Link href="#">Comments ({post.comment_count})</Card.Link>
                            <Card.Link href="#">Report</Card.Link>
                        </Card.Body>
                    </Card>
                );
            })}

            <div className="nav-links">
                {page !== 1 && <Link to={`/p/${page-1}`}>back</Link>}
                {posts.length === 20 && <Link to={`/p/${(page+1)}`}>next</Link>}
            </div>


            {authUser && <Button type='button' variant='danger' onClick={() => {
                localStorage.removeItem('authUser');
                dispatch(signOutReduce());
            }}>Logout</Button>}
        </div>
    );
}