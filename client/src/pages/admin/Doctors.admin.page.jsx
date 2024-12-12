import Layout from '../../Components/Layout'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Table, message } from "antd"
import Spinner from '../../Components/Spinner';


const DoctorsPage = () => {
  const [doctors, setDoctors] = useState(null);
  const getAllDoctors = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllDoctors", {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDoctors(res.data.data);
    } catch (error) {
      console.log(error)
    }
  }


  const handleAccountUpdateStatus = async (record, status) => {
    try {
      const res = await axios.post('/api/v1/admin/change-account-status-doctor', { doctorId: record._id, status, id: record.userId }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (res.data.success) {
        message.success('Account status updated')
        window.location.reload()
      }


    } catch (error) {
      console.log(error);
      message.error('Something Went Wrong')
    }
  }

  useEffect(() => {
    getAllDoctors();
  }, [])

  // antD table
  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      render: (text, record) => (
        <span>{record.firstName} {record.lastName} </span>
      )
    },
    {
      title: "Status",
      dataIndex: "status"
    },
    {
      title: "Phone",
      dataIndex: "phone"
    },
    {
      title: "Email",
      dataIndex: "email"
    },
    {
      title: "Actions",
      dataIndex: 'actions',
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" ? (
            <>
              <button
                className="btn btn-success mx-2"
                onClick={() => handleAccountUpdateStatus(record, "approved")}
              >
                Approve
              </button>
              <button className='btn btn-danger' onClick={() => handleAccountUpdateStatus(record, "reject")}>Reject</button>
            </>
          ) : (
            <button className="btn btn-danger" onClick={() => handleAccountUpdateStatus(record, "pending")}>Reject</button>
          )}
        </div>
      )
    },
  ]

  if (!doctors) {
    return <Spinner />
  }

  return (
    <Layout>
      <h3 className='text-center my-3'>Doctors list</h3>
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  )
}

export default DoctorsPage
