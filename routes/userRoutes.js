const express = require("express");
const {
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
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/auth.middleware");

//router onject
const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

// AUTH || POST
router.post("/getUserData", authMiddleware, handleAuth);

// Apply Doctor || POST
router.post("/apply-doctor", authMiddleware, handleApplyDoctor);

// get-all-Notification || GET
router.post("/get-all-notification", authMiddleware, getAllNotification);

// delete-all-Notification || GET
router.post("/delete-all-notification", authMiddleware, deleteAllNotification);

// GET || Get list of all doctors
router.get('/getAllDoctor',authMiddleware, handleGetAllDoctor)

// POST || book appointment
router.post("/book-appointment", authMiddleware, handleBookAppointment)


// POST || Book-availabiliy
router.post("/check-availability", authMiddleware, handleCheckAvailability)

// GET || User-appointment
router.get("/user-appointment", authMiddleware, handleUserAppointmnet)

module.exports = router;
