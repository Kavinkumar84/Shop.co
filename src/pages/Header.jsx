import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Header.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Logo from "../assets/logo.png";
import { BsBoxSeam } from "react-icons/bs";
import { IoPersonCircleOutline, IoSettingsOutline } from "react-icons/io5";
import { IoIosHelpCircleOutline, IoIosLogOut } from "react-icons/io";
import apiClient from "../utils/apiClient";
import toast from "react-hot-toast";

const Header = () => {
  const [loggedUser, setLoggedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        let parseData = JSON.parse(stored);
        setLoggedUser(parseData);
        console.log(parseData.name);
      }
    } catch (err) {
      console.error("Corrupted user data");
      localStorage.removeItem("user");
    }
  }, []);

  async function handleSignOut() {
    try {
      // Call backend to clear HTTP-only cookie
      await apiClient.post("/Auth/logout");

      // Clear local storage
      localStorage.removeItem("user");
      setLoggedUser(null);

      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Clear local data anyway
      localStorage.removeItem("user");
      setLoggedUser(null);
      navigate("/login");
    }
  }


  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <img src={Logo} alt="logo" className="logo-img" />
          <span className="logo-text">SHOP.CO</span>
        </div>
        <div className="search-box">
          <input type="text" placeholder="Search products..." />
          <i className="bi bi-search"></i>
        </div>
        <div className="header-right">
          <div className="drop">
            <div className="header-profile">
              <i className="bi bi-person-circle header-icon pro"></i>

              {!loggedUser && <Link to="/login" className="login-btn">
                Login / Signup
              </Link>}
              {loggedUser && <div className="profile-name">{loggedUser.name}</div>}
            </div>
            {loggedUser && <div className="down">
              <div className="profile-menu">
                <div className="profile-header1">
                  <IoPersonCircleOutline className="profile-avatar1" />
                  <div className="">
                    <p className="profile-name">{loggedUser.name}</p>
                    <p className="profile-email">{loggedUser.email}</p>
                  </div>
                </div>

                <Link to={'/dashboard'}><button className="profile-btn">View Profile</button></Link>

                <div className="profile-links">
                  <div className="profile-item">
                    <BsBoxSeam />
                    <span>Orders</span>
                  </div>
                  <div className="profile-item">
                    <IoSettingsOutline /> <span>Settings</span>
                  </div>
                  <div className="profile-item">
                    <IoIosHelpCircleOutline /> <span>Help</span>
                  </div>
                </div>

                <div className="profile-logout" onClick={handleSignOut}>
                  <IoIosLogOut /> <span>Sign out</span>
                </div>
              </div>
            </div>}
          </div>
          <div className="header-profile">
            <i className="bi bi-bag header-icon"></i>
            <Link to="/" className="header-profile-txt">
              Cart
            </Link>
          </div>
          <div className="header-profile">
            <i className="bi bi-heart header-icon"></i>
            <Link to="/" className="header-profile-txt">
              Wishlist
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
