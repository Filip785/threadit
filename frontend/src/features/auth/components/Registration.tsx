import React from 'react';
import { Link } from 'react-router-dom';

export default function Registration() {
    return (
        <>
            <h1>Register</h1>
            <Link to='/auth'>Already have an account? Login here.</Link>
        </>
    );
}