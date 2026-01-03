import React, { useEffect, useRef, useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineKey } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

const Otp = ({ onClose, onBack, email }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);
  const [showSuccess, setShowSuccess] = useState(true);
  const [successMsg, setSuccessMsg] = useState(
    "OTP sent to your email! Check your inbox."
  );

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");

    const newOtp = [...otp];
    newOtp[index] = value[0] || "";
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess]);
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
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
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
        {showSuccess && (
          <div className="otp-success-box">
            <IoMdCheckmarkCircleOutline />
            <span>{successMsg}</span>
          </div>
        )}

        <button className="signin-btn">Verify OTP</button>
        <div
          className="resend"
          onClick={() => {
            setSuccessMsg("New OTP sent! Check your email.");
            setShowSuccess(false); 
            setTimeout(() => setShowSuccess(true), 50);
          }}
        >
          Didn't receive OTP? Resend
        </div>

        <div className="back-mail" onClick={onBack}>
          ← Back to email
        </div>
      </div>
    </div>
  );
};

export default Otp;
