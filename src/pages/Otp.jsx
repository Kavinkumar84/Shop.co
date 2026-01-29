import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineKey } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import toast from 'react-hot-toast';

const Otp = ({ onClose, onBack, email, onVerified }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    setResendTimer(60);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

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
        `${import.meta.env.VITE_API_KEY}/Auth/forgetPass`,
        { email }
      );

      if (res.data.success) {
        toast.success("New OTP has been sent to your email.");
        setResendTimer(60);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.error("Please enter valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_KEY}/Auth/verifyOtp`,
        {
          email,
          otp: enteredOtp,
        }
      );

      if (res.data.Success) {
        toast.success("OTP verified successfully!");
        setTimeout(() => onVerified(), 1000);
      }

    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid OTP. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsVerifying(false);
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

        <button
          className={`signin-btn ${isVerifying ? 'loading' : ''}`}
          onClick={handleVerifyOtp}
          disabled={isVerifying}
          aria-busy={isVerifying}
        >
          {isVerifying && <div className="btn-spinner"></div>}
          {isVerifying ? 'Verifying OTP...' : 'Verify OTP'}
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
