import React from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '../assets/Animation/Page Not Found 404.json';
import '../css/PageNotFound.css';

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="page-not-found-wrapper">
      <div className="container-404">
        <div className="animation-wrapper">
          <Lottie
            animationData={animationData}
            loop={true}
            className="lottie-animation"
          />
        </div>

        <div className="content">
          <button className="home-button" onClick={handleGoHome}>
            <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
