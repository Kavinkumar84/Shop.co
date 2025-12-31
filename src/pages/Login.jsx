import "../css/Login.css";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { AiOutlineEye } from "react-icons/ai";
import Logo from "../assets/Logo.webp";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineErrorOutline } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import { IoEyeOffOutline } from "react-icons/io5";
import axios from "axios";

const Login = () => {
  const [isValid, setIsValid] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showError, setShowError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [UserData, setUserData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  function handleChange(e) {
    const { name, value } = e.target;
    setUserData({ ...UserData, [name]: value });

    if (submitted && name === "password") {
      validatePassword(value);
    }

    if (submitted && name === "email") {
      validateEmail(value);
    }
    if (showError) {
      setShowError(false);
    }
  }

  function handleSubmit() {
    setSubmitted(true);

    validateEmail(UserData.email);
    validatePassword(UserData.password);

    if (!isEmailValid || !isValid) return;

    axios
      .post("http://localhost:5000/shop.co/Auth/loginUser", {
        email: UserData.email,
        password: UserData.password,
      })
      .then((res) => {
        if (res.data.Success) {
          navigate("/");
        } else {
          setShowError(true);
        }
      })
      .catch(() => {
        setShowError(true);
      });
  }

  function validatePassword(value) {
    if (value.length == 0) {
      setPasswordError("Password required");
      setIsValid(false);
    } else if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      setIsValid(false);
    } else if (!/[a-z]/.test(value)) {
      setPasswordError("Password must contain a lowercase letter");
      setIsValid(false);
    } else if (!/[A-Z]/.test(value)) {
      setPasswordError("Password must contain an uppercase letter");
      setIsValid(false);
    } else if (!/[0-9]/.test(value)) {
      setPasswordError("Password must contain a number");
      setIsValid(false);
    } else {
      setPasswordError("");
      setIsValid(true);
    }
  }
  function validateEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      setEmailError("Email is required");
      setIsEmailValid(false);
    } else if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
      setIsEmailValid(false);
    } else {
      setEmailError("");
      setIsEmailValid(true);
    }
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
        <p className="subtitle">Welcome back! Log in to continue shopping</p>
      </div>
      {showError && (
        <div className="error-box">
          <div className="error-icon">
            <MdOutlineErrorOutline />
          </div>
          <span className="error-text">
            Invalid credentials. Please try again.
          </span>
          <span className="error-close" onClick={() => setShowError(false)}>
            <RxCross2 />
          </span>
        </div>
      )}
      <div className="login-card">
        <button className="google-btn">
          <FcGoogle size={22} />
          Continue with Google
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="form-field">
          <label>Email Address</label>

          <div
            className={`input-box ${
              submitted && emailError ? "input-error" : ""
            }`}
          >
            <HiOutlineMail className="eye-icon" />
            <input
              type="email"
              placeholder="you@example.com"
              name="email"
              value={UserData.email}
              onChange={handleChange}
            />
          </div>

          {submitted && emailError && (
            <p className="password-error">{emailError}</p>
          )}
        </div>

        <div className="form-field">
          <label>Password</label>

          <div
            className={`input-box ${
              submitted && passwordError ? "input-error" : ""
            }`}
          >
            <HiOutlineLockClosed className="eye-icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              name="password"
              value={UserData.password}
              onChange={handleChange}
            />

            {!showPassword ? (
              <AiOutlineEye
                className="eye-icon"
                onClick={() => setShowPassword(!false)}
              />
            ) : (
              <IoEyeOffOutline
                className="eye-icon"
                onClick={() => setShowPassword(!true)}
              />
            )}
          </div>

          {submitted && passwordError && (
            <p className="password-error">{passwordError}</p>
          )}
        </div>

        <div className="forgot">Forgot password?</div>

        <button
          className="signin-btn"
          disabled={submitted && (!isEmailValid || !isValid)}
          onClick={handleSubmit}
        >
          Sign In →
        </button>

        <p className="signup-text">
          Don&apos;t have an account?{" "}
          <span>
            <Link to={"/signup"}>Create Account</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
