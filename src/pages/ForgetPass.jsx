import { HiOutlineMail } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import "../css/ForgetPass.css";
import { FiMail } from "react-icons/fi";
import axios from "axios";
import toast from 'react-hot-toast';

const ForgotPass = ({ onClose, onSendOtp }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

    axios
      .post(`${import.meta.env.VITE_API_KEY}/Auth/forgetPass`, { email })
      .then((res) => {
        if (res.data.success) {
          setError("");
          toast.success("OTP sent successfully to your email.");
          onSendOtp(email);
        } else {
          toast.error(res.data.message || "Failed to send OTP. Please try again.");
        }
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Failed to send OTP. Please try again.";
        toast.error(errorMsg);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
                if (error) setError("");
              }}
            />
          </div>

          {error && <p className="password-error mb-0">{error}</p>}
        </div>

        <button
          className={`signin-btn ${isLoading ? 'loading' : ''}`}
          onClick={handleSendOtp}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading && <div className="btn-spinner"></div>}
          {isLoading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </div>
    </div>
  );
};

export default ForgotPass;
