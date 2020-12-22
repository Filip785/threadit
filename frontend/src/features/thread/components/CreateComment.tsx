import { Formik, FormikProps } from 'formik';
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { object, string } from 'yup';
import { selectAuthUser } from '../../auth/authSlice';
import { createComment } from '../threadSlice';

interface CreateCommentProps {
    pattern?: string;
    post_id: string;
}

interface ICommentForm {
    content: string;
}

const schema = object({
    content: string().required()
});

export default function CreateComment(props: CreateCommentProps) {
    const dispatch = useDispatch();
    const authUser = useSelector(selectAuthUser);

    return (
        <Formik validationSchema={schema} initialValues={{ content: '' }} onSubmit={(values: ICommentForm) => {
            dispatch(createComment(values.content, authUser?.id!, props.pattern!, props.post_id, authUser?.api_token!));
        }} validateOnBlur={false} validateOnChange={false}>
            {(props: FormikProps<ICommentForm>) => {
                const {
                    handleSubmit,
                    handleChange,
                    values,
                    touched,
                    errors
                } = props;

                return (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group controlId="formContent">
                            <Form.Control type="text" name="content" value={values.content} onChange={handleChange} isValid={touched.content && !errors.content} />
                            <Form.Control.Feedback type='invalid' className='d-block' style={{ marginTop: '1rem' }}>
                                {errors.content}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
}