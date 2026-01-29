import axios from "axios";
import React, { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { CiLock } from "react-icons/ci";
import { HiOutlineLockClosed, HiOutlineLockOpen } from "react-icons/hi";
import { IoEyeOffOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import toast from 'react-hot-toast';

const ResetPassword = ({ onClose, email }) => {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [matchError, setMatchError] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const hasMinLength = form.password.length >= 8;
  const hasLowercase = /[a-z]/.test(form.password);
  const hasUppercase = /[A-Z]/.test(form.password);
  const hasNumber = /[0-9]/.test(form.password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(form.password);
  const isStrongPassword =
    hasMinLength && hasLowercase && hasUppercase && hasNumber && hasSpecial;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password" && form.confirmPassword) {
      setMatchError(value !== form.confirmPassword ? "Passwords do not match" : "");
    }

    if (name === "confirmPassword") {
      setMatchError(value !== form.password ? "Passwords do not match" : "");
    }
  };

  const handleReset = async () => {
    setSubmitted(true);

    if (!form.password || !form.confirmPassword) {
      setMatchError("Password is required");
      return;
    }

    if (!isStrongPassword) {
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMatchError("Passwords do not match");
      return;
    }

    setIsResetting(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_KEY}/Auth/resetPass`,
        {
          email,
          password: form.password,
        }
      );

      if (res.data.Success) {
        toast.success("Password reset successful! You can now login.");
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        toast.error(res.data.message || "Password reset failed. Please try again.");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.Message || "Password reset failed. Please try again.";
      setMatchError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsResetting(false);
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

        <div className="form-email-field mb-3">
          <label>New Password</label>
          <div
            className={`input - box ${submitted && !isStrongPassword ? "input-error" : ""}`}
          >
            {showPassword ? <HiOutlineLockOpen /> : <HiOutlineLockClosed />}
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

          {!isStrongPassword && (
            <div className="password-requirements">
              <div className={`req - item ${hasMinLength ? "valid" : ""} `}>
                <span className="req-icon">{hasMinLength ? "✓" : "×"}</span>
                At least 8 characters
              </div>
              <div className={`req - item ${hasUppercase ? "valid" : ""} `}>
                <span className="req-icon">{hasUppercase ? "✓" : "×"}</span>
                One uppercase letter
              </div>
              <div className={`req - item ${hasLowercase ? "valid" : ""} `}>
                <span className="req-icon">{hasLowercase ? "✓" : "×"}</span>
                One lowercase letter
              </div>
              <div className={`req - item ${hasNumber ? "valid" : ""} `}>
                <span className="req-icon">{hasNumber ? "✓" : "×"}</span>
                One number
              </div>
              <div className={`req - item ${hasSpecial ? "valid" : ""} `}>
                <span className="req-icon">{hasSpecial ? "✓" : "×"}</span>
                One special character
              </div>
            </div>
          )}
        </div>

        <div className="form-email-field mb-3">
          <label>Confirm Password</label>
          <div
            className={`input - box ${(submitted && matchError) || matchError ? "input-error" : ""} `}
          >
            {showPassword1 ? <HiOutlineLockOpen /> : <HiOutlineLockClosed />}
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

        {matchError && <div className="password-error mb-2 mt-0">{matchError}</div>}

        <button
          className={`signin - btn mt - 2 ${isResetting ? "loading" : ""} `}
          onClick={handleReset}
          disabled={isResetting}
          aria-busy={isResetting}
        >
          {isResetting && <div className="btn-spinner"></div>}
          {isResetting ? "Resetting password..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
