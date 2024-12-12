const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { handleGetAllDoctors, handleGetAllUsers, handleChangeAccountStatus } = require("../controllers/adminCtrl");

// to authorize a person we can also add a new middleware which will take to whom we need to give authorization in case if that person is authorized then call the next function


router.get("/getAllUsers", authMiddleware,handleGetAllUsers);
router.get("/getAllDoctors", authMiddleware,handleGetAllDoctors);
router.post('/change-account-status-doctor',authMiddleware, handleChangeAccountStatus);



module.exports = router;
