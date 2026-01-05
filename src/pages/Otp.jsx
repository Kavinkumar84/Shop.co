import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  IoMdCheckmarkCircleOutline,
  IoMdCloseCircleOutline,
} from "react-icons/io";
import { MdOutlineKey } from "react-icons/md";
import { RxCross2, RxCrossCircled } from "react-icons/rx";

const Otp = ({ onClose, onBack, email, onVerified }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);
  const [isError, setIsError] = useState(false);

  const [showMsg, setShowMsg] = useState(true);
  const [msg, setMsg] = useState("OTP sent to your email! Check your inbox.");

  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const showMessage = (text, error = false) => {
    setMsg(text);
    setIsError(error);
    setShowMsg(true);

    setTimeout(() => {
      setShowMsg(false);
      setIsError(false);
    }, 3000);
  };

  useEffect(() => {
    showMessage("OTP sent to your email! Check your inbox.");
    setResendTimer(120);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    if (!showMsg) return;

    const timer = setTimeout(() => {
      setShowMsg(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showMsg]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = value[0] || "";
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length && i < 6; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    inputsRef.current[Math.min(pasted.length, 5)].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  async function handleResendOTP() {
    if (resendTimer > 0 || isResending) return;

    try {
      setIsResending(true);

      const res = await axios.post(
        "http://localhost:5000/shop.co/Auth/forgetPass",
        { email }
      );

      if (res.data.success) {
        showMessage("New OTP has been sent to your email.");
        setResendTimer(120);
      }
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsResending(false);
    }
  }

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      showMessage("Please enter valid 6-digit OTP", true);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/shop.co/Auth/verifyOtp",
        {
          email,
          otp: enteredOtp,
        }
      );

      if (res.data.Success) {
        showMessage("OTP verified successfully", false);
        setTimeout(() => onVerified(), 1000);
      }
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Invalid OTP",
        true
      );
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
            <MdOutlineKey />
          </div>
          <div className="forget-heading">Verify OTP</div>
          <div className="forget-subheading">
            Enter the 6-digit code sent to your email
          </div>
        </div>

        <div className="otp-text">OTP Code</div>

        <div className="otp-box-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="tel"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="otp-box"
              inputMode="numeric"
            />
          ))}
        </div>

        <div className="your-mail">Check your email: {email}</div>

        {showMsg && (
          <div className={`otp-msg-box ${isError ? "error" : "success"}`}>
            {isError ? <RxCrossCircled /> : <IoMdCheckmarkCircleOutline />}
            <span>{msg}</span>
          </div>
        )}

        <button className="signin-btn" onClick={handleVerifyOtp}>
          Verify OTP
        </button>

        <div className="resend-wrapper">
          {isResending ? (
            <div className="resending">
              <div className="loader">
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
                <div className="bar4"></div>
                <div className="bar5"></div>
                <div className="bar6"></div>
                <div className="bar7"></div>
                <div className="bar8"></div>
                <div className="bar9"></div>
                <div className="bar10"></div>
                <div className="bar11"></div>
                <div className="bar12"></div>
              </div>
              <span>Resending...</span>
            </div>
          ) : resendTimer > 0 ? (
            <span className="resend-timer">
              Resend in {formatTime(resendTimer)}
            </span>
          ) : (
            <>
              <span className="resend-text">Didn't receive OTP?</span>
              <span className="resend-link" onClick={handleResendOTP}>
                Resend
              </span>
            </>
          )}
        </div>

        <div className="back-mail" onClick={onBack}>
          ← Back to email
        </div>
      </div>
    </div>
  );
};

export default Otp;
