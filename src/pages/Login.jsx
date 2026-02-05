import "../css/Login.css";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineLockOpen } from "react-icons/hi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Logo from "../assets/Logo.webp";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiClient from "../utils/apiClient";
import ForgotPass from "./ForgetPass";
import Otp from "./Otp";
import ResetPassword from "./ResetPassword";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/FirebaseAuth";
import toast from 'react-hot-toast';

const Login = () => {
  const [isValid, setIsValid] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState("email");
  const [resetEmail, setResetEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [UserData, setUserData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...UserData, [name]: value });

    if (submitted && name === "email") validateEmail(value);
    if (submitted && name === "password") validatePassword(value);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    validateEmail(UserData.email);
    validatePassword(UserData.password);

    if (!isEmailValid || !isValid) return;

    setIsLoading(true);

    apiClient
      .post("/Auth/loginUser", UserData)
      .then((res) => {
        if (res.data.success) {
          toast.success("Login successful! Redirecting...");
          // Only store user info, token is in HTTP-only cookie
          localStorage.setItem("user", JSON.stringify(res.data.user));
          setTimeout(() => navigate("/"), 1500);
        } else {
          toast.error("Invalid credentials. Please check your credentials.");
        }
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || "Login failed. Please check your credentials.";
        toast.error(errorMsg);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError("Password required");
      setIsValid(false);
    } else if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      setIsValid(false);
    } else if (!/[a-z]/.test(value)) {
      setPasswordError("Must contain lowercase letter");
      setIsValid(false);
    } else if (!/[A-Z]/.test(value)) {
      setPasswordError("Must contain uppercase letter");
      setIsValid(false);
    } else if (!/[0-9]/.test(value)) {
      setPasswordError("Must contain a number");
      setIsValid(false);
    } else {
      setPasswordError("");
      setIsValid(true);
    }
  };

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("Email is required");
      setIsEmailValid(false);
    } else if (!regex.test(value)) {
      setEmailError("Enter valid email");
      setIsEmailValid(false);
    } else {
      setEmailError("");
      setIsEmailValid(true);
    }
  };

  function handleGoogle() {
    if (googleLoading || isLoading) return;

    setGoogleLoading(true);

    signInWithPopup(auth, provider)
      .then((res) => {
        const user = res.user;

        const googleUserData = {
          provider: user.provider,
          name: user.displayName,
          email: user.email,
          isEmailVerified: user.emailVerified,
          profileUrl: user.photoURL,
        };

        return apiClient.post("/Auth/googleAuth", googleUserData);
      })
      .then((res) => {
        if (res.data.success) {
          toast.success("Login successful! Redirecting...");
          // Only store user info, token is in HTTP-only cookie
          localStorage.setItem("user", JSON.stringify(res.data.user));
          setTimeout(() => navigate("/"), 1500);
        } else {
          toast.error("Google login failed. Please try again.");
        }
      })
      .catch((err) => {
        toast.error("Google login failed. Please try again.");
      })
      .finally(() => setGoogleLoading(false));
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
        <h2 className="card-title1">Welcome Back</h2>
        <p className="card-subtitle1">Sign in to continue shopping</p>

        <div className="form-field">
          <label>Email Address</label>
          <div className={`input-box ${submitted && emailError ? "input-error" : ""}`}>
            <HiOutlineMail />
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={UserData.email}
              onChange={handleChange}
            />
          </div>
          {submitted && emailError && (
            <p className="password-error mb-0">{emailError}</p>
          )}
        </div>

        <div className="form-field">
          <label>Password</label>
          <div className={`input-box ${submitted && passwordError ? "input-error" : ""}`}>
            {showPassword ? <HiOutlineLockOpen /> : <HiOutlineLockClosed />}
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              name="password"
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
          {submitted && passwordError && (
            <p className="password-error mb-0">{passwordError}</p>
          )}
        </div>

        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" />
            Remember me
          </label>
          <span className="forgot" onClick={() => setShowForgot(true)}>
            Forgot Password?
          </span>
        </div>

        <button
          className={`signin-btn ${isLoading ? 'loading' : ''}`}
          disabled={isLoading || (submitted && (!isEmailValid || !isValid))}
          onClick={handleSubmit}
          aria-busy={isLoading}
          aria-disabled={isLoading}
        >
          {isLoading && <div className="btn-spinner"></div>}
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="divider">
          <div className="or-line"></div>
          <span>or continue with</span>
          <div className="or-line"></div>
        </div>

        <button
          className={`google-btn ${googleLoading ? 'loading' : ''}`}
          onClick={handleGoogle}
          disabled={googleLoading || isLoading}
          aria-busy={googleLoading}
        >
          {googleLoading && <div className="btn-spinner"></div>}
          {googleLoading ? (
            'Signing in...'
          ) : (
            <>
              <FcGoogle size={22} />
              Sign in with Google
            </>
          )}
        </button>

        <p className="signup-text">
          Don&apos;t have an account?{" "}
          <span>
            <Link
              to={"/signup"}
              style={{ textDecoration: "none", color: "rgb(79 70 229)" }}
            >
              Create Account
            </Link>
          </span>
        </p>
      </div>

      {showForgot && forgotStep === "email" && (
        <ForgotPass
          onClose={() => setShowForgot(false)}
          onSendOtp={(email) => {
            setResetEmail(email);
            setForgotStep("otp");
          }}
        />
      )}

      {showForgot && forgotStep === "otp" && (
        <Otp
          email={resetEmail}
          onClose={() => {
            setShowForgot(false);
            setForgotStep("email");
          }}
          onBack={() => setForgotStep("email")}
          onVerified={() => setForgotStep("reset")}
        />
      )}

      {showForgot && forgotStep === "reset" && (
        <ResetPassword
          email={resetEmail}
          onClose={() => {
            setShowForgot(false);
            setForgotStep("email");
          }}
        />
      )}
    </div>
  );
};

export default Login;
