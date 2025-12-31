import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import '../css/Login.css'; 
import Logo from "../assets/Logo.webp";
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineLockClosed, HiOutlineMail } from 'react-icons/hi';
import { AiOutlineEye } from 'react-icons/ai';
import {  MdPersonOutline } from 'react-icons/md';


const SignUp = () => {

  const [UserData, setUserData] = useState({
    name : "",
    email : "",
    password : "",
    repassword : ""
  })

  return (
    <div className="login-page">
         <div className="logo-container">
           <div className="logo">
             <div className="logo-icon">
               <img src={Logo} alt="" />
             </div>
             <div className="txt">Shop.co</div>
           </div>
          <p className="subtitle">Create an account to enjoy seamless shopping</p>
         </div>
         <div className="login-card">
           <button className="google-btn">
             <FcGoogle size={22} />
             Continue with Google
           </button>
   
           <div className="divider">
             <span>OR</span>
           </div>
   
           <div className="form-field">
             <label>Name</label>
             <div className="input-box">
               <MdPersonOutline />
               <input type="text" placeholder="John Doe" />
             </div>
           </div>
           {/* <div className="form-field">
             <label>Phone Number</label>
             <div className="input-box">
               <MdLocalPhone />
               <input type="text" placeholder="1234567890" />
             </div>
           </div> */}
           <div className="form-field">
             <label>Email Address</label>
             <div className="input-box">
               <HiOutlineMail />
               <input type="email" placeholder="you@example.com" />
             </div>
           </div>
   
           <div className="form-field">
             <label>Password</label>
             <div className="input-box">
               <HiOutlineLockClosed />
               <input type="password" placeholder="Enter your password" />
               <AiOutlineEye className="eye-icon" />
             </div>
           </div>
           <div className="form-field">
             <label>Password</label>
             <div className="input-box">
               <HiOutlineLockClosed />
               <input type="password" placeholder="Confirm your password" />
               <AiOutlineEye className="eye-icon" />
             </div>
           </div>
           <button className="signin-btn">Sign Up →</button>
   
           <p className="signup-text">
             Already have an account? <span><Link to={"/login"}>Sign in</Link></span>
           </p>
         </div>
       </div>
  )
}

export default SignUp