const userModel = require("../models/userModels");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");

//register callback
const registerController = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      email,
      name,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).send({ message: "Register Sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

// login callback
const loginController = async (req, res) => {
  try {

    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(208).json({
        success: false,
        message: "user not found",
      });
    }
    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
      return res.status(201).json({
        success: false,
        message: "Invalid email or passowrd",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({
      success: true,
      token,
      message: "login successfull",
    });
  } catch (error) {
    console.log(`login api error ${error}`);
    res.status(500).json({
      success: false,
      message: `Error in login controller ${error}`,
    });
  }
};

// authentication controller
const handleAuth = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(208).json({
        success: false,
        message: "user not found",
      });
    } else {
      res.status(200).json({
        success: true,
        data: user,
        message: "user found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "auth error",
      error,
    });
  }
};

// apply doctor controller
const handleApplyDoctor = async (req, res) => {
  try {
    const isExist = await doctorModel.findOne({ userId: req.body.userId });
    if (isExist) {
      return res.status(201).json({
        success: false,
        message: "Already applied for doctor account",
      });
    }

    const newDoctor = await doctorModel.create({
      ...req.body,
      status: "pending",
    });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser?.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).json({
      success: true,
      message: "Doctor account Applied Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Something went wrong",
    });
  }
};

// to get all the notification
const getAllNotification = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seenNotification = user.seenNotification;
    const notification = user.notification;
    seenNotification.push(...notification);
    user.notification = [];
    user.seenNotification = seenNotification;
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).json({
      success: true,
      message: "All notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in notification",
      error,
    });
  }
};

// delete all read notification
const deleteAllNotification = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.seenNotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).json({
      success: true,
      message: "Deleted All read Notication",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting read notification",
      error,
    });
  }
};

// get list of all doctor
const handleGetAllDoctor = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).json({
      success: true,
      message: "doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching doctors",
    });
  }
};

// To book appointment
const handleBookAppointment = async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user?.notification.push({
      type: "new-appointment-request",
      message: `A new appointment request from ${req.body.userInfo.name}`,
      data: {
        onClickPath: "/doctor-appointment",
      },
    });
    await user.save();
    res.status(200).json({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while booking appointment",
      error,
    });
  }
};

// checking availability of the doctor

const handleCheckAvailability = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm").subtract(1, "hours").toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if(appointments.length>0){
      res.status(200).json({
        success:false,
        message:"Appointment not available"
      })
    }else{
      res.status(200).json({
        success:true,
        message:"Slot Available"
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while checking availability",
      error,
    });
  }
};


// Fetch user appointments
const handleUserAppointmnet = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({userId: req.body.userId});
    res.status(200).json({
      success:true,
      message:"user appointment fetched successfully",
      data:appointments
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:"Erro while fetching user appointment list",
      error
    })
  }
}

module.exports = {
  loginController,
  registerController,
  handleAuth,
  handleApplyDoctor,
  getAllNotification,
  deleteAllNotification,
  handleGetAllDoctor,
  handleBookAppointment,
  handleCheckAvailability,
  handleUserAppointmnet
};
