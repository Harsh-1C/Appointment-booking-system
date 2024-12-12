import React, { useEffect, useState } from 'react'
import Layout from '../Components/Layout';
import axios from 'axios';
import { Table } from 'antd';
import Spinner from '../Components/Spinner';
import moment from "moment"

const AppointmentPage = () => {
    const [appointment, setAppointment] = useState(null);
    const getAllAppointment = async () => {
        try {
            const res = await axios.get("/api/v1/user/user-appointment", {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setAppointment(res.data.data);
        } catch (error) {
            console.log(error)
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
            title: "Doctor",
            dataIndex: "doctor",
            render: (text, record)=>(
                record.doctorInfo.firstName
            )
        },
        {
            title: "Status",
            dataIndex: 'status',
            render : (text, record) => {
                if(record.status === 'pending'){
                    return <span style={{backgroundColor:"#ff9e00e6",color:"white", padding:"5px", borderRadius:"5px" }}>Pending</span>
                }else if(record.status === 'approve'){
                    return <span  style={{backgroundColor:"#0d920db0",color:"white", padding:"5px", borderRadius:"5px" }} >Approved</span>
                }
            }
        },
        {
            title: "Date",
            dataIndex: "date",
            render : (text, record)=>(
                moment(record.date).format('DD-MM-YYYY')
            )
        },
        {
            title: "Time",
            dataIndex: 'time',
            render: (text, record) => (
                moment(record.time).format('HH:mm')
            )
        }
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

export default AppointmentPage
