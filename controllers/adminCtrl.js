const userModel = require("../models/userModels");
const doctorModel = require("../models/doctorModel");

// GET || Fetch all list of users
const handleGetAllUsers = async (req, res) => {
  try {
    const allUser = await userModel.find({});
    res.status(200).json({
      success: true,
      message: "Fetched all users",
      data: allUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error while fetching users list",
      error,
    });
  }
};

// GET || Fetch of all list of doctors
const handleGetAllDoctors = async (req, res) => {
  try {
    const allDoctors = await doctorModel.find({});
    res.status(200).json({
      success: true,
      message: "Fetched all doctors",
      data: allDoctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error while fetching doctors list",
      error,
    });
  }
};

// POST || Approve pending request of doctor

const handleChangeAccountStatus = async (req, res) => {
  try {
    // here id is for the user._id
    const { doctorId, status, id } = req.body;
    // console.log(userId)
    if(status==='reject'){
        await doctorModel.deleteOne({doctorId});
    }else{
        await doctorModel.findByIdAndUpdate(doctorId, { status });
    }
    
    const user = await userModel.findOne({_id: id});
    const notification = user?.notification;
    notification?.push({
        type:"doctor-account-request-updated",
        message:`Your doctor account request has been ${status}`,
        data:{
           onClickPath : '/notification'
        }
       
    })
    if(status === 'approved'){
        user.isDoctor = true;
    }else{
        user.isDoctor = false;
    }
    await user.save();
    res.status(201).json({
        success:true,
        message:`status updated to ${status}`,
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while approving status of doctor",
      error,
    });
  }
};

module.exports = {
  handleGetAllDoctors,
  handleGetAllUsers,
  handleChangeAccountStatus,
};
