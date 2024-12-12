import React, { useEffect, useState } from 'react'
import Layout from "../../Components/Layout"
import axios from 'axios';
import { Table, message } from 'antd';
import Spinner from "../../Components/Spinner"
import moment from "moment"

const DoctorAppointment = () => {
    const [appointment, setAppointment] = useState(null);
    const getAllAppointment = async () => {
        try {
            const res = await axios.get("/api/v1/doctor/doctor-appointment", {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setAppointment(res.data.data);
        } catch (error) {
            console.log(error)
        }

    }

    const handleActionClick = async (action, appointmentId) => {
        try {
            const res = await axios.post('/api/v1/doctor/change-status', {
                action,
                appointmentId
            }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.data.success) {
                message.success(res.data.message);
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
            message.error('Something went wrong');
        }
    }


    useEffect(() => {
        getAllAppointment();
    }, [])

    // antD table
    const columns = [
        {
            title: "ID",
            dataIndex: "_id",
        },
        {
            title: "Patient",
            dataIndex: "patient",
            render: (text, record) => (
                record.userInfo.name
            )
        },
        {
            title: "Status",
            dataIndex: 'status',
        },
        {
            title: "Date",
            dataIndex: "date",
            render: (text, record) => (
                moment(record.date).format('DD-MM-YYYY')
            )
        },
        {
            title: "Time",
            dataIndex: 'time',
            render: (text, record) => (
                moment(record.time).format('HH:mm')
            )
        },
        {
            title: "Action",
            dataIndex: 'action',
            render: (text, record) => (

                (record.status === "pending") ? <div className='d-flex gap-2'>
                    <button className='btn btn-success' onClick={() => handleActionClick("approve", record._id)}>Approve</button>
                    <button className='btn btn-danger' onClick={() => handleActionClick("reject", record._id)}>Reject</button>
                </div> : <button className='btn btn-warning' onClick={() => handleActionClick("pending", record._id)} > Pending</ button>


            )
        },
    ]


    if (!appointment) {
        return <Spinner />
    }

    return (
        <Layout>
            <h3 className='text-center my-3'>Appointments</h3>
            <Table columns={columns} dataSource={appointment} />
        </Layout>
    )
}

export default DoctorAppointment
