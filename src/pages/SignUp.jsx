import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../css/Login.css";
import Logo from "../assets/Logo.webp";
import { FcGoogle } from "react-icons/fc";
import {
  HiOutlineLockClosed,
  HiOutlineLockOpen,
  HiOutlineMail,
} from "react-icons/hi";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdPersonOutline, MdPhone } from "react-icons/md";
import CountryDropdown from "./CountryDropdown";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
const SignUp = () => {
  const [isFilled, setisFilled] = useState(true);
  const [UserData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    repassword: "",
    phoneNumber: "",
    countryCode: "",
  });
  const [ErrorShow, setErrorShow] = useState(false);
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("");
  const [matchError, setMatchError] = useState("");
  const [Error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const navigate = useNavigate();
  const checkPasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;

    setStrengthScore(score);

    if (score <= 25) setStrengthLabel("Weak");
    else if (score <= 50) setStrengthLabel("Fair");
    else if (score <= 75) setStrengthLabel("Good");
    else setStrengthLabel("Strong");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData({ ...UserData, [name]: value });

    if (name === "password") {
      checkPasswordStrength(value);

      if (UserData.repassword && value !== UserData.repassword) {
        setMatchError("Passwords do not match");
      } else {
        setMatchError("");
      }
    }

    if (name === "repassword") {
      setMatchError(
        value !== UserData.password ? "Passwords do not match" : ""
      );
    }
    if (!isFilled) {
      setisFilled(true);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    const { name, email, password, repassword, countryCode, phoneNumber } =
      UserData;

    if (!name) {
      setError("Please fill name fields");
      setisFilled(false);
      return;
    }
    if (!email) {
      setError("Please fill email fields");
      setisFilled(false);
      return;
    }
    if (!password) {
      setError("Please fill password fields");
      setisFilled(false);
      return;
    }
    if (!repassword) {
      setError("Please fill confirm password fields");
      setisFilled(false);
      return;
    }
    if (!countryCode) {
      setError("Please select country code");
      setisFilled(false);
      return;
    }
    if (!phoneNumber) {
      setError("Please fill phone number fields");
      setisFilled(false);
      return;
    }
    if (strengthScore != 100) {
      setError("Please enter Strong password");
      setisFilled(false);
      return;
    }
    setisFilled(true);
    axios
      .post("http://localhost:5000/shop.co/Auth/createUser", UserData)
      .then((res) => {
        setErrorShow(true);

        setTimeout(() => {
          setErrorShow(false);
          navigate("/login");
        }, 3000);
      })
      .catch((err) => {
        setisFilled(false);
        setError(
          err.response?.data?.message || "Server error. Try again later"
        );
      });
  }

  return (
    <div className="login-page">
      <div className="logo-container">
        <div className="logo">
          <div className="logo-icon">
            <img src={Logo} alt="" />
          </div>
          <div className="txt">Shop.co</div>
        </div>
        <p className="subtitle">Create an account to enjoy seamless shopping</p>
      </div>
      <div className="login-card">
        <button className="google-btn">
          <FcGoogle size={22} />
          Continue with Google
        </button>

        <div className="divider">
          <div className="or-line"></div>
          <span>OR</span>
          <div className="or-line"></div>
        </div>

        <div className="form-field">
          <label>Name</label>
          <div className="input-box">
            <MdPersonOutline />
            <input
              type="text"
              placeholder="John Doe"
              name="name"
              value={UserData.name}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-field">
          <label>Email Address</label>
          <div className="input-box">
            <HiOutlineMail />
            <input
              type="email"
              placeholder="you@example.com"
              value={UserData.email}
              name="email"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-field">
          <label>Phone Number</label>
          <div className="d-flex gap-2">
            <CountryDropdown
              value={UserData.countryCode || "+1"}
              onSelect={(code) =>
                setUserData({ ...UserData, countryCode: code })
              }
            />

            <div className="input-box">
              <MdPhone />
              <input
                type="tel"
                pattern="[0-9]{10}"
                placeholder="1234567890"
                name="phoneNumber"
                value={UserData.phoneNumber}
                onChange={(e) =>
                  setUserData({
                    ...UserData,
                    phoneNumber: e.target.value.replace(/\D/g, ""),
                  })
                }
                maxLength={10}
              />
            </div>
          </div>
        </div>

        <div className="form-field">
          <label>Password</label>

          <div className="input-box">
            {showPassword ? <HiOutlineLockOpen /> : <HiOutlineLockClosed />}

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={UserData.password}
              onChange={handleChange}
            />

            {showPassword ? (
              <AiOutlineEyeInvisible
                className="eye-icon"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <AiOutlineEye
                className="eye-icon"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          {(UserData.password ||
            (strengthScore === 100 && UserData.repassword.length > 0)) && (
            <>
              <div className="strength-bar">
                <div
                  className={`strength-fill ${strengthLabel.toLowerCase()}`}
                  style={{ width: `${strengthScore}%` }}
                ></div>
              </div>
              <p className={`strength-text ${strengthLabel.toLowerCase()}`}>
                {strengthLabel} password
              </p>
            </>
          )}
        </div>

        <div className="form-field">
          <label>Confirm Password</label>
          <div className="input-box">
            {showRePassword ? <HiOutlineLockOpen /> : <HiOutlineLockClosed />}

            <input
              type={showRePassword ? "text" : "password"}
              name="repassword"
              placeholder="Confirm your password"
              value={UserData.repassword}
              onChange={handleChange}
            />

            {showRePassword ? (
              <AiOutlineEyeInvisible
                className="eye-icon"
                onClick={() => setShowRePassword(false)}
              />
            ) : (
              <AiOutlineEye
                className="eye-icon"
                onClick={() => setShowRePassword(true)}
              />
            )}
          </div>

          {matchError && <p className="password-error">{matchError}</p>}
        </div>
        {!isFilled && <div className="static-error-box">{Error}</div>}
        {ErrorShow && (
          <div className="otp-success-box">
            <IoMdCheckmarkCircleOutline /> Sign Up Successfull
          </div>
        )}
        <button className="signin-btn" onClick={handleSubmit}>
          Sign Up →
        </button>

        <p className="signup-text">
          Already have an account?{" "}
          <span>
            <Link
              to={"/login"}
              style={{ textDecoration: "none", color: "rgb(79 70 229)" }}
            >
              Sign in
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
