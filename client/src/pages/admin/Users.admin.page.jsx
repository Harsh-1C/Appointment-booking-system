import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import axios from 'axios';
import { Table } from 'antd';
import Spinner from '../../Components/Spinner';

const UsersPage = () => {

    const [users, setUsers] = useState(null);
    const getAllUsers = async () => {
        try {
            const res = await axios.get("/api/v1/admin/getAllUsers", {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUsers(res.data.data);
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        getAllUsers();
    }, [])

    // antD table
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Email",
            dataIndex: "email"
        },
        {
            title: "Doctor",
            dataIndex: 'doctor',
            render: (text, record) => (
                <span>{record.isDoctor ? "YES" : "NO"}</span>
            )
        },
        {
            title: "Admin",
            dataIndex: 'admin',
            render: (text, record) => (
                <span>{record.admin ? "YES" : "NO"}</span>
            )
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <div className='d-flex'>
                    <button className='btn btn-danger'>Block</button>
                </div>
            )
        }
    ]


    if (!users) {
        return <Spinner />
    }

    return (
        <Layout>
            <h3 className='text-center my-3'>Users List</h3>
            <Table columns={columns} dataSource={users} />
        </Layout>
    )
}

export default UsersPage
