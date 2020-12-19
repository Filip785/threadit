import { Formik, FormikProps } from 'formik';
import React, { useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { object, string } from 'yup';
import { attemptRegister, attemptRegisterFailureEnd, selectRegistered, selectRegisterError } from '../authSlice';
import history from '../../../shared/history';
import { selectRegisterErrors } from '../authSlice';

interface IRegisterForm {
    username: string;
    email: string;
    password: string;
}

const schema = object({
    username: string().required(),
    email: string().required().email(),
    password: string().required(),
});

export default function Registration() {
    const dispatch = useDispatch();
    const registerErrors = useSelector(selectRegisterErrors);
    const registered = useSelector(selectRegistered);
    const registerError = useSelector(selectRegisterError);

    useEffect(() => {
        if(registered) {
            history.push('/auth');
        }
    });

    return (
        <Row className="h-100">
            <Col className="d-flex flex-column align-items-center justify-content-center">
                <h1>Register</h1>

                <Formik validationSchema={schema} initialValues={{ username: '', email:'', password: '' }} onSubmit={(values: IRegisterForm) => {
                    dispatch(attemptRegister(values.username, values.email, values.password));
                }} validateOnBlur={false} validateOnChange={false}>
                    {(props: FormikProps<IRegisterForm>) => {
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
                                    {registerErrors.username && <Form.Control.Feedback type='invalid' className='d-block' style={{marginTop: '1rem'}}>
                                        {registerErrors.username}
                                    </Form.Control.Feedback>}
                                </Form.Group>

                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" name="email" value={values.email} onChange={handleChange} isValid={touched.email && !errors.email} />
                                    <Form.Control.Feedback type='invalid' className='d-block' style={{marginTop: '1rem'}}>
                                        {errors.email}
                                    </Form.Control.Feedback>
                                    {registerErrors.email && <Form.Control.Feedback type='invalid' className='d-block' style={{marginTop: '1rem'}}>
                                        {registerErrors.email}
                                    </Form.Control.Feedback>}
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name="password" value={values.password} onChange={handleChange} isValid={touched.password && !errors.password} />
                                    <Form.Control.Feedback type='invalid' className='d-block' style={{marginTop: '1rem'}}>
                                        {errors.password}
                                    </Form.Control.Feedback>
                                    {registerErrors.password && <Form.Control.Feedback type='invalid' className='d-block' style={{marginTop: '1rem'}}>
                                        {registerErrors.password}
                                    </Form.Control.Feedback>}

                                    {registerError && <Form.Control.Feedback type='invalid' className='d-block' style={{marginTop: '1rem'}}>
                                        Unknown error occured, which is most likely us, not you! Try again later.
                                    </Form.Control.Feedback>}
                                </Form.Group>

                                <Button variant="primary" type="submit" onClick={() => dispatch(attemptRegisterFailureEnd())}>
                                    Register
                                </Button>
                            </Form>
                        );
                    }}
                </Formik>

                <Link to='/auth' style={{marginTop: '1rem'}}>Already have an account? Login here.</Link>
            </Col>
        </Row>
    );
}