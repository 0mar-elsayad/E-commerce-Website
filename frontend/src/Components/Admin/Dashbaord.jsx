import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './dashboard.css';

export default function Dashboard() {
    const initialValues = {
        name: '',
        image: '',
        category: '',
        new_price: '',
        old_price: ''
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Product name is required'),
        image: Yup.string().url('Invalid URL format').required('Product image URL is required'),
        category: Yup.string().required('Product category is required'),
        new_price: Yup.number().positive('Price must be positive').required('New price is required'),
        old_price: Yup.number().positive('Price must be positive').required('Old price is required')
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await axios.post('/api/create-product', {
                name: values.name,
                image: values.image,
                category: values.category,
                new_price: values.new_price,
                old_price: values.old_price
            });
            console.log(response.data); // Handle the response data as needed
            resetForm();
        } catch (error) {
            console.error('Error creating product:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="form">
                        <div className="form-group">
                            <label htmlFor="name">Product Name</label>
                            <Field type="text" name="name" id="name" />
                            <ErrorMessage name="name" component="div" className="error-message" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="image">Product Image URL</label>
                            <Field type="text" name="image" id="image" />
                            <ErrorMessage name="image" component="div" className="error-message" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Product Category</label>
                            <Field type="text" name="category" id="category" />
                            <ErrorMessage name="category" component="div" className="error-message" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="new_price">New Price</label>
                            <Field type="number" name="new_price" id="new_price" />
                            <ErrorMessage name="new_price" component="div" className="error-message" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="old_price">Old Price</label>
                            <Field type="number" name="old_price" id="old_price" />
                            <ErrorMessage name="old_price" component="div" className="error-message" />
                        </div>
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Product'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
