import React from 'react'
import Layout from "../Components/Layout"
import { useDispatch, useSelector } from 'react-redux'
import { Tabs, message } from 'antd'
import TabPane from 'antd/es/tabs/TabPane'
import { useNavigate } from 'react-router-dom'
import { hideLoading, showLoading } from '../Redux/slices/alertSlice'
import axios from 'axios'
import { markAllRead, setUser } from '../Redux/slices/userSlice'

const NotificationPage = () => {

    const user = useSelector((store) => store.user.user)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleMarkAllRead = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post("/api/v1/user/get-all-notification", {}, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message)
                dispatch(setUser(res.data.data));
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error('Something Went Wrong');
        }
    }

    const handleDeleteAllRead = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post("/api/v1/user/delete-all-notification", {}, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message)
                dispatch(setUser(res.data.data));
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error('Something Went Wrong');
        }
    }

    return (
        <Layout>
            <h3 className='m-3 text-center'>Notification Page</h3>
            <Tabs style={{overflow:"auto"}}>
                <TabPane tab={'UNREAD'} key={0}>
                    <div className="d-flex justify-content-end">
                        <h5 className='mx-4' onClick={handleMarkAllRead} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>Mark All Read</h5>
                    </div>
                    {
                        user && user.notification.map((msg) => (
                            <div className="card m-2" style={{ cursor: "pointer" }} onClick={() => navigate(msg.data.onClickPath)}>
                                <div className="card-text p-2">
                                    {msg.message}
                                </div>
                            </div>
                        ))
                    }
                </TabPane>
                <TabPane tab={'READ'} key={1}>
                    <div className="d-flex justify-content-end">
                        <h5 className='mx-4' onClick={handleDeleteAllRead} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>Delete All Read</h5>
                    </div>
                    {
                        user && user.seenNotification.map((msg) => (
                            <div className="card m-2" style={{ cursor: "pointer" }} onClick={() => navigate(msg.data.onClickPath)}>
                                <div className="card-text p-2">
                                    {msg.message}
                                </div>
                            </div>
                        ))
                    }
                </TabPane>
            </Tabs>
        </Layout>
    )
}

export default NotificationPage
