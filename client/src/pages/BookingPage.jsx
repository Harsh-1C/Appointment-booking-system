import Layout from '../Components/Layout'
import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DatePicker, TimePicker, message } from 'antd';
import Spinner from '../Components/Spinner';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading, hideLoading } from "../Redux/slices/alertSlice"

const BookingPage = () => {
    const { doctorId } = useParams()
    const [doctor, setDoctor] = useState(null);
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [isAvailable, setIsAvailable] = useState(null);
    const [processing, setProcessing] = useState(false);
    const dispatch = useDispatch();

    const user = useSelector(store => store.user.user);

    const getDoctor = async () => {
        try {
            const doctor = await axios.post("/api/v1/doctor/getSingleDoctor", { doctorId: doctorId }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (doctor.data.success) {
                setDoctor(doctor.data.data);
            }
        } catch (error) {
            console.log(error);
            message.error('Something went wrong')
        }
    };

    const handleBookAppointment = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post("/api/v1/user/book-appointment", {
                userId: user._id,
                doctorId: doctorId,
                doctorInfo: doctor,
                userInfo: user,
                date: date,
                time: time
            }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                dispatch(hideLoading());
                message.success('Appointment Booked Successfully');
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error('Something went wrong');
        }
    }

    const handleAvailability = async () => {
        if(!time || !date) {
            message.error('Please fill details');
            return
        }
        setProcessing(true);
        const currentDate = new Date();
        // handling user can't book in previous days
        const curDate = moment(currentDate, 'DD-MM-YYYY').toISOString();
        const inpDate = moment(date, 'DD-MM-YYYY').toISOString();
        const inpTime = moment(time, 'HH:mm:ss').toISOString();
        const mergedDateTime = moment(inpDate)
            .hour(moment(inpTime).hour())
            .minute(moment(inpTime).minute())
            .second(moment(inpTime).second());

        if (moment(mergedDateTime).isBefore(moment(curDate))) {
            message.error(`You can't book in previos day`);
            setProcessing(false);
            return;
        }

        // handling user can't book other than doctor available timings;
        const doctorStartTime = moment(doctor.timings[0], 'HH:mm').toISOString();
        const doctorEndTime = moment(doctor.timings[1], 'HH:mm').toISOString();

        if(moment(inpTime).isBefore(moment(doctorStartTime)) || moment(inpTime).isAfter(moment(doctorEndTime))){
            message.error('Book between available time only');
            setProcessing(false);
            return
        }

        try {
            const res = await axios.post('/api/v1/user/check-availability', {
                doctorId,
                date,
                time,
            }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.data.success) {
                setProcessing(false);
                setIsAvailable(true);
                message.success(res.data.message);
            } else {
                setProcessing(false);
                message.error(res.data.message);
            }
        } catch (error) {
            setProcessing(false);
            console.log(error);
        }
    }

    const handleOnChangeDate = (value) => {
        setIsAvailable(false);
        setDate(moment(value['$d']).format("DD-MM-YYYY"))
    }

    const handleOnChangeTime = (value) => {
        setIsAvailable(false);
        setTime(moment(value['$d']).format("HH:mm"))
    }

    useEffect(() => {
        getDoctor();
    }, []);

    if (!doctor) return <Spinner />
    return (
        <Layout>
            <h2 className='text-center my-2'>Booking Page</h2>
            <div className="m-3">
                {
                    doctor && <div className='d-flex flex-column gap-1' >
                        <p className='my-1' style={{ fontSize: "2rem" }}><b>Dr. {doctor.firstName} {doctor.lastName}</b></p>
                        <p className='my-1'><b>Specialization: </b> {doctor.specialization}</p>
                        <p className='my-1'>Fees : {doctor.feesPerCunsaltation}</p>
                        <p className='my-1'>Timings : {doctor.timings[0]} - {doctor.timings[1]}</p>

                        <div className="d-flex flex-column w-50 gap-3">
                            <DatePicker format={"DD-MM-YYYY"} onChange={(value) => handleOnChangeDate(value)}>

                            </DatePicker>
                            <TimePicker format={"HH:mm"} onChange={(value) => handleOnChangeTime(value)}>

                            </TimePicker>
                            <div className={processing ? 'disabled-button' : 'btn btn-primary'} onClick={handleAvailability}>{processing ? "Processing..." : "Check Availaibility"}</div>
                            <div className={isAvailable ? 'btn btn-dark' : 'disabled-button book'} onClick={handleBookAppointment} >Book Now</div>
                        </div>

                    </div>
                }
            </div>
        </Layout>
    )
}

export default BookingPage
