import React, { useState } from "react";
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
import toast from 'react-hot-toast';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/FirebaseAuth";

const SignUp = () => {
  const [UserData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    repassword: "",
    phoneNumber: "",
    countryCode: "",
    istyping: false,
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    repassword: "",
    countryCode: "",
    phoneNumber: "",
  });

  const [matchError, setMatchError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const hasMinLength = UserData.password.length >= 8;
  const hasLowercase = /[a-z]/.test(UserData.password);
  const hasUppercase = /[A-Z]/.test(UserData.password);
  const hasNumber = /[0-9]/.test(UserData.password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(UserData.password);
  const isStrongPassword =
    hasMinLength && hasLowercase && hasUppercase && hasNumber && hasSpecial;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
      istyping: name === "password" && value.length > 0,
    }));

    if (submitted && fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "password" && UserData.repassword) {
      setMatchError(value !== UserData.repassword ? "Passwords do not match" : "");
    }

    if (name === "repassword") {
      setMatchError(value !== UserData.password ? "Passwords do not match" : "");
    }
  };

  function handleGoogleSignup() {
    if (googleLoading || isSubmitting) return;

    setGoogleLoading(true);

    signInWithPopup(auth, provider)
      .then((res) => {
        const user = res.user;

        const googleUserData = {
          provider: "google",
          name: user.displayName,
          email: user.email,
          isEmailVerified: user.emailVerified,
        };

        return axios.post(
          "https://shop-co-backend-seven.vercel.app/shop.co/Auth/googleAuth",
          googleUserData
        );
      })
      .then((res) => {
        if (res.data.success) {
          toast.success("Account created successfully! Redirecting...");
          localStorage.setItem(
            "user",
            JSON.stringify({
              user: res.data.user,
              token: res.data.token,
            })
          );
          setTimeout(() => navigate("/"), 1500);
        } else {
          toast.error("Google signup failed. Please try again.");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          err.response?.data?.message || "Google signup failed. Try again."
        );
      })
      .finally(() => setGoogleLoading(false));
  }



  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);

    const { name, email, password, repassword, countryCode, phoneNumber } = UserData;

    const errors = {
      name: !name ? "Name is required" : "",
      email: !email ? "Email is required" : "",
      password: !password ? "Password is required" : !isStrongPassword ? "Please enter a strong password" : "",
      repassword: !repassword ? "Confirm password is required" : "",
      countryCode: !countryCode ? "Country code is required" : "",
      phoneNumber: !phoneNumber ? "Phone number is required" : "",
    };

    setFieldErrors(errors);

    const hasErrors = Object.values(errors).some(error => error !== "");
    if (hasErrors) return;

    if (password !== repassword) {
      setMatchError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    axios
      .post("https://shop-co-backend-seven.vercel.app/shop.co/Auth/createUser", UserData)
      .then((res) => {
        toast.success("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Registration failed. Please try again.";
        toast.error(errorMsg);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <div className="login-page">
      <div className="logo-container">
        <div className="logo">
          <div className="logo-icon">
            <img src={Logo} alt="ShopCo Logo" />
          </div>
          <div className="txt">ShopCo</div>
        </div>
        <p className="subtitle">Your Electronics Destination</p>
      </div>

      <div className="login-card">
        <h2 className="card-title1">Create Account</h2>
        <p className="card-subtitle1">Join us and start shopping</p>

        <div className="form-field">
          <label>Full Name</label>
          <div className={`input-box ${submitted && fieldErrors.name ? "input-error" : ""}`}>
            <MdPersonOutline />
            <input
              type="text"
              placeholder="Enter your name"
              name="name"
              value={UserData.name}
              onChange={handleChange}
            />
          </div>
          {submitted && fieldErrors.name && (
            <p className="password-error">{fieldErrors.name}</p>
          )}
        </div>

        <div className="form-field">
          <label>Email Address</label>
          <div className={`input-box ${submitted && fieldErrors.email ? "input-error" : ""}`}>
            <HiOutlineMail />
            <input
              type="email"
              placeholder="Enter your email"
              value={UserData.email}
              name="email"
              onChange={handleChange}
            />
          </div>
          {submitted && fieldErrors.email && (
            <p className="password-error">{fieldErrors.email}</p>
          )}
        </div>

        <div className="form-field">
          <label>Phone Number (Optional)</label>
          <div className="d-flex gap-2">
            <CountryDropdown
              value={UserData.countryCode || "+1"}
              onSelect={(code) => {
                setUserData({ ...UserData, countryCode: code });
                if (submitted) setFieldErrors((prev) => ({ ...prev, countryCode: "" }));
              }}
            />
            <div className={`input-box ${submitted && fieldErrors.phoneNumber ? "input-error" : ""}`}>
              <MdPhone />
              <input
                type="tel"
                pattern="[0-9]{10}"
                placeholder="10-digit phone number"
                name="phoneNumber"
                value={UserData.phoneNumber}
                onChange={(e) => {
                  setUserData({
                    ...UserData,
                    phoneNumber: e.target.value.replace(/\D/g, ""),
                  });
                  if (submitted) setFieldErrors((prev) => ({ ...prev, phoneNumber: "" }));
                }}
                maxLength={10}
              />
            </div>
          </div>
          {submitted && (fieldErrors.countryCode || fieldErrors.phoneNumber) && (
            <p className="password-error">{fieldErrors.countryCode || fieldErrors.phoneNumber}</p>
          )}
        </div>

        <div className="form-field">
          <label>Password</label>
          <div className={`input-box ${submitted && fieldErrors.password ? "input-error" : ""}`}>
            {showPassword ? <HiOutlineLockOpen /> : <HiOutlineLockClosed />}
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a password"
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

          {submitted && fieldErrors.password && (
            <p className="password-error">{fieldErrors.password}</p>
          )}

          {!isStrongPassword && (
            <div className="password-requirements">
              <div className={`req-item ${hasMinLength ? "valid" : ""}`}>
                <span className="req-icon">{hasMinLength ? "✓" : "×"}</span>
                At least 8 characters
              </div>
              <div className={`req-item ${hasUppercase ? "valid" : ""}`}>
                <span className="req-icon">{hasUppercase ? "✓" : "×"}</span>
                One uppercase letter
              </div>
              <div className={`req-item ${hasLowercase ? "valid" : ""}`}>
                <span className="req-icon">{hasLowercase ? "✓" : "×"}</span>
                One lowercase letter
              </div>
              <div className={`req-item ${hasNumber ? "valid" : ""}`}>
                <span className="req-icon">{hasNumber ? "✓" : "×"}</span>
                One number
              </div>
              <div className={`req-item ${hasSpecial ? "valid" : ""}`}>
                <span className="req-icon">{hasSpecial ? "✓" : "×"}</span>
                One special character
              </div>
            </div>
          )}
        </div>

        <div className="form-field">
          <label>Confirm Password</label>
          <div className={`input-box ${(submitted && fieldErrors.repassword) || matchError ? "input-error" : ""}`}>
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
          {submitted && fieldErrors.repassword && (
            <p className="password-error">{fieldErrors.repassword}</p>
          )}
          {matchError && <p className="password-error">{matchError}</p>}
        </div>

        <div className="form-field">
          <label className="remember-me">
            <input type="checkbox" />
            I agree to the <a href="/terms" style={{ color: "#4F46E5" }}>Terms & Conditions</a> and <a href="/privacy" style={{ color: "#4F46E5" }}>Privacy Policy</a>
          </label>
        </div>

        <button
          className={`signin-btn ${isSubmitting ? 'loading' : ''}`}
          onClick={handleSubmit}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          aria-disabled={isSubmitting}
        >
          {isSubmitting && <div className="btn-spinner"></div>}
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>

        <div className="divider">
          <div className="or-line"></div>
          <span>or continue with</span>
          <div className="or-line"></div>
        </div>

        <button
          className={`google-btn ${googleLoading ? "loading" : ""}`}
          onClick={handleGoogleSignup}
          disabled={googleLoading || isSubmitting}
          aria-busy={googleLoading}
        >
          {googleLoading && <div className="btn-spinner"></div>}
          {googleLoading ? (
            "Signing up..."
          ) : (
            <>
              <FcGoogle size={22} />
              Sign up with Google
            </>
          )}
        </button>


        <p className="signup-text">
          Already have an account?{" "}
          <span>
            <Link
              to={"/login"}
              style={{ textDecoration: "none", color: "rgb(79 70 229)" }}
            >
              Sign In
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
