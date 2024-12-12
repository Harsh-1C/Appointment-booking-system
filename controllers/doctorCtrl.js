const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");
const appointmentModel = require("../models/appointmentModel");

// get profile detail of the doctor by userId
const handleGetDoctorInfo = async (req, res) => {
  try {
    const userId = req.body.userId;
    const doctor = await doctorModel.findOne({ userId });
    res.status(200).json({
      success: true,
      message: "doctor detials fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to get doctor info",
      error,
    });
  }
};

// update the doctor profile
const handleUpdateProfile = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error while updting doctor profile",
      error,
    });
  }
};

// Fetch list of all appointment booked for that particular doctor
const handleGetDoctorAppointment = async (req, res) => {
  try {
    const userId = req.body.userId;
    const doctor = await doctorModel.findOne({ userId });
    const doctorAppointment = await appointmentModel.find({
      doctorId: doctor._id,
    });
    res.status(200).json({
      success: true,
      message: "Doctor Appointment fetched successfully",
      data: doctorAppointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to get doctor Appointment",
      error,
    });
  }
};

// get profile detail of the doctor by doctorId
const handleGetSingleDoctor = async (req, res) => {
  try {
    const doctorId = req.body.doctorId;
    const doctor = await doctorModel.findOne({ _id: doctorId });
    res.status(200).json({
      success: true,
      message: "doctor details fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to get doctor info",
      error,
    });
  }
};

// Changes status of appointment done by patient to user
const handleChangeStatus = async (req, res) => {
  try {
    const { action, appointmentId } = req.body;
    const appointment = await appointmentModel.findOne({ _id: appointmentId });
    const user = await userModel.findOne({_id: appointment.userId});
    user.notification.push({
      type:"appointment-change-status",
      message:`Your appointment status has been changed to ${action} by Dr. ${appointment.doctorInfo.firstName} `,
      data:{
        onClickPath : "/appointment"
      }
    })
    await user.save();
    if (action === "pending") {
      appointment.status = "pending";
      await appointment.save();
    } else if (action === "approve") {
      appointment.status = "approve";
      await appointment.save();
    } else if (action === "reject") {
      await appointmentModel.deleteOne({ _id: appointmentId });
    }
    res.status(200).json({
      success:true,
      message:`Status changed to ${action}`
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating status",
      error,
    });
  }
};

module.exports = {
  handleGetDoctorInfo,
  handleUpdateProfile,
  handleGetSingleDoctor,
  handleGetDoctorAppointment,
  handleChangeStatus,
};
