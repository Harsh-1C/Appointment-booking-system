import React from "react";
import "../styles/LayoutStyles.css";
import { userMenu, adminMenu } from "../data/data";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { message, Badge } from "antd"
import { setUser } from "../Redux/slices/userSlice"

const Layout = ({ children }) => {
    const location = useLocation();
    const user = useSelector(store => store.user.user);
   
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        dispatch(setUser(null));
        message.success('Logged out successfully')
    }

    const handleNotificationClick = () => {
        navigate("/notification")
    }


    // =============== DOCTOR MENU START=================

    const doctorMenu = [
        {
            name: "Home",
            path: "/",
            icon: "fa-solid fa-house",
        },
        {
            name: "Appointment",
            path: "/doctor-appointment",
            icon: "fa-solid fa-list",
        },
        {
            name: "Profile",
            path: `/doctor/profile/${user?._id}`,
            icon: "fa-solid fa-user",
        },

    ];




    // =============== DOCTOR MENU END=================


    const sideBarMenu = user?.isAdmin ? adminMenu : user?.isDoctor? doctorMenu : userMenu;

    return (
        <div>
            <div className="main">
                <div className="layout">
                    <div className="sidebar">
                        <div className="logo">
                            NITT HOSPITAL &nbsp; <i style={{ color: "red" }} className="fa-solid fa-hospital"></i>
                            <hr />
                        </div>
                        <div className="menu">
                            {sideBarMenu.map((item, id) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <div key={id} className={`menu-item ${isActive && "active"}`}>
                                        <Link to={item.path}>
                                            <i className={item.icon}></i> {item.name}
                                        </Link>
                                    </div>
                                );
                            })}
                            <div className="menu-item">
                                <Link to={"/login"} onClick={handleLogout}>
                                    <i className="fa-solid fa-right-from-bracket"></i> Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="header">
                            <div className="header-content">
                                <Badge onClick={handleNotificationClick} className="notify" count={user && user.notification.length}>
                                    <i className="fa-solid fa-bell"></i>
                                </Badge>
                                <Link to={"/profile"} >{user?.name}</Link>
                            </div>
                        </div>
                        <div className="body">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
