import "../css/Login.css";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { AiOutlineEye } from "react-icons/ai";
import Logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineErrorOutline } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import { IoEyeOffOutline } from "react-icons/io5";
import axios from "axios";
import ForgotPass from "./ForgetPass";
import Otp from "./Otp";
import ResetPassword from "./ResetPassword";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/FirebaseAuth";

const Login = () => {
  const [isValid, setIsValid] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState("email");
  const [resetEmail, setResetEmail] = useState("");

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
    if (showError) setShowError(false);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    validateEmail(UserData.email);
    validatePassword(UserData.password);

    if (!isEmailValid || !isValid) return;

    axios
      .post("http://localhost:5000/shop.co/Auth/loginUser", UserData)
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              user: res.data.user,
              token: res.data.token,
            })
          );
          navigate("/");
        } else {
          setShowError(true);
        }
      })
      .catch((error) => {
        setShowError(true);
        console.log(error);
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

  const [googleLoading, setGoogleLoading] = useState(false);

  function handleGoogle() {
    if (googleLoading) return;

    setGoogleLoading(true);

    signInWithPopup(auth, provider)
      .then((res) => {
        const user = res.user;

        const googleUserData = {
          provider : user.provider,
          name: user.displayName,
          email: user.email,
          isEmailVerified: user.emailVerified,
        };

        return axios.post(
          "http://localhost:5000/shop.co/Auth/googleAuth",
          googleUserData
        );
      })
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              user: res.data.user,
              token: res.data.token,
            })
          );
          navigate("/");
        } else {
          setShowError(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setShowError(true);
      })
      .finally(() => setGoogleLoading(false));
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
        <button className="google-btn" onClick={handleGoogle}>
          <FcGoogle size={22} />
          Continue with Google
        </button>

        <div className="divider">
          <div className="or-line"></div>
          <span>OR</span>
          <div className="or-line"></div>
        </div>

        <div className="form-field mb-0">
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

        <div className="form-field mb-0">
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
                onClick={() => setShowPassword(!showPassword)}
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

        <div className="forgot" onClick={() => setShowForgot(true)}>
          Forgot password?
        </div>

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
          email={resetEmail} // ✅ CORRECT
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
