import React from "react";
import { Link } from "react-router-dom";
import "../css/Header.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Logo from "../assets/Logo.webp";
import { BsBoxSeam, BsThreeDotsVertical } from "react-icons/bs";
import { IoPersonCircleOutline, IoSettingsOutline } from "react-icons/io5";
import { IoIosHelpCircleOutline, IoIosLogOut } from "react-icons/io";

const Header = () => {
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
              <Link to="/login" className="login-btn">
                Login / Signup
              </Link>
            </div>
            <div className="down">
              <div className="profile-menu">
                <div className="profile-header">
                  <IoPersonCircleOutline className="profile-avatar" />
                  <div>
                    <p className="profile-name">KK</p>
                    <p className="profile-email">kavinv@drngpit.ac.in</p>
                  </div>
                </div>

                <button className="profile-btn">View Profile</button>

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

                <div className="profile-logout">
                  <IoIosLogOut /> <span>Sign out</span>
                </div>
              </div>
            </div>
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
          <div className="header-profile fs-5">
            <BsThreeDotsVertical />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
