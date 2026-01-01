import { HiOutlineMail } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import "../css/ForgetPass.css";
import { FiMail } from "react-icons/fi";

const ForgotPass = ({ onClose, onSendOtp }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSendOtp = () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    setError("");
    onSendOtp(email);
  };

  return (
    <div className="modal-overlay">
      <div className="forgot-modal">
        <div className="cross-model" onClick={onClose}>
          <RxCross2 />
        </div>

        <div className="logo-content">
          <div className="mail-logo">
            <FiMail />
          </div>
          <div className="forget-heading">Forgot Password?</div>
          <div className="forget-subheading">
            Enter your email to receive an OTP
          </div>
        </div>

        <div className="form-email-field">
          <label>Email Address</label>
          <div className={`input-box ${error ? "input-error" : ""}`}>
            <HiOutlineMail />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(""); // 🔥 removes red while typing
              }}
            />
          </div>

          {error && <p className="password-error">{error}</p>}
        </div>

        <button className="signin-btn" onClick={handleSendOtp}>
          Send OTP
        </button>
      </div>
    </div>
  );
};

export default ForgotPass;
