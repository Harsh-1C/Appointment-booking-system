import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import axios from "axios";
import { Row, message } from "antd";
import Spinner from "../Components/Spinner";
import DoctorCard from "../Components/DoctorCard";

const HomePage = () => {
  const [doctorList, setDoctorList] = useState(null);
  const getDoctorList = async () => {
    try {
      const doctorList = await axios.get("/api/v1/user/getAllDoctor", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (doctorList.data.success) {
        setDoctorList(doctorList.data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getDoctorList();
  }, []);

  if (!doctorList) return <Spinner />;

  return (
    <Layout>
      <h3 className="text-center">Home page</h3>
      <Row>
        {doctorList.length > 0 &&
          doctorList.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
      </Row>
    </Layout>
  );
};

export default HomePage;
