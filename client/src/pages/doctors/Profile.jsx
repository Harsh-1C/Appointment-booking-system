import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../Components/Layout'
import axios from 'axios';
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../../Redux/slices/alertSlice";
import Spinner from '../../Components/Spinner';
import moment from 'moment';

// TODO:  ============= USER IS NOT ABLE TO UPDATE HIS AVAILABLE TIMINGS =================

const Profile = () => {
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const dispatch = useDispatch();
    const user = useSelector(store => store.user.user)
    const getDoctorDetail = async () => {
        try {
            // dispatch(showLoading());
            const res = await axios.get('/api/v1/doctor/getDoctorInfo', {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.data.success) {
                setDoctor(res.data.data);
            }
            // dispatch(hideLoading());
        } catch (error) {
            // dispatch(hideLoading());
            console.log(error);
            message.error('Something Went Wrong');
            navigate('/')
        }
    }

    const handleFinish = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post('/api/v1/doctor/updateProfile', {
                ...values, timings: [moment(values.timings[0]['$d']).format("HH:mm"),
                moment(values.timings[1]['$d']).format("HH:mm")], userId: user._id
            }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                navigate('/');
            } else {
                console.log(res.data.error);
                message.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            dispatch(hideLoading());
            message.error('Something went wrong')
        }
    };

    useEffect(() => {
        getDoctorDetail()
    }, [])

    if (!doctor) {
        return <Spinner />
    }

    return (
        <Layout>
            <h3 className='p-3'>
                Manage Profile:
            </h3>
            {
                doctor && <Form layout="vertical" initialValues={doctor} className="m-3">
                    <h4 className="">Personal Details : </h4>
                    <Row gutter={20}>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="First Name"
                                name="firstName"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder="your first name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Last Name"
                                name="lastName"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder="your last name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Phone No"
                                name="phone"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder="your contact no" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Email"
                                name="email"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="email" placeholder="your email address" />
                            </Form.Item>
                        </Col>
                         <Col xs={24} md={24} lg={8}>
                         <Form.Item label="Website" name="website">
                                <Input type="text" placeholder="your website" />
                            </Form.Item> 
                         </Col> 

                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Address"
                                name="address"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder="your clinic address" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <h4>Professional Details :</h4>
                    <Row gutter={20}>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Specialization"
                                name="specialization"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder="your specialization" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Experience"
                                name="experience"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder="your experience" />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Fees Per Cunsaltation"
                                name="feesPerCunsaltation"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder="your contact no" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            {/* <Form.Item label="Timings" name="timings" required>
                                <TimePicker.RangePicker format={"HH:mm"} />
                            </Form.Item> */}
                        </Col>
                        <Col xs={24} md={24} lg={8}></Col>
                        <Col xs={24} md={24} lg={8}>
                            <button className="btn btn-primary form-btn" type="submit">
                                Submit
                            </button>
                        </Col>  
                    </Row>
                </Form>
            }
        </Layout>
    )
}

export default Profile
