import axios from "axios";
import React, { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { CiLock } from "react-icons/ci";
import { HiOutlineLockClosed } from "react-icons/hi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoEyeOffOutline } from "react-icons/io5";
import { RxCross2, RxCrossCircled } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const ResetPassword = ({ onClose, email }) => {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const nav = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [error, setError] = useState("");
  const [error1, setError1] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (name === "password") {
      setError1("");

      if (!/[A-Z]/.test(value)) {
        setError1("Must contain at least one uppercase letter");
        return;
      }

      if (!/[a-z]/.test(value)) {
        setError1("Must contain at least one lowercase letter");
        return;
      }

      if (!/[0-9]/.test(value)) {
        setError1("Must contain at least one number");
        return;
      }
      if (value.length > 0 && value.length < 8) {
        setError1("Password must be at least 8 characters");
        return;
      }

      if (form.confirmPassword && value !== form.confirmPassword) {
        setError("Passwords do not match");
      } else {
        setError("");
      }
    }

    if (name === "confirmPassword") {
      if (value !== form.password) {
        setError("Passwords do not match");
        return;
      } else {
        setError("");
      }
    }
  };

  const handleReset = async () => {
    setSubmitted(true);
    console.log(email);

    if (!form.password || !form.confirmPassword) {
      setError("Password is required");
      return;
    }

    if (error || error1) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/shop.co/Auth/resetPass",
        {
          email,
          password: form.password,
        }
      );

      if (res.data.Success) {
        setIsError(false);
        setMsg("Password updated successfully");
        setShowMsg(true);

        setTimeout(() => {
          setShowMsg(false);
          onClose(); 
        }, 1000);
      } else {
        setIsError(true);
        setMsg(res.data.message);
        setShowMsg(true);
      }
    } catch (err) {
      setError(err.response?.data?.Message || "Something went wrong");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="forgot-modal">
        <div className="cross-model" onClick={onClose}>
          <RxCross2 />
        </div>

        <div className="logo-content">
          <div className="mail-logo">
            <CiLock />
          </div>
          <div className="forget-heading">Reset Password</div>
          <div className="forget-subheading">Create your new password</div>
        </div>

        <div className="form-email-field mb-0">
          <label>New Password</label>
          <div
            className={`input-box ${submitted && error ? "input-error" : ""}`}
          >
            <HiOutlineLockClosed />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            {showPassword ? (
              <IoEyeOffOutline
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
        </div>
        {error1 && <p className="password-error mb-2 ">{error1}</p>}
        <div className="form-email-field mb-3">
          <label>Confirm Password</label>
          <div
            className={`input-box ${submitted && error ? "input-error" : ""}`}
          >
            <HiOutlineLockClosed />
            <input
              type={showPassword1 ? "text" : "password"}
              placeholder="Confirm password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {showPassword1 ? (
              <IoEyeOffOutline
                className="eye-icon"
                onClick={() => setShowPassword1(false)}
              />
            ) : (
              <AiOutlineEye
                className="eye-icon"
                onClick={() => setShowPassword1(true)}
              />
            )}
          </div>
        </div>
        {submitted && error && <div className="password-error">{error}</div>}
        {showMsg && (
          <div className={`otp-msg-box ${isError ? "error" : "success"}`}>
            {isError ? <RxCrossCircled /> : <IoMdCheckmarkCircleOutline />}
            <span>{msg}</span>
          </div>
        )}

        <button className="signin-btn mt-2" onClick={handleReset}>
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
