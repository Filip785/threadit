import { Formik, FormikProps } from 'formik';
import React, { useEffect } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { string, object } from 'yup';
import history from '../../../shared/history';
import { attemptLogin, selectAuthUser } from '../authSlice';

interface IAuthenticateForm {
    username: string;
    password: string;
}

const schema = object({
    username: string().required(),
    password: string().required(),
});

export default function Authentication() {
    const dispatch = useDispatch();

    const authUser = useSelector(selectAuthUser);

    useEffect(() => {
        if(authUser) {
            history.push('/');
        }
    });

    return (
        <Container className="h-100">
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
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="text" name="username" value={values.username} onChange={handleChange} isValid={touched.username && !errors.username} />
                                        <Form.Control.Feedback type='invalid' className='d-block'>
                                            {errors.username}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" name="password" value={values.password} onChange={handleChange} isValid={touched.password && !errors.password} />
                                        <Form.Control.Feedback type='invalid' className='d-block'>
                                            {errors.password}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Button variant="primary" type="submit">
                                        Login
                                    </Button>
                                </Form>
                            );
                        }}
                    </Formik>
                </Col>
            </Row>
        </Container>
    );
}