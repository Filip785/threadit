import React from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectAuthUser, signOutReduce } from '../auth/authSlice';

export function FrontPage() {
    const dispatch = useDispatch();

    const authUser = useSelector(selectAuthUser);

    return (
        <div>
            <h1>Frontpage!</h1>
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