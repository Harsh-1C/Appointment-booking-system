const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

//dotenv conig
dotenv.config();

//mongodb connection
connectDB();

const app = express();

//middlewares
// to parse the form data 
app.use(express.json());

//routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoute"));
app.use("/api/v1/doctor", require("./routes/doctorRoute"));

// static files

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//port
const port = process.env.PORT || 8080;
//listen port
app.listen(port, () => {
  console.log(`Server Running in on port ${process.env.PORT}`.bgCyan.white);
});
