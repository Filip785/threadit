import { Formik, FormikProps } from 'formik';
import React, { useEffect } from 'react';
import { Button, Col, Row, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { object, string } from 'yup';
import { selectAuthUser } from '../../auth/authSlice';
import { createPost, resetStateReduce, selectPostCreated } from '../createPostSlice';
import history from '../../../shared/history';

interface ICreatePostForm {
    postTitle: string;
    postContent: string;
}

const schema = object({
    postTitle: string().required(),
    postContent: string().required(),
});

export default function CreatePost() {
    const dispatch = useDispatch();
    const authUser = useSelector(selectAuthUser);
    const postCreated = useSelector(selectPostCreated);

    useEffect(() => {
        if(!authUser) {
            history.push('/auth');
        }
        
        if(postCreated) {
            history.push('/p/1');
            dispatch(resetStateReduce());
        }
    }, [authUser, postCreated]);

    return (
        <Row className="h-100">
            <Col className="d-flex flex-column align-items-center justify-content-center">
                <h1>Create Post</h1>

                <Formik validationSchema={schema} initialValues={{ postTitle: '', postContent: '' }} onSubmit={(values: ICreatePostForm) => {
                    dispatch(createPost(values.postTitle, values.postContent, authUser!.id!, authUser!.api_token!));
                }} validateOnBlur={false} validateOnChange={false}>
                    {(props: FormikProps<ICreatePostForm>) => {
                        const {
                            handleSubmit,
                            handleChange,
                            values,
                            touched,
                            errors
                        } = props;

                        return (
                            <Form noValidate onSubmit={handleSubmit} className="d-flex flex-column justify-content-center">
                                <Form.Group controlId="formPostTitle">
                                    <Form.Label>Post Title</Form.Label>
                                    <Form.Control type="text" name="postTitle" value={values.postTitle} onChange={handleChange} isValid={touched.postTitle && !errors.postTitle} />
                                    <Form.Control.Feedback type='invalid' className='d-block' style={{ marginTop: '1rem' }}>
                                        {errors.postTitle}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="formPostContent">
                                    <Form.Label>Post Link</Form.Label>
                                    <Form.Control type="text" name="postContent" value={values.postContent} onChange={handleChange} isValid={touched.postContent && !errors.postContent} />
                                    <Form.Control.Feedback type='invalid' className='d-block' style={{ marginTop: '1rem' }}>
                                        {errors.postContent}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Create
                                </Button>
                            </Form>
                        );
                    }}
                </Formik>
            </Col>
        </Row>
    );
}