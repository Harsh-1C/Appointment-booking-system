import React from 'react'
import { useNavigate } from 'react-router-dom'

const DoctorCard = ({ doctor }) => {
    const navigate = useNavigate()
  
    return (
        <>
            <div className="card m-2 doctorCard" style={{cursor:"pointer"}} onClick={()=>navigate(`/doctor/book-appointment/${doctor._id}`)}>
                <div className="card-header text-center">
                    <b>Dr. {doctor?.firstName} {doctor?.lastName}</b>
                </div>
                <div className="card-body">
                        <p>
                            <b>Specialization: </b>{doctor.specialization}
                        </p>
                        <p>
                            <b>Experience: </b>{doctor.experience}
                        </p>
                        <p>
                            <b>Contact: </b>{doctor.phone}
                        </p>
                        <p>
                            <b>Address: </b>{doctor.address}
                        </p>
                        <p>
                            <b>Fees: </b>{doctor.feesPerCunsaltation}
                        </p>
                        <p>
                            <b>Timings: </b>{doctor.timings[0]} - {doctor.timings[1]}
                        </p>
                </div>
            </div>
        </>
    )
}

export default DoctorCard
