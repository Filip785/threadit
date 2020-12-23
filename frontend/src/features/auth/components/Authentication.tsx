import { Formik, FormikProps } from 'formik';
import React, { useEffect } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { string, object } from 'yup';
import { attemptLogin, attemptLoginFailureEnd, attemptRegisterReduce, selectLoginError, selectRegistered } from '../authSlice';

interface IAuthenticateForm {
    username: string;
    password: string;
}

const schema = object({
    username: string().required('Please enter username.'),
    password: string().required('Please enter password.'),
});

export default function Authentication() {
    const dispatch = useDispatch();

    const loginError = useSelector(selectLoginError);
    const registered = useSelector(selectRegistered);

    useEffect(() => {
        if(registered) {
            dispatch(attemptRegisterReduce());
        }
    });

    return (
        <Row className="h-100">
            <Col className="d-flex flex-column align-items-center justify-content-center">
                <h1>Authenticate</h1>

                <Formik validationSchema={schema} initialValues={{ username: '', password: '' }} onSubmit={(values: IAuthenticateForm) => {
                    dispatch(attemptLogin(values.username, values.password))
                }} validateOnBlur={false} validateOnChange={false}>
                    {(props: FormikProps<IAuthenticateForm>) => {
                        const {
                            handleSubmit,
                            handleChange,
                            values,
                            touched,
                            errors
                        } = props;

                        return (
                            <Form noValidate onSubmit={handleSubmit} className="d-flex flex-column justify-content-center">
                                <Form.Group controlId="formBasicUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" name="username" value={values.username} onChange={handleChange} isValid={touched.username && !errors.username} />
                                    <Form.Control.Feedback type='invalid' className='d-block' style={{marginTop: '1rem'}}>
                                        {errors.username}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name="password" value={values.password} onChange={handleChange} isValid={touched.password && !errors.password} />
                                    <Form.Control.Feedback type='invalid' className='d-block' style={{marginTop: '1rem'}}>
                                        {errors.password}
                                    </Form.Control.Feedback>
                                    {loginError && <Form.Control.Feedback type='invalid' className='d-block' style={{marginTop: '1rem'}}>
                                        Username / password incorrect.
                                    </Form.Control.Feedback>}
                                </Form.Group>

                                <Button variant="primary" type="submit" onClick={() => dispatch(attemptLoginFailureEnd())}>
                                    Login
                                </Button>
                            </Form>
                        );
                    }}
                </Formik>
                
                <Link to='/register' style={{marginTop: '1rem'}}>Don't have an account? Register here.</Link>
            </Col>
        </Row>
    );
}